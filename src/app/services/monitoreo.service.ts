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
  ListarMonitoreoSapSalidaEntrada(grupoCotizacion: any,fechaInicio:any,fechaFin:any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}Monitoreo/ListarMonitoreoSapSalidaEntrada?grupoCotizacion=`+grupoCotizacion+"&fechaInicio="+fechaInicio+"&fechaFin="+fechaFin);
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
  
  GuardarFormulacionRollerShade(data: any): Observable<IApiResponse> {
    const headers = { 'Content-Type': 'application/json-patch+json' };
    return this.http.post<IApiResponse>(this.urlBase + 'Monitoreo/GuardarFormulacionRollerShade', data, { headers: headers });
  }
  

  GuardarExplocionMantenimiento(data: any): Observable<IApiResponse> {
    const headers = { 'Content-Type': 'application/json-patch+json' };
    return this.http.post<IApiResponse>(this.urlBase + 'Monitoreo/ExplocionarMantenimiento', data, { headers: headers });
  }
  
  //CARGAR EXPLOCION EXCEL  
  CargarExplocionExcel(data: any): Observable<IApiResponse> {
    const headers = { 'Content-Type': 'application/json-patch+json' };
    console.log("ENVIADO===>");
    console.log(data);
    return this.http.post<IApiResponse>(this.urlBase + 'Monitoreo/ExplocionarCompCargaExcel', data, { headers: headers });
  }
  
  EnviarSalidaSap(grupoCotizacion: any,grupo:any,idusuario :any): Observable<any> {
    return this.http.post<IApiResponse>(`${this.urlBase}Monitoreo/EnviarSalidaSap?cotizacion=`+grupoCotizacion+"&grupo="+grupo+"&idusuario="+idusuario,{});
  }
  EnviarEntradaSap(grupoCotizacion: any,grupo:any,idusuario :any): Observable<any> {
    return this.http.post<IApiResponse>(`${this.urlBase}Monitoreo/EnviarEntradaSap?cotizacion=`+grupoCotizacion+"&grupo="+grupo+"&idusuario="+idusuario,{});
  }
   
  GuardarSalidaSap(request: { numeroCotizacion: string; grupoCotizacion: string; codigoSalida: string }): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${this.urlBase}Monitoreo/GuardarSalidaSap`, request);
  }
  
  ListarMaestroArticulos(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}MaestroArticulo`);
  }

  
  ListarFormulacionRollerShade(numCotizacion: any,grupoCotizacion:any,tipoProducto:any,accionamiento:any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}Monitoreo/ListarFormulacionRollerShade?numCotizacion=`+numCotizacion+"&grupoCotizacion="+grupoCotizacion+"&tipoProducto="+tipoProducto+"&accionamiento="+accionamiento);
  }
}
