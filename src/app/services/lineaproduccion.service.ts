import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITblOrdenProduccion, TblOrdenProduccion } from './models/Tbl_OrdenProduccion.model';
import { IApiResponse } from './service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LineaProduccionService {

  private urlBase: string;
  constructor(private http: HttpClient,

  ) { 
    
    this.urlBase = `${environment.baseUrl}/api/`; 
  } 
  ListarLineaProduccion(fecha: any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}LineaProduccion?fecha=`+fecha);
  } 
  DetalleListarLinaProduccion(turno: any,dia: any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}LineaProduccion/DetalleLineaProd?turno=`+turno+"&dia="+dia);
  } 
}
