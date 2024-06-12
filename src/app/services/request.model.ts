












export interface HistorialSolicitudResponse {
  id: number;
  idSolicitud?: number;
  estadoSolicitud?: string;
  subEstado?: string;
  motivo?: string;
  comentario?: string;
  paso?:string;
  usuarioCreacion?: number;
  fechaCreacion?: Date;
  solicitud: Array<Solicitud2>;
  usuario: Array<IUserResponse>;
}

export type IHistorialSolicitudResponse = Array<HistorialSolicitudResponse>;

export interface Adjunto {
  idadjunto: number;
  idsolicitud: number;
  idtipoadjunto: number;
  nrodococumento: string;
  nombrestorage: string;
  nombrearchivo: string;
  observacion: string;
  fecharegistro: string;
  nombre:string;
}
export interface TipoSolicitud {
  id: number;
  descripcion: string;
  estado: number;
  usuarioCreacion: number;
  fechaCreacion: string;
  fechaModificacion: string;
}

//INIT
/*
export interface SolicitudReporteResponse {
  Numero_NC_SAP: string;
  Serie_NC_SAP: string;
  Monto_Total_SAP: string;
  Moneda_SAP: string;
  Nro_Solicitud: string;
  TipoSolicitud: string;
  UN: string;
  Tienda: string;
  CECO: string;
  Nro_SAP: string;
  Comprobante: string;
  ClienteRazonSocial: string;
  DNIRUC: string;
  Fecha_Solicitud: string;
  Importe: string;
  Moneda: string;
  Comentario: string;
  Nro_NotaCredito: string;
  Fecha_Aplicacion: string;
  Registro_Contable: string;
  Asesor: string;
  ADV:  string;
  Fecha_Aprob_ADV: string;
  Fecha_2daAprob_ADV: string;
  Jefatura: string;
  Fecha_Aprob_Jefatura: string;
  Gerencia: string;
  Fecha_Aprob_Gerencia: string;
  Cumplimiento: string;
  Fecha_Aprob_Cumpl: string;
  Contabilidad: string;
  Fecha_Aprob_Contabilidad: string;
  Tesoreria: string;
  Fecha_Aprob_Tesoreria: string;
  Estado: string;
  Horas_Ultima_Aprobacion: string;
  Fecha_Cierre: string;

historial: Array<HistorialSolicitudResponse>;
usuario: Array<IUserResponse>;
}*/
export interface SolicitudReporteResponse {
  numero_NC_SAP: string;
  serie_NC_SAP: string;
  monto_Total_SAP: string;
  moneda_SAP: string;
  nro_Solicitud: string;
  tipoSolicitud: string;
  un: string;
  tienda: string;
  ceco: string;
  nro_SAP: string;
  comprobante: string;
  clienteRazonSocial: string;
  dniruc: string;
  fecha_Solicitud: string;
  importe: string;
  moneda: string;
  comentario: string;
  nro_NotaCredito: string;
  fecha_Aplicacion: string;
  registro_Contable: string;
  asesor: string;
  ADV: string;
  fecha_Aprob_ADV: string;
  fecha_2daAprob_ADV: string;
  jefatura: string;
  fecha_Aprob_Jefatura: string;
  gerencia: string;
  fecha_Aprob_Gerencia: string;
  cumplimiento: string;
  fecha_Aprob_Cumpl: string;
  contabilidad: string;
  fecha_Aprob_Contabilidad: string;
  tesoreria: string;
  fecha_Aprob_Tesoreria: string;
  estado: string;
  horas_Ultima_Aprobacion: string;
  fecha_Cierre: string;
  comentarioContabilidad: string;

  historial: Array<HistorialSolicitudResponse>;
  usuario: Array<IUserResponse>;
  banco:string;
  numeroCuenta:string;
  cciCuentaBancaria:string;
}
export type ISolicitudReporteResponse = Array<SolicitudReporteResponse>;
//END
export interface Solicitud2 {
    id: number;
    idTipoSolicitud: number;
    nroSap: string;
    clienteRazonSocial: string;
    dniClienteRuc: string;
    fechSolicitud: string;
    importe: string;
    moneda: string;
    unidadNegocio: string;
    tienda: string;
    centroCosto: string;
    comentario: string;
    tipo: string;
    estadoSolicitud: string;
    fechaCreacion: string;
    tipoSolicitud: Array<TipoSolicitud>;
    adjuntos: Array<Adjunto>;
    subEstadoSolicitud:string;
    motivo:string;
    comentarioAprobacion:string;

