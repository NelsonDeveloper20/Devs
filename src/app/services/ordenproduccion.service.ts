import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITblOrdenProduccion, TblOrdenProduccion } from './models/Tbl_OrdenProduccion.model';
import { IApiResponse } from './service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenproduccionService {

  private urlBase: string;
  constructor(private http: HttpClient,

  ) { 
    
    this.urlBase = `${environment.baseUrl}/api/`; 
  }

  ListarOrdenPorNumero(numCotizacion): Observable<any>{
    return this.http.get(`${this.urlBase}OrdenProduccion?numeroCotizacion=${numCotizacion}`); 
  }
   
  DescargarArchivo(nombre): Observable<any>{
    return this.http.get(`${this.urlBase}OrdenProduccion/download?nombre=${nombre}`, {
      responseType: 'blob' // Especifica que esperas un blob
    }); 
  }
  
   
  obtenerOrdenesPorNumero(numeroCotizacion: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlBase}OPSisgecoDc?numeroCotizacion=${numeroCotizacion}`);
  }
  ListarProductoSisgeco_DC(numeroCotizacion): Observable<IApiResponse>{  
    return this.http.post<IApiResponse>(  this.urlBase + 'OPSisgecoDc?numeroCotizacion='+numeroCotizacion,   {}   );
  }
  
  listas(tabla:any){
    return this.http.get<IApiResponse>(  this.urlBase + 'listas?table='+tabla,   {}   );  
  }

    //REGISTRO
    RegistrarOrden(_orden: ITblOrdenProduccion,_archivo:any ): Observable<IApiResponse>{ 
   console.log("ENVIANDO;");
   console.log(JSON.stringify(_orden));
   const formData = new FormData();
    formData.append('orden', JSON.stringify(_orden)); // Convertir el objeto a JSON y agregarlo al FormData
    formData.append('archivo', _archivo);
      return this.http.post<IApiResponse>(  this.urlBase + 'OrdenProduccion',  formData  );
  
    }
    //REGISTRAR  PRODUCTO
    
    RegistrarDetalleOrdenProduccion(Data:any,tipo:any ): Observable<IApiResponse>{    
      const formData = new FormData();
       formData.append('Formulario', JSON.stringify(Data.Formulario)); // Convertir el objeto a JSON y agregarlo al FormData
       formData.append('Escuadra', JSON.stringify(Data.Escuadra));
         return this.http.post<IApiResponse>(  this.urlBase + 'DetalleOrdenProduccion?tipo='+tipo,  formData  );
       }
    RegistrarDetalleOrdenProduccionComponente(Data:any,tipo:any ): Observable<IApiResponse>{ 

    const formData = new FormData();
      formData.append('Formulario', JSON.stringify(Data)); // Convertir el objeto a JSON y agregarlo al FormData
        return this.http.post<IApiResponse>(  this.urlBase + 'DetalleOrdenProduccion?tipo='+tipo,  formData  );
    
      }
      //VALIDAR CANTIDAD DE PRODUCTO POR TURNO
      
      ValidarRegistroProducto( turno:any,  fechaProduccion:any,  codigoProducto:any,  accionamiento:any): Observable<IApiResponse>{    
         return this.http.post<IApiResponse>(  this.urlBase +
          'DetalleOrdenProduccion/ValidarCantidadPorTurnoFecProd?turno='+turno+"&fechaProduccion="+fechaProduccion+"&codigoProducto="+codigoProducto+"&accionamiento="+accionamiento,  {} );
       }

     
  
  listarAmbiente(numCotizacion): Observable<any>{
    return this.http.get(`${this.urlBase}Ambiente?numeroCotizacion=${numCotizacion}`); 
  }
  GuardarAmbiente(numeroCotizacion:any,indice:any,ambiente:any,cantidad:any): Observable<IApiResponse>{  
    return this.http.post<IApiResponse>(  this.urlBase + 'Ambiente?cotizacion='+numeroCotizacion+'&indice='+indice+'&ambiente='+ambiente+'&cantidad='+cantidad,   {}   );
  }
  
  EliminarAmbiente(id:any): Observable<IApiResponse>{  
    return this.http.delete<IApiResponse>(  this.urlBase + 'Ambiente?id='+id,   {}   );
  }
}
