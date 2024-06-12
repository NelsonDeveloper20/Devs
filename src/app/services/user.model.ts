export interface IRolResponse {
  id?: number;
  nombre?: string;
};


export interface IUserResponse {
  id?: number;
  nombre?:string;
  correo?: string;
  estado?: string;
  rol?: IRolResponse;
};

export type IUsersResponse = Array<IUserResponse>;
export type IRolesResponse = Array<IRolResponse>;

export interface UnidadNegocio {
  id?: number;

  descripcion?: string;
  estado?: string;
  usuarioCreacion?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
}; 
export type IUnidadNegociosResponse = Array<UnidadNegocio>;


export interface Sede {
  id?: number;

  descripcion?: string;
  estado?: string;
  usuarioCreacion?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
}; 
export type SedeResponse = Array<Sede>;

export interface IAgregarUsuarioRequest {
  nombre?:string;
  correo?: string;
  roles?: Array<number>;
  usuario?: string;
  idUnidadNegocio?:string;
}

export interface IAgregarSubContratistaRequest {
  
  Empresa?: string;
  Usuario?: string; 
}

export interface ILoginRequest {
  usuario?: string;
  clave?: string;
}
export interface ILoginIdRequest {
  id?: string
}

export interface IModificarUsuarioRequest {
  nombre?: string;
  estado?: string;
  roles?: Array<number>;
  correo?:string;
  usuario?: string;
  idUnidadNegocio?:string;
}
//proveedor
//export interface IProveedor {
  export interface IModificarProveedorRequest  { 
    correoElectronico?:string;
    nombre?:string;
    ruc ?:string;
    razonSocial ?:string;
    direccion ?:string;
    numero ?:number;
    distrito ?:string;
    provincia ?:string;
    departamento ?:string;
    pais ?:string;
    codigoCiu ?:string;
    telefonoFijo ?:string;
    paginaWeb ?:string; 
    //
    numeroDeCuentaDetraccion ?:string;
    padronAlQuePertenece ?:string;
    correoEletronicoIgv ?:string;
    anioDeCreacion ?:string;
    //
    moneda ?:string;
    condicionPago ?:string;
    creditoMontoBesco ?:string;
    creditoMontoMiranda  ?:string;
    fechaRegistro ?:string;
    fechaModificacion?:string;
    estado ?:number;
    
      }
      

export interface IUsuarioResponse {
  status?: number;
  json?: any;
}
export interface IResponse {
  status?: number;
  json?: any;
}

export interface IModificarEstadoUsuarioRequest {
  estado?: string;
  usuario?: string;
}
