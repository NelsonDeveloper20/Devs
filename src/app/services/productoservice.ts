import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITblOrdenProduccion, TblOrdenProduccion } from './models/Tbl_OrdenProduccion.model';
import { IApiResponse } from './service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlBase: string;
  constructor(private http: HttpClient,) { 
    
    this.urlBase = `${environment.baseUrl}/api/`; 
  }

  obtenerEscuadra(id:any): Observable<any>{
    return this.http.get(`${this.urlBase}Producto?id=`+id); 
  }
    /*
  ObtenerProductoPorId(id:any): Observable<any>{
    return this.http.get(`${this.urlBase}Producto?id=`+id); 
  }*/
    GuardarProyecto(nombre:any ): Observable<IApiResponse>{  
        return this.http.post<IApiResponse>(  this.urlBase + 'Proyecto?nombreProyecto='+nombre,   {}   );
    }
    ModificarProyecto(id: any,nombre:any ): Observable<IApiResponse>{  
        return this.http.put<IApiResponse>(  this.urlBase + 'Proyecto?id='+id+'&nombreProyecto='+nombre,   {}   );
    }
  
    ObtenerArticulo(tipo:any,subfamilia:any): Observable<any>{
      return this.http.get(`${this.urlBase}ListasSisgeco?tipo=`+tipo+'&subfamilia='+subfamilia); 
    }
}
