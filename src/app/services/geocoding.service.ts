import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LatLong } from '../models/geocoding/lat-long';
import { AddressLookupResponse } from '../models/geocoding/address-lookup-response';
import { Loader } from "@googlemaps/js-api-loader"
import { map } from 'rxjs/operators';
@Injectable(
  {
    providedIn: 'root'
  }
)
export class GeoCodingService {

  private readonly APIKEY = environment.geocodingApiKey;

  constructor(public client: HttpClient) { }

  public addressLookup(latLong: LatLong, callback: (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => void): void {

    new google.maps.Geocoder().geocode({ location: latLong as any }, callback)

  }
}