     numNotaCredito:string;
     archivoNotaCredito:string;
     docPorPlicar:string;
     nroSapTesoreria:string;
     fechaAplicacion:string;
    archivoTesoreria:string;
    comentarioContabilidad:string;



//Carta Cruzada
 tipoCarta :string;
 vinculo:string;
 banco :string;

 dniclienteRealiza :string;
 clienteRealiza :string;
solicitante :string;
formaPago :string;
numOperacion  :string;
//PAGO PDP
pjudicialPnatural:string;
proveedor:string;
cliente:string;
proyecto:string;
numeroArticuloSap:string;
descripcionArticuloSap:string;
numeroCuentaBancaria:string;
numeroCuentaInterbancaria:string;
entidadBancaria:string;
local:string;
area:string;
asesor:string;
tipoPago:string;
nroFacturaSunat:string;
archivoFactura:string;
tipoDocumento:string;
validacionContabilidad:string;
//audit

usuarioCreacion:string;
usuarioModificacion:string;
fechaModificacion:string;

usuario: Array<IUserResponse>;
//addicional
comprobanteOrigen:string

unidadNegocios: Array<UnidadNegocio>;
sede: Array<Sede>;
usuarioModifica: Array<IUserResponse>;
historial: Array<HistorialSolicitudResponse>;
asesorAsignado: string
//adicional
cciCuentaBancaria:string;
mRechazoMDevolucion:string;
}
export type ISolicitud2Response = Array<Solicitud2>;

export interface Solicitud {
  id: number;
        idTipoSolicitud: number;
        nroSap: string;
        clienteRazonSocial: string;
        dniClienteRuc: string;
        fechSolicitud: string;
        importe: string;
        moneda: string;
        unidadNegocio: string;
        tienda: string;
        centroCosto: string;
        comentario: string;
        tipo: string;
        estadoSolicitud: string; fechaCreacion:string;
}

export type ISolicitudAdvResponse = Array<Solicitud>;

////////////EEENDDD
export interface Dim_Categoria {
  intCategoria: number;
  vchNombreCategoria: string;
  dtmFechaCarga: string;
}
export type IDim_CategoriaResponse = Array<Dim_Categoria>;

export interface ProyectoItems{
  intProyectos: number;
  intEmpresa: number;
  intProyectoCategoria: number;
  intEtapas: number;
  intProyectoGeneral: number;
  vchNombreProyecto: string;
  vchFechaInicio: string;
  vchFechaFin: string;
  dmlMetrosCuadrados: number;
  vchFechaModificada: string;
  dcmPorcentajeUtilidadC: number;
  vchCoordenadas: string;
  dtmFechaCarga: string;
  vchGerenteObra: string;
  vchLogo: string;
  vchProyectoSSOMA: string;
  vchProyectoBS: string;
  vchProyectoAdm: string;
  vchProyectoGTC: string;
  vchProyectoProduccion: string;
  empresa:  Dim_Empresa;
  proyectoCategoria: Dim_ProyectoCategoria;
  proyectoGeneral: Dim_ProyectoGeneral;
  etapas: Dim_Etapas;
}
export type IProyectosResponses = Array<ProyectoItems>;

export interface Dim_Empresa {
  intEmpresa: number;
  vchNombreEmpresa: string
  dtmFechaCarga: string
  estadoEmpresa: boolean
}
export type IDim_EmpresaResponse = Array<Dim_Empresa>;

export interface Dim_ProyectoCategoria {
  intProyectoCategoria: number
  intCategoria: number
  vchNombreProyectoCategoria: string
  dtmFechaCarga: string
}
export type IDim_ProyectoCategoriaResponse = Array<Dim_ProyectoCategoria>;

export interface Dim_Etapas {
  intEtapas: number;
  intNetapas: number
  vchNombreEtapas: string
  dtmFechaCarga: string
}

export type IDim_EtapasResponse = Array<Dim_Etapas>;
export interface Dim_ProyectoGeneral {
  intProyectoGeneral: number;
  vchNombreProyectoGeneral: string
  dtmFechaCarga: string
}
export type IDim_ProyectoGeneralResponse = Array<Dim_ProyectoGeneral>;
export interface FactAppBQ31EPS {
  intFactAppBQ31EPS: number;
  intProyecto: number;
  intFecha: number;
  vchArea: string;
  intItem: number;
  vchTarea1: string;
  vchTarea2: string;
  vchTarea3: string;
  dtmFechaInicio: string;
  dtmFechaFin: string;
  intDias: number;
  intPeriodo: number;
  vchUsuario: string;
  dtmFechaCarga: string;
}

