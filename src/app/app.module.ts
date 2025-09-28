import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

//grafico
import { HighchartsChartModule } from 'highcharts-angular';
//end
//API AZURE

import { environment } from 'src/environments/environment';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NestableModule } from 'ngx-nestable';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LightboxModule } from 'ngx-lightbox';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]);

import { MetismenuAngularModule } from '@metismenu/angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { CarouselModule } from 'ngx-owl-carousel-o';

// ads*

//NNNSSSimport { NGX_MAT_SELECT_CONFIGS,NgxMatSelectConfigs} from "ngx-mat-select";
 
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

/* #########################  SITE PAGES COMPONENT ###################*/

//import { AdminComponent } from './admin/admin.component';
import { LoadingComponent } from './elements/loading/loading.component';
import { NavHeaderComponent } from './elements/nav-header/nav-header.component';
import { NavigationComponent } from './elements/navigation/navigation.component';
import { HeaderComponent } from './elements/header/header.component';
import { FooterComponent } from './elements/footer/footer.component';

import { ElementsComponent } from './forms/elements/elements.component';
import { FormValidateComponent } from './forms/form-validate/form-validate.component';

import { RegisterComponent } from './pages/register/register.component';
// import { LoginComponent } from './pages/login/login.component';
import { LockScreenComponent } from './pages/lock-screen/lock-screen.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { Error400Component } from './pages/error400/error400.component';
import { Error403Component } from './pages/error403/error403.component';
import { Error404Component } from './pages/error404/error404.component';
import { Error500Component } from './pages/error500/error500.component';
import { Error503Component } from './pages/error503/error503.component';

import { KanbanComponent } from './kanban/kanban.component';

import { HeaderModule } from './kanban/header/header.module';
import { BoardModule } from './kanban/board/board.module';

import { TokenInterceptor } from './shared/interceptors/token.interceptor';

import { LoginComponent } from './login/login.component';
//init

import { HomeMainComponent } from './home-main/home-main.component'; 

import { HomeMainUserComponent } from './home-main-user/home-main-user.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RegistrarUsuarioComponent } from './usuarios/registrar-usuario/registrar-usuario.component';
import { ModificarUsuarioComponent } from './usuarios/modificar-usuario/modificar-usuario.component';
//ADS
import { ToastNotificationsModule } from 'ngx-toast-notifications';

import { MatSelectFilterModule } from 'mat-select-filter';
import { SearchPipe } from './search.pipe';
import { RestrictedPageComponent } from './restricted-page/restricted-page.component';
import { AzureAdDemoService } from './azure-ad-demo.service';
import {
  MsalGuard,
  MsalInterceptor,
  MsalModule,
  MsalRedirectComponent,
} from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

import { CheckboxGroupComponent } from './checkbox-group.component';
import { CheckboxComponent } from './checkbox.component';
 
import { SolicitudPendienteComponent } from './solicitud-pendiente/solicitud-pendiente.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ReporteNCComponent } from './reportes/reporte-nc/reporte-nc.component';

import { RegistroCotizacionComponent } from './ventas/registro-cotizacion/registro-cotizacion.component';
import { RegistroCotizacionsComponent } from './registro-cotizacions/registro-cotizacions.component';
import { ProductosDialogComponent } from './registro-cotizacions/productos-dialog/productos-dialog.component';
import { EstacionesTrabajoComponent } from './estaciones-trabajo/estaciones-trabajo.component';
import { ScanestacionDialogComponent } from './estaciones-trabajo/scanestacion-dialog/scanestacion-dialog.component';
import { FabricacionEstacionComponent } from './estaciones-trabajo/fabricacion-estacion/fabricacion-estacion.component';
import { MonitoreoProduccionComponent } from './monitoreo-produccion/monitoreo-produccion.component';
import { MantenimientoPerfilesComponent } from './mantenimiento-perfiles/mantenimiento-perfiles.component';
import { LineaProduccionComponent } from './linea-produccion/linea-produccion.component';
import { FormProductoComponent } from './form-producto/form-producto.component';
import { ProyectoDialogComponent } from './registro-cotizacions/proyecto-dialog/proyecto-dialog.component';
import { LayoutComponent } from './layout/layout.component';
import { MantOpComponent } from './mant-op/mant-op.component';
import { AsignarModuloDialogComponent } from './mantenimiento-perfiles/asignar-modulo-dialog/asignar-modulo-dialog.component';
import { MantenimientoComponentesComponent } from './mantenimiento-componentes/mantenimiento-componentes.component';
import { DetalleProductosComponent } from './solicitud-pendiente/detalle-productos/detalle-productos.component';
import { SupervisionOpComponent } from './supervision-op/supervision-op.component';
import { SupervisionDialogComponent } from './supervision-op/supervision-dialog/supervision-dialog.component';
import { DatePipe } from '@angular/common';
import { DetalleMonitoreoDialogComponent } from './monitoreo-produccion/detalle-monitoreo-dialog/detalle-monitoreo-dialog.component';
import { LineaProdDialogComponent } from './registro-cotizacions/linea-prod-dialog/linea-prod-dialog.component';
import { DetalleSalidaEntradaSapComponent } from './monitoreo-produccion/detalle-salida-entrada-sap/detalle-salida-entrada-sap.component';
import { DetalleFormulacionComponent } from './monitoreo-produccion/detalle-formulacion/detalle-formulacion.component';
import { DetalleFormulacionRollerzebraComponent } from './monitoreo-produccion/detalle-formulacion-rollerzebra/detalle-formulacion-rollerzebra.component';
import { CargaMiniexcelComponent } from './monitoreo-produccion/carga-miniexcel/carga-miniexcel.component';

