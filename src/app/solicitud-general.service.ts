import { Injectable } from '@angular/core';
import { IComprobante } from './op-con-nota-credito/vh-anulacion-nuevocomprobante/comprobante.model';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from './services/service.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Solicitud2 } from './services/request.model';import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { RequestService } from './services/request.service';
import { HistorialSolicitud } from './historial-solicitud/historialsolicitud.model';
//import { IComprobante, IProveedor } from './comprobante.model';
export interface TablaModelo {
  id:string,
  texto: string;
  archivo: File;
  nombrearchivo:string;
  tipo:string;
}
const ELEMENT_DATA: TablaModelo[] = [];
@Injectable({
  providedIn: 'root'
})
export class SolicitudGeneralService {
  datePipe: DatePipe;
  private urlBase: string;
  constructor(private http: HttpClient,
    private requestService: RequestService ) {
    this.urlBase = `${environment.baseUrl}/api/`;
     this.datePipe = new DatePipe('en-US');
    }

    transform(fecha: string): string {
      // Verificar si la fecha ya está en el formato esperado (dd/MM/yyyy)
      if (fecha.includes('/') && fecha.split('/').length === 3) {
        return fecha; // Devolver la fecha sin cambios
      } else {
        // Verificar si la fecha está en el formato largo (Tue Jun 13 2023 00:00:00 GMT-0500)
        if (isNaN(Date.parse(fecha))) {
          // Aplicar el formato del DatePipe al formato largo de fecha
          const dateObj = new Date(fecha);
          // Nota: Asegúrate de importar el DatePipe en el archivo correspondiente
          // import { DatePipe } from '@angular/common';
          const datePipe = new DatePipe('en-US');
          return datePipe.transform(dateObj, 'dd/MM/yyyy');
        } else {
          // Aplicar el formato del DatePipe al formato dd/MM/yyyy
          // Nota: Asegúrate de importar el DatePipe en el archivo correspondiente
          // import { DatePipe } from '@angular/common';
          const datePipe = new DatePipe('en-US');
          return datePipe.transform(fecha, 'dd/MM/yyyy');
        }
      }
    }

