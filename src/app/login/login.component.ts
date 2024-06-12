import { Component, Inject, OnInit } from '@angular/core';  
import { NgxSpinnerService } from 'ngx-spinner';
import { filter, finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../shared.service';


import { Router } from '@angular/router';
//apis
 import { Login } from '../login/login.model'
import { ILoginRequest } from 'src/app/services/user.model';
import { UserService } from 'src/app/services/user.service';

//API AZURE 
import { ProfileType } from 'src/app/services/auth.model';
import { Subject } from 'rxjs';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { AzureAdDemoService } from '../azure-ad-demo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//END API
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  
  user: Login={};
  loginDisplay = false;
  hamburgerClass: boolean = false;
  message: string = '';
  //show hide div variables
  userlogin = true;
  userregister = false;

  profile!: ProfileType;
  rolName?: string;

  toggleChat: boolean = true;
  toggleSingle: boolean = true;
  isIframe = false; 
  private readonly _destroying$ = new Subject<void>();

  isUserLoggedIn:boolean=false;
  private readonly _destroy=new Subject<void>();
  constructor(private fb: FormBuilder,
//AZUREE
 
    //END AZURE
    private router: Router,
    private authService: AuthService,
    private userService: UserService, //api 
    private spinner: NgxSpinnerService, 
    public sharedService: SharedService,
     
  //IINI
  @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig:MsalGuardConfiguration,
  private msalBroadCastService:MsalBroadcastService,
  private authMsalService:MsalService,private azureAdDemoSerice:AzureAdDemoService, 
  
  ) {} 
 //Buttons clicks functionalities 
  user_register()
  {
    this.userlogin = false;
    this.userregister = true;
  }
  user_login()
  {
    this.userlogin = true;
    this.userregister = false;
  }  
  Iniciarsession(): void {
      
    if(this.msalGuardConfig.authRequest)
    {
      this.authMsalService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest)
    }
    else
    {
      this.authMsalService.loginRedirect();
    } 
  } 

  Iniciarsessionv2(): void {
    
  }

//API AZURE
dominio:String="";
rutaImagen: string = '';
onSubmit() {
  // Handle form submission logic here
  // This could involve making an API call to your backend
  console.log(this.loginForm.value);
  this.loginForm.reset(); // Reset form after submission
}
ngOnInit(): void {
  
  this.loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  
  this.dominio= window.location.hostname; 
  if(this.dominio.trim().toLowerCase()=='aprobaciones.panaautos.com.pe'){
this.rutaImagen='../../assets/fondologin.png';
  }else{
    this.rutaImagen = '../../assets/fondo5.png';
  } /*
  
 this.msalBroadCastService.inProgress$.pipe
 (filter((interactionStatus:InteractionStatus)=>
 interactionStatus==InteractionStatus.None),
 takeUntil(this._destroy))
 .subscribe(x=>
   {
     this.isUserLoggedIn=this.authMsalService.instance.getAllAccounts().length>0;
   
     if(this.isUserLoggedIn)
     {

      this.msalBroadCastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
        )
      )
      .subscribe((result: EventMessage) => {
        console.log('Login msalBroadcastService Success');
        if (this.authService.isExpired()) {
          console.log('Login msalBroadcastService Success / isExpired');
          this.spinner.show();
          this.authService
            .getTokenJlr()
            .pipe(
              finalize(() => {
                this.spinner.hide();
              })
            )
            .subscribe((response) => {
              if (response.status === 200) {
                this.authService.setTokenJrl(response?.json); 
               this.router.navigate(['/Home-main']);
              }
            });
        }else{
          
          this.router.navigate(['/Home-main']);
        }
      }); 
     }
     this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
   });
   
   this.isUserLoggedIn=this.authMsalService.instance.getAllAccounts().length>0;
   if(this.isUserLoggedIn){
    this.router.navigate(['/Home-main']);
   }*/
} 

getProfile() {
  this.authService.getGraphProfile().subscribe((profile) => {
    this.profile = profile;
    this.authService.setProfile(profile);
  });
}

togglechatbar() {
  this.toggleChat = !this.toggleChat;
}
singleChatWindow() {
  this.toggleSingle = !this.toggleSingle;
}

setLoginDisplay() { 
}
 

ngOnDestroy(): void {
  this._destroying$.next(undefined);
  this._destroying$.complete();
}
}
