import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITblOrdenProduccion, TblOrdenProduccion } from './models/Tbl_OrdenProduccion.model';
import { IApiResponse } from './service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoOPService {

  private urlBase: string;
  constructor(private http: HttpClient,

  ) { 
    
    this.urlBase = `${environment.baseUrl}/api/`; 
  }
/*
  listarDetalleOpGrupo(request: any): Observable<any> {
    const params = new HttpParams({
      fromObject: request
    });
    return this.http.get<any>(`${this.urlBase}DetalleOpgrupo`, { params });
  }*/
  ListarOP(numeroCotizacionGrupo: any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}MantenimientoOP?numeroCotizacionGrupo=`+numeroCotizacionGrupo);
  }
  
  EliminarOp(id:any): Observable<IApiResponse>{ 
    return this.http.delete<IApiResponse>(  this.urlBase + 'MantenimientoOP?id='+id);
  } 

}
