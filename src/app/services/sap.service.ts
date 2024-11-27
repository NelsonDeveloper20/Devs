import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
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
  }
 
  private tokenSubject = new BehaviorSubject<string | null>(null);
   
   // Método para iniciar sesión y obtener un token
   private login(): Observable<string> {
    const url = `${this.urlBase}Login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { Username: this.username, Password: this.password };

    return this.httpClient.post<string>(url, body, { headers, responseType: 'text' as 'json' }).pipe(
      tap((token: string) => {
        localStorage.setItem('authToken', token);
      }),
      catchError((error) => {
        console.error('Error al iniciar sesión:', error);
        return throwError(() => new Error('Error al iniciar sesión. Por favor, verifica tus credenciales.'));
      })
    );
  }

 
// Obtiene el token almacenado
private getToken(): string | null {
  return localStorage.getItem('authToken');
}

// Verifica si el token ha expirado
private isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwt_decode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}
  
  // Obtiene un token válido
  private getValidToken(): Observable<string> {
    const currentToken = this.getToken();
    if (currentToken && !this.isTokenExpired(currentToken)) {
      return of(currentToken); // Retorna el token si aún es válido
    }

    if (!this.tokenSubject.getValue()) {
      // Evitar múltiples renovaciones simultáneas
      this.tokenSubject.next(null);
      this.login().subscribe({
        next: (newToken) => this.tokenSubject.next(newToken),
        error: (err) => this.tokenSubject.error(err),
      });
    }

    // Espera hasta que el token esté disponible
    return this.tokenSubject.pipe(
      filter((token) => token !== null), // Espera a que el token esté disponible
      take(1) // Sólo toma el primer valor
    );
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
  ListarOrdenesByDocEntry(docEntry:any): Observable<any> {
    console.log("BUSCADO ESS: "+docEntry);
    const url = `${this.urlBase}Orders/`+docEntry; // Cambia esto a tu endpoint específico 
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
  EnviarSalidaSap(body: any): Observable<any> {
    const url = `${this.urlBase}InventoryGenExit`;  
  
    return this.getValidToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Asegúrate de especificar este header
        });
        return this.httpClient.post(url, body, { headers });
      }),
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        // Manejo de errores mejorado
        return throwError(() => new Error(error?.message || 'Error en la solicitud al servidor'));
      })
    );
  }
  

  // Método para cerrar sesión y limpiar el token
  logout(): void {
    localStorage.removeItem('authToken');
    this.tokenSubject.next(null);
  }

  //LISTAR ARTICULOS POR FAMILIA Y GRUPO 
  ListarArticulosPorFamiliaGrupo2(identificador: any, grupo: any): Observable<any[]> { 
    const url = `${this.urlBase}Items/ListFilter`;//?idenficado=` + identificador + "&grupo=" + grupo; 
    const body=
      {
        "GroupCode": 124,
        "FamilyCode": "TEL"
      };
    return this.getValidToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.httpClient.post<any>(url,body, { headers });
      }),
      map((response) => {
        // Extrae y mapea la información relevante del array `value`
        return response.map((item: any) => ({
          codigo: item.ItemCode,
          nombre: item.ItemName,
          unidadMedida:"",
          color:""
        }));
      }),
      catchError((error) => {
        console.error('Error en la solicitud sap:', error);
        return throwError(error);
      })
    );
  }
  ListarArticulosPorFamiliaGrupo(identificador: any, grupo: any): Observable<any[]> {
    const url = `${this.urlBase}Items/ListFilter`;
    const body = {
      "GroupCode": 124,
      "FamilyCode": "TEL"
    };
  
    return this.getValidToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });
  
        return this.httpClient.post<any>(url, body, { 
          headers,
          responseType: 'json'
        }).pipe(
          map(response => {
            if (!response) {
              throw new Error('No se recibió respuesta del servidor');
            }
            return response.map((item: any) => ({
              codigo: item.ItemCode,
              nombre: item.ItemName,
              unidadMedida: "",
              color: ""
            }));
          }),
          catchError(error => {
            console.error('Error en la solicitud SAP:', error);
            // Reintentar la conexión si es un error de COM
            if (error.error?.ErrorDescription?.includes('COM object')) {
              return timer(1000).pipe(
                switchMap(() => this.ListarArticulosPorFamiliaGrupo(identificador, grupo))
              );
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}
