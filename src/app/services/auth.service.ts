import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api/api.service';
import { INotificacionRequest,INotificacionRequestResponse,ProfileType,ProfileUser, ITokenResponse, TokenModel } from './auth.model';
import jwt_decode from 'jwt-decode';
 
 
import { 
  IUsuarioResponse, 
  ILoginRequest,
} from './user.model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
  private profile: ProfileUser = {};
  private profileSub$: Subject<ProfileType> = new Subject<ProfileType>();
  private urlBase: string;
  private urlBasev2: string;
  private urlBaseNotifi:string;
  private token: string;
  private tokenSub$: BehaviorSubject<string> = new BehaviorSubject<string>(`${localStorage.getItem('tokenJlr')}`);
  constructor(private apiService: ApiService) {
    this.urlBase = `${environment.baseUrl}/api/auth`;
    this.urlBaseNotifi = `${environment.baseUrl}/api/`;
    this.urlBasev2 = `${environment.baseUrl}/api/Notificacion`;
    this.token = `${localStorage.getItem('tokenJlr')}`;
  }

  getGraphProfile(): Observable<ProfileType> {
    return this.apiService.get(this.GRAPH_ENDPOINT);
  }

  getProfileSub(): Subject<ProfileType> {
    return this.profileSub$;
  }

  getProfile(): ProfileUser {
    return this.profile;
  }

  setProfile(profile: ProfileUser): void {
    this.profile = profile;
    this.profileSub$.next(profile);
  }
/*
  getTokenJlr(body: ILoginRequest): Observable<ITokenResponse> {
    return this.apiService.post(`${this.urlBase}/token`,body);
  }
  */
  getTokenJlr(): Observable<ITokenResponse> { 
    return this.apiService.post(`${this.urlBase}/token`);
  }
  getUserProfile(): Observable<ITokenResponse> {
    return this.apiService.post(`${this.urlBase}/userLoginID?Id=`+localStorage.getItem('id_'),);
  }
  AceptarNotificacion(idUsuario:any,idFactura:any ,iduser:any): Observable<ITokenResponse> {
    return this.apiService.post(`${this.urlBaseNotifi}Notificacion/Revision?idFactura=`+idFactura+`&idUsuario=`+idUsuario+`&id_user=`+iduser);
  }
  getNotificacion(
    search: INotificacionRequest
  ): Observable<INotificacionRequestResponse> {
    return this.apiService.get(`${this.urlBasev2}`, { params: search });
  }
  /*
  loginUser(body: ILoginRequest): Observable<IUsuarioResponse> {
    return this.apiService.post(`${this.urlBase}/token`, body);
  }*/

  refreshTokenJlr(): Observable<any> {
    const item = {
      accessToken: localStorage.getItem('tokenJlr'),
      refreshToken: localStorage.getItem('refreshTokenJlr'),
    };
    const urlBuilder = `${this.urlBase}/refresh-token`;
    return this.apiService.post(urlBuilder, item);
  }

  setTokenJrl(token?: TokenModel): void {
    localStorage.setItem('tokenJlr', `${token?.token}`);
    localStorage.setItem('refreshTokenJlr', `${token?.refreshToken}`);
    localStorage.setItem('ByUser', `${token?.id}`);
    //localStorage.setItem('UndNgcio', `${token?.unidadNegocio}`);
    //localStorage.setItem('RolUser', `${token?.rol}`);
    this.token = `${token?.token}`;
    this.tokenSub$.next(this.token);
  }

  getTokenSub(): Subject<string> {
    return this.tokenSub$;
  }

  getToken(): string {
    return this.token;
  }

  getRol(): number {
    return +`${this.getDecodedAccessToken(this.token)['http://jlr.gp.orders.com/claims/rol']}`;
  }

  getRolName(): string {
    return this.getDecodedAccessToken(this.token)['http://jlr.gp.orders.com/claims/rolname'];
  }

  getExpiredDate(): Date {
    const date = this.getDecodedAccessToken(this.token)['exp'];
    return new Date(date*1000);
  }

  isExpired(): boolean {
    if (!this.token) return true;
    const date = this.getDecodedAccessToken(this.token)['exp'];
    if (!date) return true;
    return new Date().getTime() > new Date(date*1000).getTime();
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token) || {};
    } catch (Error) {
      return {};
    }
  }

  logout(): void {
    localStorage.removeItem('tokenJlr');
    localStorage.removeItem('refreshTokenJlr');
    localStorage.removeItem('tokenMsal');
    localStorage.removeItem('idTokenMsal');
   // localStorage.removeItem('ByUser');
    this.token = ``;
    this.tokenSub$.next(this.token);
    
  }
}
