import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delay, filter, map, retry, retryWhen, scan, switchMap, take, tap } from 'rxjs/operators';
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
    if(environment.production==true){
      this.urlBase = `${environment.urlSap}api/`;
    }else{

    }
  }
  
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
 
  private login(): Observable<string> {
    const url = `${this.urlBase}Login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { Username: this.username, Password: this.password };
  
    return this.httpClient.post<string>(url, body, { headers, responseType: 'text' as 'json' }).pipe(
      tap((token: string) => {
        localStorage.setItem('authToken', token);
      }),
      retryWhen((errors) =>
        errors.pipe(
          scan((retryCount, err) => {
            if (retryCount >= 1) {
              throw err; // Lanza el error después de dos intentos fallidos
            }
            console.warn(`Reintentando login (${retryCount + 1}/2)...`);
            return retryCount + 1;
          }, 0),
          delay(1000) // Espera 1 segundo entre intentos
        )
      ),
      catchError((error) => {
        console.error('Error al iniciar sesión:', error);
        return throwError(() => new Error('Error al iniciar sesión después de dos intentos fallidos.'));
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
      return of(currentToken);
    }
  
    if (!this.tokenSubject.getValue()) {
      this.tokenSubject.next(null);
      this.login().subscribe({
        next: (newToken) => this.tokenSubject.next(newToken),
        error: (err) => {
          console.error('Error al renovar token:', err);
          this.tokenSubject.error(err);
          this.tokenSubject = new BehaviorSubject<string | null>(null); // Reinicia el subject
        },
      });
    }
  
    return this.tokenSubject.pipe(
      filter((token) => token !== null),
      take(1)
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
  ListarArticulosPorFamiliaGrupooff(identificador: any, grupo: any): Observable<any[]> {
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
              unidadMedida:item.SalesUnit,
              color: item.U_EXD_COLD,
              serie: item.ManageSerialNumbers,
              lote: item.ManageBatchNumbers,
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
    ListarArticulosPorFamiliaGrupo(identificador: any, grupo: any): Observable<any[]> {
      const url = `${this.urlBase}Items/ListFilter`;
      const body = {
        "GroupCode": identificador,
        "FamilyCode": grupo
      };
    
      return this.getValidToken().pipe(
        switchMap((token) => {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          });
    
          return this.httpClient.post<any>(url, body, { headers }).pipe(
            retry({
              count: 3,
              delay: (error, retryCount) => {
                console.log(`Reintento ${retryCount} debido a error:`, error);
                return timer(1000 * retryCount); // Aumenta el tiempo entre reintentos
              },
              resetOnSuccess: true
            }),
            map(response => {
              if (!Array.isArray(response)) {
                throw new Error('La respuesta no es un array de artículos');
              }
              return response.map((item: any) => ({
                codigo: item.ItemCode,
                nombre: item.ItemName,
                unidadMedida: item.SalesUnit,
                color: item.U_EXD_COLD,
                serie: item.ManageSerialNumbers,
                lote: item.ManageBatchNumbers,
              }));
            }),
            catchError(error => {
              console.error('Error en la solicitud SAP:', error);
               
              // Si el error persiste después de los reintentos
              if (error.status === 500) {
                return timer(2000).pipe(
                  switchMap(() => this.ListarArticulosPorFamiliaGrupo(identificador, grupo))
                );
              }
    
              return throwError(() => new Error(`Error al listar artículos: ${error.message}`));
            })
          );
        }),
        catchError(error => {
          if (error.status === 500) {
            return this.handleTokenRefresh().pipe(
              switchMap(() => this.ListarArticulosPorFamiliaGrupo(identificador, grupo))
            );
          }
          return throwError(() => error);
        })
      );
    }
    
    // Método auxiliar para manejar la renovación del token
    private handleTokenRefresh(): Observable<any> {
      return this.login().pipe(
        tap(newToken => {
          this.tokenSubject.next(newToken);
        }),
        catchError(error => {
          console.error('Error al renovar el token:', error);
          return throwError(() => error);
        })
      );
    }
  CerrarCotizacion(body: any): Observable<any> {
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
  // Método PATCH
  updateOrder(enty: any): Observable<any> {    
    //N = MIGRADO
    //Y = PENDIENTE A MIGRAR
    // Asumiendo que `enty` es el ID del pedido o un valor similar
    const url = `${this.urlBase}Orders/${enty}/N`;  
    return this.getValidToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Especificar Content-Type
        }); 
        const body = { 
        }; 
        return this.httpClient.patch(url, body, { headers });
      }),
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        return throwError(() => new Error(error?.message || 'Error en la solicitud al servidor'));
      })
    );
  }
  
}
