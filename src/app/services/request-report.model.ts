export interface IOrderRequestItem {
  codigo?: string;
  Marca?: string;
  Almacen?: string;
  Icc?: string;
  StockFisicoUbicacion?: string;
  TipoRepuesto?: string;
  LUN?: string;
 // icc?: string;
  enero?: string;
  febrero?: string;
  marzo?: string;
  abril?: string;
  mayo?: string;
  junio?: string;
  julio?: string;
  agosto?: string;
  setiembre?: string;
  octubre?: string;
  noviembre?: string;
  diciembre?: string;

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

export type IOrderRequestResponse = Array<IOrderRequestItem>;

export interface ISolicitudSearchRequest {
  fechaDeSolicitudInicio?: string; 
  tienda?: string; 
}
 

export interface ISolicitudResponse {
  status?: number;
  json?: any;
}