export type IFactAppBQ31EPSResponse = Array<FactAppBQ31EPS>;
export interface FactAppIMG_Detalle {
  intFactAppIMG_Detalle: number;
  intFactAppIMG: number;
  vchTitle: string;
  vchDescripcion: string;
  dtmFechaCarga: string;
}
export interface FactAppIMG {
    intFactAppIMG: number;
    intProyecto: number;
    intFecha: number;
    vchCategoria: string;
    vchDescripcion: string;
    dtmFechaCarga: string;
    detalleFoto?:Array<FactAppIMG_Detalle>;
}

export type IFactAppIMGResponse = Array<FactAppIMG>;

export interface Dim_Estatus {
  intEstatus?: string;
  vchEstatus?: string;
  dtmFechaCarga?: string;
};


export interface Dim_Prioridad {
  intPrioridad?: string;
  vchPrioridad?: string;
  dtmFechaCarga?: string;
};


export interface Dim_Etapa_App {
  intEtapa_App?: string;
  vchEtapa?: string;
  dtmFechaCarga?: string;
};


export type IDim_Etapa_AppResponse = Array<Dim_Etapa_App>;


export interface FactAppBQ32CP {
  intFactAppBQ32CP: number;
  intProyecto: number;
  intFecha: number;
  intItem: number;
  vchtipo1: string;
  vchdescripcion: string;
  intPlanNegocioMeta: number;
  intAlaFecha: number;
  intProyectado: number;
  intDiferencias: number;
  vchProyectadoEtapa: number;
  intPeriodo: number;
  vchUsuario: string;
  dtmFechaCarga: string;
}

export type IFactAppBQ32CPResponse = Array<FactAppBQ32CP>;

export interface FactAppBQ22EI {
  intFactAppBQ22EE: number;
  intProyecto: string;
  intTiempo: string;
  dtmFecha: string;
  dcmMeta: string;
  dcmProyeccion: string;
  vchUsuario: string;
  dtmFechaCarga: string;
}

export type IFactAppBQ22EIResponse = Array<FactAppBQ22EI>;

export interface Dim_Proyecto_HR {
  intProyecto_HR?: string;
  vchProyecto?: string;
};

export type IDim_Proyecto_HRResponse = Array<Dim_Proyecto_HR>;

export interface FactAppBQ22EE {
  intFactAppBQ22EE: number;
  intProyecto: string;
  intTiempo: string;
  dtmFecha: string;
  dcmMeta: string;
  dcmProyeccion: string;
  vchUsuario: string;
  dtmFechaCarga: string;
}

export type IFactAppBQ22EEResponse = Array<FactAppBQ22EE>;


export interface FactAppBQ23ER {
  intFactAppBQ23ER: number;
  intProyecto: string;
  intTiempo: string;
  intEtapa: string;
  intPrioridad: string;
  intEstatus: string;
  vchDenomincacionRiesgo: string;
  vchDescripcionRiesgo: string;
  vchResponsables: string;
  vchRespuestaRiesgo: string;
  vchUsuario: string;
  dtmFechaCarga: string;
  vchProbabilidad: string;
  vchDisparador: string;
  vchObjetivoAfectado: string;
  vchImpacto: string;
}

export interface FactAppBQ31GO {
  intFactAppBQ31GO: number;
  intProyecto: number;
  intFecha: number;
  intItem: number;
  vchTarea1: string;
  vchTarea2: string;
  vchTarea3: string;
  vchArea: string;
  vchResponsable: string;
  dtmFechaInicio: string;
  dtmFechaFin: string;
  intDias: number;
  intPeriodo: number;
  dtmFechaCarga: string;
}
export type IFactAppBQ31GOResponse = Array<FactAppBQ31GO>;

export type IFactAppBQ23ERResponse = Array<FactAppBQ23ER>;
export interface Dim_Usuarios {
  intUsuario: number;
  intProyecto: number;
  vchUsuario: string;
  vchClave: string;
  vchEstado: boolean;
  dtmFechaRegistro: string;
  dtmFechaActualizacion: string;
  vchUsuarioRegistro: string;
  vchArea: string;
  intIdUsuario: number;
}

