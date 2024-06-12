//export interface IProveedor {
  export type IProveedor = {
id?:number;
idusuario?:string;
correoelectronico?:string;
nombre?:string;
ruc ?:string;
razonsocial ?:string;
direccion ?:string;
numero ?:number;
distrito ?:string;
provincia ?:string;
departamento ?:string;
pais ?:string;
codigociu ?:string;
telefonofijo ?:string;
paginaweb ?:string;
//UEN
numerodecuentadetraccion ?:string;
padronAlquepertenece ?:string;
correoeletronicoigv ?:string;
anioDecreacion ?:string;
//met pago
moneda ?:string;
condicionpago ?:string;
montocreditobesco ?:string;
montocreditomiranda  ?:string;
fecharegistro ?:string;
fechamodificacion?:string;
estado ?:number;
contactosusuario?:[]
cuentabancaria?:[]
  };
  export type IComprobante = {
    id?:string;
    nrosap?:string;
    clienterazonsocial?:string;
    dniclienteruc?:string;
    fechsolicitud ?:string;
    importe ?:string;
    moneda ?:string;
    unidadnegocio ?:string;
    tienda ?:string;
    centrocosto ?:string;
    comentario ?:string;
    tipo ?:string; 
    estadoSolicitud?:string;    
    subEstadoSolicitud?:string;
    motivo?:string; 
    tipodocumento?:string;
  //Carta Cruzada
  tipoCarta ?:string;
  vinculo ?:string;
  banco ?:string; 
   
 dniclienteRealiza ?:string;
 clienteRaliza ?:string;
 solicitante ?:string;
 formaPago ?:string;
 numOperacion  ?:string;
//UEN
numerodecuentadetraccion ?:string;
padronAlquepertenece ?:string;
correoeletronicoigv ?:string;
anioDecreacion ?:string;
//met pago 
condicionpago ?:string;
montocreditobesco ?:string;
montocreditomiranda  ?:string;
fecharegistro ?:string;
fechamodificacion?:string;
estado ?:number;
contactosusuario?:[]
cuentabancaria?:[]

//FORM ERROR PAGO
entidadBancaria?:string;
numeroCuentaBancaria?:string;

//ADICIONAL NOTAS DE CREDITO
comprobanteOrigen?:string
//DATO para todos los flujos donde se genere devolución de dinero
cciCuentaBancaria?:string
      };
      export type sapModel=
{
 
	COD_CLIENTE?: String;
	NOMBRE_CLIENTE?: String;
	TIPO_DOCUMENTO?: String;
	NRO_DOCUMENTO?: String;
	FECHA_DOC?: String;
	MONEDA?: String;
	UNIDAD_NEGOCIO?: String;
	TIENDA?: String;
	CENTRO_COSTO?: String;
	MONTO_TOTAL?: String;
	IMPUESTO?: String; 

};