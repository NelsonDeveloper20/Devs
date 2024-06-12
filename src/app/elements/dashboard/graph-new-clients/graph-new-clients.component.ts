import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ApexGrid,
} from "ng-apexcharts";


export type ChartOptions = {
  series?: ApexAxisChartSeries | any;
  chart?: ApexChart | any;
  xaxis?: ApexXAxis | any;
  stroke?: ApexStroke | any;
  dataLabels?: ApexDataLabels | any;
  yaxis?: ApexYAxis | any;
  title?: ApexTitleSubtitle | any;
  labels?: string[] | any;
  legend?: ApexLegend | any;
  subtitle?: ApexTitleSubtitle | any;
  colors?: string[] | any;
  fill?: ApexFill | any;
  tooltip?: ApexTooltip | any;
  grid?: ApexGrid | any;
};


@Component({
  selector: 'app-graph-new-clients',
  templateUrl: './graph-new-clients.component.html',
  styleUrls: ['./graph-new-clients.component.css']
})
export class GraphNewClientsComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [{
          name: 'Desktops',
          data: [30, 40, 30, 50, 40]
      }],
        chart: {
          height: 270,
          type: 'line',
          zoom: {
            enabled: true
          },
		  toolbar:{
			show:false  
		  }
        }, 
        dataLabels: {
          enabled: false
        },
        stroke: {
          // width:4,
          curve: 'smooth'
        },
        colors:['#43DC80'],
		legend:{
			show:false
		},
        title: {
          text: undefined,
          align: 'left'
        },
        grid: {
			strokeDashArray: 5,
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0
          },
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
		  axisBorder: {
			show:false
		  },
		  axisTicks:{
			show:false  
		  },
		  labels: {
			  style: {
				  colors: '#828690',
				  fontSize: '14px',
				   fontFamily: 'Poppins',
				  fontWeight: 100,
				  
				}
			}
        },
		yaxis: {
			show:false
		},

    };
  }
  
  
  ngOnInit(): void {
  }

}
