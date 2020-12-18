import { DataModel, Region } from '../models/data-model';
import { State } from 'novelcovid';
import { TimeSeriesModel } from '../models/novel-covid/county-historical';
import * as moment from 'moment';
import { CountyTotal } from '../models/novel-covid/county-total';
import { All } from '../models/novel-covid/all';
import { Country } from '../models/novel-covid/country';

export class CovidHelper {

  public static mapGlobal(a: All): DataModel {
    return {
      name: 'Worldwide',
      active: {
        value: a.active,
        change: undefined
      },
      tests: {
        value: a.tests,
        change: undefined
      },
      critical: {
        value: a.critical,
        change: undefined
      },
      recovered: {
        value: a.recovered,
        change: {
          duration: 1,
          value: a.todayRecovered
        },
      },
      deaths: {
        value: a.deaths,
        change: {
          duration: 1,
          value: a.todayDeaths
        }
      },
      total: {
        value: a.cases,
        change: {
          duration: 1,
          value: a.todayCases
        }
      },
      region: Region.Global
    } as DataModel;
  }

  public static mapCountry(a: Country, timeSeries: TimeSeriesModel): DataModel {
    return {
      name: a.country,
      active: {
        value: a.active,
        change: undefined
      },
      tests: {
        value: a.tests,
        change: undefined
      },
      critical: {
        value: a.critical,
        change: undefined
      },
      recovered: {
        value: a.recovered,
        change: {
          duration: 1,
          value: a.todayRecovered
        },
      },
      deaths: {
        value: a.deaths,
        change: {
          duration: 1,
          value: a.todayDeaths
        }
      },
      total: {
        value: a.cases,
        change: {
          duration: 1,
          value: a.todayCases
        }
      },
      region: Region.Country
    } as DataModel;
  }

  public static mapProvince(a: State, timeSeries: TimeSeriesModel): DataModel {
    return {
      name: a.state,
      active: {
        value: a.active,
        change: undefined
      },
      tests: {
        value: a.tests,
        change: undefined
      },
      deaths: {
        value: a.deaths,
        change: {
          duration: 1,
          value: a.todayDeaths
        }
      },
      total: {
        value: a.cases,
        change: {
          duration: 1,
          value: a.todayCases
        }
      },
      region: Region.State
    } as DataModel;
  }

  public static mapCounty(a: CountyTotal, timeSeries: TimeSeriesModel): DataModel {
    const date = this.getDateString();
    return {
      name: a.county,
      active: {
        value: undefined,
        change: undefined
      },
      tests: {
        value: undefined,
        change: undefined
      },
      deaths: {
        value: a.stats.deaths,
        change: {
          duration: 1,
          value: a.stats.deaths - timeSeries.timeline.deaths[date]
        }
      },
      total: {
        value: a.stats.confirmed,
        change: {
          duration: 1,
          value: a.stats.confirmed - timeSeries.timeline.cases[date]
        }
      },
      region: Region.County
    } as DataModel;
  }

  private static getDateString() {
    const today = moment();
    const yesterday = today.subtract(1, 'd');
    return yesterday.format('MM/DD/YY');
  }
}
