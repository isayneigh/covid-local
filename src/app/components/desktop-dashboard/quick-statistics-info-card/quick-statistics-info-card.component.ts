import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DataModel, Region } from 'src/app/models/data-model';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-quick-statistics-info-card',
  templateUrl: './quick-statistics-info-card.component.html',
  styleUrls: ['./quick-statistics-info-card.component.scss'],
  providers: [PercentPipe]
})
export class QuickStatisticsInfoCardComponent implements OnInit, OnChanges {

  @Input()
  public data: DataModel;

  public cardColor = '#424242';

  public colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  public cardData = [];

  public wait = true;
  constructor(private readonly percentPipe: PercentPipe) { }

  ngOnInit(): void {

    this.cardData.push(
      {
        value: this.percentPipe.transform(this.data?.total?.value / this.data?.parent?.total?.value, '1.1'),
        name: this.parentStatisticLabel(this.data?.parent, 'case')
      }
    );


    this.cardData.push(
      {
        value: this.percentPipe.transform(this.data?.total?.value / this.data?.parent?.parent?.total?.value, '1.3-5'),
        name: this.parentStatisticLabel(this.data?.parent?.parent, 'case')
      }
    );

    this.cardData.push(
      {
        value: this.percentPipe.transform(this.data?.deaths?.value / this.data?.parent?.deaths?.value, '1.1'),
        name: this.parentStatisticLabel(this.data?.parent, 'case')
      }
    );


    this.cardData.push(
      {
        value: this.percentPipe.transform(this.data?.deaths?.value / this.data?.parent?.parent?.deaths?.value, '1.3-5'),
        name: this.parentStatisticLabel(this.data?.parent?.parent, 'case')
      }
    );
    this.wait = false;
  }

  public ngOnChanges(changes: SimpleChanges) {

    if (changes.data.firstChange) {
      this.wait = false;
    }

  }

  public parentStatisticLabel(data: DataModel, context: 'case' | 'death'): string {

    let label = `of `;

    if (context === 'case') {
      label += 'cases ';
    } else {
      label += 'deceased ';
    }

    if (data) {
      if (data.region === Region.Global) {
        label += data.name.toLowerCase();
      } else {
        label += 'in ' + data.name;
      }
    }

    return label;
  }

}
