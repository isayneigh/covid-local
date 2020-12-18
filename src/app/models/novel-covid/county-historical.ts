export interface TimeSeriesModel {
  province: string | string[];
  country: string;
  county: string;
  timeline: Timeline;
}

export interface Timeline {
  recovered: { [key: string]: number; };
  cases: { [key: string]: number; };
  deaths: { [key: string]: number; };
}
