import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { NovelCovidService } from 'src/app/services/novel-covid.service';
import { LinearContext } from 'src/app/models/graphs/linear-context';
import { DataModel } from 'src/app/models/data-model';
import { LocaleModel } from 'src/app/models/locale-request-model';
import { FilterService } from 'src/app/services/filter.service';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material/select';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Colors } from 'ng2-charts';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { TimeSeriesModel } from 'src/app/models/novel-covid/county-historical';
import * as Chart from 'chart.js';
import { CovidTrackingService } from 'src/app/services/covid-tracking.service';
import { forkJoin } from 'rxjs';
import { CovidTrackingModel } from 'src/app/models/covid-tracking/covid-tracking-model';
import { SkyNumericPipe } from '@skyux/core';

export enum LineGraphMode {
  Cumulative,
  DayToDay,
  Velocity
}

@Component({
  selector: 'app-linear-graph-info-card',
  templateUrl: './linear-graph-info-card.component.html',
  styleUrls: ['./linear-graph-info-card.component.scss'],
  providers: [DecimalPipe, PercentPipe]
})
export class LinearGraphInfoCardComponent implements OnInit, OnChanges {

  @Input()
  public data: DataModel;

  @Input()
  public locale: LocaleModel;

  @Input()
  public duration: number;

  @Input()
  public context: LinearContext;

  public noData = false;

  public graphData: ChartDataSets[];

