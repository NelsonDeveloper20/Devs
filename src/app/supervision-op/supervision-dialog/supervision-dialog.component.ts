import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { DatePipe } from '@angular/common'; // Importa DatePipe
import { SupervisionService } from 'src/app/services/supervision.service';
import { Toaster } from 'ngx-toast-notifications';


@Component({
  selector: 'app-supervision-dialog',
  templateUrl: './supervision-dialog.component.html',
  styleUrls: ['./supervision-dialog.component.css']
})
export class SupervisionDialogComponent implements OnInit {
  id:string="";
  turno:string="";
  fechaProduccion:string="";
  cotizacion:string="";
  grupo:string=""; 

  
  turnoInicial:string="";
  fechaProduccionInicial:string="";
  cotizacionInicial:string="";
  solicitante:string="";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialog: MatDialog,
    private dialogRef: MatDialogRef<SupervisionDialogComponent>,
    private spinner: NgxSpinnerService, 
    private datePipe: DatePipe,
    private _service: SupervisionService,
    private toaster: Toaster
    ) {
      this.id=data.id;
      this.turno = data.turno;   
      this.fechaProduccion= data.fechaProduccion;
      this.cotizacion=data.cotizacion;
      this.grupo=data.grupo; 
      this.fechaProduccion = this.formatDate(this.fechaProduccion);  
      console.log(this.fechaProduccion);
      this.turnoInicial = data.turno;    
      this.cotizacionInicial=data.cotizacion; 
      this.fechaProduccionInicial = this.formatDate(this.fechaProduccion); 
      this.solicitante=data.solicitante; 

      
     }
     formatDate(fecha: string): string {
      return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }
  ngOnInit(): void {

  } 

  save(){
    
  const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
  var idUser= userDataString.id.toString();
    var requests = { 
        id:this.id,
        CotizacionGrupo:this.grupo,
        TurnoInicial:this.turnoInicial,
        TurnoCambio:this.turno,
        FechProdInicial:this.fechaProduccionInicial,
        FechaProdCambio:this.fechaProduccion,
        IdUsuario:idUser,
        IdUsuarioSolicita:this.solicitante,
        NumeroCotizacion:this.cotizacion,
        Estado:"Aprobado"

    }
    this.spinner.show();
    this._service.AplicarAprobacion(requests)
      .subscribe({
        next: response => {
          this.spinner.hide();
          if (response.status == 200) { 
                const respuesta = response.json.respuesta;
                if(respuesta=="OK"){ 
                  this.dialogRef.close(requests); 
                }else{
                  this.toaster.open({
                    text: respuesta,
                    caption: 'Mensaje',
                    type: 'danger',
                    // duration: 994000
                  }); 
                }    
            }else{
              this.toaster.open({
                text: "Ocurrio un error al enviar",
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
  }
  

  close() {  
      this.dialogRef.close(); 
  }
}
