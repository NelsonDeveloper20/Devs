import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SapService {
  //private urlBase: string;
  private username = 'admin';  // Puedes almacenar estos datos de forma segura en un servicio seguro
  private password = 'admin';
  private urlBase = 'apisap/api/';
  constructor(public httpClient: HttpClient) {
  //this.urlBase = `${environment.urlSap}api/`;
//    this.urlBase = `https://cors-anywhere.herokuapp.com/http://191.98.160.56:8081/api/`;

  }

 /* private login(): Observable<string> {
    const url = `${this.urlBase}Login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { Username: this.username, Password: this.password };

    return this.httpClient.post<string>(url, body, { headers }).pipe(
      tap((token: string) => {
        localStorage.setItem('authToken', token); // Guardar token en localStorage
      })
    );
  }*/
  private login(): Observable<string> {
    const url = `${this.urlBase}Login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { Username: this.username, Password: this.password };
  
    return this.httpClient.post(url, body, { headers, responseType: 'text' }).pipe(
      tap((token: string) => {
        localStorage.setItem('authToken', token); // Guardar token en localStorage
      })
    );
  }
  

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const { exp } = jwt_decode<{ exp: number }>(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  private getValidToken(): Observable<string> {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      return of(token);
    }
    // Si el token ha caducado o no existe, intenta renovarlo
    return this.login();
  }

  // Método para realizar una solicitud GET con token de autenticación
  ListarOrdenes(): Observable<any> {
    const url = `${this.urlBase}Orders/0/p`; // Cambia esto a tu endpoint específico

    return this.getValidToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.httpClient.get(url, { headers });
      }),
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        return throwError(error);
      })
    );
  }

  // Método para cerrar sesión y limpiar el token
  logout(): void {
    localStorage.removeItem('authToken');
  }
}
