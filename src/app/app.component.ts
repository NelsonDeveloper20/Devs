import { Component, OnDestroy, OnInit,Inject } from '@angular/core'; 
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser'; 
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AzureAdDemoService } from './azure-ad-demo.service';
import { Toaster } from 'ngx-toast-notifications';
import { OperacionesConstruccionService } from './services/operacionesconstruccion.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Consulta de Solicitudes/Pedidos'; 
  isIframe = false; 

  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>(); 
  isUserLoggedIn:boolean=false;
  userName?:string='';
  private readonly _destroy=new Subject<void>();
  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig:MsalGuardConfiguration,
  private msalBroadCastService:MsalBroadcastService,
  private authService:MsalService,private azureAdDemoSerice:AzureAdDemoService,
  private router: Router,
  private toaster: Toaster,
  private spinner: NgxSpinnerService, 
  private _service: OperacionesConstruccionService,)
  {
 
  }
  
rutaImagen: string = '';
dominio:String="";
subscription: Subscription;
ngOnInit(): void {
  console.log();
  // Suscripción al método getIsLogin() del servicio
  this.subscription = this.azureAdDemoSerice.getIsLogin().subscribe(isLoggedIn => {
    // Actualiza el valor de isLoggedIn cuando cambie el estado de inicio de sesión
    this.isUserLoggedIn = isLoggedIn;
  });
 
  this.dominio= window.location.hostname;  
//this.rutaImagen='https://tractocamiones.pe/wp-content/uploads/2020/11/Logo-png.png';
this.rutaImagen='../../assets/login.png'; 

 
    const userDataString = localStorage.getItem('UserLog'); 
    if (userDataString) {  
      this.isUserLoggedIn=true;     
      this.router.navigate(['/Home-main']);
    } else {
      this.isUserLoggedIn=false;     
      this.router.navigate(['/']);
    }

   /*
    this.msalBroadCastService.msalSubject$.pipe
    (filter(
      
      (msg: EventMessage) =>
        msg.eventType === EventType.LOGIN_SUCCESS ||
        msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS 
    ),
    takeUntil(this._destroy))
    .subscribe(async (result) =>
      {
        this.isUserLoggedIn=this.authService.instance.getAllAccounts().length>0; 
        if (result.payload) {
          localStorage.setItem('tokenMsal', (result.payload as any)['accessToken']);
          localStorage.setItem('idTokenMsal', (result.payload as any)['idToken']);
        }
        if(this.isUserLoggedIn)
        {
          this.userName = this.authService.instance.getAllAccounts()[0].name;
       //   console.log(this.authService.instance.getAllAccounts());
        // this.router.navigate(['/Home-main']);
        }
        this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
      }       ,
     () => {
      console.log('er');
     }
     
      
      ); 

  if(this.authService.instance.getAllAccounts().length<1){
    this.router.navigate(['/']);
  }else{
    this.isUserLoggedIn=true;
    //this.router.navigate(['/Home-main']);

  }*/



  } 
  ngOnDestroy(): void {
   this._destroy.next(undefined);
   this._destroy.complete();
   // Importante: desuscribirse cuando el componente se destruya para evitar fugas de memoria
   this.subscription.unsubscribe();
  }
  username: string='';
  password: string='';
  login()
  { 

    if (!this.username || !this.password || this.username.length === 0 || this.password.length === 0) {
      this.toaster.open({
        text: "Debe ingresar usuario y contraseña",
        caption: 'Mensaje',
        type: 'danger',
      });
      return;
    }

    this.spinner.show(); 
    this._service.ValidarLogin(this.username,this.password).subscribe(
      (data: any) => {
        this.spinner.hide();  
        console.log(data[0]); 
          if(data[0].length!=0){
            this.isUserLoggedIn=true;             
            localStorage.setItem('UserLog', JSON.stringify(data[0]));
            this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
            this.router.navigate(['/Home-main']);
          }else{
                  
        this.toaster.open({
          text: "Usuario o contraseña incorrecto ",
          caption: 'Mensaje',
          type: 'danger',
        });
          }  
      },
      (error: any) => {
        this.spinner.hide(); 
        console.error(error);       
        this.toaster.open({
          text: "Error al obtener datos: "+error,
          caption: 'Ocurrio un error en el API ',
          type: 'danger',
        });
      }
    ); 
    
    /*
    if(this.msalGuardConfig.authRequest)
    {
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest)
    }
    else
    {
      this.authService.loginRedirect();
    }*/
  }
  logout()
  {
    this.authService.logoutRedirect({postLogoutRedirectUri:environment.authRedirectUri});
  }


//end
panelOpenState = true;  

isExpanded = true;
showSubmenu: boolean = false;
isShowing = false;
showSubSubMenu: boolean = false;

mouseenter() {
  if (!this.isExpanded) {
    this.isShowing = true;
  }
}

mouseleave() {
  if (!this.isExpanded) {
    this.isShowing = false;
  }
}
}
 