import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileType } from 'src/app/services/auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { IModificarUsuarioRequest } from 'src/app/services/user.model';
import { UserService } from 'src/app/services/user.service';
import { ModificarUsuario, RolUsuario, Roles, Sedes, UnidadNegocioS, User, Usuario } from '../users.model';
import { Toaster } from 'ngx-toast-notifications';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from 'src/app/services/service.model';
import { environment } from 'src/environments/environment';

export const UserColumns = [ 
  {
    key: 'RolId',
    type: 'select',
    label: 'Rol',
    required: true,
  },
  {
    key: 'IdUnidadNegocio',
    type: 'select',
    label: 'UnidadNegocio',
  },
  {
    key: 'IdSede',
    type: 'select',
    label: 'Sede',
  }, 
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];
@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent implements OnInit {
  user: ModificarUsuario = {};
  profile: ProfileType = {};
  subAccion: string = '';
  message: string = '';

  
  roles: Roles = [];
  unidadNegocio: UnidadNegocioS = [];
  sede: Sedes = [];
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<RolUsuario>();  
  displayedColumns: string[] = UserColumns.map((col) => col.key);
  columnsSchema: any = UserColumns; 
  
  private urlBase: string;
  constructor(private toaster: Toaster,private httpClient: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ModificarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) data: Usuario
  ) {

    this.urlBase = `${environment.baseUrl}/api/`; 
    this.user = {
      id: data.id,
      nombre: data.nombre,
      correo: data.correo,
      estado: data.estado,
      usuarioCreacion: data.usuarioCreacion,
      fechaCreacion: data.fechaCreacion,
      usuarioModificacion: data.usuarioModificacion,
      fechaModificacion: data.fechaModificacion,
      idUnidadNegocio: data.idUnidadNegocio,
      roles: data.roles
/*
      id: data.id,
      nombre:data.nombre,
      correo: data.correo,
      estado: data.estado,
      rol: data.rol?.id?.toString(),
      idUnidadNegocio: data.idUnidadNegocio*/
    };
    this.profile = this.authService.getProfile();
    this.listar();
  }

  ngOnInit(): void {
    //this.addRow();
  }
  listar(){
this.spinner.show();
    this.userService.getRoles().subscribe((response) => {
      this.roles = response; 
    });

    this.userService.getUnidadNegocio().subscribe((response) => {
      this.unidadNegocio = response;
    });  
    this.userService.getSede().subscribe((response) => {
      this.sede = response;
    });  
    
    this.userService.getSede().subscribe((response) => {
      this.sede = response;
    });  
    this.listarRoles();
    this.spinner.hide();
  }

  hasDuplicates(array: any[], properties: string[]): boolean {
    return array.some((item, index) => {
      const hasDuplicate = array.findIndex(i => {
        return properties.every(property => i[property] === item[property]);
      }) !== index;
      
      return hasDuplicate;
    });
  }
  save(): void {
    this.submitform();
    /*
     this.spinner.show();
    let roles: Array<number> = [];
    if (!!this.user.rol) {
      roles = [parseInt(this.user.rol)];
    }
    const request: IModificarUsuarioRequest = {
      nombre: this.user.nombre,
      estado: this.user.estado,
      roles,
      correo: this.user.correo,
      usuario: this.user.correo, //this.profile.userPrincipalName,
      idUnidadNegocio:this.user.idUnidadNegocio

    };
    this.userService.updateUser(this.user.id, request).subscribe((response) => {
      this.spinner.hide();
      if (response.status === 200) {
        this.dialogRef.close(request);
      } else {
      
        this.toaster.open({
          text: 'Ya existe un usuario con el correo ingresado',
          caption: 'Ocurrio un error',
          type: 'danger',
        });
      }
    }); */
  }

  submitform(){  

    if(this.user.nombre==undefined || this.user.nombre==""){  
      this.toaster.open({
        text: 'Ingrese nombre',
        caption: 'Ocurrio un error',
        type: 'danger',
      });
      return;
    }
    if(this.user.correo==undefined || this.user.correo==""){  
      this.toaster.open({
        text: 'Ingrese correo',
        caption: 'Ocurrio un error',
        type: 'danger',
      });
      return;
    }
      var jsonData=JSON.parse(JSON.stringify(this.dataSource.data));
      
    if(jsonData.length<1){
      this.toaster.open({
        text: "Debe agregar roles y unidades de negocio",
        caption: 'Mensaje',
        type: 'warning',
        position:'top-right'
      }); 
      return;
    }
    var errores="OK";
    jsonData.forEach(element => {
        
        if(element.RolId==0 ||  element.IdUnidadNegocio==0 ||  element.IdSede==0){
          this.toaster.open({
            text: "Debe seleccionar items en la fila agregada",
            caption: 'Mensaje',
            type: 'warning',
            position:'top-right'
          }); 
          errores="NO OK";
          return;
        } 
      });
      if(errores=="OK"){ 
        const propertiesToCheck = ['RolId', 'IdUnidadNegocio', 'IdSede'];
var hasDuplicatesByProperties = this.hasDuplicates(jsonData, propertiesToCheck);
if(hasDuplicatesByProperties==true){
  this.toaster.open({
    text: "Evite filas duplicados",
    caption: 'Mensaje',
    type: 'warning',
    position:'top-right'
  }); 
  return; 
}else{

  this.spinner.show(); 
  const request: IModificarUsuarioRequest = {
    nombre: this.user.nombre,
    estado: this.user.estado, 
    correo: this.user.correo,
    usuario: this.user.correo,   
  };

    this.spinner.show();  
    const formData_ = new FormData();  
    formData_.append('nombre',this.user.nombre);
    formData_.append('correo',this.user.correo);
    formData_.append('usuario',this.profile.userPrincipalName); 
    formData_.append('estado',this.user.estado); 
    formData_.append('DatosFoms',JSON.stringify(jsonData));     
  this.httpClient.put<IApiResponse>(this.urlBase + 'users/'+this.user.id, formData_)
  .subscribe({
  next: data => {      
    if(data.status==200){  
      this.dialogRef.close(request); 
      /*this.toaster.open({
        text: "Guardado correctamente",
        caption: 'Mensaje',
        type: 'success',
        position:'top-right'
      }); 
      this.spinner.hide();	 */
    }else{      
      this.spinner.hide();	 
        this.toaster.open({
          text: 'Ya existe un usuario con el correo ingresado',
          caption: 'Ocurrio un error',
          type: 'danger',
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
    
      } 

      //end  
  
  }
close() {
    this.dialogRef.close();
} 
maxID:number=0;
addRow() { 
    
  var idNext="";
  if(this.dataSource.data.length<1){
      this.maxID++;
      idNext= "N"+this.maxID;
  }
  else{
    this.maxID=this.dataSource.data.reduce((max, b) => Math.max(max, b.Id), this.dataSource.data[0].Id);
    this.maxID++;
    idNext= "N"+this.maxID;
  }  

  const newRow: RolUsuario = { 
    Id: this.maxID,
    UsuarioId:0,
    RolId:0,
    UsuarioCreacion: '',
    FechaCreacion: '',
    UsuarioModificacion: '',
    FechaModificacion: '',
    IdUnidadNegocio: 0,
    IdSede:0,
    isSelected: false,
    idDelete: idNext
  };
  this.dataSource.data = [newRow, ...this.dataSource.data];
  this.order();
}
listarRoles(){
  if(this.user.roles){
 
    var JsonData=[]; 
    this.user.roles.forEach(element => {
      JsonData.push(
        {
          Id: element.id,
          UsuarioId:this.user.id,
          RolId:element.rolId,
          UsuarioCreacion: '',
          FechaCreacion: '',
          UsuarioModificacion: '',
          FechaModificacion: '',
          IdUnidadNegocio: element.idUnidadNegocio,
          IdSede:element.idSede,
          isSelected: false,
          idDelete: "0", 
        }
      ); 
    });
    //this.FactAppBq21AP = response;  
  
    this.dataSource.data=JsonData;
  }else{
    this.addRow();
  }
}
order(){
  this.dataSource.sort = this.sort;
  const sortState: Sort = {active: 'Id', direction: 'asc'};
  this.sort.active = sortState.active;
  this.sort.direction = sortState.direction;
  this.sort.sortChange.emit(sortState);
}

someMethod(value: any, element: any, elem:any) {
  if(elem=="Rol"){
    element.RolId = value;
  }else if(elem=="UnidadNegocio"){
  element.IdUnidadNegocio = value;
  }else{
    element.IdSede = value;
  }
} 

eliminar(id:number, _idDelete:string){  
  if(_idDelete!=="0"){
  this.dataSource.data = this.dataSource.data.filter(
    (u: RolUsuario) => u.idDelete !== _idDelete
  );

}else{
  this.spinner.show();	
  this.httpClient.delete<IApiResponse>(this.urlBase + 'users?Id='+id, {})
  .subscribe({
  next: data => {      
    if(data.status==200){   
      this.toaster.open({
        text: "Eliminado correctamente",
        caption: 'Mensaje',
        type: 'success',
        position:'top-right'
      }); 
      this.spinner.hide();	 
      
  this.dataSource.data = this.dataSource.data.filter(
    (u: RolUsuario) => u.Id !== id
  );
    }else{      
      this.spinner.hide();	 
        this.toaster.open({
          text: 'Ocurrio un error',
          caption: 'Ocurrio un error',
          type: 'danger',
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
}

}


