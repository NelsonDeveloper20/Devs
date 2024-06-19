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
  ListarComponenteDelProducto(grupoCotizacion: any,id:any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}Monitoreo/ListarComponenteProducto?grupoCotizacion=`+grupoCotizacion+"&id="+id);
  }
  
  
  DescargarPlantilla(): Observable<any>{
    return this.http.get(`${this.urlBase}Monitoreo/downloadPlantilla`, {
      responseType: 'blob' // Especifica que esperas un blob
    }); 
  }
  
}
