import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api/api.service';
import {ICargarFacturaRequest,IFacturaResponse
} from './factura.moldes';

@Injectable({
  providedIn: 'root',
})
export class facturaService {
  private urlBase: string;
  constructor(private apiService: ApiService) {
    this.urlBase = `${environment.baseUrl}/api/Factura`;
  } 
  cargarFactura(bodys: ICargarFacturaRequest): Observable<IFacturaResponse> {
  /*  const headers= new HttpHeaders()
  .set('content-type', 'multipart/form-data')
  .set('Accept', 'application/json')
  .set('Access-Control-Allow-Origin', '*');*/
 
const httpOptions = { headers: new HttpHeaders().set('Content-Type', 'multipart/form-data')
.set('Accept', 'application/json')
};
    return this.apiService.post(`${this.urlBase}/UploadFactura`,bodys.formData );
  } 
}