//IMPORT

@NgModule({
  declarations: [
    CheckboxGroupComponent,
    CheckboxComponent,

    AppComponent,
    //AdminComponent,
    HomeComponent,
    LoadingComponent,
    NavHeaderComponent,
    NavigationComponent,
    HeaderComponent,
    FooterComponent,

    ElementsComponent,
    FormValidateComponent,

    RegisterComponent,
    // LoginComponent,
    LockScreenComponent,
    ForgotPasswordComponent,
    Error400Component,
    Error403Component,
    Error404Component,
    Error500Component,
    Error503Component,
    KanbanComponent,
    LoginComponent,
    HomeMainComponent,
    HomeMainUserComponent,
    UsuariosComponent,
    RegistrarUsuarioComponent,
    ModificarUsuarioComponent,

    HomeMainComponent,
    SearchPipe,
    RestrictedPageComponent, 
    SolicitudPendienteComponent,
    ReporteNCComponent,
    VentasComponent,
    RegistroCotizacionComponent,
    RegistroCotizacionsComponent,
    ProductosDialogComponent,
    EstacionesTrabajoComponent,
    ScanestacionDialogComponent,
    FabricacionEstacionComponent,
    MonitoreoProduccionComponent,
    MantenimientoPerfilesComponent,
    LineaProduccionComponent,
    FormProductoComponent,
    ProyectoDialogComponent,
    LayoutComponent,
    MantOpComponent,
    AsignarModuloDialogComponent,
    MantenimientoComponentesComponent,
    DetalleProductosComponent,
    SupervisionOpComponent,
    SupervisionDialogComponent,
    DetalleMonitoreoDialogComponent,
    LineaProdDialogComponent,
    DetalleSalidaEntradaSapComponent,
    DetalleFormulacionComponent,
    DetalleFormulacionRollerzebraComponent,
    CargaMiniexcelComponent,
  ],
  imports: [
    HighchartsChartModule, //grafico
    MatSelectFilterModule, //filter
    ToastNotificationsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxChartsModule,
    NgApexchartsModule,
    NestableModule,
    NgxSpinnerModule,
    LightboxModule,
    FullCalendarModule,
    MetismenuAngularModule,
    PerfectScrollbarModule,
    NgxDropzoneModule,
    CarouselModule,
    MatListModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    DragDropModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatExpansionModule,
    MatSelectModule,
    MatGridListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    MatTreeModule,

    HeaderModule,
    BoardModule,

    //AZURE
    //offc
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          //GP PANA
          clientId: "e15af7a9-fe4c-460e-a500-82bb8f1cfed3",
          redirectUri: environment.authRedirectUri, // "http://localhost:4200",
          authority:
            "https://login.microsoftonline.com/d9dd2d8b-a032-4ef5-885f-f9e7fa678956",
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: isIE,
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read'],
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        ]),
      }
    ),
  ],
  providers: [
    DatePipe,
    //azure
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    MsalGuard,
    AzureAdDemoService,
    //{provide: NGX_MAT_SELECT_CONFIGS, useValue: NgxMatSelectConfigs}
    //end
  ],
  bootstrap: [
    AppComponent,
    //azure
    MsalRedirectComponent,
  ],
})
export class AppModule {}