  public xAxisTicks = [];

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          position: 'left',
          gridLines: {
            color: '#fffff'
          },
          ticks: {
            callback: (value, index) => {
              return this.skyNumericPipe.transform(value as number, { truncate: true, truncateAfter: 9999 });
            },
          },
        },
        {
          id: 'y-axis-2',
          position: 'right',
          gridLines: {
            color: '#fffff'
          },
          ticks: {
            callback: (value, index) => {
              return this.skyNumericPipe.transform(value as number, { truncate: true, truncateAfter: 9999 });
            },
          },
        }
      ]
    },
    tooltips: {
      callbacks: {
        label: (item, data) => {
          return this.decimalPipe.transform(data.datasets[item.datasetIndex].data[item.index]);
        }
      }
    }
  };

  public lineChartColors: Colors[] = [
    {
      backgroundColor: 'rgba(102, 102, 102, 0.2)',
      borderColor: '#c43837'
    },
    {
      backgroundColor: 'rgba(102, 102, 102, 0.2)',
      borderColor: '#5f8dd3'
    }
  ];

  public barChartColors: Colors[] = [
    {
      backgroundColor: '#c43837',
    }
  ];

  public durationOptions = [
    {
      name: '7 days ago',
      value: 7
    },
    {
      name: '30 days ago',
      value: 30
    },
    {
      name: 'Jan 1, 2020',
      value: moment().diff(moment('01/01/2020', 'MM/DD/YYYY'), 'days')
    },
  ];

  public modeOptions = [
    {
      name: 'cumulative',
      value: LineGraphMode.Cumulative
    },
    {
      name: 'day to day',
      value: LineGraphMode.DayToDay
    }
  ];

  public chartType = 'line';

  public currentMode = LineGraphMode.Cumulative;

  private currentData: TimeSeriesModel;

  constructor(
    private readonly covidService: NovelCovidService,
    private readonly filterService: FilterService,
    private readonly covidTrackingService: CovidTrackingService,
    private readonly decimalPipe: DecimalPipe,
    private readonly skyNumericPipe: SkyNumericPipe,
    private readonly percentPipe: PercentPipe,
    private readonly ref: ElementRef
  ) { }

  ngOnInit(): void {
    this.getGraphInformation();
  }

  public ngOnChanges(changes: SimpleChanges) {

    if (changes.data) {
      if (!changes.data?.isFirstChange() &&
        (changes.data.currentValue.region !== changes.data.previousValue.region)) {
        this.noData = false;
        this.getGraphInformation();
      }
    }

    if (changes.duration) {
      if (!changes.duration?.isFirstChange() &&
        (changes.duration.currentValue !== changes.duration.previousValue)) {
        this.noData = false;
        this.getGraphInformation();
      }
    }
  }

  public updateDuration(newDuration: MatSelectChange) {
    if (newDuration.value !== this.duration) {
      this.filterService.updateDuration.next(newDuration.value);
    }
  }

  public updateMode(newDuration: MatSelectChange) {
    if (newDuration.value !== this.duration) {
      this.currentMode = newDuration.value;
      this.getGraphInformation();
    }
  }

  private getGraphInformation() {
    this.lineChartOptions.tooltips = {
      callbacks: {
        label: (item, data) => {
          return this.decimalPipe.transform(data.datasets[item.datasetIndex].data[item.index]);
        }
      }
    };

    forkJoin([
      this.covidService.getTimeSeriesInformation(this.data.region, this.locale, this.duration + 2),
      this.covidTrackingService.getCovidTrackingHistorical(this.data.region, this.locale)]
    )
      .subscribe(([current, testData]) => {
        this.xAxisTicks = [];
        this.graphData = [];
        this.currentData = current;
        this.addDataToGraph(current, this.currentMode, testData);
      });
  }

  private addDataToGraph(results: TimeSeriesModel, mode: LineGraphMode, trackingData: CovidTrackingModel[]) {

    const countyData = { label: this.data.name, data: [], yAxisID: 'y-axis-1' };
    const testData = { label: 'Tests', data: [], yAxisID: 'y-axis-2' };

    const keys = this.context.type === 'case'
      ? this.currentData.timeline.cases :
      this.context.type === 'recovered'
        ? this.currentData.timeline.recovered :
        this.currentData.timeline.deaths;

    let temp1 = [0];
    countyData.data = Object.keys(keys || {})
      .map((key, index) => {

        const array = this.context.type === 'case'
          ? this.currentData.timeline.cases :
          this.context.type === 'recovered'
            ? this.currentData.timeline.recovered :
            this.currentData.timeline.deaths;

        if (index >= 2) {
          this.xAxisTicks.push(key);
          const cumulativeValue = array[key];
          const dayToDayValue = array[key] ? array[key] - array[Object.keys(array)[index - 1]] : 0;
          const prevDayToDayValue = array[Object.keys(array)[index - 1]] ?
            array[Object.keys(array)[index - 1]] - array[Object.keys(array)[index - 2]] : 0;
          let velocityValue = (prevDayToDayValue + dayToDayValue + temp1[0]);
          temp1 = [velocityValue];
          velocityValue /= index + 1;
          velocityValue = Math.fround(velocityValue);
          if (velocityValue > 0) {
            velocityValue -= 1;
          }
          if (mode === LineGraphMode.Cumulative) {
            if (trackingData) {
              const mappedDate = this.mapNovelCoronaDateToCoronaTrackingDate(key);
              const totalTestResults = trackingData.find(item => item.date === mappedDate)?.totalTestResults || 0;
              // const factor = this.getFactor((totalTestResults / cumulativeValue));
              // totalTestResults /= factor;
              testData.data.push(totalTestResults);
            }
            return cumulativeValue;
          } else if (mode === LineGraphMode.DayToDay) {
            if (trackingData) {
              const mappedDate = this.mapNovelCoronaDateToCoronaTrackingDate(key);
              const totalTestResults = trackingData.find(item => item.date === mappedDate)?.totalTestResultsIncrease || 0;
              // const factor = this.getFactor((totalTestResults / cumulativeValue));
              // totalTestResults /= factor;
              testData.data.push(totalTestResults);
            }
            return dayToDayValue;
          } else {
            this.lineChartOptions.tooltips = {
              callbacks: {
                label: (item, data) => {
                  return data.datasets[item.datasetIndex].data[item.index] + ' per day';
                }
              }
            };
            return velocityValue;
          }
        } else {
          return undefined;
        }
      });

    countyData.data.shift();
    countyData.data.shift();

    if (countyData.data.length) {
      if (mode === LineGraphMode.DayToDay) {
        this.chartType = 'bar';
      } else {
        this.chartType = 'line';
      }

      this.graphData.push(countyData);
      if (trackingData && testData.data) {
        this.graphData.push(testData);
      }
    } else {
      this.noData = true;
    }
  }

  private mapNovelCoronaDateToCoronaTrackingDate(date: string): number {
    const day = moment(date, 'M/DD/YYYY').date();
    const month = moment(date, 'M/DD/YYYY').month() + 1;
    const year = moment(date, 'M/DD/YYYY').year();

    return parseInt(`${year}${month > 9 ? month : '0' + month}${day > 9 ? day : '0' + day}`, 10);
  }

}

