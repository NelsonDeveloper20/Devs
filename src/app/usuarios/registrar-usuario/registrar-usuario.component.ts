import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner'; 
//forms
import { Toaster } from 'ngx-toast-notifications';
 
import { MatSort } from '@angular/material/sort'; 
import { UsuarioService } from 'src/app/services/usuarioservice';
import Swal from 'sweetalert2';

interface Usuario {
  id: string;
  idTipoUsuario: string;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  usuario: string;
  clave: string;
  codigoUsuario: string;
  fechaCreacion: string;
  fechaModificacion: string;
  idUsuarioCreacion: string;
  idUsuarioModifica: string;
  estado: string;
  idRol: string;
  nombreRol: string;
}
@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent implements OnInit {
   
  usuario: Usuario;
   
  constructor(private toaster: Toaster, 
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<RegistrarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) data: Usuario,
    private _service: UsuarioService, 
  ) { 
    this.usuario = data ? data : this.initUsuario();
  }

  ngOnInit(): void { this.listas();
      
  }
 
  listTipoUsuario:any=[];
  listRol:any=[]; 
  listas(){
   this.spinner.show(); 
   this._service.listas('TipoUsuario').subscribe(
     (res: any) => {
       if(res){
         this.listTipoUsuario = res;
       } 
     },
     (error) => {
       console.error("Error al obtener lista de tipo cliente:", error); 
     }
   );
 
   this._service.listas('Rol').subscribe(
     (res: any) => { 
       if(res){
         this.listRol = res;
       } 
     },
     (error) => {
       console.error("Error al obtener lista de destinos:", error); 
     }
   ); 
   this.spinner.hide();
 } 
 validateForm(): boolean {
  if (!this.usuario.nombre) {
    this.toaster.open({ text: 'El campo Nombre es obligatorio', caption: 'Error', type: 'danger' });
    return false;
  }
  if (!this.usuario.apellido) {
    this.toaster.open({ text: 'El campo Apellido es obligatorio', caption: 'Error', type: 'danger' });
    return false;
  }
  if (!this.usuario.dni) {
    this.toaster.open({ text: 'El campo Documento es obligatorio', caption: 'Error', type: 'danger' });
    return false;
  }
  if (!this.usuario.idTipoUsuario) {
    this.toaster.open({ text: 'El campo Tipo de Usuario es obligatorio', caption: 'Error', type: 'danger' });
    return false;
  }
  if (!this.usuario.idRol) {
    this.toaster.open({ text: 'El campo Rol Usuario es obligatorio', caption: 'Error', type: 'danger' });
    return false;
  }
  if (!this.usuario.usuario) {
    this.toaster.open({ text: 'El campo Usuario es obligatorio', caption: 'Error', type: 'danger' });
    return false;
  }
  if (!this.usuario.clave) {
    this.toaster.open({ text: 'El campo Contraseña es obligatorio', caption: 'Error', type: 'danger' });
    return false;
  }
  return true;
}
  save(): void {
    if (!this.validateForm()) {
      return;
    }
    const jsonData = JSON.stringify(this.usuario);
    console.log(jsonData);
    this.spinner.show();
    this._service.GuardarUsuario(jsonData)
      .subscribe({
        next: response => {
          this.spinner.hide();
          if (response.status == 200) { 
                const respuesta = response.json.respuesta;
                const id = response.json.id; 
                if(respuesta=="Operacion realizada correctamente"){
                  Swal.fire({
                  title: 'Mensaje',
                  text: 'Operacion realizada correctamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  allowOutsideClick: false
                  }); 
                  var requests={
                  agegados:"OK"
                  };
                  this.dialogRef.close(requests);

                }else{
                  Swal.fire({
                  title: 'Mensaje',
                  text: respuesta,
                  icon: 'warning',
                  confirmButtonText: 'Aceptar',
                  allowOutsideClick: false
                  }); 
                  
                }
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
  nuevo="NO";
  initUsuario(): Usuario {
    this.nuevo="SI";
    return {
      id: '',
      idTipoUsuario: '',
      nombre: '',
      apellido: '',
      dni: '',
      correo: '',
      usuario: '',
      clave: '',
      codigoUsuario: '',
      fechaCreacion: '',
      fechaModificacion: '',
      idUsuarioCreacion: '',
      idUsuarioModifica: '',
      estado: '',
      idRol: '',
      nombreRol: ''
    };
  } 
  close() {
    this.dialogRef.close();
  }
  
}
