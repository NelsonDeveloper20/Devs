import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexResponsive,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series?: ApexAxisChartSeries | any;
  chart?: ApexChart | any;
  dataLabels?: ApexDataLabels | any;
  plotOptions?: ApexPlotOptions | any;
  yaxis?: ApexYAxis | any;
  xaxis?: ApexXAxis | any;
  fill?: ApexFill | any;
  tooltip?: ApexTooltip | any;
  stroke?: ApexStroke | any;
  legend?: ApexLegend | any;
  colors?: string[] | any;
  responsive?: ApexResponsive[] | any;
  grid?: ApexGrid | any;
};

@Component({
  selector: 'app-graph-project-created',
  templateUrl: './graph-project-created.component.html',
  styleUrls: ['./graph-project-created.component.css']
})
export class GraphProjectCreatedComponent implements OnInit {

  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
        series: [
             {
                name: "New Clients",
                data: [300, 450, 600, 600, 400, 450, 410, 470, 480, 800, 600, 900, 400]
            }
        ],
        chart: {
            type: "bar",
            height: 200,
            stacked: true,
            toolbar: {
                show: false
            },
            sparkline: {
                //enabled: true
            },
            offsetX: -10,
        },
        plotOptions: {
            bar: {
                columnWidth: "30%",
                // endingShape: "rounded",
                // startingShape: "rounded",
                
                colors: {
                    backgroundBarColors: ['#f0f0f0', '#f0f0f0', '#f0f0f0', '#f0f0f0','#f0f0f0','#f0f0f0','#f0f0f0','#f0f0f0'],
                    backgroundBarOpacity: 1,
                    backgroundBarRadius: 5,
                },

            },
            // distributed: true
        },
        colors:['#43DC80'],
        grid: {
            show: false,
        },
        legend: {
            show: false
        },
        fill: {
          opacity: 1
        },
        dataLabels: {
            enabled: false,
            // colors: ['#000'],
            dropShadow: {
              enabled: true,
              top: 1,
              left: 1,
              blur: 1,
              opacity: 1
          }
        },
        xaxis: {
         categories: ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
          labels: {
           style: {
              colors: '#787878',
              fontSize: '13px',
              fontFamily: 'poppins',
              fontWeight: 100,
              cssClass: 'apexcharts-xaxis-label',
            },
          },
          crosshairs: {
            show: false,
          },
          axisBorder: {
              show: false,
            },
        },
        yaxis: {
			labels: {
				show:false,
			   style: {
				  colors: '#3e4954',
				  fontSize: '14px',
				   fontFamily: 'Poppins',
				  fontWeight: 100,
				  
				},
				 formatter: function (y: any) {
						  return y.toFixed(0) + "k";
						}
			},
        },
        tooltip: {
            x: {
                show: true
            }
        },
         responsive: [{
            breakpoint: 575,
            options: {
                chart: {
                    height: 250,
                }
            }
         }]
    };
  }

  ngOnInit(): void {
  }

}