export type IDim_UsuariosResponse = Array<Dim_Usuarios>;
export interface FactResultadosCPISPI {
  intFactResultadosCPISPI: number;
  intFecha: number;
  intProyecto: number;
  intestado: number;
  dcmMetrosCuadrados: number;
  dcmPorcUtilidadC: number;
  dcmResultadoCPI: number;
  dcmAccionPreCorrCPI: number;
  dcmResultadoSPI: number;
  dcmAccionPreCorrSPI: number;
  vchUsuario: string;
  dtmFechaRegistro: string;
}
export type IFactResultadosCPISPIResponse = Array<FactResultadosCPISPI>;

export interface FactDirectorio {
  intFactDirectorio: number;
  intTiempo: number;
  intProyecto: number;
  dcmMetroCuadrado: number;
  dcmPorcentajeUtil: number;
  vchUsuario: string;
  vchEmail: string;
  dcmAcumPresupuesto: number;
  dmcAcumCostoReal: number;
  dmcAcumProyectadoCostoReal: number;
  dmcAcumAvanceValorizado: number;
  dmcProyeccionCRCierre: number;
  dmcAcumProyectadoValorizado: number;
  dtmMes: string;
  vchModificado: string;
  intID: number;
  dtmFechaCarga: string;
}

export type IFactDirectorioResponse = Array<FactDirectorio>;

export interface FactAdicionales {
  intAdiciones: number;
  intTiempo: number;
  intProyecto: number;
  intTipoAdicionales: number;
  vchUsuario: string;
  vchEmail: string;
  dcmMontoOcultos: number;
  dcmMontoInmobilaria: number;
  dcmMontoDeductivos: number;
  vchComentarios: string;
  dtmFechaCarga: string;
  dcmMetroCuadrados: number;
  dcmPorcentajeUtlidad: number;
  vchEstado: string;
  adicionales?:Array<Dim_TipoAdicionales>;
}

export type IFactAdicionalesResponse = Array<FactAdicionales>;
export interface Dim_TipoAdicionales {
  intTipoAdicionales: number;
  vchNombreTipo: string;
  dtmFechaCorte: string;
}
export type IDim_TipoAdicionalesponse = Array<Dim_TipoAdicionales>;

export interface FactMargenes {
  intMargenes: string;
  intTiempo:string;
  intProyecto: string;
  vchDescripcion: string;
  dcmMontoAcumulado: string;
  dcmMontoProyectadoCierre: string;
  vchDetalleAcumuladoMes: string;
  vchDetalleProyectadoMes:string;
  dtmFechaCarga: string;
  dcmMetroCuadrados: string;
  dcmPorcentajeUtlidad: string;
  vchEstado:string;
}

export type IMargenResponse = Array<FactMargenes>;

export interface IRolResponse {
  id?: number;
  nombre?: string;
};
export interface IUserResponse {
  id?: number;
  nombre?: string;
  correo?: string;
  estado?: string;
  rol?: IRolResponse;
  idUnidadNegocio? : string;
};
//USUARIOS Y ROLES
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  estado: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string;
  fechaModificacion: string;
  idUnidadNegocio: number;
  roles: RolUsuario[];
}

export interface RolUsuario {
  id: number;
  usuarioId: number;
  rolId: number;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string;
  fechaModificacion: string;
  idUnidadNegocio: number;
  idSede: number;
  rol: Rol;
  unidad: UnidadNegocio;
  sede: Sede;
}

export interface Rol {
  id: number;
  nombre: string;
}

