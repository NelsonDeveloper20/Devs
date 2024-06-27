import { Component, OnInit } from '@angular/core';  

import * as Highcharts from 'highcharts';   
import HC_exporting from 'highcharts/modules/exporting'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { LineaProduccionService } from '../services/lineaproduccion.service';
HC_exporting(Highcharts);




@Component({
  selector: 'app-linea-produccion',
  templateUrl: './linea-produccion.component.html',
  styleUrls: ['./linea-produccion.component.css']
})
export class LineaProduccionComponent implements OnInit { 
  constructor( 
    private toaster: Toaster,
    private spinner: NgxSpinnerService,
    private _service: LineaProduccionService
  ) { 
    
  }
  ngOnInit(): void { }

  ngAfterViewInit() {
    this.iniciarGraficos();  
  }
  iniciarGraficos(){
    this.crearCircular(); 
    this.CrearBaraDerecha();
    //this.LinaProdHorizontal();
    this.ListarLinea();
  }
 

//#region  LISTAR LINEA DE PRODUCCION API

ListLinea: any[] = [];
LineaCategoria: any[] = [];
LineaSeries: any[] = [];
LineaPieSeriesData: any[] = [];
Fecha: Date = new Date();  
LineaAverageSeries: any = {}; // Cambiado a un objeto
ListarLinea() {
  this.spinner.show();
  this._service.ListarLineaProduccion("2024").subscribe(
    (data: any) => {
      if (data && data.status === 200) {
        this.ListLinea = data.json;
        console.log("RESULTADOSS");
        console.log(this.ListLinea);
        this.spinner.hide();

        // Obtener las categorías únicas y ordenadas
        this.LineaCategoria = [...new Set(this.ListLinea.map(item => item.fechas))];

        // Agrupar los datos por 'turno' y sumar los totales por cada fecha
        const groupedData = this.ListLinea.reduce((acc, item) => {
          const { turno, fechas, total } = item;
          if (!acc[turno]) {
            acc[turno] = {};
          }
          if (!acc[turno][fechas]) {
            acc[turno][fechas] = 0;
          }
          acc[turno][fechas] += total;
          return acc;
        }, {});

        // Crear el formato para Highcharts series de columnas
        this.LineaSeries = Object.keys(groupedData).map(turno => {
          return {
            type: 'column',
            name: turno,
            data: this.LineaCategoria.map(fecha => groupedData[turno][fecha] || 0)
          };
        });

        // Crear el formato para Highcharts series de pastel
        const totalData = this.LineaCategoria.reduce((acc, fecha) => {
          this.ListLinea.forEach(item => {
            if (!acc[fecha]) {
              acc[fecha] = 0;
            }
            if (item.fechas === fecha) {
              acc[fecha] += item.total;
            }
          });
          return acc;
        }, {});

        this.LineaPieSeriesData = this.LineaCategoria.map((fecha, index) => {
          return {
            name: fecha,
            y: totalData[fecha],
            color: Highcharts.getOptions().colors[index % Highcharts.getOptions().colors.length] // Asignar colores cíclicamente
          };
        });

        // Calcular el promedio para cada fecha
        const averageData = this.LineaCategoria.map(fecha => {
          const totalSum = Object.keys(groupedData).reduce((sum, turno) => sum + (groupedData[turno][fecha] || 0), 0);
          const turnosCount = Object.keys(groupedData).length;
          return totalSum / turnosCount;
        });

        this.LineaAverageSeries = {
          type: 'line',
          name: 'Average',
          data: averageData,
          marker: {
            lineWidth: 3,
            lineColor: Highcharts.getOptions().colors[3],
            fillColor: 'white'
          }
        };
        this.LinaProdHorizontal();
      } else {
        this.spinner.hide();
        console.error('Error: No se pudo obtener datos.');
      }
    },
    (error: any) => {
      this.spinner.hide();
      console.error('Error al obtener datos:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  );
}
/*
MANEJO CUANDO HAY MUCHAS CATEGORIAS scroll 
*/
/*filtrarPorTurnoYFecha(turno: string, fecha: string) {
  this.spinner.show();
  this._service.FiltrarPorTurnoYFecha(turno, fecha).subscribe(
    (data: any) => {
      if (data && data.status === 200) {
        this.spinner.hide();
        const productos = data.json;
        console.log("Productos filtrados:", productos);
        this.mostrarProductosFiltrados(productos);
      } else {
        this.spinner.hide();
        console.error('Error: No se pudo obtener datos.');
      }
    },
    (error: any) => {
      this.spinner.hide();
      console.error('Error al obtener datos:', error);
    }
  );
}*/
LinaProdHorizontal() {
  Highcharts.chart('container_linea_horizontal', { 
     chart: {
      scrollablePlotArea: {
          minWidth: 500,
          scrollPositionX: 1
      }
  }, 
    title: {
      text: 'Linea de Producción',
      align: 'left',
    },
    
    xAxis: {
      categories: this.LineaCategoria, 
    },
    yAxis: {
      title: {
        text: 'Productos'
      }, 
    },
    tooltip: {
      valueSuffix: ' Productos', 
    },
    plotOptions: {
      series: {
        //borderRadius: '25%'
        point: {
          events: {
            click: (event) => {
              const turno = event.point.series.name;
              const fecha = event.point.category;
              //this.filtrarPorTurnoYFecha(turno, fecha);
            }
          }
        }
      }, 
    },
    exporting: {
      enabled: true
    },
    series: [
      ...this.LineaSeries,      
      this.LineaAverageSeries, // Añadir la serie de promedio
      {
        type: 'pie',
        name: 'Total',
        data: this.LineaPieSeriesData,
        center: [75, 65],
        size: 100,
        innerSize: '70%',
        showInLegend: false,
        dataLabels: {
          enabled: false
        }
      }
    ]
  });
}
//#endregion


 
 
CrearBaraDerecha() {
  Highcharts.chart('container_derecho', {
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

crearCircular(){
Highcharts.chart('container_circular', {
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
    text: 'Source: <a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        distance: 20,
        formatter: function() {
            return this.point.percentage > 10 ? `${this.point.percentage.toFixed(1)}%` : null;
        },
        format: '{point.name}: {point.percentage:.1f}%',
        
        style: {
          fontSize: '1.2em',
          textOutline: 'none',
          opacity: 0.7
      }
      },
      showInLegend: true 

    }
  },
  series: [{
    type: 'pie', // Indica el tipo de gráfico aquí
    name: 'Percentage',
    //colorByPoint: true,
    data: [{
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
}
}
