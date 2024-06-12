import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api/api.service';
import {
  IAgregarSubContratistaRequest,
  IModificarProveedorRequest,
  IAgregarUsuarioRequest,
  ILoginIdRequest,
  IUsuarioResponse,
  IRolesResponse,
  IUserResponse,
  IUsersResponse,
  IModificarEstadoUsuarioRequest,
  IModificarUsuarioRequest,
  ILoginRequest,
  IResponse,
  IUnidadNegociosResponse,
  SedeResponse,
} from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlBase: string;
  private urlBase2: string;
  constructor(private apiService: ApiService) {
    this.urlBase = `${environment.baseUrl}/api/users`;
    this.urlBase2 = `${environment.baseUrl}/api/`;
  }

  getUsers(): Observable<IUsersResponse> {
    return this.apiService.get(this.urlBase);
  }

  getRoles(): Observable<IRolesResponse> {
    return this.apiService.get(`${this.urlBase}/roles`);
  }
  getUnidadNegocio(): Observable<IUnidadNegociosResponse> {
    return this.apiService.get(`${this.urlBase}/Unidad`);
  }
  getSede(): Observable<SedeResponse> {
    return this.apiService.get(`${this.urlBase}/Sede`);
  }



  registerUser(body: IAgregarUsuarioRequest): Observable<IUsuarioResponse> {
    return this.apiService.post(`${this.urlBase}`, body);
  }
  registerSubContratista(body: IAgregarSubContratistaRequest): Observable<IResponse> {
    return this.apiService.post(`${this.urlBase2}SubContratista`, body);
  }
  //login
 GetProveedorById(body: ILoginIdRequest): Observable<IUsuarioResponse> {
    return this.apiService.post(`${this.urlBase}/GetProveedorById?id=`+body.id);
  }
  updateProveedor(
    userId?: number,

    body?: IModificarProveedorRequest
  ): Observable<IUsuarioResponse> {
    return this.apiService.put(`${this.urlBase}/UpdateproveedorId?usuarioId=${userId}`, body);
  } 
  
  updateUser(
    userId?: number,
    body?: IModificarUsuarioRequest
  ): Observable<IUsuarioResponse> {
    return this.apiService.put(`${this.urlBase}/${userId}`, body);
  }


  changedStateUser(
    userId?: number,
    body?: IModificarEstadoUsuarioRequest
  ): Observable<IUsuarioResponse> {
    return this.apiService.put(`${this.urlBase}/${userId}/state`, body);
  }
}
