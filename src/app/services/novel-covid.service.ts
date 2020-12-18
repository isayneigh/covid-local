import { Injectable } from '@angular/core';
import { NovelCovid, State, HistoricalCountry } from 'novelcovid';
import { Observable, from, of, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StateTotal } from '../models/novel-covid/state-total';
import { CountyTotal } from '../models/novel-covid/county-total';
import { TimeSeriesModel, Timeline } from '../models/novel-covid/county-historical';
import { Region, DataModel, ChangeOverTime } from '../models/data-model';
import { LocaleModel } from '../models/locale-request-model';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { CovidHelper } from '../shared/covid-helper';
import { Country } from '../models/novel-covid/country';
import { All } from '../models/novel-covid/all';
@Injectable(
  {
    providedIn: 'root'
  }
)
export class NovelCovidService {

  private readonly covidService = new NovelCovid();

  private readonly ninjaBaseUrl = 'https://corona.lmao.ninja/v2';

  constructor(private readonly client: HttpClient) {
    this.covidService.baseURL = this.ninjaBaseUrl;
   }

  public getCurrentInformation(region: Region, request: LocaleModel): Observable<DataModel> {
    if (region === Region.Global) {
      return this.getGlobalInformation(false)
        .pipe(
          map((result) => {
            return CovidHelper.mapGlobal(result);
          })
        );
    } else if (region === Region.Country) {
      return forkJoin([
        this.getCountryInformation(request.country),
        this.getTimeSeriesInformation(region, request, 1)
      ])
        .pipe(
          map(([result, timeSeries]) => {
            return CovidHelper.mapCountry(result, timeSeries);
          })
        );
    } else if (region === Region.State) {
      return forkJoin([
        this.getStateInformation(request.province),
        this.getTimeSeriesInformation(region, request, 1)
      ])
        .pipe(
          map(([result, timeSeries]) => {
            return CovidHelper.mapProvince(result, timeSeries);
          })
        );
    } else {
      return forkJoin([
        this.getCountyInformaton(request.county),
        this.getTimeSeriesInformation(region, request, 1)
      ])
        .pipe(
          map(([result, timeSeries]) => {
            return CovidHelper.mapCounty(result, timeSeries);
          })
        );
    }
  }

  public getCountyInformaton(countyName: string): Observable<CountyTotal> {
    countyName = countyName.split('County')[0].trim().toLowerCase();
    return this.client.get<CountyTotal[]>(`${this.ninjaBaseUrl}/jhucsse/counties/${countyName}`)
      .pipe(
        map((result) => result[0])
      );
  }
  public getStateInformation(state: string): Observable<State> {
    state = state.toLowerCase();
    return from(this.covidService.states(state) as Promise<State>);
  }

  public getCountryInformation(country: string): Observable<Country> {
    country = country.toLowerCase();
    return from(this.covidService.countries(country) as Promise<Country>);
  }

  public getGlobalInformation(checkYesterday: boolean): Observable<All> {
    return from(this.covidService.all({ yesterday: checkYesterday }) as Promise<All>);
  }

  public getTimeSeriesInformation(region: Region, request: LocaleModel, days: number): Observable<TimeSeriesModel> {

    if (region === Region.Global) {
      return this.getGlobalTimeSeries(days)
        .pipe(
          map((result) => {
            return {
              timeline: result
            } as TimeSeriesModel;
          })
        );
    } else if (region === Region.Country) {
      return this.getCountryTimeSeries(request, days);
    } else if (region === Region.State) {
      return this.getStateTimeSeries(request.province, days);
    } else {
      return this.getCountyTimeSeries(request.province, request.county, days);
    }
  }


  public getCountyTimeSeries(state: string, county: string, days: number): Observable<TimeSeriesModel> {
    state = state.toLowerCase();
    county = county.split('County')[0].trim().toLowerCase();
    return this.getAllCountyTimeSeriesForProvince(state, days)
      .pipe(
        map((result) => {
          return result.filter(item => item.county.toLowerCase() === county.toLowerCase())[0];
        })
      );
  }

  public getStateTimeSeries(state: string, days: number): Observable<TimeSeriesModel> {
    state = state.toLowerCase();
    return this.getAllCountyTimeSeriesForProvince(state, days)
      .pipe(
        map((result) => {
          return result.reduce((prev, curr) => {
            const newTimeline: Timeline = {
              cases: {},
              deaths: {},
              recovered: {}
            } as Timeline;
            const newSeries = {
              country: prev.country,
              province: prev.province,
              county: prev.county
            } as TimeSeriesModel;

            Object.keys(prev.timeline?.cases || {}).forEach((key) => {
              newTimeline.cases[key] = prev.timeline.cases[key] + curr.timeline.cases[key];
            });
            Object.keys(prev.timeline?.deaths || {}).forEach((key) => {
              newTimeline.deaths[key] = prev.timeline.deaths[key] + curr.timeline.deaths[key];
            });
            Object.keys(prev.timeline?.recovered || {}).forEach((key) => {
              newTimeline.recovered[key] = prev.timeline.recovered[key] + curr.timeline.recovered[key];
            });
            newSeries.timeline = newTimeline;
            return newSeries;
          });
        })
      );
  }

  private getCountryTimeSeries(request: LocaleModel, days: number): Observable<TimeSeriesModel> {
    const countryAsQuery = encodeURIComponent(request.country.toLowerCase());
    return this.client.get<TimeSeriesModel>(`${this.ninjaBaseUrl}/historical/${countryAsQuery}`, {
      params: {
        lastdays: days.toString()
      }
    });
  }

  public getGlobalTimeSeries(days: number): Observable<Timeline> {
    return this.client.get<Timeline>(`${this.ninjaBaseUrl}/historical/all`, {
      params: {
        lastdays: days.toString()
      }
    });
  }

  private getAllCountyTimeSeriesForProvince(state: string, days: number): Observable<TimeSeriesModel[]> {
    const stateAsQuery = encodeURIComponent(state.toLowerCase());
    return this.client.get<TimeSeriesModel[]>(`${this.ninjaBaseUrl}/historical/usacounties/${stateAsQuery}`, {
      params: {
        lastdays: days.toString()
      }
    });
  }

  private getUSAStateOptions(): Observable<string[]> {
    return this.client.get<string[]>(`${this.ninjaBaseUrl}/historical/usacounties`);
  }

  private getDateString() {
    const today = moment();
    const yesterday = today.subtract(1, 'd');
    return yesterday.format('MM/DD/YY');
  }

}

