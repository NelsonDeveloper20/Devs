import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITblOrdenProduccion, TblOrdenProduccion } from './models/Tbl_OrdenProduccion.model';
import { IApiResponse } from './service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComponentesService {

  private urlBase: string;
  constructor(private http: HttpClient,
  ) {     
    this.urlBase = `${environment.baseUrl}/api/`; 
  }
  ListarComponentes(): Observable<any> { 
    return this.http.get<any>(`${this.urlBase}Componentes`);
  } 
  
  ListarComponentesSsigeco(): Observable<any> { 
    return this.http.get<any>(`${this.urlBase}ListasSisgeco/ListarComponentesSisgeco`);
  } 
    GuardarCompoente(data: any): Observable<IApiResponse> {
      const headers = { 'Content-Type': 'application/json-patch+json' };
      return this.http.post<IApiResponse>(this.urlBase + 'Componentes', data, { headers: headers });
    }
    EliminarComponente(id:any): Observable<IApiResponse>{ 
      return this.http.delete<IApiResponse>(  this.urlBase + 'Componentes?id='+id);
    } 


}
