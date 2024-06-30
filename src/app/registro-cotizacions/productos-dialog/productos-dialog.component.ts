import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { ObjConfigs } from 'src/app/configuration';
import { FormProductoComponent } from 'src/app/form-producto/form-producto.component';
import { OrdenproduccionService } from 'src/app/services/ordenproduccion.service';
import Swal from 'sweetalert2';
import { LineaProdDialogComponent } from '../linea-prod-dialog/linea-prod-dialog.component';
 
interface ConfiguracionAtributos {
  [key: string]: {
    [key: string]: {
      visible: number;
      required: number;
    };
  };
}
@Component({
  selector: 'app-productos-dialog',
  templateUrl: './productos-dialog.component.html',
  styleUrls: ['./productos-dialog.component.css']
})
export class ProductosDialogComponent implements OnInit {
  @ViewChild(FormProductoComponent) formProductoComponent: FormProductoComponent;
 
  objConfiguracionAtributos:ConfiguracionAtributos=ObjConfigs;
  
  //JSON QUE SE ENVIARA AL HIJO
  JsonItemHijo: any = {}; // Objeto inicial que se pasa al componente hijo
  jsonProductoItemDelHijo: any; // Objeto que se actualizará con los datos del formulario 
onProductoActualizado(producto: any) {
  this.jsonProductoItemDelHijo = producto;
}  
TipoProducto:string="";
Cotizacion:string="";
CodigoSisgeco:string="";
IdProducto:string="";
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private toaster: Toaster,
private dialog: MatDialog,
  private dialogRef: MatDialogRef<ProductosDialogComponent>,
  private spinner: NgxSpinnerService,    
  private _OrdenService: OrdenproduccionService,

) {
    const codProducto = data.producto.codigoProducto.slice(0, 5); // Salida: PRTRS0    
    this.Cotizacion=data.Cotizacion;
    this.CodigoSisgeco=data.CodigoSisgeco;
  this.TipoProducto=codProducto;  
  this.IdProducto=data.producto.id;
  this.JsonItemHijo={
    tipo:this.TipoProducto,anio:data.Cotizacion,
    producto:data.producto,
    ambiente:data.ambiente
  } 

  }
  
  ngOnInit(): void {
   // this.setFormValues('');
  }
  
  closeDialog(): void {
  this.dialogRef.close();
  } 
  normalizeKeys(obj: any): any {
    return Object.keys(obj).reduce((acc, key) => {
      const normalizedKey = key.toLowerCase();
      acc[normalizedKey] = obj[key];
      return acc;
    }, {});
  }
  save(): void {   
    let validacion = 0;
    const normalizedConfig = this.normalizeKeys(this.objConfiguracionAtributos[this.TipoProducto]); 
    if (this.formProductoComponent) {
      this.formProductoComponent.onInputChange();
    }  
    if(this.jsonProductoItemDelHijo){ 
      var accionamiento=""
      Object.entries(this.jsonProductoItemDelHijo.Formulario).forEach(([key, value]) => {
        var lowerKey = key.toLowerCase();
        lowerKey=lowerKey.replace("nombretubo","tubo");
        const manualKeys = new Set(["tipocadena", "numeromotores", "motor", "marcamotor"]);//campos que no aplica cuando es manual
        const motorizadoKeys = new Set(["alturacadena"]);//campos que no aplica cuando es motorizado
        if (
          normalizedConfig[lowerKey] &&
          normalizedConfig[lowerKey].required === 1
        ) {
          if(lowerKey=="accionamiento"){
            accionamiento=value.toString();
          }
          if (accionamiento === "Manual" && manualKeys.has(lowerKey)) {
  
          }else if(accionamiento === "Motorizado" && motorizadoKeys.has(lowerKey)){
  
          }else{
          if (value == null || value === "--Seleccione--" || value === undefined || value === "0" || value === "") {           
          //console.log('DEBES INGRESAR:'+`${key}: ${value}`);
          this.toaster.open({
            text: "el dato "+lowerKey+ " es obligatorio",
            caption: 'Mensaje',
            type: 'danger',
          });
            validacion++;
          }
        }
  
        }
        if(lowerKey=="IdTbl_Ambiente".toLowerCase() && value==""){
          this.toaster.open({
            text: "el dato Indice Agrupado es obligatorio",
            caption: 'Mensaje',
            type: 'danger',
          });
            validacion++;
        }else if(lowerKey=="FechaProduccion".toLowerCase() && value==""){
          this.toaster.open({
            text: "el dato "+lowerKey+ " es obligatorio",
            caption: 'Mensaje',
            type: 'danger',
          });
            validacion++;
        }else if(lowerKey=="FechaEntrega".toLowerCase() && value==""){
          this.toaster.open({
            text: "el dato "+lowerKey+ " es obligatorio",
            caption: 'Mensaje',
            type: 'danger',
          });
            validacion++;
        }else if(lowerKey=="Turno".toLowerCase() && value.toString().replace("--Seleccione--","")==""){
          this.toaster.open({
            text: "el dato "+lowerKey+ " es obligatorio",
            caption: 'Mensaje',
            type: 'danger',
          });
            validacion++;
        }
      });
      if(validacion==0){

        
if(this.jsonProductoItemDelHijo.Formulario.Id==""){ 
  this.spinner.show(); 
  this._OrdenService.ValidarRegistroProducto(
    this.jsonProductoItemDelHijo.Formulario.Turno,
    this.jsonProductoItemDelHijo.Formulario.FechaProduccion,
    this.jsonProductoItemDelHijo.Formulario.CodigoProducto.slice(0, 5), //PRTRZ CORTIN Esto imprimirá "PRTRZ"
    this.jsonProductoItemDelHijo.Formulario.Accionamiento)
    .subscribe({
      next: response => {
        console.log(response);
        if (response.status == 200) { 
const respuesta = response.json.resultado;
const mensaje = response.json.msj;
const id = response.json.id;
this.spinner.hide();
switch(respuesta){
  case "OK": 
  //PROCESAR REGISTRO   
  console.log("registrando: "+respuesta);
  this.RegistrarProducto(this.jsonProductoItemDelHijo);
    break;
  case "NO":
    Swal.fire({
      title: mensaje,
      text: 'Advertencia',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {        
        this.RegistrarProducto(this.jsonProductoItemDelHijo);
      } 
    });
    break;
  default:
    ;
     } 
        } else {
          this.spinner.hide();
          this.toaster.open({
            text: "Ocurrio un error, ingrese los datos correctamente",
            caption: 'Mensaje',
            type: 'warning',
            position: 'bottom-right',
            //duration: 4000
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
  this.RegistrarProducto(this.jsonProductoItemDelHijo);
}

        
      }
    }
    
  }  
  close() {
    this.dialogRef.close();
  }
   RegistrarProducto(data){   

    data.Formulario.NumeroCotizacion =  this.Cotizacion;
    data.Formulario.CodigoSisgeco = this.CodigoSisgeco;     
    console.log(JSON.stringify(data));
    this.spinner.show(); 
    this._OrdenService.RegistrarDetalleOrdenProduccion(data,"Producto")
      .subscribe({
        next: response => {
          console.log(response);
          if (response.status == 200) { 
  const respuesta = response.json.respuesta;
  const id = response.json.id;
  switch(respuesta){
    case "Ok": 
      Swal.fire({
        title: 'Mensaje',
        text: 'Operacion realizada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      var request={
        respuesta:"OK",
        id:1
      };
      this.dialogRef.close(request);
      break;
    case "Ya existe":
      Swal.fire({
        title: 'Mensaje',
        text: 'Ya existe la cotizacion ',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      break;
    default:
      ;
       } 
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toaster.open({
              text: "Ocurrio un error, ingrese los datos correctamente",
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
              //duration: 4000
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

   }

   
  AbrirLineaProd(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width ='1104px';
    const dialogRef = this.dialog.open(LineaProdDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: data => {   
       if (data) {   
      } 
    },
    error: error => { 
        var errorMessage = error.message;
        console.error('There was an error!', error); 
        this.toaster.open({
          text: errorMessage,
          caption: 'Ocurrio un error',
          type: 'danger',
        });
      }
    });
  }
  }