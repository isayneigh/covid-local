import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NovelCovidService } from 'src/app/services/novel-covid.service';
import { Country, HistoricalCountry } from 'novelcovid';
import { StateTotal } from 'src/app/models/novel-covid/state-total';
import { switchMap, count, tap, catchError } from 'rxjs/operators';
import { LocationService } from 'src/app/services/location.service';
import { Position } from '@angular/compiler';
import { GeoCodingService } from 'src/app/services/geocoding.service';
import { CountyTotal } from 'src/app/models/novel-covid/county-total';
import { LinearContext } from 'src/app/models/graphs/linear-context';
import { FilterService } from 'src/app/services/filter.service';
import { LocaleModel } from 'src/app/models/locale-request-model';
import { GeoCodingHelper } from 'src/app/shared/geocoding-helper';
import { DataModel, Region } from 'src/app/models/data-model';
import { forkJoin, Observable, EMPTY, from } from 'rxjs';
import * as Chart from 'chart.js';
import { ErrorModel } from 'src/app/models/error';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../error/error.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public locale: LocaleModel = {} as LocaleModel;

  public data: DataModel = {} as DataModel;

  public duration = 30;

  public wait = true;

  public flagUrl = 'https://flagcdn.com/w640/XX.png';

  public caseContext = { type: 'case' } as LinearContext;

  public deathContext = { type: 'death' } as LinearContext;

  public recoveredContext = { type: 'recovered' } as LinearContext;

  public error: ErrorModel = new ErrorModel();

  private readonly APIKEY = environment.geocodingApiKey;

  private shortCountry = '';
  private shortState = '';
  private baseFlagUrl = 'https://flagcdn.com/w640/XX.png';

  constructor(
    private readonly covidService: NovelCovidService,
    private readonly locationService: LocationService,
    private readonly geocodingService: GeoCodingService,
    private readonly filterService: FilterService,
    private readonly dialog: MatDialog
  ) {
    Chart.defaults.global.defaultFontColor = '#ffffff';
    this.error.extra = {};
  }


  public ngOnInit() {
    this.duration = this.filterService.duration;
    const callback: PositionCallback = (position: any) => {
      this.error.extra.location = { lat: position.coords.latitude.toString(), lng: position.coords.longitude.toString() };
      this.geocodingService.addressLookup(
        { lat: position.coords.latitude, lng: position.coords.longitude },
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === "OK") {
            if (results[0]) {
              try {
                const countryResult = GeoCodingHelper.getCountry(results[0].address_components);

                this.shortCountry = countryResult.short_name.toLowerCase();

                const stateResult = GeoCodingHelper.getProvince(results[0].address_components);

                this.shortState = stateResult.short_name.toLowerCase();

                const countyResult = GeoCodingHelper.getCounty(results[0].address_components);

                this.locale = {
                  country: countryResult.long_name,
                  countryiso3166: this.shortCountry,
                  county: countyResult.long_name,
                  province: stateResult.long_name,
                  provinceiso3166: this.shortState
                };
                this.error.extra.locale = this.locale;

                this.loadRegionInformation(this.filterService.region);

              } catch (error) {
                this.error.extra.googleResponse = status;
                this.error.message = 'There was an issue finalizing your location.  Please try again or report the issue.';
                this.error.enableReporting = true;
                this.error.extra.locale = undefined;
              }
            } else {
              window.alert("No results found");
            }
          }
          else if (status === 'REQUEST_DENIED') {
            this.error.extra.googleResponse = status;
            this.error.message = 'There was an issue processing your location.  Please try again or report the issue.';
            this.error.enableReporting = true;
          }
          else {
            this.error.error = status;
            this.error.message = 'There was an issue determining your location.  Please try again or report the issue.';
            this.error.enableReporting = true;
          }
        }
      );
    };

    const errorCallback: PositionErrorCallback = (error: PositionError) => {

      this.error = {
        message: 'Unable to access information without location data.',
        modal: false,
        enableReporting: false,
        extra: {
          positionError: error
        }
      };

    };

    from(new Loader({
      apiKey: this.APIKEY,
      version: "weekly"
    }).load())
      .subscribe(() => {
        this.locationService.getLocation(callback, errorCallback);
        this.filterService.updateRegion
          .subscribe(region => this.loadRegionInformation(region, true));
        this.filterService.updateDuration
          .subscribe(newDuration => this.duration = newDuration);

    })
  }

  private loadRegionInformation(region: Region, errorAsModal: boolean = false) {

    const calls: Observable<DataModel>[] = [];

    if (region === Region.Global) {
      calls.push(this.covidService.getCurrentInformation(region, this.locale));
    } else if (region === Region.Country) {
      calls.push(this.covidService.getCurrentInformation(region, this.locale));
      calls.push(this.covidService.getCurrentInformation(Region.Global, this.locale));
    } else if (region === Region.State) {
      calls.push(this.covidService.getCurrentInformation(region, this.locale));
      calls.push(this.covidService.getCurrentInformation(Region.Country, this.locale));
      calls.push(this.covidService.getCurrentInformation(Region.Global, this.locale));
    } else if (region === Region.County) {
      calls.push(this.covidService.getCurrentInformation(region, this.locale));
      calls.push(this.covidService.getCurrentInformation(Region.State, this.locale));
      calls.push(this.covidService.getCurrentInformation(Region.Country, this.locale));
    }

    this.flagUrl = this.baseFlagUrl;
    this.flagUrl = this.flagUrl.replace('XX', this.shortCountry);
    if (region === Region.State || region === Region.County) {
      this.flagUrl = this.flagUrl.replace(this.shortCountry, this.shortCountry + '-' + this.shortState);
    } else if (region === Region.Global) {
      this.flagUrl = '/assets/world.png';
    } else {
      this.flagUrl = this.flagUrl.replace('/YY', '');
    }

    forkJoin(calls)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error.error = error.message;
          this.error.message = 'We couldn\'t get your personal data at this time.  Please try again, or report the issue.';
          this.error.enableReporting = true;

          if (errorAsModal) {
            this.error.modal = true;
            this.dialog.open(ErrorModalComponent, {
              data: this.error
            });
          }
          return EMPTY;
        })
      )
      .subscribe(([currentData, parentData, grandParentData]) => {
        this.data = currentData;
        this.data.parent = parentData;
        if (this.data.parent) {
          this.data.parent.parent = grandParentData;
        }
        this.wait = false;
      });
  }

}