export interface UnidadNegocio {
  id: number;
  descripcion: string;
  estado: number;
  usuarioCreacion: string;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface Sede {
  id: number;
  descripcion: string;
  estado: number;
  usuarioCreacion: string;
  fechaCreacion: string;
  fechaModificacion: string;
}
//END
export type IUsersResponse = Array<Usuario>;//IUserResponse>;
export type IRolesResponse = Array<IRolResponse>;

export interface FactAppBq22Ins {
  intFactAppBq22Ins: number;
  intProyecto: number;
  intTiempo: number;
  vchEtapaZona: string;
  vchDescripcion: string;
  dtmFechaInicio: string;
  dtmFechaFin: string;
  vchUsuario: string;
  dtmFechaCarga: string;
}
export interface FactAppBq21AP {
  intFactAppBq21AP: number;
  intProyecto: number;
  intTiempo: number;
  vchArea: string;
  vchEtapaZona: string;
  vchDescripcion: string;
  dtmFechaInicio: string;
  dtmFechaFin: string;
  vchUsuario: string;
  dtmFechaCarga: string;
}
export interface FactAppBq22Ins {
  intFactAppBq22Ins: number;
  intProyecto: number;
  intTiempo: number;
  vchEtapaZona: string;
  vchDescripcion: string;
  dtmFechaInicio: string;
  dtmFechaFin: string;
  vchUsuario: string;
  dtmFechaCarga: string;
}

export type IFactAppBq22Ins = Array<FactAppBq22Ins>;

export type IFactAppBq21AP = Array<FactAppBq21AP>;

export interface FactGTCIndicadoresCalidad_DetalleFotos {
  intFactGTCIndicadoresDetalle: number;
  intFactGTCIndicadoresCalidad: number;
  vchNombreArchivo: string;
  dtmFechaCarga: string;
}
export interface FactGTCIndicadoresCalidad {
  intFactGTCIndicadoresCalidad: number;
  intProyecto: number;
  intTiempo: number;
  dcmIndObservaciones: number;
  dcmIndCapacitaciones: number;
  dcmIndResponsabilidades: number;
  vchCumplimientoRespon: string;
  vchDescripcionCumplim: string;
  dcmNumeroObservaciones: number;
  dcmNumeroCapacitaciones: number;
  vhcLink: string;
  dcmHHCapacitadas: number;
  dcmCapacitacionesInternas: number;
  dcmCapacitacionesExternas: number;
  dtmFechaCarga: string;


  nombreCapacitacionExterna: string;
  vchMotivoReprogramaciones: string;
  dcmCumpTotal: string;
  dcmCumpRACIdec: string;
  dcmCumResPrev: string;
  dcmCumpRespCapa: string;
  vchEsanyoGeotina: string;
  vchEnsayoConcreto : string;
  vchEnsayoPruebas: string;
  vchRevisionMateCriticos: string;
  vchMotivoRechazo: string;


  detalleFoto?: Array<FactGTCIndicadoresCalidad_DetalleFotos>;
}
export type IFactGTCIndicadoresCalidad = Array<FactGTCIndicadoresCalidad>;

