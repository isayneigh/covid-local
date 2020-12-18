export interface DataModel {
  region: Region;
  name: string;
  active: DataItem;
  total: DataItem;
  deaths: DataItem;
  tests: DataItem;
  recovered: DataItem;
  critical: DataItem;
  parent?: DataModel;
}

export interface DataItem {
  change: ChangeOverTime;
  value: number;
}

export interface ChangeOverTime {
  duration: number;
  value: number;
}

export enum Region {
  County,
  State,
  Country,
  Global
}

export class RegionDisplayModel {
  region: Region;
  name: string;
  flagSrc: string;
}

export class RegionListDisplayModel {
  regions: RegionDisplayModel[];
}
