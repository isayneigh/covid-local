export interface CountyTotal {
  country: string;
  province: string;
  county: string;
  updatedAt: string;
  stats: CountyTotalStats;
  coordinates: CountyTotalCoordinates;
}

export interface CountyTotalStats {
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface CountyTotalCoordinates {
  latitude: number;
  longitude: number;
}
