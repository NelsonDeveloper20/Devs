import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { HomeComponent } from './home/home.component'; 
import { Error400Component } from './pages/error400/error400.component';
import { Error403Component } from './pages/error403/error403.component';
import { Error404Component } from './pages/error404/error404.component';
import { Error500Component } from './pages/error500/error500.component';
import { Error503Component } from './pages/error503/error503.component';  
import { LoginComponent } from './login/login.component';
import { HomeMainComponent } from './home-main/home-main.component';
import { ProveedorRegisterComponent } from './proveedor-register/proveedor-register.component'; 
import { HomeMainUserComponent } from './home-main-user/home-main-user.component' 
import { UsuariosComponent } from './usuarios/usuarios.component' 
//PROVE 
  
//API AZURE

import { RestrictedPageComponent } from './restricted-page/restricted-page.component';
import { PublicPageComponent } from './public-page/public-page.component';
import { MaslGuard } from './masl.guard';
import { ProfileComponent } from './apps/profile/profile.component';
import { MsalGuard } from '@azure/msal-angular'; 
import { OPSinNotaCreditoComponent } from './op-sin-nota-credito/op-sin-nota-credito.component';
import { OPConNotaCreditoComponent } from './op-con-nota-credito/op-con-nota-credito.component';
import { VhAnulacionNuevocomprobanteComponent } from './op-con-nota-credito/vh-anulacion-nuevocomprobante/vh-anulacion-nuevocomprobante.component';
import { SolicitudesAdvComponent } from './solicitudes-adv/solicitudes-adv.component';
import { VhAnulacionDevolucionClienteComponent } from './op-con-nota-credito/vh-anulacion-devolucion-cliente/vh-anulacion-devolucion-cliente.component';
import { VhPorDescuentoComponent } from './op-con-nota-credito/vh-por-descuento/vh-por-descuento.component';
import { VhDevolucionComponent } from './op-con-nota-credito/vh-devolucion/vh-devolucion.component';
import { VhDesistimientoCompraSnEntregaComponent } from './op-con-nota-credito/vh-desistimiento-compra-sn-entrega/vh-desistimiento-compra-sn-entrega.component';
import { VhDesistimientoCompraCnEntregaComponent } from './op-con-nota-credito/vh-desistimiento-compra-cn-entrega/vh-desistimiento-compra-cn-entrega.component';
import { VhCartaCruzadaComponent } from './op-con-nota-credito/vh-carta-cruzada/vh-carta-cruzada.component';
import { VhCambioDatosBoletaComponent } from './op-con-nota-credito/vh-cambio-datos-boleta/vh-cambio-datos-boleta.component';
import { HistorialSolicitudComponent } from './historial-solicitud/historial-solicitud.component';
import { PartePagoEpdpComponent } from './parte-pago-epdp/parte-pago-epdp.component';
import { PagoExcesoComponent } from './op-sin-nota-credito/pago-exceso/pago-exceso.component';
import { PagoEpdpParcialComponent } from './op-sin-nota-credito/pago-epdp-parcial/pago-epdp-parcial.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { SolicitudPendienteComponent } from './solicitud-pendiente/solicitud-pendiente.component';
import { ReporteNCComponent } from './reportes/reporte-nc/reporte-nc.component';
import { CartaSnCruzadaComponent } from './op-sin-nota-credito/carta-sn-cruzada/carta-sn-cruzada.component';
import { VhAnulacioFacturanDevolucionClienteComponent } from './op-con-nota-credito/vh-anulacion-factura-devolucion-cliente/vh-anulacion-factura-devolucion-cliente.component';
import { RegistroCotizacionComponent } from './registro-cotizacion/registro-cotizacion.component';
import { VentasComponent } from './ventas/ventas.component';
import { RegistroCotizacionsComponent } from './registro-cotizacions/registro-cotizacions.component';
import { EstacionesTrabajoComponent } from './estaciones-trabajo/estaciones-trabajo.component';
import { FabricacionEstacionComponent } from './estaciones-trabajo/fabricacion-estacion/fabricacion-estacion.component';
import { MonitoreoProduccionComponent } from './monitoreo-produccion/monitoreo-produccion.component';
import { MantenimientoPerfilesComponent } from './mantenimiento-perfiles/mantenimiento-perfiles.component';
import { LineaProduccionComponent } from './linea-produccion/linea-produccion.component';
import { LayoutComponent } from './layout/layout.component';
import { MantOpComponent } from './mant-op/mant-op.component';
import { MantenimientoComponentesComponent } from './mantenimiento-componentes/mantenimiento-componentes.component';
 //END API AZURE
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'Usuarios',
    component: UsuariosComponent,
  }, 
  {
    path: 'CN-NotaCredito',
    component: OPConNotaCreditoComponent,
  },  
  {
    path: 'CN-NotaCredito-Nuevo-Comprobante/:FactId',
    component: VhAnulacionNuevocomprobanteComponent,
  },  
  {
path:'CN-NotaCredito-Devolucion-Cliente/:FactId',
component:VhAnulacionDevolucionClienteComponent
  },
  {
  path:'CN-NotaCredito-Devolucion-Factura-Cliente/:FactId',
  component:VhAnulacioFacturanDevolucionClienteComponent
  },
   //init 
  {
    path:'CN-NotaCredito-Datos-Boleta/:FactId',
    component:VhCambioDatosBoletaComponent
      }, 
      {
    path:'CN-NotaCredito-Carta-Cruzada/:FactId',
    component:VhCartaCruzadaComponent
      },
  {
    path:'CN-NotaCredito-Compra-CN-Entrega/:FactId',
    component:VhDesistimientoCompraCnEntregaComponent
      },
       
  {
    path:'CN-NotaCredito-Compra-SN-Cruzada/:FactId',
    component:VhDesistimientoCompraSnEntregaComponent
      },
       
  {
  path:'CN-NotaCredito-Devolucion/:FactId',
  component:VhDevolucionComponent
    },
  {
    path:'CN-NotaCredito-Descuento/:FactId',
    component:VhPorDescuentoComponent
  }, 
      //end
  {
    path: 'SN-NotaCredito',
    component: OPSinNotaCreditoComponent,
  }, 
  {
    path:'SN-PartePago-Epdp/:FactId',
    component:PartePagoEpdpComponent
  },
  {
  path:'SN-Carta-Cruzada/:FactId',
  component:CartaSnCruzadaComponent
    },
     