  export interface DetallePanelFotoGrafico {
    intDetallePanelFotoGrafico:number,
    intFactPanelFotoGrafico: number;
    vchArchivo: string;
    dtmFechaCarga?: any;
}

export interface FactPanelFotoGrafico {
    intFactPanelFotoGrafico: number;
    intProyecto: number;
    intTiempo: number;
    vchMotivoFoto: string;
    vchDescripcion: string;
    vchUsuario: string;
    dtmFechaCarga?: any;
    vchArea: string;
    detallePanelFotoGrafico?: Array<DetallePanelFotoGrafico>;
}
export interface FactOtResultadosGenerales {
  intFactOTResultadoGenerales: number;
  intTiempo: number;
  intProyecto: number;
  intIndicadores: string;
  vchArea: string;
  vchFrecuencia: string;
  dcmCriterioMin: number;
  dcmCriterioMax: number;
  dcmResultado: string;
  dcmPonderado: number;
  vchAccionPreventiva: string ;
  vchUsuario: string;
  dtmFechaCarga: string;
}

export type IFactOtResultadosGeneralesResponse = Array<FactOtResultadosGenerales>;
export type IFactPanelFotoGraficoResponse = Array<FactPanelFotoGrafico>;

export interface DetalleLeccionesAprendidas {
  intDetalleLecApren: number;
  intFactLeccionesApre: number;
  vchFotos: string;
  dtmFechaCarga: string;
}
export interface ILeccionAprendidaResponse {
  intProyectos: number;
  dtmMes: string;
  vchUsuario: string;
  vchPartidaProceso: string;
  dtmFecha: string;
  vchNombreUsuario: string;
  vchArea: string;
  vchPregunta1QuePaso: string;
  vchPregunta2ComoSeSoluciono: string;
  vchPregunta3QueSeAprendio: string;
  vchElaboradoNombre: string;
  vchElaboradoPorEmail: string;
  vchElaboradoPorPuesto: string;
  vchFoto: string;
  intIndice: string;
  dtmFechaCarga: string;
  vchTipoArea:string;
  detalleLecionesAprendidas?:Array<DetalleLeccionesAprendidas>;
}




export type ILeccionesAprendidasResponse = Array<ILeccionAprendidaResponse>;
export interface IFactRRhhReportPersonal {
  intRRhhReportPersonal?: number;
  intFecha?:  number;
  intProyectos?:  number;
  intContrata?:  number;
  intArticulos:  number;
  dmlValor?:  number;
  dtmFechaCargaMes?:  string;
  dtmFechaCarga?: string;
  vchUsuario?:  string;
  dtmFechaRegistro?: string;
  atributos:Array<Atributo>;
}
export interface Atributo {
  intArticulo: number;
  vchNombreAtributo: string;
  dtmFechaCarga: string;
}
export type IFactRRhhReportPersonalResponse = Array<IFactRRhhReportPersonal>;
export interface FactSubContrataciones {
  intSubContracionesid: number;
  intFecha: number;
  intProyecto: number;
  intSubContrista: number;
  intContrata: number;
  intQEmpleados: number;
  dtmFecha: string;
  vchCodigo: number;
  subContratista:Array<SubContratista>;
}
export interface SubContratista {
  intSubContratista: number;
  vchEmpresa: string;
  dtmFechaCarga: string;
}
export type IFactSubContratacionesResponse = Array<FactSubContrataciones>;
export interface IProyectoResponse {
  intProyectos?: string;
  intEmpresa?: string;
  intProyectoCategoria?: string;
  intEtapas?: string;
  intProyectoGeneral?: string;
  vchNombreProyecto?: string;
  vchFechaInicio?: string;
  vchFechaFin?: string;
  dmlMetrosCuadrados?: string;
  vchFechaModificada?: string;
  dcmPorcentajeUtilidadC?: string;
  vchCoordenadas?: string;
  dtmFechaCarga?: string;
};

export type IProyectosResponse = Array<IProyectoResponse>;

export interface ITiempoResponse {
  intTiempo?: number;
  intPeriodo?: number;
  dtmFecha: Date;
  intAnio?: number;
  intMes?: number;
  intDia?: number;
  intTrismestre?: number;
  vchDescripcionMes?: string;
  vchNDia?: string;
  vchNMNes3L?: string;
  vchNombreDia?: string;
}

export interface Dim_Etapa_Zona{
  intEtapaZona?:number,
  vchEtapaZona?:string,
   dtmFechaCarga?:string
}
export type IDim_Etapa_ZonaResponse = Array<Dim_Etapa_Zona>;



export interface IPeriodo{
  intPeriodo?:number,
  vchNMNes3L?:string
}
export type ITiemposResponse = Array<ITiempoResponse>;
export type IPeriodoResponse = Array<IPeriodo>;
export interface ISubContratistaResponse {
  intSubContratista: number;
  vchEmpresa: string;
  dtmFechaCarga: Date;
}

export interface IFactBSDataResponse {
intFactBSData: string;
intFecha: string;
intProyecto: string;
vchSatisfaccionLaboral: string;
intPoblacion: string;
intEncuestados: string;
vchSatisfaccionDeseada: string;
vchSatisfaccionModerada: string;
vchIsatisfaccion: string;
vchFechaActualizada: string;
vchSustentos: string;
intQEncuestados: string;
dtmFechaCarga: string;
}
export type IFactBSDatasResponse = Array<IFactBSDataResponse>;

export interface IProcesoCargaResponse {
  intProcesoCarga: number;
  intUsuario: number;
  intProyecto: number;
  intEstado: number;
  dtmFechaInicio: string;
  dtmFechaFin: string;
  vchNombreArchivo: string;
  vchTipoArea: string;
  proyecto?:Array<Proyecto>;
}


export type IFactRRHHCurvaPersonalResponse = Array<FactRRHHCurvaPersonal>;

export interface FactRRHHCurvaPersonal {
    intCurvaPersonal: number;
    intFecha: number;
    intProyecto: number;
    intContrata: number;
    dtmFechaInico: string;
    dtmFechaFinal: string;
    intSemana: number;
    vchAnioSemana: string;
    intObreros: number;
    dmlSalidas: number;
    dmlIngresos: number;
    dmlAcumulado: number;
    vchDescripcionSemana: string;
    dtmFechaCorte: string;
    vchUsuario: string;
    dtmFechaCarga: string;
    proyecto?:Proyecto;
}
export interface Proyecto {
  intProyectos?: number;
  intEmpresa?: number;
  intProyectoCategoria?: number;
  intEtapas?: number;
  intProyectoGeneral?: number;
  vchNombreProyecto?: string;
  vchFechaInicio?: string;
  vchFechaFin?: string;
  dmlMetrosCuadrados?: number;
  vchFechaModificada?: string;
  dcmPorcentajeUtilidadC?: number;
  vchCoordenadas?: string;
  dtmFechaCarga?: string;
}

export type IProcesoCargasResponse = Array<IProcesoCargaResponse>;

export type ISubContratistasResponse = Array<ISubContratistaResponse>;
export interface IOrderRequestItem {
  numeroDocumentoSap?: number;
  idDocumento?: number;
  unidadNegocio?: string;
  tienda?: string;
  nroPlaca?: string;
  procedencia?: string;
  tipoDeCompra?: string;
  tipoDeCompraDes?: string;
  nroAvisoTdp?: string;
  solicitante?: string;
  docStatus?: string;
  tipo?: string;
  fechaDeSolicitud?: string;
  centroDeCosto?: string;
  detalleSolicitud?: Array<IOrderRequestArticle>;
}
export interface IFacturaRequestItem {
   id?: number;
   idproveedor?: number;
  numpedido?: string;
  archivopdf?: string;
  archivoxml?: string;
  centrocosto?: string;
  codigoproyecto?: string;
   fechacarga?: string;
  estadofactura?: string;
   fecharegistro?: string;
   fechamodificacion?: string;
  usuariocreacion?: number;
  usuariomodificacion?: number;
  estado?: number;

