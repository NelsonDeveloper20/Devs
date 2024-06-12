import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { MonitoreoService } from '../services/monitoreo.service';
import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-monitoreo-produccion',
  templateUrl: './monitoreo-produccion.component.html',
  styleUrls: ['./monitoreo-produccion.component.css']
})
export class MonitoreoProduccionComponent implements OnInit {
  color: ThemePalette = 'primary'; //accent   //warn
  mode: ProgressBarMode = 'buffer';
  value = 50;
  bufferValue = 75;


  
  displayedColumns: string[] = ['expand', 'ruc', 'razonSocial', 'cotizacion', 'producto', 'codProducto', 'accionamiento', 'cantidad', 'cantProducto', 'estado', 'tipoOperacion', 'subtable'];
 
toggleExpand(item: any) {
  this.ListMonitoreoExplocion.forEach(data => {
    if (data !== item) {
      data.isExpand = false; // Cierra todos los elementos que no sean el seleccionado
    }
  });
  item.isExpand = !item.isExpand; // Abre o cierra el elemento seleccionado
}
  estaciones(){
    
    this.router.navigate(['/Estacion-Trabajo']);
    }
      
  constructor(
    private router: Router,
    private toaster: Toaster,
    private spinner: NgxSpinnerService, 
    private _service: MonitoreoService
  ) {  
  } 
   
  ngOnInit(): void {  
    this.ListarMonitoreoExplocion();
  }  
showfilter=false; 
cotizacion: string; 
fechaInicio: Date;
fechaFin: Date; 
showFilter(){
this.showfilter=!this.showfilter;
}
buscarVenta() {
  // Aquí puedes implementar la lógica para buscar la venta
  // utilizando los datos del formulario
  console.log('Buscar venta'); 
  console.log('Cotización:', this.cotizacion); 
  console.log('Fecha de Inicio:', this.fechaInicio);
  console.log('Fecha de Fin:', this.fechaFin); 
}

Fecha:Date=new Date();

//#region LISTAR PARA EXPLOCION
ListMonitoreoExplocion:any=[];
ListarMonitoreoExplocion() {
  const fecInicio = moment(this.Fecha, 'DD/MM/YYYY').format(
    'YYYY-MM-DD'
  ); 
  var cotizacion="--";
  
  this.spinner.show();
  this._service.ListarMonitoreo(cotizacion,fecInicio,fecInicio).subscribe(
    (data: any) => {
      if (data && data.status === 200) {  
        this.ListMonitoreoExplocion = data.json.map(item => ({ ...item, isExpand: false }));
        this.spinner.hide();      
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
//#endregion

//#region LISTAR COMPONENTE DEL PRODDUCTO POR GRUPO
ListComponenteProducto:any=[];
ListarComponteProductoByGrupo(Grupo) { 
  this.spinner.show();
  this._service.ListarComponenteDelProducto(Grupo,"1").subscribe(
    (data: any) => {
      if (data && data.status === 200) {  
        this.ListComponenteProducto = data.json.map(item => ({ ...item, agregado: false ,cantidad:"",merma:"" }));
        this.spinner.hide();      
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
agregarComponente(){
  this.ListComponenteProducto.push(
    {
      componente:"Agregado",
      codigo:"",
      nombre:"",
      agregado:true
  });
}

guardarComponentes() {
  // Aquí tienes acceso a todos los datos, incluidos los cambios realizados por el usuario
  console.log('Datos de componentes:', this.ListComponenteProducto);
  
  // Si deseas convertir los datos a formato JSON
  const datosJSON = JSON.stringify(this.ListComponenteProducto);
  console.log('Datos en formato JSON:', datosJSON);
}
eliminarItemAgregado(item: any) {
  const index = this.ListComponenteProducto.indexOf(item);
  if (index !== -1) {
    this.ListComponenteProducto.splice(index, 1);
  }
}
clonarComponente(item:any){  
  // Encuentra el índice del elemento seleccionado
  const index = this.ListComponenteProducto.indexOf(item);
  
  // Inserta el nuevo elemento justo después del elemento seleccionado
  this.ListComponenteProducto.splice(index + 1, 0, {
    componente: "Clonado",
    codigo: item.codigo,
    nombre: item.nombre
  });
/*
  console.log(item);
  this.ListComponenteProducto.push(item);*/
}
//#endregion

}

