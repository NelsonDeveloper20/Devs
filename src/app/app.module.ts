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
 

//END API AZURE
 

import { SharedService } from './shared.service'; 

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
import { Index1Component } from './dashboard/index1/index1.component';
import { Index2Component } from './dashboard/index2/index2.component';
import { LoadingComponent } from './elements/loading/loading.component';
import { NavHeaderComponent } from './elements/nav-header/nav-header.component';
import { NavigationComponent } from './elements/navigation/navigation.component';
import { HeaderComponent } from './elements/header/header.component';
import { FooterComponent } from './elements/footer/footer.component';

import { ProfileComponent } from './apps/profile/profile.component';
import { UserStatisticsComponent } from './elements/profile/user-statistics/user-statistics.component';
import { InterestComponent } from './elements/profile/interest/interest.component';
import { LatestNewsComponent } from './elements/profile/latest-news/latest-news.component';
import { HighlightsComponent } from './elements/profile/highlights/highlights.component';

import { PostDetailsComponent } from './apps/post-details/post-details.component';

import { ComposeComponent } from './apps/email/compose/compose.component';
import { InboxComponent } from './apps/email/inbox/inbox.component';
import { ReadComponent } from './apps/email/read/read.component';

import { CalenderComponent } from './apps/calender/calender.component';

import { ProductGridComponent } from './apps/shop/product-grid/product-grid.component';
import { ProductListComponent } from './apps/shop/product-list/product-list.component';
import { ProductDetailComponent } from './apps/shop/product-detail/product-detail.component';
import { OrderComponent } from './apps/shop/order/order.component';
import { CheckoutComponent } from './apps/shop/checkout/checkout.component';
import { InvoiceComponent } from './apps/shop/invoice/invoice.component';
import { EcomCustomersComponent } from './apps/shop/ecom-customers/ecom-customers.component';
   
import { LightGalleryComponent } from './plugins/light-gallery/light-gallery.component'; 

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
import { GraphProjectCreatedComponent } from './elements/dashboard/graph-project-created/graph-project-created.component';
import { GraphNewClientsComponent } from './elements/dashboard/graph-new-clients/graph-new-clients.component';
import { GraphMonthlyTargetComponent } from './elements/dashboard/graph-monthly-target/graph-monthly-target.component';
import { GraphProjectReleasedComponent } from './elements/dashboard/graph-project-released/graph-project-released.component';
import { GraphContactsAddedComponent } from './elements/dashboard/graph-contacts-added/graph-contacts-added.component';
import { UpcomingProjectsComponent } from './elements/dashboard/upcoming-projects/upcoming-projects.component';
import { RecentMessagesComponent } from './elements/dashboard/recent-messages/recent-messages.component';
import { ActivityComponent } from './elements/dashboard/activity/activity.component'; 
import { ContactsComponent } from './contacts/contacts.component';
import { MessagesComponent } from './messages/messages.component';
import { KanbanComponent } from './kanban/kanban.component';

import { HeaderModule } from './kanban/header/header.module';
import { BoardModule } from './kanban/board/board.module';

import { SwitcherComponent } from './switcher/switcher.component';
import { NestableComponent } from './plugins/nestable/nestable.component';  

import { TokenInterceptor } from './shared/interceptors/token.interceptor';

import { LoginComponent } from './login/login.component';
//init

import { HomeMainComponent } from './home-main/home-main.component';
import { ProveedorRegisterComponent } from './proveedor-register/proveedor-register.component';  
 
import { HomeMainUserComponent } from './home-main-user/home-main-user.component'; 
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RegistrarUsuarioComponent } from './usuarios/registrar-usuario/registrar-usuario.component';
import { ModificarUsuarioComponent } from './usuarios/modificar-usuario/modificar-usuario.component';
//ADS
import { ToastNotificationsModule } from 'ngx-toast-notifications'; 

