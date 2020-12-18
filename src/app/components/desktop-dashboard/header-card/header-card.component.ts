import { Component, OnInit, Input, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { DataModel } from 'src/app/models/data-model';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header-card',
  templateUrl: './header-card.component.html',
  styleUrls: ['./header-card.component.scss']
})
export class HeaderCardComponent implements OnInit, OnChanges {

  @Input()
  public flagSrc: string;

  @Input()
  public data: DataModel;

  public get isMobile(): boolean {
    return screen.width < 480;
  }

  public arrowUp = faArrowUp;

  public arrowDown = faArrowDown;

  public numericConfig = { truncate: true, truncateAfter: 10000 };

  public flagStyle = {};

  constructor(
    private readonly ref: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes) {
      this.flagStyle = {
        'width.px': (this.ref.nativeElement.querySelector('.flag-container') as HTMLDivElement).offsetWidth
      };
    }

  }

  public getFlagStyle() {
    this.flagStyle = {
      'width.px': (this.ref.nativeElement.querySelector('.flag-container') as HTMLDivElement).offsetWidth
    };
  }

}
