export interface RolUsuario {
  Id: number;
  UsuarioId:number;
  RolId:number;
  UsuarioCreacion: string;
  FechaCreacion: string;
  UsuarioModificacion: string;
  FechaModificacion: string;
  IdUnidadNegocio:number;
  IdSede:number;
  isSelected: boolean;
  idDelete: string;
}
//USUARIO ROLES
export type Usuario ={
  id?: number;
  nombre?: string;
  correo?: string;
  estado?: string;
  usuarioCreacion?: string;
  fechaCreacion?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
  idUnidadNegocio?: string;
  roles?: RolUsuarioResponse[];
}

export type RolUsuarioResponse ={
  id?: number;
  usuarioId?: number;
  rolId?: number;
  usuarioCreacion?: string;
  fechaCreacion?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
  idUnidadNegocio?: number;
  idSede?: number;
  rol?: Rol;
  unidad?: UnidadNegocio;
  sede?: Sede;
}
    
export type User = {
  id?: number;
  nombre?: string;
  correo?: string;
  estado?: string;
  rol?: Rol;
  idUnidadNegocio?:string;
};

export type Rol = {
  id?: number;
  nombre?: string;
}
//END

export type Roles = Array<Rol>;
export type UnidadNegocio ={
  id?: number;

  descripcion?: string;
  estado?: string;
  usuarioCreacion?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
};  

export type UnidadNegocioS = Array<UnidadNegocio>;
export type Sede ={
  id?: number;

  descripcion?: string;
  estado?: string;
  usuarioCreacion?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
};  

export type Sedes = Array<Sede>;
export type AgregarUsuario = {
  nombre?: string;
    correo?: string;
    rol?: string;
    usuario?: string;
    idUnidadNegocio?:string;
}


/**
export type ModificarUsuario = {
  id?: number;
  nombre?: string;
  correo?: string;
  estado?: string;
  rol?: string;
  idUnidadNegocio?:string;
}
*/
export type ModificarUsuario ={
  id?: number;
  nombre?: string;
  correo?: string;
  estado?: string;
  usuarioCreacion?: string;
  fechaCreacion?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
  idUnidadNegocio?: string;
  roles?: RolUsuarioResponse[];
}
 