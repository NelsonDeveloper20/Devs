import { Component, OnInit, Inject } from '@angular/core';


import { Router } from '@angular/router';
  
import { Subject } from 'rxjs';
import { filter,takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileType,ProfileUser } from 'src/app/services/auth.model';
 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  profile!: ProfileType;  
  profile_!: ProfileUser; 
  rolName?: string;  

  toggleChat: boolean = true;
  toggleSingle: boolean = true;
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private router: Router,  
    private authService: AuthService
  ) {}

  ngOnInit(): void { 
   // this.getProfile();
    
  }

  getProfile() {
    
    this.authService.getUserProfile().subscribe((profiles_) => {
      
      let userStr = JSON.stringify(profiles_.json);  
      const objuser = JSON.parse(userStr);
      
      const request: ProfileUser = { 
        nombre: objuser.nombre,
        roluser: objuser.rolUser,
        correo: objuser.correo,
        id: objuser.id

      };    
      if(objuser.flagRegistro==='1'){
         
      }else{

        //this.router.navigate(['/', 'Proveedor-register']);
      }

      this.profile_ = request; 
      this.authService.setProfile(request);
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

  login() {
    
  }

  logout() {
    
      takeUntil(this._destroying$)
    this.authService.logout(); 
    
    // }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
