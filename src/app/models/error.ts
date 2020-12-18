import { LatLong } from './geocoding/lat-long';
import { LocaleModel } from './locale-request-model';
import { HttpErrorResponse } from '@angular/common/http';

export class ErrorModel {
  public message: string;
  public modal = false;
  public error?: string;
  public enableReporting: boolean;
  public extra?: {
    location?: LatLong;
    locale?: LocaleModel;
    googleResponse?: any;
    positionError?: PositionError;
  };
}
