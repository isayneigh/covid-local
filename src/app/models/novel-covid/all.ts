import { All as CovidAll } from 'novelcovid';

export interface All extends CovidAll {
  todayRecovered: number;
}
