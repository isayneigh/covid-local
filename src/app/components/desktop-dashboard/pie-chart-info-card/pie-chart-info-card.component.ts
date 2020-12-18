import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataModel } from 'src/app/models/data-model';
import { LinearContext } from 'src/app/models/graphs/linear-context';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { ChartOptions } from 'chart.js';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-pie-chart-info-card',
  templateUrl: './pie-chart-info-card.component.html',
  styleUrls: ['./pie-chart-info-card.component.scss'],
  providers: [DecimalPipe]
})
export class PieChartInfoCardComponent implements OnInit, OnChanges {

  @Input()
  public data: DataModel;

  @Input()
  public context: LinearContext;

  public pieChartData = [];

  public pieChartLabels = [];

  public circle = faCircle;

  public pieChartColors = [
    {
      backgroundColor: ['#5f8dd3', 'rgb(162, 126, 168)', '#c43837'],
      borderColor: ['#000000a0']
    },
  ];

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom',
      labels: {
        fontColor: '#ffffff',
        fontFamily: 'Open Sans Light',
        fontSize: 15
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    tooltips: {
      callbacks: {
        label: (item, data) => {
          return this.numberPipe.transform(data.datasets[item.datasetIndex].data[item.index]);
        }
      }
    }
  };

  constructor(
    private readonly numberPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.processDataForGraph();
  }

  public ngOnChanges(changes: SimpleChanges) {

    if (!changes.data.isFirstChange() && changes.data.currentValue.region !== changes.data.previousValue.region) {
      this.processDataForGraph();
    }

  }

  private processDataForGraph() {
    this.pieChartData = [];
    this.pieChartLabels = [];
    if (this.context.type === 'case') {
      this.pieChartData.push(this.data.total.value);
      this.pieChartLabels.push(this.data.name);
      if (this.data.parent) {
        this.pieChartData.push(this.data.parent.total.value - this.data.total.value);
        this.pieChartLabels.push(this.data.parent.name);
      }
      if (this.data.parent?.parent) {
        this.pieChartData.push(this.data.parent.parent.total.value - (this.data.parent.total.value + this.data.total.value));
        this.pieChartLabels.push(this.data.parent.parent.name);
      }
    } else if (this.context.type === 'death') {
      this.pieChartData.push(this.data.deaths.value);
      this.pieChartLabels.push(this.data.name);
      if (this.data.parent) {
        this.pieChartData.push(this.data.parent.deaths.value - this.data.deaths.value);
        this.pieChartLabels.push(this.data.parent.name);
      }
      if (this.data.parent?.parent) {
        this.pieChartData.push(this.data.parent.parent.deaths.value - (this.data.parent.deaths.value + this.data.deaths.value));
        this.pieChartLabels.push(this.data.parent.parent.name);
      }
    } else if (this.context.type === 'recovered') {
      this.pieChartData.push(this.data.recovered.value);
      this.pieChartLabels.push(this.data.name);
      if (this.data.parent) {
        this.pieChartData.push(this.data.parent.recovered.value - this.data.recovered.value);
        this.pieChartLabels.push(this.data.parent.name);
      }
      if (this.data.parent?.parent) {
        this.pieChartData.push(this.data.parent.parent.recovered.value - (this.data.parent.recovered.value + this.data.recovered.value));
        this.pieChartLabels.push(this.data.parent.parent.name);
      }
    }
  }

}
