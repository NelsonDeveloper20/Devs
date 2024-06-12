import { Component, OnInit,ViewChild } from '@angular/core'; 
import { MatSidenav } from '@angular/material/sidenav';

//ini 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AzureAdDemoService } from 'src/app/azure-ad-demo.service';
import { Profile } from 'src/app/profile.model';

//ennd
import * as Highcharts from 'highcharts';   
import HC_exporting from 'highcharts/modules/exporting'; 
HC_exporting(Highcharts);


@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.css']
})
export class HomeMainComponent implements OnInit {

  //#region MENU
  @ViewChild('sidenav') sidenav!: MatSidenav; 
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
 
//dd
profile?:Profile;
profilePic?:SafeResourceUrl;
constructor(private azureAdDemoService:AzureAdDemoService,
  private domSanitizer:DomSanitizer,private authService:MsalService,  
  private router: Router) { }

  dominio:String=""; 
  rutaImagen: string = '';
  
getProfile()
{
  this.azureAdDemoService.getUserProfile()
  .subscribe(profileInfo=>{ 
    this.profile=profileInfo;
  })
}
getProfilePic()
{
  this.azureAdDemoService.getProfilePic()
  .subscribe(response=>{
    var urlCreator = window.URL ||window.webkitURL
    this.profilePic = this.domSanitizer.bypassSecurityTrustResourceUrl
    (urlCreator.createObjectURL(response));
  });
}
//#endregion

ngOnInit(): void {
  this.dominio= window.location.hostname;   
    this.rutaImagen='../../assets/login.png'; 
}
 /*
  
  ngAfterViewInit() {
    this.createChart();
    this.createChart2();
    this.createChart3();
  }
 
  createChart() {
    Highcharts.chart('container', {
      title: {
        text: 'Sales of petroleum products March, Norway',
        align: 'left'
      },
      xAxis: {
        categories: [
          'Jet fuel', 'Duty-free diesel', 'Petrol', 'Diesel', 'Gas oil'
        ]
      },
      yAxis: {
        title: {
          text: 'Million liters'
        }
      },
      tooltip: {
        valueSuffix: ' million liters'
      },
      plotOptions: {
        series: {
          //borderRadius: '25%'
        }
      },
      exporting: {
        enabled: true
      },
      series: [{
        type: 'column',
        name: '2020',
        data: [59, 83, 65, 228, 184]
      }, {
        type: 'column',
        name: '2021',
        data: [24, 79, 72, 240, 167]
      }, {
        type: 'column',
        name: '2022',
        data: [58, 88, 75, 250, 176]
      }, {
        type: 'line',
        step: 'center',
        name: 'Average',
        data: [47, 83.33, 70.66, 239.33, 175.66],
        marker: {
          lineWidth: 2,
          lineColor: Highcharts.getOptions().colors[3],
          fillColor: 'white'
        }
      }, {
        type: 'pie',
        name: 'Total',
        data: [{
          name: '2020',
          y: 619,
          color: Highcharts.getOptions().colors[0], // 2020 color
          dataLabels: {
            enabled: true,
            distance: -50,
            format: '{point.total} M',
            style: {
              fontSize: '15px'
            }
          }
        }, {
          name: '2021',
          y: 586,
          color: Highcharts.getOptions().colors[1] // 2021 color
        }, {
          name: '2022',
          y: 647,
          color: Highcharts.getOptions().colors[2] // 2022 color
        }],
        center: [75, 65],
        size: 100,
        innerSize: '70%',
        showInLegend: false,
        dataLabels: {
          enabled: false
        }
      }]
    });
  }  
 
  createChart2() {
    Highcharts.chart('container2', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Historic World Population by Region',
        align: 'left'
      },
      subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population" target="_blank">Wikipedia.org</a>',
        align: 'left'
      },
      xAxis: {
        categories: ['Africa', 'America', 'Asia', 'Europe'],
        title: {
          text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Population (millions)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        },
        gridLineWidth: 0
      },
      tooltip: {
        valueSuffix: ' millions'
      },
      plotOptions: {
        bar: {
          borderRadius: 5, // Usar un número aquí para el radio
          dataLabels: {
            enabled: true
          },
          groupPadding: 0.1
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: Highcharts.defaultOptions.legend?.backgroundColor || '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        type: 'bar',
        name: 'Year 1990',
        data: [631, 727, 3202, 721]
      }, {
        type: 'bar',
        name: 'Year 2000',
        data: [814, 841, 3714, 726]
      }, {
        type: 'bar',
        name: 'Year 2018',
        data: [1276, 1007, 4561, 746]
      }]
    });
  }
  createChart3() {
    Highcharts.chart('container3', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Egg Yolk Composition'
        },
        tooltip: {
            valueSuffix: '%'
        },
        subtitle: {
            text: 'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
        },
        plotOptions: {
            pie: {  // Specify the plot options for the pie chart
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: 20,
                    formatter: function() {
                        return this.point.percentage > 10 ? `${this.point.percentage.toFixed(1)}%` : null;
                    },
                    style: {
                        fontSize: '1.2em',
                        textOutline: 'none',
                        opacity: 0.7
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Percentage',
            //colorByPoint: true,
            data: [
                {
                    name: 'Water',
                    y: 55.02
                },
                {
                    name: 'Fat',
                    sliced: true,
                    selected: true,
                    y: 26.71
                },
                {
                    name: 'Carbohydrates',
                    y: 1.09
                },
                {
                    name: 'Protein',
                    y: 15.5
                },
                {
                    name: 'Ash',
                    y: 1.68
                }
            ]
        }]
    });
}*/
}

