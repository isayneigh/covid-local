import { Country as CovidCountry } from 'novelcovid';

export interface Country extends CovidCountry {
  todayRecovered: number;
}