  numfactura?: string;
  fechaemision?: string;
  subtotal?: number;
  igv?: number;
  importetotal?: number;
  //datos Guia emision
  numguia?: string;
  fechaguia?: string;
  grupodetraccion?: string;
  motivorechazo?: string;
  FacturaDetalle?: Array<FacturaDetalleResponse>;
}

export interface FacturaDetalleResponse {
  id: number;
  idfactura: number;
  rucemisor: string;
  nombreemisor: string;
  fechapedidocompraemisor: string;
  compradoremisor: string;
  rucdest: string;
  nombredest: string;
  condicionpagodest: string;
  divisadest: string;
  fecharegistro: string;
  fechamodificacion: string;
  usuariocreacion: number;
  usuariomodificacion: number;
  estado: number;
}
export interface IOrderRequestArticle {
  id?: number;
  numeroDocumentoSap?: number;
  cantidad?: number;
  codigoArticulo?: string;
  descripcionArticulo?: string;
  codigoAlmacen?: string;
  icc?: string;
  accion?: string;
  codTraslado?: number;
  codPedido?: string;
  numPedido?: string;
  codPedidoA?: string;
  numPedidoA?: string;
  codPedidoM?: string;
  numPedidoM?: string;
  saldoPedido?: number;
  stockProcesado?: number;
  accionRPA?: string;
  subAccionRPA?: string;
  descripcion?: string;
  fechaPedido?: string;
  errTraslado?: number;
  observacion?: string;
  concesionario?: string;
  usuarioModificacion?: string;
  almacenes?: Array<IOrderRequesttStore>;
}

export interface IOrderRequesttStore {
  codigoAlmacen?: string;
  enStock?: string;
  nombreAlmacen?: string;
}
export interface IFilesResponse {
  files?: any;
}

export type IOrderRequestResponse = Array<IOrderRequestItem>;

export type IFacturaRequestResponse = Array<IFacturaRequestItem>;

export interface ISolicitudSearchRequest {
  tienda?: string;
  accionRPA?: string;
  fechaDeSolicitudInicio?: string;
  fechaDeSolicitudFin?: string;
  numeroDocumentoSap?: string;
  nroPlaca?: string;
  codigoArticulo?: string;
}
export interface IFacturaSearchRequest {
  fechaDeSolicitudInicio?: any;
  fechaDeSolicitudFin?: any;
  id_user?:any
}
export interface ISolicitudActionRpaRequest {
  articuloSolicitudId?: number;
  accionRPA?: string;
  usuario?: string;
}

export interface ISolicitudSubActionRpaRequest {
  articuloSolicitudId?: number;
  subAccionRPA?: string;
  usuario?: string;
}

export interface ISolicitudObservacionRpaRequest {
  articuloSolicitudId?: number;
  observacion?: string;
  usuario?: string;
}

export interface ISolicitudResponse {
  status?: number;
  json?: any;
}
