import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {
  private accionFuente = new Subject<void>();
  accion$ = this.accionFuente.asObservable();

  dispararAccion() {
    console.log("HASTA API");
    this.accionFuente.next();
  }
}
