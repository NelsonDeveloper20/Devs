import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-chartjs-active-users',
  templateUrl: './chartjs-active-users.component.html',
  styleUrls: ['./chartjs-active-users.component.css']
})
export class ChartjsActiveUsersComponent implements OnInit {

  constructor() { }
  
  

  barChartOptions: ChartOptions = {
    responsive: true,
	scales: {
		yAxes: [{
			id: 'y-axis-1',
			type: 'linear',
			display: false,
			position: 'left',
			ticks: {
			   fontColor: '#fff' 
			},
			gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
		}],
		xAxes: [{
			ticks: {
			   fontColor: '#fff'
			},
			gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
		}]
		},
	
	
  };
  barChartLabels: Label[] = ['10', '20', '30', '40', '50', '60'];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];
  barChartColors: Color[] = [{
        borderColor: '#fff',
        backgroundColor: '#69FF93',
    }];

  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Users' }
  ];
  
  
  ngOnInit(): void {
  }

}
