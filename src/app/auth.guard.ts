import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    const loginData = JSON.parse(localStorage.getItem('UserLog'));
    const loginTime = localStorage.getItem('loginTime');
    if (loginData && loginTime) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(loginTime, 10);
      const tenHours = 10 * 60 * 60 * 1000; // 10 horas en milisegundos
      
  /*   
const currentTime = new Date().getTime();
const timeDifference = currentTime - parseInt(loginTime, 10);
const tenHours = 3 * 60 * 1000; // 3 minutos en milisegundos   
*/
      if (timeDifference > tenHours) {
        localStorage.removeItem('UserLog');
        localStorage.removeItem('loginTime');
        this.router.navigate(['/login']); 
        Swal.fire({
          title: 'Mensaje',
          text: 'La sesión ha expirado',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });
        

        return false;
      }
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
