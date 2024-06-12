export type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
}
export type ProfileUser = {
  nombre?: string,
  roluser?: string,
  correo?: string,
  id?: string
}
export type LoginType ={
  usuario?: string;
  clave?: string;
}
export type TokenModel = {
  id?:string;
  rol?:string;
  unidadNegocio?:string;
  token?: string;
  refreshToken?: string;
}

export interface ITokenResponse {
  status?: number;
  json?: TokenModel;
}
export interface ITokenResponse {
  status?: number;
  json?: TokenModel;
}
//notificacion

export interface INotificacionRequestItem {
  id?:number;
  idusuario?:number;
  idfactura?:number;
  titulo?:string;
  descripcion?:string;
  status?:string;
  usuariocreacion?:string;
  fecharegistro?:string;
  usuariomodificacion?:string;
  fechamodificacion?:string; 
  estado?:string;
  }
  export type INotificacionRequestResponse = Array<INotificacionRequestItem>;
  
  export interface INotificacionRequest {
    id_user?: string
  }