    //REGISTRO
  RegistrarSolicitudBDGeneral(unidadSeleccionada:{},user: IComprobante,EstadoSolicitud:string,filasData:TablaModelo[],
    tipoSolicitud:string,asesorselecionado?:string
    ): Observable<IApiResponse>{
console.log("TIPO SOLICITD BD ===>:"+tipoSolicitud);
    const formData = new FormData();
    formData.append('id', user.id);
    formData.append('nrosap', user.nrosap);
    formData.append('clienterazonsocial', user.clienterazonsocial);
    formData.append('dniclienteruc', user.dniclienteruc);

  const value = user.fechsolicitud;
  var fechFormat=this.transform(value);// this.datePipe.transform(value, 'dd/MM/yyyy');

    formData.append('fechsolicitud',fechFormat);// user.fechsolicitud);
    formData.append('importe', user.importe);
    formData.append('moneda', user.moneda);
    formData.append('unidadnegocio', user.unidadnegocio);
    formData.append('tienda', user.tienda);
    formData.append('centrocosto', user.centrocosto);
    formData.append('comentario', user.comentario);
    formData.append('tipo', user.tipo);
    formData.append('tiposolicitud', tipoSolicitud);
    formData.append('estadosolicitud',  EstadoSolicitud);
    const idUsuario = localStorage.getItem('ByUser');
    formData.append('ussercreacion', idUsuario);
    //  Anulación por anticipo para devolución al cliente / error de pago
    formData.append('tipodocumento',user.tipodocumento);
    formData.append('formaPago', user.formaPago);
    formData.append('entidadBancaria', user.entidadBancaria);
    formData.append('numeroCuentaBancaria', user.numeroCuentaBancaria);
    formData.append('UnidadNegocioselect',JSON.stringify(unidadSeleccionada));
    formData.append("comprobanteOrigen",user.comprobanteOrigen);
    formData.append("asesorselecionado",asesorselecionado);
    formData.append("cciCuentaBancaria",user.cciCuentaBancaria); 
    for (let i = 0; i < filasData.length; i++) {
      if (filasData[i].archivo) {
        formData.append(`texto[${i}]`, filasData[i].texto);
        formData.append(`archivo[${i}]`, filasData[i].archivo);
      } else {
        formData.append(`texto[${i}]`, filasData[i].texto);
        // Adjuntar un valor ficticio para indicar que no hay archivo adjunto
        formData.append(`archivo[${i}]`, null);
      }
    }
    return this.http.post<IApiResponse>(  this.urlBase + 'Solicitud',   formData   );

  }
  //CAMBIO ESTADO
EnviarBDGeneral(user: IComprobante,paso,estado,subestado,motivo,motivorechazodevolucion?:string){
  var idUsuario= localStorage.getItem('ByUser');
  var parametros="&paso="+paso+"&estado="+estado+"&subestado="+subestado+"&motivo="+motivo+"&motivorechazodevolucion="+motivorechazodevolucion;
  return this.http.put<IApiResponse>(
  this.urlBase + 'Solicitud?usuario='+idUsuario+'&id='+user.id+parametros,{}
  );
}
// ENVIO A TESORERIA

EnvioTesoreriaGeneral(itemsolicitud: Solicitud2,  nroNotaCredito: string,archivoNotaCredito: File,
  archivoPorAplicar: File  | undefined = undefined,advFinalizacion: string  | undefined = undefined){
  const formData: FormData = new FormData();
  formData.append('id', itemsolicitud.id.toString());
  formData.append('numero', nroNotaCredito);
  formData.append('estado', "Revision Tesoreria");
  formData.append('archivo', archivoNotaCredito);
  formData.append('archivoporaplicar', archivoPorAplicar);
  formData.append('finalizaadv', advFinalizacion);
  var idUsuario= localStorage.getItem('ByUser');
  formData.append("ussercreacion",idUsuario);

  return this.http.put<IApiResponse>(
    this.urlBase + 'SolicitudArchivo',formData
    );

}
AplicarTesoreriaGeneral(itemsolicitud: Solicitud2,fechaAplicacion:string,numSap:string,archivoTesoreria: File){
  const formData: FormData = new FormData();

  const value = fechaAplicacion;
   var fechFormat= this.datePipe.transform(value, 'dd/MM/yyyy');
  formData.append('id', itemsolicitud.id.toString());

  formData.append('fecha',fechFormat);// fechaAplicacion.toString());
  formData.append('nrosap', numSap);
  formData.append('estado', "Aplicado Tesoreria");
  formData.append('archivo', archivoTesoreria);
  var idUsuario= localStorage.getItem('ByUser');
  formData.append("ussercreacion",idUsuario);

  return this.http.post<IApiResponse>(
    this.urlBase + 'SolicitudTesoreria',formData
    );

}

ObservarTesoreriaGeneral(itemsolicitud: Solicitud2,motivoDevolucion:string){

  var idUsuario= localStorage.getItem('ByUser');
  return this.http.put<IApiResponse>(
    this.urlBase + 'SolicitudTesoreria?id='+itemsolicitud.id+"&motivo="+motivoDevolucion+"&usuario="+idUsuario,{}
    );

}
validationRol(estadoSolic:string,itemsolicitud:Solicitud2,rolUser:string,idUser:string){

var idUser=localStorage.getItem('ByUser');

const jsonString = localStorage.getItem('RolsUser');
const jsonObject = JSON.parse(jsonString);
var roles = '';
jsonObject.forEach(element => {
  roles += element.rol.nombre + ',';
});


var AccionVisible=false;
const rolesUsuario = roles.split(',').map(rolitem => rolitem.trim().toLowerCase());
 
switch (estadoSolic) {
  case 'Registrado':
    var usuarioCreacion = itemsolicitud.usuarioCreacion;
    if (idUser == usuarioCreacion) {
      AccionVisible = true;
    }
    break;
  case 'Revision ADV':
  if (rolesUsuario.includes('ADV'.toLowerCase())) {
    AccionVisible = true;
  }
  break;
  case 'Validacion ADV':
    if (rolesUsuario.includes('ADV'.toLowerCase())) {
      AccionVisible = true;
    }
    break;
  case 'Revision Cumplimiento':
    if (rolesUsuario.includes('Cumplimiento'.toLowerCase())) {
      AccionVisible = true;
    }
    break;
  case 'Revision Gerencia':
    if (rolesUsuario.includes('Gerencia'.toLowerCase())) {
      AccionVisible = true;
    }
    break;
  case 'Revision Contabilidad':
    if (rolesUsuario.includes('Cumplimiento'.toLowerCase())) {
      AccionVisible = true;
    }
    if (rolesUsuario.includes('Contabilidad'.toLowerCase())) {
      AccionVisible = true;
    }
    break;
  case 'Rechazado Contabilidad':
  case 'Revisado Conforme SAP':
    if (rolesUsuario.includes('Contabilidad EPDP'.toLowerCase())) {
      AccionVisible = true;
    }
    // agregado por roy
    if (rolesUsuario.includes('Tesorería'.toLowerCase())) {
      AccionVisible = true;
    }
    break;



  case 'Revision Contabilidad EPDP':
    if (rolesUsuario.includes('Contabilidad EPDP'.toLowerCase())) {
      AccionVisible = true;
    }
    break;


  case 'Aprobaciones':
    if (rolesUsuario.includes('Jefatura'.toLowerCase())) {
      AccionVisible = true;
    }
    /* comentado
    if(rolesUsuario.includes('Gerencia'.toLowerCase())) {
      AccionVisible = true;
    }*/
    break;



  case 'Revision Tesoreria':
    if (rolesUsuario.includes('Tesorería'.toLowerCase())) {
        AccionVisible = true;
    }
    break;
  case 'Aplicado Tesoreria':
  case 'Observado Tesoreria':
    if (rolesUsuario.includes('Tesorería'.toLowerCase())) {
      AccionVisible = true;
    }
    break;
  case 'Rechazado Jefatura':
  case 'Revision Jefatura':
    if (rolesUsuario.includes('Jefatura'.toLowerCase())) {
      AccionVisible = true;
    }
    break;
  case 'Rechazado Gerencia':
    //if (rolesUsuario.includes('Gerencia'.toLowerCase())) {
      //AccionVisible = true;
    //}
    //break;
  case 'IniciarSolicitud':
    AccionVisible = true;
    break;
  default:
    AccionVisible = false;
    break;
}

  return AccionVisible;
}

descargararchivo(nombre:string ){
  const formData = new FormData();
  formData.append("nombre",nombre);
  // Realiza la solicitud POST al backend
  this.http.post(this.urlBase + 'SolicitudArchivo', formData, { responseType: 'blob' })
    .subscribe((blob: Blob) => {
      let filename = nombre; // Nombre por defecto
      // Crea un enlace temporal para iniciar la descarga
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download =  filename; // Nombre del archivo a descargar
      downloadLink.click();
      // Libera el objeto URL creado para la descarga
      window.URL.revokeObjectURL(url);
    });
}

getHistorialSolicitud(id:any): Observable<HistorialSolicitud[]> {
   return this.requestService.getHistorialSolicitudAdvEstado(id).pipe();
}
verHistorialPorEstado(estado: string,solicitudHistorial: Array<HistorialSolicitud> ,itemsolicitud: Solicitud2 ) {
  var estadoSearch=estado;
  /*switch (estado) {
    case 'Registrado':
      estadoSearch=estado;
      break;
    case 'Revision ADV':
      estadoSearch='Aprobaciones';
      break;
    case 'Aprobaciones':
      estadoSearch='Revision Contabilidad,Revision Cumplimiento';
      break;
    case 'AprobacionesCumplimiento':
    estadoSearch='Revision Cumplimiento';
    break;
    case 'Rechazado Jefatura':
      estadoSearch=estado;
      break;
    case 'Revision Contabilidad':
      estadoSearch='Validacion ADV';
      break;
    case 'Revision Contabilidad EPDP':
      estadoSearch='Revision Contabilidad';
    break;
    case 'Validacion ADV':
  this.EditAtribFinales=false;
      if(itemsolicitud?.estadoSolicitud=="Revision Tesoreria"){
        estadoSearch='Revision Tesoreria';
      }else{

        estadoSearch=estado;
      }
      break;
    case 'Rechazado Contabilidad':
      estadoSearch=estado;
      break;
    case 'Revision Tesoreria':
  this.EditAtribFinales=false;
      estadoSearch='Aplicado Tesoreria';
      break;
    case 'Aplicado Tesoreria':
      estadoSearch=estado;
      break;
    case 'Observado Tesoreria':
      estadoSearch=estado;
      break;
    case 'Revision Jefatura':
      estadoSearch=estado;
      break;
    case 'Revision Cumplimiento':
      estadoSearch=estado;
      break;
    case 'Rechazado Cumplimiento':
      estadoSearch=estado;
      break;
    case 'Rechazado Gerencia':
      estadoSearch=estado;
      break;
    case 'Revisado Conforme SAP':
      estadoSearch=estado;
      break;
    case 'IniciarSolicitud':
    estadoSearch=estado;
      break;
    case 'Cumplimiento':
      estadoSearch='Revision Contabilidad';
        break;
    default:
      estadoSearch=estado;
      break;
      }

      */


switch (estadoSearch) {
  case "Revision Tesoreria":
  case "Aplicado Tesoreria":
    estadoSearch = "Revision Tesoreria,Aplicado Tesoreria,Observado Tesoreria";
    break;
  default :
  estadoSearch=estadoSearch;
  break;
}

      var estadosBusqueda = estadoSearch.split(',');
const historialFiltrado = solicitudHistorial.filter(item =>
  item.paso && estadosBusqueda.some(estado => item.paso.includes(estado.trim()))
);
if (historialFiltrado.length > 0) {
  const historialOrdenado = historialFiltrado.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  return historialOrdenado[0];
} else {
  return null;
}

}

buscarapinotaCredito(itemsolicitud: Solicitud2): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    var notaCredito;
    var tipos = "";
    var formActivo = localStorage.getItem('Formactivo');
    if (formActivo == 'OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante') {
      tipos = "ANTICIPO";
    } else if (formActivo == 'OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago') {
      tipos = "ANTICIPO";
    }else if (formActivo == 'OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago') {
      tipos = "ANTICIPO";
    } else {
      tipos = "APIVENTA";
    }
    if (tipos == "APIVENTA") { 
    } else { 
    }
  });
}
documentosPorUnidad(tipo?:string){
  const jsonString = localStorage.getItem('RolsUser');
  const jsonObject = JSON.parse(jsonString);
  //const unidadDescripciones = jsonObject.map(item => item.unidad.descripcion);  
  const jsonStringunidad = localStorage.getItem('unselected_'); 
  var unidadDescripciones=jsonStringunidad;  
  var filasData=ELEMENT_DATA;
  var formActivo=localStorage.getItem('Formactivo');
  if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante'){

    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      filasData= [
        { id:"1",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"2", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }else{
      filasData= [
      {id:"1", texto: 'Carta Solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"3",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"4",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"5",texto: 'UIF', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"6", texto: 'Vigencia de poder (en caso de empresa)', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"7", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
      ];
    }

  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago'){

    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      filasData= [
        { id:"1",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"2",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"3", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }else{
      filasData= [
        {id:"1", texto: 'Carta Solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"3",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"4",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"5",texto: 'UIF', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"6", texto: 'Vigencia de poder (en caso de empresa)', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"7", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'){

    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      filasData= [
        { id:"1",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"2",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"3", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }else{
      filasData= [
        {id:"1", texto: 'Carta Solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"3",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"4",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"5",texto: 'UIF', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"6", texto: 'Vigencia de poder (en caso de empresa)', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"7", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Cambio de datos (boleta por factura, nombre, dirección etc.)'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      filasData= [
        { id:"1",texto: 'Carta o correo de solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"3", texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"4", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }else{
      filasData= [
        {id:"1", texto: 'Carta Solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"3", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)'){
      filasData= [
        {id:"1", texto: 'Carta Solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"3",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"4",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"5", texto: 'Vigencia de poder (en caso de empresa)', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"6", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
  }
  //duplicado sin contabilidad
  else if(formActivo=='OP. SIN NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)'){
    filasData= [
      {id:"1", texto: 'Carta Solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"3",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"4",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"5", texto: 'Vigencia de poder (en caso de empresa)', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"6", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
      ];
}

  else if(formActivo=='OP. CON NOTA DE CREDITO - Desistimiento de compra (con entrega) (vehículos)'){
    filasData= [
      {id:"1", texto: 'Carta Solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"3",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"4",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"5",texto: 'UIF', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"6", texto: 'Vigencia de poder (en caso de empresa)', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"7", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
      ];
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Desistimiento de compra (sin entrega) (vehículos) tipo de NC'){
    filasData= [
      {id:"1", texto: 'Carta Solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"3",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"4",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"5",texto: 'UIF', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"6", texto: 'Vigencia de poder (en caso de empresa)', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"7", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
      ];
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Devolución por ítem (para aplicar a nuevo comprobante)'){

      if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
        filasData= [
          { id:"1",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
          {id:"2", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
          ];
      }else{
        filasData= [
          { id:"1",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
          {id:"2", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
          ];
      }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Solicitud Por descuento'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      filasData= [
        { id:"1",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"2", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }else{
      filasData= [
        { id:"1",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"2", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }
  }else if(formActivo=='OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      filasData= [
        { id:"1",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"2",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"3",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"4", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }else{
      filasData= [
        { id:"1",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"2",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
        { id:"3",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"4", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
        ];
    }
  }else if(formActivo=='OP. SIN NOTA DE CREDITO - Pago EPDP'){
   /* filasData= [
      {id:"1", texto: 'Carta Solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"3",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"4",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"5", texto: 'Vigencia de poder (en caso de empresa)', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"6", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
      ];*/
if(tipo=="DNI"){
  filasData=[
    {id:"1", texto: 'Autorización de Pago', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"2", texto: 'Boleta Informativa', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"3", texto: 'Carta de Pago en 2 Partes', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"4", texto: 'Carta Recepción', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"5", texto: 'Declaración Jurada', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"6", texto: 'DNI', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"7", texto: 'Orden de Compra', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"8", texto: 'Reconocimiento de Deuda- Documento firmado', archivo: null ,nombrearchivo:null,tipo:'local'},
  ];
}else{
  filasData=[
    {id:"1", texto: 'Autorización de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"2", texto: 'Boleta Informativa', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"3", texto: 'Carta de Pago en 2 Partes', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"4", texto: 'Carta Recepción', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"4", texto: 'Copia Literal', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"5", texto: 'Declaración Jurada', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"6", texto: 'DNI', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"7", texto: 'Factura de Venta Unidad a GP', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"7", texto: 'Ficha Ruc', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"7", texto: 'Orden de Compra', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"8", texto: 'Reconocimiento de Deuda- Documento firmado', archivo: null ,nombrearchivo:null,tipo:'local'},
    {id:"8", texto: 'Vigencia Poder', archivo: null ,nombrearchivo:null,tipo:'local'},
  ];
}

  }else if(formActivo=='OP. SIN NOTA DE CREDITO - Pago EPDP Parcial'){
   /* filasData= [
      {id:"1", texto: 'Carta Solicitud', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"2",texto: 'PDF de la factura o boleta', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"3",texto: 'Copia del DNI del cliente', archivo: null ,nombrearchivo:null,tipo:'local'},
      { id:"4",texto: 'Constancia de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"5", texto: 'Vigencia de poder (en caso de empresa)', archivo: null ,nombrearchivo:null,tipo:'local'},
      {id:"6", texto: 'Ficha RUC', archivo: null ,nombrearchivo:null,tipo:'local'},
      ];*/

      filasData= [
        {id:"1", texto: 'Autorización de pago', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'Boleta Informativa', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'Carta de Pago en 2 Partes', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'Carta Recepción', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'Copia Literal', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'Declaración Jurada', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'DNI', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'Factura de Venta Unidad a GP', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'Ficha Ruc', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'Orden de Compra', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'Reconocimiento de Deuda- Documento firmado', archivo: null ,nombrearchivo:null,tipo:'local'},
        {id:"1", texto: 'Vigencia Poder', archivo: null ,nombrearchivo:null,tipo:'local'},

        ];
  }

  return filasData;

}
filterItemsByRolName(name: string): any[] {
  const jsonString = localStorage.getItem('RolsUser');
  const jsonObject = JSON.parse(jsonString);
  //const unidadDescripciones = jsonObject.map(item => item.unidad.descripcion);
  const jsonStringunidad = localStorage.getItem('unselected_'); 
  var unidadDescripciones=jsonStringunidad;  
  var formActivo=localStorage.getItem('Formactivo');
  if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      name="ADV";
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos') ) {
      name="Asesor";
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      name="ADV";
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      name="Asesor";
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      name="ADV";
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      name="Asesor";
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Cambio de datos (boleta por factura, nombre, dirección etc.)'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      name="ADV";
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      name="Asesor";
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)'){
    name="Asesor";
  }
  //duplicado sin contabilidad
  else if(formActivo=='OP. SIN NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)'){
    name="Asesor";
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Desistimiento de compra (con entrega) (vehículos)'){
    name="Asesor";
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Desistimiento de compra (sin entrega) (vehículos) tipo de NC'){
    name="Asesor";
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Devolución por ítem (para aplicar a nuevo comprobante)'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      name="ADV";
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      name="Asesor";
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Solicitud Por descuento'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      name="ADV";
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      name="Asesor";
    }
  }else if(formActivo=='OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)'){
      name="Asesor";
  }else if(formActivo=='OP. SIN NOTA DE CREDITO - Pago EPDP'){
    name="Asesor";
  }else if(formActivo=='OP. SIN NOTA DE CREDITO - Pago EPDP Parcial'){
    name="Asesor";
  }

  return jsonObject.filter((item) => item.rol.nombre === name
  && item.unidad.descripcion===jsonStringunidad
  );
}
visibleGerencia(){
  const jsonString = localStorage.getItem('RolsUser');
  const jsonObject = JSON.parse(jsonString);
  //const unidadDescripciones = jsonObject.map(item => item.unidad.descripcion);
  const jsonStringunidad = localStorage.getItem('unselected_'); 
  var unidadDescripciones=jsonStringunidad;  
  var formActivo=localStorage.getItem('Formactivo');
  var visibleNumero=false;
  if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=true;
    }else{
      visibleNumero=false;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago'){
    //SI TIENE ALGUNOS DE LOS SIGUIENTES: ACTIVO
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') ||
    unidadDescripciones.includes('Accesorios')) {
      visibleNumero=true;//MOSTRAR
    }else{
      visibleNumero=false;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'){
    //SI TIENE ALGUNOS DE LOS SIGUIENTES: ACTIVO
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') ||
    unidadDescripciones.includes('Accesorios')) {
      visibleNumero=true;//MOSTRAR
    }else{
      visibleNumero=false;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Cambio de datos (boleta por factura, nombre, dirección etc.)'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=true;
    }else{
      visibleNumero=false;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Devolución por ítem (para aplicar a nuevo comprobante)'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=true;
    }else{
      visibleNumero=false;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Solicitud Por descuento'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=true;
    }else{
      visibleNumero=false;
    }
  }
  return visibleNumero;
}

visibleCumplimiento(){
  const jsonString = localStorage.getItem('RolsUser');
  const jsonObject = JSON.parse(jsonString);
  //const unidadDescripciones = jsonObject.map(item => item.unidad.descripcion);  
  const jsonStringunidad = localStorage.getItem('unselected_'); 
  var unidadDescripciones=jsonStringunidad;  
  var formActivo=localStorage.getItem('Formactivo');
  var visibleNumero=false;
  if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=true;
    }else{
      visibleNumero=false;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago'){
    /*
    if (unidadDescripciones.includes('Servicios')){// unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=false;
    }else{
      visibleNumero=true;//false;
    }*/
    visibleNumero=false;

  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'){
    /*
    if (unidadDescripciones.includes('Servicios')){// unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=false;
    }else{
      visibleNumero=true;//false;
    }*/
    visibleNumero=false;

  }else if(formActivo=='OP. CON NOTA DE CREDITO - Cambio de datos (boleta por factura, nombre, dirección etc.)'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=true;
    }else{
      visibleNumero=false;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Devolución por ítem (para aplicar a nuevo comprobante)'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=true;
    }else{
      visibleNumero=false;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Solicitud Por descuento'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=true;
    }else{
      visibleNumero=false;
    }
  }
  return visibleNumero;
}
visibleADVComboAsesor(){
  const jsonString = localStorage.getItem('RolsUser');
  const jsonObject = JSON.parse(jsonString);
  //const unidadDescripciones = jsonObject.map(item => item.unidad.descripcion);
  const jsonStringunidad = localStorage.getItem('unselected_'); 
  var unidadDescripciones=jsonStringunidad;  
  var formActivo=localStorage.getItem('Formactivo');
  var visibleNumero=false;
  if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante'){
    if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;//NO MOSTRAR
    }else{ //MOSTRAR
      visibleNumero=false; //MOSTRAR
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago'){
    if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;//NO MOSTRAR
    }else{ //MOSTRAR
      visibleNumero=false; //MOSTRAR
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'){
    if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;//NO MOSTRAR
    }else{ //MOSTRAR
      visibleNumero=false; //MOSTRAR
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Cambio de datos (boleta por factura, nombre, dirección etc.)'){
    if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;//NO MOSTRAR
    }else{ //MOSTRAR
      visibleNumero=false; //MOSTRAR
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Devolución por ítem (para aplicar a nuevo comprobante)'){
    if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;//NO MOSTRAR
    }else{ //MOSTRAR
      visibleNumero=false; //MOSTRAR
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Solicitud Por descuento'){
    if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;//NO MOSTRAR
    }else{ //MOSTRAR
      visibleNumero=false; //MOSTRAR
    }
  }else{
    visibleNumero=true; //no mostrar
  }
  return visibleNumero;
}

visibleADV(){
  const jsonString = localStorage.getItem('RolsUser');
  const jsonObject = JSON.parse(jsonString);
  //const unidadDescripciones = jsonObject.map(item => item.unidad.descripcion);
  const jsonStringunidad = localStorage.getItem('unselected_'); 
  var unidadDescripciones=jsonStringunidad;  
  var formActivo=localStorage.getItem('Formactivo');
  var visibleNumero=false;
  if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=false;
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=false;
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=false;
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Cambio de datos (boleta por factura, nombre, dirección etc.)'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=false;
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)'){
    visibleNumero=true;
  }
  //duplicado sin contabilidad
  else if(formActivo=='OP. SIN NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)'){
    visibleNumero=true;
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Desistimiento de compra (con entrega) (vehículos)'){
    visibleNumero=true;
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Desistimiento de compra (sin entrega) (vehículos) tipo de NC'){
    visibleNumero=true;
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Devolución por ítem (para aplicar a nuevo comprobante)'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=false;
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;
    }
  }else if(formActivo=='OP. CON NOTA DE CREDITO - Solicitud Por descuento'){
    if (unidadDescripciones.includes('Repuestos') || unidadDescripciones.includes('Servicios') || unidadDescripciones.includes('Accesorios')) {
      visibleNumero=false;
    }else if (unidadDescripciones.includes('Vehículos') || unidadDescripciones.includes('Motos')) {
      visibleNumero=true;
    }
  }else if(formActivo=='OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)'){
    visibleNumero=true;
  }else if(formActivo=='OP. SIN NOTA DE CREDITO - Pago EPDP'){
    visibleNumero=true;
  }else if(formActivo=='OP. SIN NOTA DE CREDITO - Pago EPDP Parcial'){
    visibleNumero=true;
  }
  return visibleNumero;
}
validaParametro(importe, moneda): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (moneda == "US$") {
      this.http.get(this.urlBase + 'listas?table=Parametro').subscribe((res: any) => {
        const data = res.filter(item => item.descripcion.trim().toUpperCase() === "MONTO DOLARES")[0];
      const _importe = Number(importe.replace(/[^0-9.]/g, ''));
      const importeParametro = Number(data.valor.replace(/[^0-9.]/g, ''));
        if (Number(_importe) > Number(importeParametro)) {
          //console.log("ES MAYOR DEBE PASAR POR GERENCIA");
          resolve(true);
        } else {
          //console.log("ES MENOR NO DEBE PASAR POR GERENCIA");
          resolve(false);
        }
      });
    } else if (moneda == "S/") {
      this.http.get(this.urlBase + 'listas?table=Parametro').subscribe((res: any) => {
        const data = res.filter(item => item.descripcion.trim().toUpperCase() === "MONTO SOLES")[0];
        console.log("CALCULANDO");
      const _importe = Number(importe.replace(/[^0-9.]/g, ''));
      const importeParametro = Number(data.valor.replace(/[^0-9.]/g, ''));
      if (Number(_importe) > Number(importeParametro)) {
          //console.log("ES MAYOR DEBE PASAR POR GERENCIA");
          //1469.86
          //3500 dato
          resolve(true);
        } else {
          //console.log("ES MENOR NO DEBE PASAR POR GERENCIA");
          resolve(false);
        }
      });
    } else {
      resolve(false);
    }
  });
}
}
