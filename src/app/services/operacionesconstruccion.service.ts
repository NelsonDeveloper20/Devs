import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITblOrdenProduccion, TblOrdenProduccion } from './models/Tbl_OrdenProduccion.model';
import { IApiResponse } from './service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperacionesConstruccionService {

  private urlBase: string;
  constructor(private http: HttpClient,

  ) { 
    
    this.urlBase = `${environment.baseUrl}/api/`; 
  } 
  ListarOperacionesConstruccion(fecha: any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}OperacionesContruccion?fecha=`+fecha);
  }
  ValidarEstacion(paso: any,dato:any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}OperacionesContruccion/Estacion?paso=`+paso+"&dato="+dato);
  }
  
  ValidarLogin(usuario: any,contrasena:any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}Login?usuario=`+usuario+"&contrasena="+contrasena);
  }

  
  ListarProductoXEstacionGrupo(grupoCotizacion: any,estacion: any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}OperacionesContruccion/ProductoEstacionPorEstacion?grupoCotizacion=`+grupoCotizacion+"&estacion="+estacion);
  }
  
  ListarAvanceEstacion(grupoCotizacion: any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}OperacionesContruccion/AvanceEstacion?grupoCotizacion=`+grupoCotizacion);
  }

  InsertarEstacionProducto(data: any): Observable<IApiResponse> {
    const headers = { 'Content-Type': 'application/json-patch+json' };
    return this.http.post<IApiResponse>(this.urlBase + 'OperacionesContruccion', data, { headers: headers });
  }
}
