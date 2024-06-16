import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MantenimientoOPService } from '../services/mantenimiento-op.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Toaster } from 'ngx-toast-notifications';
import { SupervisionService } from '../services/supervision.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SupervisionDialogComponent } from './supervision-dialog/supervision-dialog.component';

@Component({
  selector: 'app-supervision-op',
  templateUrl: './supervision-op.component.html',
  styleUrls: ['./supervision-op.component.css']
})
export class SupervisionOpComponent implements OnInit {
  displayedColumns: string[] = ['cotizacion', 'codOp', 'grupo','fechasolicitud','vendedor','destrito','fechaCreacion','aprobar','rechazar'];
  dataSource=new MatTableDataSource<any>();//this.ELEMENT_DATA
  constructor(
    private dialog: MatDialog,
    private toaster: Toaster, 
    private spinner: NgxSpinnerService,
    private _service: SupervisionService
  ) { 
    
  }

  ngOnInit(): void {
    this.ListarOp();
  }

  ListOP:any=[];
  Fecha:Date=new Date();
  ListarOp() {
    const fecInicio = moment(this.Fecha, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    ); 
    
    this.spinner.show();
    this._service.ListarOP(fecInicio).subscribe(
      (data: any) => {
        if (data && data.status === 200) { 
          this.ListOP = data.json;
          this.spinner.hide(); 
          //this.groupData();           
      this.dataSource = new MatTableDataSource<any>(this.ListOP);
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
  
  EliminarOP(id:any) {
/*
    Swal.fire({
      title: '¿Estás seguro que desea elminar?',
      text: 'Al realizar este proceso, se eliminaran todos los productos relacionados con este número de cotización.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       this.spinner.show();
    this._service.EliminarOp(id)
    .subscribe({
      next: response => {
        this.spinner.hide();
        if (response.status == 200) { 
const respuesta = response.json.respuesta;
const id = response.json.id; 
Swal.fire(
  'Eliminado',
  'El elemento ha sido eliminado correctamente',
  'success'
);
    this.ListarOp();
    
  }else{
    this.toaster.open({
      text: response.json.respuesta,
      caption: "Mensaje",
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
          text: "Mensaje",
          caption: 'Ocurrio un error ' +error,
          type: 'danger',
          // duration: 994000
        });
      }
    });
      
      }
    });
    */

   }

   
 
 
  AbriConfirmacion(item:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;  
    const dataToSend = {  
      id:item.id,
      turno: item.turno,   
      fechaProduccion: item.fechaProduccion,
      cotizacion: item.numeroCotizacion,
      grupo: item.cotizacionGrupo,
      solicitante:item.idUsuarioCrea,
    };
    dialogConfig.data = dataToSend; 
    dialogConfig.width ='804px';
    const dialogRef = this.dialog.open(SupervisionDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: data => {   
       if(data){
        this.toaster.open({
          text: "Grupo Aprobado",
          caption: 'Mensaje',
          type: 'success',
          position: 'bottom-right',
          //duration: 4000
        });   
        this.ListarOp();
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
  AplicarRechazo(item:any){
    const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
    var idUser= userDataString.id.toString();
      var requests = { 
          id:item.id,
          CotizacionGrupo:item.cotizacionGrupo,
          TurnoInicial:item.turno,
          TurnoCambio:item.turno,
          FechProdInicial:item.fechaProduccion,
          FechaProdCambio:item.fechaProduccion,
          IdUsuario:idUser,
          IdUsuarioSolicita:item.idUsuarioCrea,
          NumeroCotizacion:item.numeroCotizacion,
          Estado:"Rechazado"
  
      }
    Swal.fire({
      allowOutsideClick: false,
      title: "¿Desea Rechazar?",
      html: `¿Esta seguro que desea rechazar el grupo?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, Rechazar',
      cancelButtonText: 'Cancelar',
    })
      .then((result) => {
        if (result.isConfirmed) {            
    this.spinner.show();
    this._service.AplicarAprobacion(requests)
    .subscribe({
      next: response => {
        this.spinner.hide();
        if (response.status == 200) { 
              const respuesta = response.json.respuesta;
              if(respuesta=="OK"){ 
                this.toaster.open({
                  text: "Grupo Rechazado",
                  caption: 'Mensaje',
                  type: 'success',
                  position: 'bottom-right',
                  //duration: 4000
                });  
                this.ListarOp();
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
        }else{
          
        }
      });
  }
}
