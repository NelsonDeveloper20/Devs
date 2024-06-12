import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api/api.service';
import {
  IOrderRequestResponse,
  ISolicitudActionRpaRequest,
  ISolicitudSubActionRpaRequest,
  ISolicitudObservacionRpaRequest,
  ISolicitudResponse,
  ISolicitudSearchRequest,
  IFacturaSearchRequest,
  IFacturaRequestResponse,
  IFilesResponse,
  //ads
  IProyectosResponse,
  ITiemposResponse,
  ISubContratistasResponse,
  IFactBSDatasResponse,
  IProcesoCargasResponse,
  ILeccionesAprendidasResponse,
  IFactRRHHCurvaPersonalResponse,
  IFactRRhhReportPersonalResponse,
  IFactSubContratacionesResponse,
  IPeriodoResponse,
  IFactPanelFotoGraficoResponse,
  IFactOtResultadosGeneralesResponse,
  IFactGTCIndicadoresCalidad,
  IFactAppBq21AP,
  IDim_Etapa_ZonaResponse,
  IFactAppBq22Ins,
  IUsersResponse,
  IMargenResponse,
  IDim_TipoAdicionalesponse,
  IFactAdicionalesResponse,
  IFactDirectorioResponse,
  IFactResultadosCPISPIResponse,
  IDim_UsuariosResponse,
  IFactAppBQ23ERResponse,
  IFactAppBQ22EEResponse,
  IDim_Proyecto_HRResponse,
  IFactAppBQ22EIResponse,
  IDim_Etapa_AppResponse,
  IFactAppBQ31GOResponse,
  IFactAppBQ31EPSResponse,
  IFactAppIMGResponse,
  IFactAppBQ32CPResponse,
  IDim_ProyectoGeneralResponse,
  IDim_EtapasResponse,
  IDim_ProyectoCategoriaResponse,
  IDim_EmpresaResponse,
  IProyectosResponses,
  IDim_CategoriaResponse,
  ISolicitudAdvResponse,
  ISolicitud2Response,
  IHistorialSolicitudResponse,
  ISolicitudReporteResponse
} from './request.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private urlBase: string;
  constructor(private apiService: ApiService) {
    this.urlBase = `${environment.baseUrl}/api/`;
  }
  getusuarios(): Observable<IUsersResponse>{
    return this.apiService.get(`${this.urlBase}users`); //Usuario
  }



  getSolicitudAdv(idUsuario,  fechainicio,  fechafin,  usuario,  estado,tipolistado,cliente , Otro): Observable<ISolicitud2Response>{//ISolicitudAdvResponse>{
    return this.apiService.get(`${this.urlBase}Solicitud?idUsuario=${idUsuario}&fechainicio=${fechainicio}&fechafin=${fechafin}&usuario=${usuario}&estado=${estado}&tipoListado=${tipolistado}&cliente=${cliente}&otro=${Otro}`); //Usuario
  }

  getSolicitudReporte(
  Serie_NC_SAP,
  UN,
  Tienda,
  Ceco,
  ClienteRazonSocial,
  RucCliente,
  FechaInicio,
  FechaFin,
  NroNotaCredito,
  Asesor,
  EstadoSolicitud,
  FechaInicioCierre,
  FechaFinCierre
  ): Observable<ISolicitudReporteResponse>{//ISolicitudAdvResponse>{
    return this.apiService.get(`${this.urlBase}SolicitudReporte?Serie_NC_SAP=${Serie_NC_SAP}&UN=${UN}&Tienda=${Tienda}&Ceco=${Ceco}&ClienteRazonSocial=${ClienteRazonSocial}&RucCliente=${RucCliente}&FechaInicio=${FechaInicio}&FechaFin=${FechaFin}&NroNotaCredito=${NroNotaCredito}&Asesor=${Asesor}&EstadoSolicitud=${EstadoSolicitud}&FechaInicioCierre=${FechaInicioCierre}&FechaFinCierre=${FechaFinCierre}`); //Usuario
  }


  getClienteSolicitud(idUsuario,  fechainicio,  fechafin): Observable<ISolicitud2Response>{//ISolicitudAdvResponse>{
    return this.apiService.get(`${this.urlBase}SolicitudFiltro?idUsuario=${idUsuario}&fechainicio=${fechainicio}&fechafin=${fechafin}`); //Usuario
  }


  getHistorialSolicitudAdv(idUsuario,  fechainicio,  fechafin,  usuario,  estado,tipolistado,cliente ): Observable<IHistorialSolicitudResponse>{//ISolicitudAdvResponse>{
    return this.apiService.get(`${this.urlBase}HistorialSolicitud?idUsuario=${idUsuario}&fechainicio=${fechainicio}&fechafin=${fechafin}&usuario=${usuario}&estado=${estado}&tipoListado=${tipolistado}&cliente=${cliente}`); //Usuario
  }

  getHistorialSolicitudAdvEstado(id:string): Observable<IHistorialSolicitudResponse>{//ISolicitudAdvResponse>{
    return this.apiService.get(`${this.urlBase}HistorialSolicitudEstado?id=${id}`); //Usuario
  }

  ///////////////7
  getDim_usuarios(): Observable<IDim_UsuariosResponse>{
    return this.apiService.get(`${this.urlBase}Dim_Usuarios`); //Usuario
  }
  getRequest(
    search: ISolicitudSearchRequest
  ): Observable<IOrderRequestResponse> {
    return this.apiService.get(this.urlBase, { params: search });
  }

  GetProyecto(): Observable<IProyectosResponse>{
    return this.apiService.get(`${this.urlBase}proyecto`, {});
  }
  GetProyectoGeneral(): Observable<IDim_ProyectoGeneralResponse>{
    return this.apiService.get(`${this.urlBase}ProyectoGeneral`, {});
  }

  GetDim_Etapas(): Observable<IDim_EtapasResponse>{
    return this.apiService.get(`${this.urlBase}Etapa`, {});
  }
  GetProyectoCategoria(): Observable<IDim_ProyectoCategoriaResponse>{
    return this.apiService.get(`${this.urlBase}ProyectoCategoria`, {});
  }
  GetDim_Categoria(): Observable<IDim_CategoriaResponse>{
    return this.apiService.get(`${this.urlBase}Dim_Categoria`, {});
  }
  GetEmpresa(): Observable<IDim_EmpresaResponse>{
    return this.apiService.get(`${this.urlBase}Empresa`, {});
  }

  GetProyectoHR(): Observable<IDim_Proyecto_HRResponse>{
    return this.apiService.get(`${this.urlBase}Dim_Proyecto_HR`, {});
  }
  GetDim_Etapa_App(): Observable<IDim_Etapa_AppResponse>{
    return this.apiService.get(`${this.urlBase}Dim_Etapa_App`, {});
  }
  GetSubContratista(): Observable<ISubContratistasResponse>{
    return this.apiService.get(`${this.urlBase}SubContratista`, {});
  }

  GetResultadoEncuesta(idproyecto:any,tiempo:any): Observable<IFactBSDatasResponse>{
    return this.apiService.get(`${this.urlBase}FactBSData?proyectoId=`+idproyecto+'&tiempo='+tiempo, {});
  }
  //int intFecha, int intProyectos,int intContrata
  GetFactRRHHReportePersonal(intFecha:any,intProyectos:any,intContrata:any): Observable<IFactRRhhReportPersonalResponse>{
    return this.apiService.get(`${this.urlBase}FactRRHHReportePersonal?intFecha=`+intFecha+'&intProyectos='+intProyectos+'&intContrata='+intContrata, {});
  }
  GetFactSubContratista(idUsuario:any,periodo:any,proyecto:any,contrata:any): Observable<IFactSubContratacionesResponse>{
    return this.apiService.get(`${this.urlBase}FactSubContratista?id_usuario=`+idUsuario+'&periodo='+periodo+'&proyecto='+proyecto+'&contrata='+contrata, {});
  }
  GetProcesoCarga( id_user:any,periodo:any, proyecto:any,tipoArea:any,tipoFormulario:any ): Observable<IProcesoCargasResponse>{
    return this.apiService.get(`${this.urlBase}procesocarga?id_user=`+id_user+'&periodo='+periodo+'&proyecto='+proyecto+"&tipoArea="+tipoArea+'&tipoFormulario='+tipoFormulario, {});
  }
  GetCurvaIngreso( id_user:any,periodo:any, proyecto:any): Observable<IFactRRHHCurvaPersonalResponse>{
    return this.apiService.get(`${this.urlBase}FactRRHH?id_user=`+id_user+'&periodo='+periodo+'&proyecto='+proyecto, {});
  }
  GetProyectoAll(): Observable<IProyectosResponses>{
    return this.apiService.get(`${this.urlBase}proyecto`, {});
  }
  GetLeccionesAprendidas( id_user:any, proyecto:any,periodo:any, tipoArea:any): Observable<ILeccionesAprendidasResponse>{
    return this.apiService.get(`${this.urlBase}lecionesAprendidas?id_user=`+id_user+'&proyecto='+proyecto+"&periodo="+periodo+"&tipoArea="+tipoArea, {});
  }
  GetFactPanelFotoGrafico( id_user:any, proyecto:any,periodo:any, tipoArea:any): Observable<IFactPanelFotoGraficoResponse>{
    return this.apiService.get(`${this.urlBase}FactPanelFotoGrafico?id_user=`+id_user+'&proyecto='+proyecto+"&periodo="+periodo+"&tipoArea="+tipoArea, {});
  }
  getFactOtResultados( id_user:any, proyecto:any,periodo:any, tipoArea:any): Observable<IFactOtResultadosGeneralesResponse>{
    return this.apiService.get(`${this.urlBase}FactOtResultadosGenerales?id_user=`+id_user+'&proyecto='+proyecto+"&periodo="+periodo+"&tipoArea="+tipoArea, {});
  }
  getFactResultadosCPISPI( id_user:any, proyecto:any,periodo:any): Observable<IFactResultadosCPISPIResponse>{
    return this.apiService.get(`${this.urlBase}FactResultadosCPISPI?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }

  getFactGTCIndicadoresCalidad( id_user:any, proyecto:any,periodo:any ): Observable<IFactGTCIndicadoresCalidad>{
    return this.apiService.get(`${this.urlBase}FactGTCIndicadores?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }
  getFactAppBq21AP( id_user:any, proyecto:any,periodo:any ): Observable<IFactAppBq21AP>{
    return this.apiService.get(`${this.urlBase}FactAppBq21AP?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }

  getFactAppBQ23ER( id_user:any, proyecto:any,periodo:any ): Observable<IFactAppBQ23ERResponse>{
    return this.apiService.get(`${this.urlBase}FactAppBQ23ER?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }
  getFactAppBQ31GO( id_user:any, proyecto:any,periodo:any ): Observable<IFactAppBQ23ERResponse>{
    return this.apiService.get(`${this.urlBase}FactAppBQ31GO?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }
  getFactAppBQ31EPS( id_user:any, proyecto:any,periodo:any ): Observable<IFactAppBQ31EPSResponse>{
    return this.apiService.get(`${this.urlBase}FactAppBQ31EPS?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }
  getFactAppBQ31EPSList(): Observable<IFactAppBQ31EPSResponse>{
    return this.apiService.get(`${this.urlBase}FactAppBQ31EPSList`, {});
  }
  getFactAppIMG( id_user:any, proyecto:any,periodo:any ): Observable<IFactAppIMGResponse>{
    return this.apiService.get(`${this.urlBase}FactAppIMG?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }
  getFactAppBQ22EE( id_user:any, proyecto:any,periodo:any ): Observable<IFactAppBQ31GOResponse>{
    return this.apiService.get(`${this.urlBase}FactAppBQ22EE?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }
  getFactAppBQ22EI( id_user:any, proyecto:any,periodo:any ): Observable<IFactAppBQ22EIResponse>{
    return this.apiService.get(`${this.urlBase}FactAppBQ22EI?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }
  getFactAppBQ32CP( id_user:any, proyecto:any,periodo:any ): Observable<IFactAppBQ32CPResponse>{
    return this.apiService.get(`${this.urlBase}FactAppBQ32CP?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }
  getFactAppBq22Ins(id_user:any, proyecto:any,periodo:any ): Observable<IFactAppBq22Ins>{
    return this.apiService.get(`${this.urlBase}FactAppBq22Ins?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }
  getFactDirectorio(id_user:any, proyecto:any,periodo:any,
    metroscuadrados:any,procentajeutil:any,estado:any
     ): Observable<IFactDirectorioResponse>{
    return this.apiService.get(`${this.urlBase}FactDirectorio?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto
    +"&metrocuadrado="+metroscuadrados+"&porcentUtil="+procentajeutil+"&estado="+estado
    , {});
  }
  GetTiempo(): Observable<ITiemposResponse>{
    return this.apiService.get(`${this.urlBase}tiempo`,{});
  }
  GetPeriodo(): Observable<IPeriodoResponse>{
    return this.apiService.get(`${this.urlBase}Periodo`,{});
  }
  getTipoAdicionales(): Observable<IDim_TipoAdicionalesponse>{
    return this.apiService.get(`${this.urlBase}Dim_TipoAdicionales`,{});
  }
  getAdicionales(id_user:any, proyecto:any,periodo:any ): Observable<IFactAdicionalesResponse>{
    return this.apiService.get(`${this.urlBase}FactAdicionales?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }

  GetMargen(id_user:any, proyecto:any,periodo:any ): Observable<IMargenResponse>{
    return this.apiService.get(`${this.urlBase}FactMargenes?id_user=`+id_user+'&periodo='+periodo+"&proyecto="+proyecto, {});
  }
  GetDim_Etapa_Zona(): Observable<IDim_Etapa_ZonaResponse>{
    return this.apiService.get(`${this.urlBase}Dim_Etapa_Zona`,{});
  }
  getFactura(
    search: IFacturaSearchRequest
  ): Observable<IFacturaRequestResponse> {
    return this.apiService.get(`${this.urlBase}Factura`, { params: search });
  }

  getFacturaUser(
    search: IFacturaSearchRequest
  ): Observable<IFacturaRequestResponse> {
    return this.apiService.get(`${this.urlBase}FacturaUser/getFacturaUs`, { params: search });
  }
  getFiles(
    files?: string,
  ): Observable<IFilesResponse> {
    return this.apiService.get(`${this.urlBase}XmlRead/GetFile?nameFile=${files}`);
  }

  updateAccionRpa(
    body: ISolicitudActionRpaRequest
  ): Observable<ISolicitudResponse> {
    return this.apiService.put(`${this.urlBase}/accionrpa`, body);
  }

  updateSubAccion(
    body: ISolicitudSubActionRpaRequest
  ): Observable<ISolicitudResponse> {
    return this.apiService.put(`${this.urlBase}/subaccionrpa`, body);
  }

  updateObservation(
    body: ISolicitudObservacionRpaRequest
  ): Observable<ISolicitudResponse> {
    return this.apiService.put(`${this.urlBase}/observacion`, body);
  }
}
