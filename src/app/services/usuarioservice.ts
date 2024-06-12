import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITblOrdenProduccion, TblOrdenProduccion } from './models/Tbl_OrdenProduccion.model';
import { IApiResponse } from './service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlBase: string;
  constructor(private http: HttpClient,
  ) {     
    this.urlBase = `${environment.baseUrl}/api/`; 
  }
  ListarUsuarios(): Observable<any> { 
    return this.http.get<any>(`${this.urlBase}Usuarios`);
  } 

  GuardarUsuario(data: any): Observable<IApiResponse> {
    const headers = { 'Content-Type': 'application/json-patch+json' };
    return this.http.post<IApiResponse>(this.urlBase + 'Usuarios', data, { headers: headers });
  }
  
  listas(tabla:any){
    return this.http.get<IApiResponse>(  this.urlBase + 'listas?table='+tabla,   {}   );  
  }
  //END
  ListarPerfiles(): Observable<any> { 
    return this.http.get<any>(`${this.urlBase}Perfil`);
  }  
    GuardarPerfil(id:any,nombre:any,descripcion:any ): Observable<IApiResponse>{ 
      return this.http.post<IApiResponse>(  this.urlBase + 'Perfil?id='+id+"&nombre="+nombre+"&descripcion="+descripcion,{}  );
    } 
    AgregarModuloRol(id: any, data: any): Observable<IApiResponse> {
      const headers = { 'Content-Type': 'application/json-patch+json' };
      return this.http.post<IApiResponse>(this.urlBase + 'Perfil/AgregarModuloRol?idRol=' + id, data, { headers: headers });
    }
    EliminarPerfil(id:any): Observable<IApiResponse>{ 
      return this.http.delete<IApiResponse>(  this.urlBase + 'Perfil?id='+id);
    } 

    ListarModulosPorUsuario(idUsuario: any): Observable<any> { 
      return this.http.get<any>(`${this.urlBase}Perfil/ModulosPorUsuario?idUsuario=`+idUsuario);
    } 

}