import { MatSelectFilterModule } from 'mat-select-filter';
import { SearchPipe } from './search.pipe'; 
import { PublicPageComponent } from './public-page/public-page.component';
import { RestrictedPageComponent } from './restricted-page/restricted-page.component'
import { AzureAdDemoService } from './azure-ad-demo.service';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
    
 
import {CheckboxGroupComponent} from './checkbox-group.component';
import {CheckboxComponent} from './checkbox.component';
import { OPConNotaCreditoComponent } from './op-con-nota-credito/op-con-nota-credito.component';
import { OPSinNotaCreditoComponent } from './op-sin-nota-credito/op-sin-nota-credito.component';
import { VhAnulacionNuevocomprobanteComponent } from './op-con-nota-credito/vh-anulacion-nuevocomprobante/vh-anulacion-nuevocomprobante.component';
import { FilesComponent } from './op-con-nota-credito/vh-anulacion-nuevocomprobante/files/files.component';
import { SolicitudesAdvComponent } from './solicitudes-adv/solicitudes-adv.component';
import { SolicitudesFormComponent } from './solicitudes-form/solicitudes-form.component';
import { VhAnulacionDevolucionClienteComponent } from './op-con-nota-credito/vh-anulacion-devolucion-cliente/vh-anulacion-devolucion-cliente.component';
import { VhCambioDatosBoletaComponent } from './op-con-nota-credito/vh-cambio-datos-boleta/vh-cambio-datos-boleta.component';
import { VhCartaCruzadaComponent } from './op-con-nota-credito/vh-carta-cruzada/vh-carta-cruzada.component';
import { VhDesistimientoCompraCnEntregaComponent } from './op-con-nota-credito/vh-desistimiento-compra-cn-entrega/vh-desistimiento-compra-cn-entrega.component';
import { VhDesistimientoCompraSnEntregaComponent } from './op-con-nota-credito/vh-desistimiento-compra-sn-entrega/vh-desistimiento-compra-sn-entrega.component';
import { VhDevolucionComponent } from './op-con-nota-credito/vh-devolucion/vh-devolucion.component';
import { VhPorDescuentoComponent } from './op-con-nota-credito/vh-por-descuento/vh-por-descuento.component';

import { HistorialSolicitudComponent } from './historial-solicitud/historial-solicitud.component';
import { SolicitudesFormCartacruzadaComponent } from './solicitudes-form-cartacruzada/solicitudes-form-cartacruzada.component';
import { PartePagoEpdpComponent } from './parte-pago-epdp/parte-pago-epdp.component';
import { FilesEpdpComponent } from './parte-pago-epdp/files-epdp/files-epdp.component';
import { FormularioEpdpComponent } from './parte-pago-epdp/formulario-epdp/formulario-epdp.component';
import { PagoExcesoComponent } from './op-sin-nota-credito/pago-exceso/pago-exceso.component';
import { PagoEpdpParcialComponent } from './op-sin-nota-credito/pago-epdp-parcial/pago-epdp-parcial.component';
import { ModalFormsComponent } from './op-con-nota-credito/modal-forms/modal-forms.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { ModalUnidadComponent } from './op-con-nota-credito/modal-unidad/modal-unidad.component';
import { SolicitudPendienteComponent } from './solicitud-pendiente/solicitud-pendiente.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ReporteNCComponent } from './reportes/reporte-nc/reporte-nc.component';
import { CartaSnCruzadaComponent } from './op-sin-nota-credito/carta-sn-cruzada/carta-sn-cruzada.component';
import { SolFormSnCartacruzadaComponent } from './sol-form-sn-cartacruzada/sol-form-sn-cartacruzada.component';
import { VhAnulacioFacturanDevolucionClienteComponent } from './op-con-nota-credito/vh-anulacion-factura-devolucion-cliente/vh-anulacion-factura-devolucion-cliente.component';

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
//IMPORT 

