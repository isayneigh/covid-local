import { Component, OnInit, Input } from '@angular/core';
import { faDizzy, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { ErrorModel } from 'src/app/models/error';
import * as moment from 'moment';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  @Input()
  public error: ErrorModel;

  public readonly dizzy = faDizzy;

  public readonly report = faBullhorn;

  constructor() { }

  ngOnInit(): void {
  }

  public getMailToValue() {

    let initial = 'mailto:covid19localwebsite@gmail.com';

    if (this.error.extra?.positionError) {
      initial += '?subject=LOCATION: ' + this.error.extra?.positionError.code;
      initial += ' ***DO NOT REPLACE SUBJECT LINE***';
      return initial;
    }

    if (this.error.extra?.location && !this.error.extra?.googleResponse) {
      initial += '?subject=GOOG_NORESPONSE: ' + this.error.message;
      initial += ' ***DO NOT REPLACE SUBJECT LINE***';
      initial += '&body=' + JSON.stringify(this.error.error) + escape('\r\n');
      initial += JSON.stringify(this.error.extra.location) + escape('\r\n');
      initial += moment().toString();
      return initial;
    }

    if (this.error.extra?.location && this.error.extra?.googleResponse && this.error.extra?.googleResponse.status === 'REQUEST_DENIED') {
      initial += '?subject=GOOG_DENIED ' + this.error.message;
      initial += ' ***DO NOT REPLACE SUBJECT LINE***';
      initial += '&body=' + JSON.stringify(this.error.extra.location) + escape('\r\n');
      initial += JSON.stringify(this.error.extra.googleResponse.status);
      initial += moment().toString();
      return initial;
    }

    if (this.error.extra?.location && this.error.extra?.googleResponse && !this.error.extra?.locale) {
      initial += '?subject=GOOG_LOCALE ' + this.error.message;
      initial += ' ***DO NOT REPLACE SUBJECT LINE***';
      initial += '&body=' + JSON.stringify(this.error.extra.location) + escape('\r\n');
      initial += JSON.stringify(this.error.extra.googleResponse);
      initial += moment().toString();
      return initial;
    }


    if (this.error.extra?.location && this.error.extra?.googleResponse && this.error.extra?.locale) {
      initial += '?subject=COVID_ERROR ' + this.error.message;
      initial += ' ***DO NOT REPLACE SUBJECT LINE***';
      initial += '&body=' + JSON.stringify(this.error.extra.location) + escape('\r\n');
      initial += JSON.stringify(this.error.extra.locale) + escape('\r\n');
      initial += JSON.stringify(this.error.error) + escape('\r\n');
      initial += JSON.stringify(this.error.extra.googleResponse);
      initial += moment().toString();
      return initial;
    }

  }

}
