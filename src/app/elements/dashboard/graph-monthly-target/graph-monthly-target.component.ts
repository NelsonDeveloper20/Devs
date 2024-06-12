import { Component, OnInit, ViewChild } from '@angular/core';

import {ChartComponent, ApexNonAxisChartSeries, ApexPlotOptions, ApexChart,  ApexFill, ApexStroke,  ApexResponsive } from "ng-apexcharts";

 
export type ChartOptions = {
  series?: ApexNonAxisChartSeries | any;
  chart?: ApexChart | any;
  labels?: string[] | any;
  plotOptions?: ApexPlotOptions | any;
  fill?: ApexFill | any;
  stroke?: ApexStroke | any;
  responsive?: ApexResponsive[] | any;
};


@Component({
  selector: 'app-graph-monthly-target',
  templateUrl: './graph-monthly-target.component.html',
  styleUrls: ['./graph-monthly-target.component.css']
})
export class GraphMonthlyTargetComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

      constructor() {
        this.chartOptions = {
          series: [60],
          chart: {
            height: 230,
            type: "radialBar",
            toolbar: {
                show: false
            }
          },
            plotOptions: {
              radialBar: {
                hollow: {
                  margin: 20,
                  size: '65%',
                  background: '#fff',
                  image: undefined,
                  imageOffsetX: 0,
                  imageOffsetY: 0,
                  position: 'front',
                  dropShadow: {
                    enabled: true,
                    top: 3,
                    left: 0,
                    blur: 10,
                    opacity: 0.1
                  }
                },
                track: {
                  background: '#F8F8F8',
                  strokeWidth: '100%',
                  margin: 0, // margin is in pixels
                },
            
                dataLabels: {
                  show: true,
                  value: {
                    offsetY:-7,
                    color: '#111',
                    fontSize: '20px',
                    show: true,
                  }
                }
              }
            },
            fill: {
                colors: ['#43DC80'],
            },
            stroke: {
            },
            labels: [''],
            responsive: [{
                breakpoint: 575,
                options: {
                    chart: {
                        height: 180,
                    }
                }
            }]
        };
      }

  ngOnInit(): void {
  }

}
