import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../shared.service';
import { HostListener } from '@angular/core';

import { Toaster } from 'ngx-toast-notifications';
//main
import { environment } from 'src/environments/environment';

import { MatSidenav } from '@angular/material/sidenav';
import { AzureAdDemoService } from 'src/app/azure-ad-demo.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Profile } from 'src/app/profile.model';
import { MsalService } from '@azure/msal-angular';
import { NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { filter, finalize } from 'rxjs/operators'; 
import { ThemeService } from 'src/app/services/theme.service';
import { PerfilGrupoService } from 'src/app/services/perfilservice';
//import { ThemeService } from 'ng2-charts/lib/theme.service';

interface MenuList {
  id: number;
  nombre: string;
  descripcion: string;
  ruta: string;
  icono: string; 
}
/*
const ELEMENT_DATA: MenuList[] = [
  { id: 1, nombre: 'Inicio', descripcion: 'descrip', route: "Home-main", icon: "home", }, 
  { id: 3, nombre: 'Ventas', descripcion: 'descrip', route: "SolicitudPendiente", icon: "markunread_mailbox", },
  { id: 3, nombre: 'Linea Prod', descripcion: 'descrip', route: "linea-Prod", icon: "markunread_mailbox", }, 
  { id: 3, nombre: 'Operacion Construccion', descripcion: 'descrip', route: "Op-Construccion", icon: "donut_small", },
  { id: 3, nombre: 'Monitoreo Produccion', descripcion: 'descrip', route: "Monitoreo-Produccion", icon: "donut_small", },
  { id: 3, nombre: 'Componentes', descripcion: 'descrip', route: "Parametros", icon: "confirmation_number", },
  { id: 3, nombre: 'Mantenimiento OP', descripcion: 'descrip', route: "Mantenimiento-OP", icon: "donut_small", },
  { id: 3, nombre: 'Usuarios', descripcion: 'descrip', route: "Usuarios", icon: "supervised_user_circle", }, 
  { id: 3, nombre: 'Perfiles', descripcion: 'descrip', route: "Mantenimiento-Perfil", icon: "donut_small", },  
];*/
@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css'],
})
export class NavHeaderComponent implements OnInit {

  ListModuloByUsuario:any=[];
  filtrarElementosMenu() {
    this.elementosMenu =[{ id: 1, nombre: 'Inicio', descripcion: 'descrip', ruta: "Home-main", icono: "home", }];  
const userDataString = localStorage.getItem('UserLog'); 
if (userDataString) { 
  const userData = JSON.parse(userDataString);  
  this.PerfilUser=userData;
  this._service.ListarModulosPorUsuario(userData.id)
  .subscribe(
    data => {          
      this.spinner.hide();
      if(data.status==200){         
        this.ListModuloByUsuario=data.json;  
        this.ListModuloByUsuario.forEach(item=>{
          this.elementosMenu.push(item);
        }); 
      }
    },
    error => {
      this.spinner.hide();
      console.error('Error al obtener el detalle del grupo:', error);
    }
  );
} else {
  this.logout();
}


/*
    try {
      const rolesPermitidos = { 
        admins: ['Inicio',   'Usuarios', 'Parametros',
        'Consultas', 'Reporte',
        'Ventas','Operacion Construccion','Perfiles','Componentes','Mantenimiento OP',
        'Monitoreo Produccion','Linea Prod','Mantenimiento-OP'
      ], 
        tesorería: ['Inicio', 'Solicitudes', 'Historial Solicitudes','Solic. Pendiente', 'Reporte NC'],
        'contabilidad epdp': ['Inicio', 'Solicitudes', 'Historial Solicitudes', 'Solic. Pendiente']
      };    
      const role =["admins"]; 
      if (role.includes('admin')) {
        this.elementosMenu = ELEMENT_DATA;
        this.roles = ['Admin'];
      } else {

        this.roles = role;
        this.elementosMenu = ELEMENT_DATA.filter(item => {
          return rolesPermitidos[role[0]].includes(item.nombre);
        });
      }

    } catch (error) {
    }*/
  }
  
  roles: string[] = []; 
  elementosMenu: MenuList[] = [];

