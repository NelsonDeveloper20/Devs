import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api/api.service';
import {
  IOrderRequestResponse, 
  ISolicitudResponse,
  ISolicitudSearchRequest,
} from './request-report.model';

@Injectable({
  providedIn: 'root',
})
export class RequestReportService {
  private urlBase: string;
  constructor(private apiService: ApiService) {
    this.urlBase = `${environment.baseUrl}/api/purcharse-request/facturacion`;
  }

  getRequest(
    search: ISolicitudSearchRequest
  ): Observable<IOrderRequestResponse> { 
    return this.apiService.getReporte(this.urlBase, { params: search });
  }
 
}
