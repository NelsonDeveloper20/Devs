import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileType } from 'src/app/services/auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { IAgregarUsuarioRequest } from 'src/app/services/user.model';
import { UserService } from 'src/app/services/user.service';
import { AgregarUsuario, RolUsuario, Roles, Sedes, UnidadNegocioS, User } from '../users.model';
//forms
import { Toaster } from 'ngx-toast-notifications';

import { IUsuario } from './usuario.model'
import { FormGroup, FormControl, FormArray } from '@angular/forms'  
import {FormBuilder, Validators} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from 'src/app/services/service.model';
import { environment } from 'src/environments/environment';
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
  
  @ViewChild(MatSort) sort: MatSort;
  //user: AgregarUsuario = { rol: "" }; 
  usuario: Usuario;
  
  private urlBase: string;
  constructor(private toaster: Toaster,private httpClient: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<RegistrarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) data: Usuario,
    private _service: UsuarioService,
//Form user
    private fb:FormBuilder, 
   private _formBuilder: FormBuilder
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
  
  save(): void {
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

    // Aquí puedes hacer lo que necesites con el JSON, como enviarlo a un servicio o mostrarlo en la consola.
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