  UserLogin = false;
  //@Input() isUserLogged = false;
  @Input()
  set isUserLogged(value: boolean) {
    this.UserLogin = value;
  }
  profile?: Profile;
  profilePic?: SafeResourceUrl;
  isUserLoggedIn:boolean=true;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  hamburgerClass: boolean = true;
  screenHeight: any;
  screenWidth: any;
  UnidadSelected: any = 'Seleccione'; 
  unidadesUser:any;
  disableSelect = false;
  constructor(private sharedService: SharedService, 
    //aazure
    private router: Router,
    private azureAdDemoService: AzureAdDemoService,
    private domSanitizer: DomSanitizer,
    private authService: MsalService,//api
    private spinner: NgxSpinnerService,
    private authServiceApi: AuthService, private toaster: Toaster,
    private azureAdDemoSerice:AzureAdDemoService,
    private themeService: ThemeService,
    private _service: PerfilGrupoService, 
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRoutes(event.url);
    });
    this.getScreenSize();
  }
  navegar(){

  }
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
  }
  activeRoute: string = 'Home-main';
  PerfilUser:any={};
  ngOnInit(): void {     
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => { 
      const userDataString = localStorage.getItem('UserLog'); 
    if (!userDataString) {  
      
  this.logout();
    }
      var navegacion= event.url.replace("/","");
        switch(navegacion){
          case "Registro-Cotizacion":
          this.activeRoute="SolicitudPendiente";
          break;
          case "Estacion-Trabajo":
            this.activeRoute="Op-Construccion";
            break;
          case "Fabricacion":
            this.activeRoute="Op-Construccion";
            break;
          default:
          this.activeRoute=navegacion;
          break;
        } 
    });

    this.filtrarElementosMenu();
    /*
    if (this.UserLogin == true) {
      this.spinner.show();
      this.getProfile();
      this.authServiceApi
        .getTokenJlr()
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe((response) => {
          if (response.status === 200) { 
            const userRol = JSON.parse(JSON.stringify(response.json)).user;
            var roles = userRol.roles;
            localStorage.setItem('RolsUser', `${JSON.stringify(roles)}`);
            this.authServiceApi.setTokenJrl(response?.json);
            //this.roles.push(response?.json.rol.toLowerCase());

            //OBTENER UNIDADES DE NEGOCIO ASIGNADOS AL USUARIO
const jsonString = localStorage.getItem('RolsUser'); 
if (jsonString) { 
  const jsonObject = JSON.parse(jsonString); 
  const unidades = []; 
  jsonObject.forEach(element => { 
    // Verificar si la unidad ya está en el arreglo unidades
    const unidadExiste = unidades.some(item => {
      return item.descripcion.toLowerCase() === element.unidad.descripcion.toLowerCase();
    });

    // Si la unidad no existe en el arreglo unidades, agregarla
    if (!unidadExiste) {
      unidades.push(element.unidad);
    }  
  });     

  this.unidadesUser = unidades;  

  if(this.unidadesUser.length==1){     
    var unidad=unidades[0].descripcion;
    localStorage.setItem('unselected_',unidad); 
    this.UnidadSelected=unidades[0];
  }
  
  const unidadLocal = localStorage.getItem('unselected_'); 
  if(unidadLocal){

    const unidadExiste = unidades.filter(item => {
      return item.descripcion.toLowerCase() === unidadLocal.toLowerCase();
    }); 
    this.UnidadSelected=unidadExiste[0];
  }

}

            this.filtrarElementosMenu();
            this.router.navigate(['/Home-main']);
          } else {

            this.toaster.open({
              text: "Usuario no encontrado en la base de datos",
              caption: 'Mensaje',
              type: 'danger',
              position: 'top-right'
            });
            this.UserLogin = false;// true;

            //this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);

            // this.authService.loginRedirect();
            // this.router.navigate(['/']);
          }
        });
    }*/
    
  }
  
  checkRoutes(url: string) {
    var urlcomponent=url;
   // Aquí puedes definir las rutas en las que quieres deshabilitar el mat-select 
   var urlcomponent=url;
   let textoBuscado = "/item"; 
   // Utilizando includes()
   if (urlcomponent.includes(textoBuscado)) { this.disableSelect = true;
   } else {
     this.disableSelect = false;
   }
 }
  getProfile() {
    this.azureAdDemoService.getUserProfile()
      .subscribe(profileInfo => {
        this.profile = profileInfo;         
        localStorage.setItem('UserLog', profileInfo.displayName);
      })
  }
  
  onUnidadSelected() {
    // Aquí puedes ejecutar cualquier acción que desees cuando cambie la unidad seleccionada
    console.log('Unidad seleccionada:', this.UnidadSelected);
  } 
  logout() { 
    
    console.log("saliendo");
    this.isUserLoggedIn=false;
     this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
    //this.router.navigate(['/Home-main']); 
    localStorage.removeItem('UserLog');
    this.router.navigate(['/']);
    //this.authService.logout();

   // this.authService.logoutRedirect({ postLogoutRedirectUri: environment.authRedirectUri });
  }
  toggleHamburgerClass() {
    this.hamburgerClass = this.sharedService.toggleHamburgerClass();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    const div = document.getElementById('main-wrapper');
    if (this.screenWidth < 768) {
      document.body.setAttribute('data-sidebar-style', 'overlay');
    } else if (this.screenWidth >= 768 && this.screenWidth <= 1023) {
      document.body.setAttribute('data-sidebar-style', 'mini');
    } else {
      document.body.setAttribute('data-sidebar-style', 'full'); // full
    }
  }
  WasiBI() {
  }
  //menu

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
