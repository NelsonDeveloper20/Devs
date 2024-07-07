
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core'; 
import { PerfilGrupoService } from '../services/perfilservice';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AsignarModuloDialogComponent } from './asignar-modulo-dialog/asignar-modulo-dialog.component';
import Swal from 'sweetalert2';
  
interface Perfil {
  id?:string,
  nombre?: string;
  descripcion?: string;
}

@Component({
  selector: 'app-mantenimiento-perfiles',
  templateUrl: './mantenimiento-perfiles.component.html',
  styleUrls: ['./mantenimiento-perfiles.component.css']
})
export class MantenimientoPerfilesComponent implements OnInit {

  constructor(  private toaster: Toaster, 
    private spinner: NgxSpinnerService,  
    private _service: PerfilGrupoService,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.ObtenerPerfiles();
    //this.ObtenerModulosPorRol();
  } 

  
  ListPerfil:any=[];
  ObtenerPerfiles() { 
    this.spinner.show();
    this._service.ListarPerfiles()
      .subscribe(
        data => {           
          this.spinner.hide();
          this.ListPerfil=data;  
        },
        error => {
          this.spinner.hide();
          console.error('Error al obtener el detalle del grupo:', error);
        }
      );
  }
  EdicionPerfil: Perfil = {};

  editar(item: Perfil) {
    this.EdicionPerfil = { ...item };
  }
  
  
  Guardar() {
    console.log(this.EdicionPerfil.nombre);
    if(this.EdicionPerfil.nombre==undefined || this.EdicionPerfil.nombre==""){
      this.toaster.open({
        text: "Debe ingresar nombre del perfil",
        caption: 'Mensaje',
        type: 'warning',
        position: 'bottom-right',
        //duration: 4000
      });
      return;

    }
    this.spinner.show(); 
    if(!this.EdicionPerfil.id){
    this.EdicionPerfil.id="0"
    }
    if(!this.EdicionPerfil || !this.EdicionPerfil.nombre){

      this.toaster.open({
        text: "Debe ingresar nombre del perfil",
        caption: 'Mensaje',
        type: 'warning',
        position: 'bottom-right',
        //duration: 4000
      });
      return;
    }

    this._service.GuardarPerfil(this.EdicionPerfil.id,this.EdicionPerfil.nombre,this.EdicionPerfil.descripcion)
      .subscribe({
        next: response => {
          this.spinner.hide();
          if (response.status == 200) { 
  const respuesta = response.json.respuesta;
  const id = response.json.id; 
      Swal.fire({
        title: 'Mensaje',
        text: 'Operacion realizada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      }); 
      this.Cancelar();
      this.ObtenerPerfiles();
      this.EdicionPerfil={};
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

   EliminarPerfil(id:any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar este elemento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       
    this._service.EliminarPerfil(id)
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
    this.Cancelar();
    this.ObtenerPerfiles();
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
    });

   }

  Cancelar() {
    this.EdicionPerfil = {};
  }

  OpenAsignarUsuario(item:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataToSend = { 
      idrol:item.id,
      Modulo:item.nombre
    };
    dialogConfig.data = dataToSend;
    const dialogRef = this.dialog.open(AsignarModuloDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: data => {   
       if (data) { 
        //this.ListPerfil(); 
        //OK
  
        this.ObtenerPerfiles();
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