import { HistorialSolicitud } from "../historial-solicitud/historialsolicitud.model";
import { User } from "../usuarios/users.model";

 


export type Solicitud = { 
    
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
        fechaCreacion:string;
}



export interface Adjunto {
        idadjunto: number;
        idsolicitud: number;
        idtipoadjunto: number;
        nrodococumento: string;
        nombrestorage: string;
        nombrearchivo: string;
        observacion: string;
        fecharegistro: string;
      }
      export interface TipoSolicitud {
        id: number;
        descripcion: string;
        estado: number;
        usuarioCreacion: number;
        fechaCreacion: string;
        fechaModificacion: string;
      }

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
nroSapTesoreria:string;
fechaAplicacion:string;
archivoTesoreria:string;

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
validacionContabilidad:string;
tipoDocumento:string;
//audit
usuarioCreacion:string;
usuarioModificacion:string;
fechaModificacion:string;

usuario: Array<User>;
//adicional comprobanteOrigen
comprobanteOrigen:string
unidadNegocios: Array<UnidadNegocio>;
sede: Array<Sede>;
usuarioModifica: Array<User>;
historial: Array<HistorialSolicitud>;
asesorAsignado:string;
//adicional

cciCuentaBancaria:string;

  mRechazoMDevolucion:string;
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