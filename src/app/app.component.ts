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
import Swal from 'sweetalert2';

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
this.rutaImagen='../../assets/login.png'; 

this.checkSession();
 /*
    const userDataString = localStorage.getItem('UserLog'); 
    if (userDataString) {  
      this.isUserLoggedIn=true;     
      this.router.navigate(['/Home-main']);
    } else {
      this.isUserLoggedIn=false;     
      this.router.navigate(['/']);
    } */
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
        console.log(data);
        if(data[0]){

          console.log(data[0]); 
          if(data[0].length!=0){
            this.isUserLoggedIn=true;             
            localStorage.setItem('UserLog', JSON.stringify(data[0]));
            localStorage.setItem('loginTime', new Date().getTime().toString());
            this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
            this.router.navigate(['/Home-main']);
          }else{
                  
        this.toaster.open({
          text: "Usuario o contraseña incorrecto ",
          caption: 'Mensaje',
          type: 'danger',
        });
          }  
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
  }
  logout()
  {
    localStorage.removeItem('UserLog');
  localStorage.removeItem('loginTime');
    this.authService.logoutRedirect({postLogoutRedirectUri:environment.authRedirectUri});
  }

  checkSession() {
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
        this.logout();
        Swal.fire({
          title: 'Mensaje',
          text: 'La sesión ha expirado',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });
      } else {
        this.isUserLoggedIn = true;
        this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
        this.router.navigate(['/Home-main']);
      }
    } else {
      
    localStorage.removeItem('UserLog');
    localStorage.removeItem('loginTime');
      this.isUserLoggedIn=false;   
      this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);  
      this.router.navigate(['/']); 
    }
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
 