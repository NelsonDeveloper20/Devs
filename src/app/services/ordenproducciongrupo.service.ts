import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITblOrdenProduccion, TblOrdenProduccion } from './models/Tbl_OrdenProduccion.model';
import { IApiResponse } from './service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenproduccionGrupoService {

  private urlBase: string;
  constructor(private http: HttpClient,
  ) {     
    this.urlBase = `${environment.baseUrl}/api/`; 
  }
  listarDetalleOpGrupo(request: any): Observable<any> {
    const params = new HttpParams({
      fromObject: request
    });
    return this.http.get<any>(`${this.urlBase}DetalleOpgrupo`, { params });
  }
  ObtenerLayout(numeroCotizacionGrupo: any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}Layout?numeroCotizacionGrupo=`+numeroCotizacionGrupo);
  }
  
  CambiarEstadoGrupo(destino :any,data: any): Observable<IApiResponse> {
    const headers = { 'Content-Type': 'application/json-patch+json' };
    return this.http.post<IApiResponse>(this.urlBase + 'DetalleOpgrupo/CambioEstadoOP?destino=' + destino, data, { headers: headers });
  }
  
  ListarFiltros(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}DetalleOpgrupo/ListarFiltros`);
  }
  ListatarProductosDetallePorGrupo(grupo:any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}DetalleOpgrupo/ListarProductosPorGrupo?grupo=`+grupo);
  }
}
