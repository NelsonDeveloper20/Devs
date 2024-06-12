 
 
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


export interface Dim_Empresa {
  intEmpresa: number;
  vchNombreEmpresa: string
  dtmFechaCarga: string
  estadoEmpresa: boolean
}
export interface Dim_ProyectoCategoria {
  intProyectoCategoria: number
  intCategoria: number
  vchNombreProyectoCategoria: string
  dtmFechaCarga: string
}

export interface Dim_Categoria {
  intCategoria: number;
  vchNombreCategoria: string;
  dtmFechaCarga: string;
}

export interface Dim_Etapas {
  intEtapas: number;
  intNetapas: number
  vchNombreEtapas: string
  dtmFechaCarga: string
}
export interface Dim_ProyectoGeneral {
  intProyectoGeneral: number;
  vchNombreProyectoGeneral: string
  dtmFechaCarga: string
}
export interface FactOtResultadosGenerales {
  intFactOTResultadoGenerales: number;
  intTiempo: number;
  intProyecto: number;
  intIndicadores: string;
  vchArea: string
  vchFrecuencia: string
  dcmCriterioMin: number
  dcmCriterioMax: number
  dcmResultado: string;
  dcmPonderado: number
  vchAccionPreventiva: string;
  vchUsuario: string
  dtmFechaCarga: string
}

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
export interface FactSubContrataciones {
  intSubContracionesid: number
  intFecha: number
  intProyecto: number
  intSubContrista: number
  intContrata: number
  intQEmpleados: number;
  dtmFecha: string
  vchCodigo: number
  subContratista:Array<SubContratista>; 
}
export interface SubContratista {
  intSubContratista: number;
  vchEmpresa: string;
  dtmFechaCarga: string;
}
export interface Atributo {
  intArticulo: number;
  vchNombreAtributo: string;
  dtmFechaCarga: string;
}
export interface IFactRRhhReportPersonal {
  intRRhhReportPersonal?: number;
  intFecha?:  number;
  intProyectos?:  number;
  intContrata?:  number;
  intArticulos?:  number;
  dmlValor?:  number;
  dtmFechaCargaMes?:  string;
  dtmFechaCarga?: string;
  vchUsuario?:  string;
  dtmFechaRegistro?: string;
  atributos?:Array<Atributo>;
}
export interface FactRRHHCurvaPersonal {
  intCurvaPersonal: number;
  intFecha: number
  intProyecto: number
  intContrata: number
  dtmFechaInico: string;
  dtmFechaFinal: string;
  intSemana: number
  vchAnioSemana: string
  intObreros: number
  dmlSalidas: number
  dmlIngresos: number
  dmlAcumulado: number
  vchDescripcionSemana: string
  dtmFechaCorte: string
  vchUsuario: string
  dtmFechaCarga: string; 
  proyecto?:Proyecto2;
}
export interface DetalleLeccionesAprendidas {
  intDetalleLecApren: number;
  intFactLeccionesApre: number;
  vchFotos: string
  dtmFechaCarga: string
}
export interface ILeccionAprendidaResponse {
  intProyectos: number;
  dtmMes: string
  vchUsuario: string
  vchPartidaProceso: string
  dtmFecha: string
  vchNombreUsuario: string
  vchArea: string
  vchPregunta1QuePaso: string
  vchPregunta2ComoSeSoluciono: string
  vchPregunta3QueSeAprendio: string
  vchElaboradoNombre: string
  vchElaboradoPorEmail: string
  vchElaboradoPorPuesto: string
  vchFoto: string
  intIndice: string
  dtmFechaCarga: string
  vchTipoArea: string
  detalleLecionesAprendidas?:Array<DetalleLeccionesAprendidas>; 
}
export interface IProcesoCarga {
  intProcesoCarga: number;
  intUsuario: number
  intProyecto: number
  intEstado: number
  dtmFechaInicio: string
  dtmFechaFin: string
  vchNombreArchivo: string
  vchTipoArea: string
  proyecto?:Array<Proyecto2>;
} 
 export interface Proyecto2 {
  intProyectos?: number;
  intEmpresa?: number
  intProyectoCategoria?: number
  intEtapas?: number
  intProyectoGeneral?: number
  vchNombreProyecto?: string
  vchFechaInicio?: string
  vchFechaFin?: string
  dmlMetrosCuadrados?: number
  vchFechaModificada?: string
  dcmPorcentajeUtilidadC?: number
  vchCoordenadas?: string
  dtmFechaCarga?: string
}
export interface MotivacionTrabajoElement1 {
  Poblacion: string;
  Encuestados: string;
  SatisfaccionDeseada: string; 
  SatisfaccionModerada: string; 
  SustentosResultados: string;
}
export interface MotivacionTrabajoElement2 {
  Poblacion2: string;
  Encuestados2: string;
  SatisfaccionDeseada2: string; 
  SatisfaccionModerada2: string; 
  SustentosResultados2: string;
}
export interface MotivacionTrabajoElement3 {
  Poblacion3: string;
  Encuestados3: string;
  SatisfaccionDeseada3: string; 
  SatisfaccionModerada3: string; 
  SustentosResultados3: string;
}
export interface MotivacionTrabajoElement4 {
  Poblacion4: string;
  Encuestados4: string;
  SatisfaccionDeseada4: string; 
  SatisfaccionModerada4: string; 
  SustentosResultados4: string;
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
export interface ISubContratistaResponse { 
  intSubContratista: number;
  vchEmpresa: string;
  dtmFechaCarga: Date;
}
export class SubContratistaR { 
  intSubContratista!: number;
  vchEmpresa!: string;
  dtmFechaCarga!: Date;
} 
export interface Proyecto {
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
  }
  
  export interface Tiempo {
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

  export interface Periodo{
    intPeriodo?:number,
    vchNMNes3L?:string
  }
  
  export interface IApiResponse {
    status?: number;
    json?: any;
  }
  export interface Dim_Etapa_Zona{
    intEtapaZona?:number,
    vchEtapaZona?:string,
     dtmFechaCarga?:string
  }