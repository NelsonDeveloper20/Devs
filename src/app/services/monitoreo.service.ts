import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITblOrdenProduccion, TblOrdenProduccion } from './models/Tbl_OrdenProduccion.model';
import { IApiResponse } from './service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  private urlBase: string;
  constructor(private http: HttpClient,

  ) { 
    
    this.urlBase = `${environment.baseUrl}/api/`; 
  } 
  ListarMonitoreo(grupoCotizacion: any,fechaInicio:any,fechaFin:any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}Monitoreo?grupoCotizacion=`+grupoCotizacion+"&fechaInicio="+fechaInicio+"&fechaFin="+fechaFin);
  }
  ListarReporteExplocion(grupoCotizacion: any,fechaInicio:any,fechaFin:any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}Monitoreo/ListarReporteExplocion?grupoCotizacion=`+grupoCotizacion+"&fechaInicio="+fechaInicio+"&fechaFin="+fechaFin);
  }
  ListarMantenimientoExplocion(grupoCotizacion: any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}Monitoreo/ListarMantenimientoExplocion?grupoCotizacion=`+grupoCotizacion);
  }
  ListarComponenteDelProducto(grupoCotizacion: any,id:any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}Monitoreo/ListarComponenteProducto?grupoCotizacion=`+grupoCotizacion+"&id="+id);
  }
  
  ListarComponentesPorCodigosProducto(codigosProducto: any,grupo): Observable<any> {
    return this.http.get<any>(`${this.urlBase}Monitoreo/ListarComponentesPorCodigosProducto?codigosProducto=`+codigosProducto+'&grupo='+grupo);
  }
  
  
  DescargarPlantilla(): Observable<any>{
    return this.http.get(`${this.urlBase}Monitoreo/downloadPlantilla`, {
      responseType: 'blob' // Especifica que esperas un blob
    }); 
  }
  //GUARDAR EXPLOCION DE COMPONENTES
  
  GuardarExplocion(data: any): Observable<IApiResponse> {
    const headers = { 'Content-Type': 'application/json-patch+json' };
    return this.http.post<IApiResponse>(this.urlBase + 'Monitoreo/ExplocionarComponente', data, { headers: headers });
  }
  
  GuardarExplocionMantenimiento(data: any): Observable<IApiResponse> {
    const headers = { 'Content-Type': 'application/json-patch+json' };
    return this.http.post<IApiResponse>(this.urlBase + 'Monitoreo/ExplocionarMantenimiento', data, { headers: headers });
  }
  
  //CARGAR EXPLOCION EXCEL  
  CargarExplocionExcel(data: any): Observable<IApiResponse> {
    const headers = { 'Content-Type': 'application/json-patch+json' };
    return this.http.post<IApiResponse>(this.urlBase + 'Monitoreo/ExplocionarCompCargaExcel', data, { headers: headers });
  }
  
}
