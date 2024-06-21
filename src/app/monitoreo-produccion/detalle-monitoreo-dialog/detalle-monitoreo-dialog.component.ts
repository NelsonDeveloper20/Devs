import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { MonitoreoService } from 'src/app/services/monitoreo.service';

@Component({
  selector: 'app-detalle-monitoreo-dialog',
  templateUrl: './detalle-monitoreo-dialog.component.html',
  styleUrls: ['./detalle-monitoreo-dialog.component.css']
})
export class DetalleMonitoreoDialogComponent implements OnInit {

 
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private toaster: Toaster,
  private dialogRef: MatDialogRef<DetalleMonitoreoDialogComponent>,
  private spinner: NgxSpinnerService,     
  private _service: MonitoreoService

) {
  this.ListarComponteProductoByGrupo(data.cotizacionGrupo);
}

  ngOnInit(): void {
  }

  save(): void {    
    
  }  
  close() {
    this.dialogRef.close();
  }
  lisComponente: any[] = [
    { codigo: 'ACCRS00000011', nombre: 'ACCRS00000011 : ADAPTADOR SL ROLLEASE 1-1/4 - COLOR:WHITE', color: "BLUE", unidad: "UNK" },
    { codigo: 'ACCRS00000012', nombre: 'ACCRS00000012 : ADAPTADOR SL ROLLEASE 1-1/4 - COLOR:BROWN', color: "BLUE", unidad: "UNK" },
    { codigo: 'ACCRS00000013', nombre: 'ACCRS00000013 : ADAPTADOR SL ROLLEASE 1-1/4 - COLOR:BLACK', color: "BLUE", unidad: "UNK" },
    { codigo: 'TELRS00000121', nombre: 'TELRS00000121 : ADAPTADOR SL ROLLEASE 1-1/2 - COLOR:WHITE', color: "BLUE", unidad: "UNK" }
  ];
  
  filteredListComponente = this.lisComponente;
  
  applyFilter(event: any) {
    const valor = event.target.value;
    this.filteredListComponente = this.lisComponente.filter(option => option.codigo.toLowerCase().includes(valor.toLowerCase()));
  }
  
  onNombreChange(event: any, element: any) {
    const selectedOption = this.lisComponente.find(option => option.codigo === event.value);
    if (selectedOption) {
      element.componente = selectedOption.codigo;
      element.descripcionComponente = selectedOption.nombre;
      element.unidadMedida = selectedOption.unidad;
      element.color = selectedOption.color;
    }
  }

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
