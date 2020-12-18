import { Region } from '../models/data-model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private readonly storagePrefix = 'covid-local';
  private readonly regionKey = 'region';
  private readonly durationKey = 'duration';

  private localRegion: Region;
  public get region(): Region {
    return this.localRegion;
  }

  private localDuration: number;
  public get duration(): number {
    return this.localDuration;
  }

  public updateRegion = new Subject<Region>();

  public updateDuration = new Subject<number>();

  constructor() {
    this.localRegion = this.initializeSelectedRegion();
    this.localDuration = this.initializeSelectedDuration();
    this.updateRegion.subscribe((region) => {
      this.localRegion = region;
      localStorage.setItem(`${this.storagePrefix}-${this.regionKey}`, region.toString());
    });
    this.updateDuration.subscribe((duration) => {
      this.localDuration = duration;
      localStorage.setItem(`${this.storagePrefix}-${this.durationKey}`, duration.toString());
    });
  }

  private initializeSelectedRegion(): Region {
    const storageVal = localStorage.getItem(`${this.storagePrefix}-${this.regionKey}`);
    const mappedValue = parseInt(storageVal, 10);
    const returnVal = isNaN(mappedValue) ? Region.County : mappedValue as Region;
    localStorage.setItem(`${this.storagePrefix}-${this.regionKey}`, returnVal.toString());
    return returnVal;
  }

  private initializeSelectedDuration(): number {
    const storageVal = localStorage.getItem(`${this.storagePrefix}-${this.durationKey}`);
    const mappedValue = parseInt(storageVal, 10);
    const returnVal = isNaN(mappedValue) ? 30 : mappedValue;
    localStorage.setItem(`${this.storagePrefix}-${this.durationKey}`, returnVal.toString());
    return returnVal;
  }
}
