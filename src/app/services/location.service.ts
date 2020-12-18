import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  public getLocation(callback: PositionCallback, errorCallback: PositionErrorCallback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(callback, errorCallback);
    }
  }
}