@NgModule({
  declarations: [
      CheckboxGroupComponent, CheckboxComponent,

    AppComponent,
    //AdminComponent,
    HomeComponent,
    Index1Component,
    Index2Component,
    LoadingComponent,
    NavHeaderComponent,
    NavigationComponent,
    HeaderComponent,
    FooterComponent,

    ProfileComponent,
    UserStatisticsComponent,
    InterestComponent,
    LatestNewsComponent,
    HighlightsComponent,

    PostDetailsComponent,

    ComposeComponent,
    InboxComponent,
    ReadComponent,

    CalenderComponent,

    ProductGridComponent,
    ProductListComponent,
    ProductDetailComponent,
    OrderComponent,
    CheckoutComponent,
    InvoiceComponent,
    EcomCustomersComponent,
  
    LightGalleryComponent, 

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
    GraphProjectCreatedComponent,
    GraphNewClientsComponent,
    GraphMonthlyTargetComponent,
    GraphProjectReleasedComponent,
    GraphContactsAddedComponent,
    UpcomingProjectsComponent,
    RecentMessagesComponent,
    ActivityComponent, 
    ContactsComponent,
    MessagesComponent,
    KanbanComponent, 
    SwitcherComponent,
    NestableComponent,  
    /*UsersComponent,
    RegisterUserComponent,
    ModifyUserComponent,*/
    LoginComponent,
    HomeMainComponent,
    ProveedorRegisterComponent, 
    HomeMainUserComponent, 
    UsuariosComponent,
    RegistrarUsuarioComponent,
    ModificarUsuarioComponent, 
    
    HomeMainComponent,
    ProveedorRegisterComponent,  
    SearchPipe,  
     PublicPageComponent, RestrictedPageComponent,
      OPConNotaCreditoComponent, OPSinNotaCreditoComponent,
       VhAnulacionNuevocomprobanteComponent, FilesComponent,
        SolicitudesAdvComponent, SolicitudesFormComponent, 
        VhAnulacionDevolucionClienteComponent, 
        VhAnulacioFacturanDevolucionClienteComponent,
        VhCambioDatosBoletaComponent, VhCartaCruzadaComponent, 
        VhDesistimientoCompraCnEntregaComponent, 
        VhDesistimientoCompraSnEntregaComponent, VhDevolucionComponent, 
        VhPorDescuentoComponent, HistorialSolicitudComponent, 
        SolicitudesFormCartacruzadaComponent, PartePagoEpdpComponent,
         FilesEpdpComponent, FormularioEpdpComponent, PagoExcesoComponent,
          PagoEpdpParcialComponent, ModalFormsComponent, ParametrosComponent,
           ModalUnidadComponent, SolicitudPendienteComponent, ReporteNCComponent,
            CartaSnCruzadaComponent, SolFormSnCartacruzadaComponent, VentasComponent, RegistroCotizacionComponent, RegistroCotizacionsComponent, ProductosDialogComponent, EstacionesTrabajoComponent, ScanestacionDialogComponent, FabricacionEstacionComponent, MonitoreoProduccionComponent, MantenimientoPerfilesComponent, LineaProduccionComponent, FormProductoComponent, ProyectoDialogComponent, LayoutComponent, MantOpComponent, AsignarModuloDialogComponent, MantenimientoComponentesComponent, DetalleProductosComponent, SupervisionOpComponent, SupervisionDialogComponent,  
  ],
  imports: [  
    
    HighchartsChartModule,//grafico
    MatSelectFilterModule ,//filter
    ToastNotificationsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule, NgxChartsModule,
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
  MsalModule.forRoot(new PublicClientApplication
    (
      {
        auth:{
           //GP PANA
     clientId : "e15af7a9-fe4c-460e-a500-82bb8f1cfed3",
          redirectUri: environment.authRedirectUri,// "http://localhost:4200", 
          authority:  "https://login.microsoftonline.com/d9dd2d8b-a032-4ef5-885f-f9e7fa678956", 
          
  /*    
          //JLR
        clientId : "b9199613-4e17-480d-aa2c-a2aa6da2767b",
        redirectUri: environment.authRedirectUri,// "http://localhost:4200", 
        authority:  "https://login.microsoftonline.com/231fc845-ffbb-40e7-a2df-27f4db8fcca0", 
       */
        },
        cache:
        {
          cacheLocation:'localStorage',
          storeAuthStateInCookie:isIE
        }
    }    
  ), 
  {
    interactionType:InteractionType.Redirect,
    authRequest: {
      scopes:['user.read']
    }
  },    
  {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map(
      [
        ['https://graph.microsoft.com/v1.0/me',['user.read']]
      ]
    )
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
     MsalGuard,AzureAdDemoService,
     //{provide: NGX_MAT_SELECT_CONFIGS, useValue: NgxMatSelectConfigs}
//end
  ],
  bootstrap: [
    AppComponent ,
    //azure
    MsalRedirectComponent
    
  ],
})
export class AppModule {}
