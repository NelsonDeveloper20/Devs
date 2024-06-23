import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { MonitoreoService } from 'src/app/services/monitoreo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-monitoreo-dialog',
  templateUrl: './detalle-monitoreo-dialog.component.html',
  styleUrls: ['./detalle-monitoreo-dialog.component.css']
})
export class DetalleMonitoreoDialogComponent implements OnInit {

 DatosGrupo:any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private toaster: Toaster,
  private dialogRef: MatDialogRef<DetalleMonitoreoDialogComponent>,
  private spinner: NgxSpinnerService,     
  private _service: MonitoreoService,
  private router: Router,

) {
  this.DatosGrupo=data;
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
      //element.componente = selectedOption.codigo;
      element.descripcionComponente = selectedOption.nombre;
      element.unidadMedida = selectedOption.unidad;
      element.color = selectedOption.color;
    }
  }

//#region LISTAR COMPONENTE DEL PRODDUCTO POR GRUPO
ListComponenteProducto:any=[];
ListarComponteProductoByGrupo(Grupo) { 
  
  const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
  var idUsuario= userDataString.id.toString(); 
  if (!userDataString) {   this.toaster.open({
    text: "Su sessión ha caducado",
    caption: 'Mensaje',
    type: 'danger',
    // duration: 994000
  });
    this.router.navigate(['/Home-main']);
    return;
  }  
  this.spinner.show();
  this._service.ListarComponenteDelProducto(Grupo,"1").subscribe(
    (data: any) => {
      if (data && data.status === 200) {  
        this.ListComponenteProducto = data.json.map(item => (
          { ...item, 
            NumeroCotizacion:this.DatosGrupo.cotizacion,
            Grupo:Grupo,
            Usuario:idUsuario,
            IdProducto:"1",
            CodigoProducto:"PRTS",
            NombreProducto:"PR",
            agregado: false ,
            cantidadUtilizada:"",
            merma:"" }));
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
 
  const datosJSON = JSON.stringify(this.ListComponenteProducto);
  console.log('Datos en formato JSON:', datosJSON);
  var counter=0;
  this.ListComponenteProducto.forEach(item => {
     if(item.codigo==""){
      counter++;
     }
     if(item.nombre==""){
      counter++;
     }     
     if(item.cantidadUtilizada==""){
      counter++;
     }
     if(item.merma==""){
      counter++;
     }    

  });
  if(counter==0){
    this.GuardarExplocion();
  }else{
    this.toaster.open({
      text: "Debe ingresar todos los atos",
      caption: 'Mensaje',
      type: 'danger',
      // duration: 994000
    });
  }
}


ListGrupos:any  =[];
GuardarExplocion(){ 
  if(this.ListComponenteProducto.length === 0){
    this.toaster.open({
      text: "Debe Ingresar componentes",
      caption: 'Mensaje',
      type: 'danger',
      // duration: 994000
    });
    return;
  }

  Swal.fire({
    allowOutsideClick: false,
    title: "¿Desea Explocionar?",
    html: `Al explocionar finalizara todo el proceo`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Si, Enviar',
    cancelButtonText: 'Cancelar',
  })
    .then((result) => {
      if (result.isConfirmed) { 
        
  const jsonData = JSON.stringify(this.ListComponenteProducto);
  console.log(jsonData);
  this.spinner.show();
  this._service.GuardarExplocion(jsonData)
    .subscribe({
      next: response => {
        this.spinner.hide();
        console.log(response);
        if (response.status == 200) { 
              const respuesta = response.json.respuesta;
              const id = response.json.id; 
              console.log("RESPUESTA");
             if(respuesta=="OK"){       
              var rpt={
                id:id,
                result:respuesta
              };      
            this.dialogRef.close(rpt);
             }
          }else{
            this.toaster.open({
              text: "Ocurrio un error al enviar: "+response,
              caption: 'Mensaje',
              type: 'danger',
              // duration: 994000
            });
          }
      },
      error: error => {
        this.spinner.hide();
        var errorMessage = error.message;
        console.error('There was an error!', error);
        this.toaster.open({
          text: errorMessage,
          caption: 'Ocurrio un error',
          type: 'danger',
          // duration: 994000
        });
      }
    });
      }else{
        this.ListGrupos=[];
      }
    });
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
