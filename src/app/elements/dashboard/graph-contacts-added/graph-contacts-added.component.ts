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
  selector: 'app-graph-contacts-added',
  templateUrl: './graph-contacts-added.component.html',
  styleUrls: ['./graph-contacts-added.component.css']
})
export class GraphContactsAddedComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

      constructor() {
        this.chartOptions = {
          series: [29],
          chart: {
            height: 130,
            width: 130,
            type: "radialBar",
           
            toolbar: {
                show: false
            },
			sparline:{
                enabled: true,
			}
          },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '75%',
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
                  background: '#efefef',
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
                colors: ['#43dc80'],
            },
            stroke: {
            },
            labels: [''],
            responsive: [{
                breakpoint: 575,
                options: {
                    chart: {
                        height: 80,
                    }
                }
            }]
        };
        }

  ngOnInit(): void {
  }
}
