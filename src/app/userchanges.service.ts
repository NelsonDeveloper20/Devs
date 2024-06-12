import { Injectable } from '@angular/core'; 
import { BehaviorSubject } from 'rxjs';
import { IPartePago } from './parte-pago-epdp/formulario-epdp/formulario-epdp.component';
//import { IPartePago } from './parte-pago.model';
@Injectable({
  providedIn: 'root'
})
export class UserchangesService {
  private userSubject = new BehaviorSubject<IPartePago>(null);
  user$ = this.userSubject.asObservable();

  updateUser(newUser: IPartePago) {
    this.userSubject.next(newUser);
  }
  constructor() { }
}
