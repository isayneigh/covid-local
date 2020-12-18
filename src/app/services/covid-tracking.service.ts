import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CovidTrackingModel } from '../models/covid-tracking/covid-tracking-model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocaleModel } from '../models/locale-request-model';
import { Region } from '../models/data-model';

@Injectable({
  providedIn: 'root'
})
export class CovidTrackingService {

  private stateData: CovidTrackingModel[];

  private countryData: CovidTrackingModel[];

  constructor(
    private readonly httpClient: HttpClient
  ) { }


  public getCovidTrackingHistorical(region: Region, locale: LocaleModel): Observable<CovidTrackingModel[]> {
    if (region === Region.Country) {
      return this.getCovidTrackingResultsCountry(locale.countryiso3166);
    } else if (region === Region.State) {
      return this.getCovidTrackingResultsByState(locale.provinceiso3166);
    } else {
      return of(undefined);
    }
  }

  public getCovidTrackingResultsByState(state: string): Observable<CovidTrackingModel[]> {
    return !this.stateData ? this.httpClient
      .get<CovidTrackingModel[]>('https://api.covidtracking.com/v1/states/' + state + '/daily.json')
      .pipe(
        map((result) => {
          this.stateData = result;
          return this.stateData;
        })
      ) :
      of(this.stateData);
  }

  public getCovidTrackingResultsCountry(country: string): Observable<CovidTrackingModel[]> {
    return !this.countryData ? this.httpClient
      .get<CovidTrackingModel[]>('https://api.covidtracking.com/v1/' + country + '/daily.json')
      .pipe(
        map((result) => {
          this.countryData = result;
          return this.countryData;
        })
      ) :
      of(this.countryData);
  }
}