{
  path:"SN-PagoExceso/:FactId",
  component:PagoExcesoComponent
},
  
{
  path:"SN-Pago-Epdp-parcial/:FactId",
  component:PagoEpdpParcialComponent
},
  {
path:'SolicitudAdv',
component:SolicitudesAdvComponent
  },
  
  {
    path:'SolicitudPendiente',
    component:SolicitudPendienteComponent
  },
  {
    path: 'Ventas-DC',
    component: VentasComponent,
  }, 
  {
    path:'Registro-Cotizacion',
    component:RegistroCotizacionsComponent
  },
  {
    path:'Estacion-Trabajo',
    component:EstacionesTrabajoComponent
  },
  {
    path:'Fabricacion',
    component:FabricacionEstacionComponent
  },
  {
path:'Monitoreo-Produccion',
component:MonitoreoProduccionComponent
  },
  {
path:'Mantenimiento-Perfil',
component:MantenimientoPerfilesComponent
  },
  {
    path:'linea-Prod',
    component:LineaProduccionComponent
  },
  {
path:'Historial-Solicitud',
component:HistorialSolicitudComponent
  },
  {
    path:'Main-user',
    component:HomeMainUserComponent
  },
  {
    path:'Proveedor-register',
    component:ProveedorRegisterComponent
  }, 
  {
    path:'Home-main',
    component:HomeMainComponent
  },
  {
    path:'Parametros',
    component:ParametrosComponent
  }, 
  {
    path:'Op-Construccion',
    component:ReporteNCComponent
  }, 
  {
    path:'Mantenimiento-OP',
    component:MantOpComponent
  }, 
  {
    path:'Layout/:id',
    component:LayoutComponent
  }, 
  {path: 'Mantenimiento-componente',
    component: MantenimientoComponentesComponent
  },
  {
    path: 'code', // Error Msal
    redirectTo: '', // Redirect Home
  },
   
  {
    path: 'auth',
    component: LoginComponent
  },  
  { path: 'page-error-400', component: Error400Component },
  { path: 'page-error-403', component: Error403Component },
  { path: 'page-error-404', component: Error404Component },
  { path: 'page-error-500', component: Error500Component },
  { path: 'page-error-503', component: Error503Component },
  { path: '**', component: Error404Component },


  //API AZURE

  {path : 'public-page', component: PublicPageComponent},
  {path: 'restricted-page', component: RestrictedPageComponent, canActivate: [MaslGuard]},
  {path: '**', component: PublicPageComponent}
  //END AZURE
  ,{
    path:'Profiles',
    component:ProfileComponent,
    canActivate:[MsalGuard]
  },
  {
    path:'',
    component:HomeComponent
  },
  
  
  {
    path: 'Registro-Cotizacion',
    component: RegistroCotizacionComponent,
  }, 
];

const isIframe = window !== window.parent && !window.opener;
const _hash = true; // anteriormente ha estado en true
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: _hash,
      initialNavigation: !isIframe ? 'enabled' : 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
