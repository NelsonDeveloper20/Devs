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
import { HomeMainUserComponent } from './home-main-user/home-main-user.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
//PROVE

//API AZURE

import { RestrictedPageComponent } from './restricted-page/restricted-page.component';
import { SolicitudPendienteComponent } from './solicitud-pendiente/solicitud-pendiente.component';
import { ReporteNCComponent } from './reportes/reporte-nc/reporte-nc.component';
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
import { SupervisionOpComponent } from './supervision-op/supervision-op.component';
import { AuthGuard } from './auth.guard';
//END API AZURE
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'Usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'SolicitudPendiente',
    component: SolicitudPendienteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Ventas-DC',
    component: VentasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Registro-Cotizacion',
    component: RegistroCotizacionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Estacion-Trabajo',
    component: EstacionesTrabajoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Fabricacion',
    component: FabricacionEstacionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Monitoreo-Produccion',
    component: MonitoreoProduccionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Mantenimiento-Perfil',
    component: MantenimientoPerfilesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'linea-Prod',
    component: LineaProduccionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Main-user',
    component: HomeMainUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Home-main',
    component: HomeMainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Op-Construccion',
    component: ReporteNCComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Supervision',
    component: SupervisionOpComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Mantenimiento-OP',
    component: MantOpComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Layout/:id',
    component: LayoutComponent,
  },
  {
    path: 'Mantenimiento-componente',
    component: MantenimientoComponentesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'code', // Error Msal
    redirectTo: '', // Redirect Home
  },

  {
    path: 'auth',
    component: LoginComponent,
  },
  { path: 'page-error-400', component: Error400Component },
  { path: 'page-error-403', component: Error403Component },
  { path: 'page-error-404', component: Error404Component },
  { path: 'page-error-500', component: Error500Component },
  { path: 'page-error-503', component: Error503Component },
  { path: '**', component: Error404Component },

  { path: '', component: HomeMainComponent, pathMatch: 'full' },
  //API AZURE

  {
    path: 'restricted-page',
    component: RestrictedPageComponent,
    canActivate: [AuthGuard],
  },

  //END AZURE
  {
    path: '',
    component: HomeComponent,
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
