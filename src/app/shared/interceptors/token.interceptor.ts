import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core'; 
import { MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, mergeMap, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private msalService: MsalService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration
  ) {
    // TokenInterceptor
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    let tokenReq = this.addToken(req);
    tokenReq = this.addAzureToken(tokenReq);
    return next.handle(tokenReq).pipe(
      catchError((err: any) => {
        if (this.isUnauthorized(err)) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            return this.authService.refreshTokenJlr().pipe(
              mergeMap((data: any) => {
                if (data && data?.status === 200 && data?.json) {
                  this.authService.setTokenJrl(data?.json);
                  this.isRefreshing = false;
                  this.refreshTokenSubject.next(this.authService.getToken());
                  return next.handle(this.addToken(req));
                } else {
                  this.authService.logout();
                  if (this.msalGuardConfig.authRequest) {
                    this.msalService.loginRedirect({
                      ...this.msalGuardConfig.authRequest,
                    } as RedirectRequest);
                  } else {
                    this.msalService.loginRedirect();
                  }
                  return next.handle(req);
                }
              }),
              catchError((err: any) => {
                this.isRefreshing = false;
                if (this.msalGuardConfig.authRequest) {
                  this.msalService.loginRedirect({
                    ...this.msalGuardConfig.authRequest,
                  } as RedirectRequest);
                } else {
                  this.msalService.loginRedirect();
                }
                return next.handle(req);
              })
            );
          } else {
            return this.refreshTokenSubject.pipe(
              filter((token) => token != null),
              take(1),
              switchMap(() => next.handle(this.addToken(req)))
            );
          }
        }

        return throwError(err);
      })
    );
  }

  addToken(req: HttpRequest<any>) {
    return req.clone({
      setHeaders: {
        'x-authorization-jlr': `Bearer ${localStorage.getItem('tokenJlr')}`,
        expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
        pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
    });
  }

  addAzureToken(req: HttpRequest<any>) {
    return req.clone({
      setHeaders: {
        // AzureToken: `${localStorage.getItem('tokenMsal')}`,
        AzureTokenAD: `${localStorage.getItem('idTokenMsal')}`,
      },
    });
  }

  private isUnauthorized(err: any): boolean {
    return (
      err.status === 401 &&
      (err.error === 'HTTP 401 Unauthorized: Token invalid' ||
        err.error instanceof Blob)
    );
  }
}
