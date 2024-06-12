

//TIPO : OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante
this.EnviarBD("Registrado","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Revision ADV","Revision ADV","Enviado a ADV",'none');
this.EnviarBD("Revision ADV","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Aprobaciones","Revision Gerencia","Enviado a gerencia por Jefatura",'none');
this.EnviarBD("Aprobaciones","Revision Contabilidad","Enviado a contabilidad por Jefatura",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Revision Contabilidad","Enviado a contabilidad por Gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Validacion ADV","Aprobado por contabilidad",motivoDevolucion); 
//DEVOLUCION
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Aprobaciones","Registrado","Devuelto a ADV por jefatura",motivoDevolucion);  
this.EnviarBD("Aprobaciones","Revision ADV","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Registrado","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Registrado","Devuelto a ADV por contabilidad",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);
//RECHAZO
this.EnviarBD("Aprobaciones","Rechazado Jefatura","Rechazado por Jefatura",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Rechazado Gerencia","Rechazado por Gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);
//END

//TIPO : OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago
//ENVIO
this.EnviarBD("Registrado","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Revision ADV","Revision ADV","Enviado a ADV",'none');
this.EnviarBD("Revision ADV","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Aprobaciones","Revision Gerencia","Enviado a cumplimiento por Jefatura",'none');
this.EnviarBD("Aprobaciones","Revision Contabilidad","Enviado a contabilidad por Jefatura",'none')
this.EnviarBD("Aprobaciones","Revision Cumplimiento","Enviado a cumplimiento por Jefatura",'none')
this.EnviarBD("Cumplimiento","Revision Gerencia","Aprobado por cumplimiento",motivoDevolucion); 
this.EnviarBD("Cumplimiento","Revision Contabilidad","Aprobado por cumplimiento",motivoDevolucion); 
this.EnviarBD("Revision Gerencia","Revision Contabilidad","Aprobado por gerencia",motivoDevolucion); 
this.EnviarBD("Revision Contabilidad","Validacion ADV","Aprobado por contabilidad",motivoDevolucion); 
//DEVOLVER
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Aprobaciones","Registrado","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Aprobaciones","Revision ADV","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Cumplimiento","Registrado","Devuelto a ADV por cumplimiento",motivoDevolucion); 
this.EnviarBD("Cumplimiento","Revision ADV","Devuelto a ADV por cumplimiento",motivoDevolucion); 
this.EnviarBD("Revision Gerencia","Registrado","Devuelto a ADV por gerencia",motivoDevolucion);  
this.EnviarBD("Revision Gerencia","Revision ADV","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Registrado","Devuelto a ADV por contabilidad",motivoDevolucion);          
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);
//RECHAZO
this.EnviarBD("Aprobaciones","Rechazado Jefatura","Rechazado por jefatura",motivoDevolucion);
this.EnviarBD("Cumplimiento","Rechazado Cumplimiento","Rechazado por cumplimiento",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Rechazado Gerencia","Rechazado por Gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);

//TIPO : OP. CON NOTA DE CREDITO - Cambio de datos (boleta por factura, nombre, dirección etc.)
//ENVIO   
this.EnviarBD("Registrado","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Revision ADV","Revision ADV","Enviado a ADV",'none');
this.EnviarBD("Revision ADV","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Aprobaciones","Revision Gerencia","Enviado a gerencia por Jefatura",'none');
this.EnviarBD("Aprobaciones","Revision Contabilidad","Enviado a contabilidad por Jefatura",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Revision Contabilidad","Enviado a contabilidad por Gerencia",motivoDevolucion); 
this.EnviarBD("Revision Contabilidad","Validacion ADV","Aprobado por contabilidad",motivoDevolucion); 
//DEVOLUCION
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Aprobaciones","Registrado","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Aprobaciones","Revision ADV","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Registrado","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Revision ADV","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Registrado","Devuelto a ADV por contabilidad",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);
//RECHAZO
this.EnviarBD("Aprobaciones","Rechazado Jefatura","Rechazado por Jefatura",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Rechazado Gerencia","Rechazado por Gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);

//TIPO : OP. CON NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)
//ENVIO

this.EnviarBD("Registrado","Revision ADV","Enviado a ADV",'none');
this.EnviarBD("Revision ADV","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Aprobaciones","Revision Cumplimiento","Enviado a cumplimiento por Jefatura",'none');
this.EnviarBD("Cumplimiento","Revision Contabilidad","Aprobado por cumplimiento",motivoDevolucion); 
this.EnviarBD("Revision Contabilidad","Validacion ADV","Aprobado por contabilidad",motivoDevolucion); 
//DEVOLVER
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Aprobaciones","Revision ADV","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Cumplimiento","Revision ADV","Devuelto a ADV por cumplimiento",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);
//RECHAZ
this.EnviarBD("Aprobaciones","Rechazado Jefatura","Rechazado por jefatura",motivoDevolucion);
this.EnviarBD("Cumplimiento","Rechazado Cumplimiento","Rechazado por cumplimiento",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);

//TIPO : OP. CON NOTA DE CREDITO - Desistimiento de compra (con entrega) (vehículos)
//ENVIO
this.EnviarBD("Registrado","Revision ADV","Enviado a ADV",'none');
this.EnviarBD("Revision ADV","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Aprobaciones","Revision Cumplimiento","Enviado a cumplimiento por Jefatura",'none');
this.EnviarBD("Cumplimiento","Revision Gerencia","Enviado a gerencia por cumplimiento",motivoDevolucion); 
this.EnviarBD("Revision Gerencia","Revision Contabilidad","Enviado a contabilidad por Gerencia",'none');
this.EnviarBD("Revision Contabilidad","Validacion ADV","Aprobado por contabilidad",motivoDevolucion); 
//DEVOLVER
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Aprobaciones","Revision ADV","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Cumplimiento","Revision ADV","Devuelto a ADV por cumplimiento",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Revision ADV","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);
//RECHAZO
this.EnviarBD("Aprobaciones","Rechazado Jefatura","Rechazado por Jefatura",motivoDevolucion);
this.EnviarBD("Cumplimiento","Rechazado Cumplimiento","Rechazado por Cumplimiento",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Rechazado Gerencia","Rechazado por Gerencia",motivoDevolucion); 
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);

//TIPO : OP. CON NOTA DE CREDITO - Desistimiento de compra (sin entrega) (vehículos) tipo de NC
//ENVIOO

this.EnviarBD("Registrado","Revision ADV","Enviado a ADV",'none');
this.EnviarBD("Revision ADV","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Aprobaciones","Revision Cumplimiento","Enviado a cumplimiento por Jefatura",'none');
this.EnviarBD("Cumplimiento","Revision Gerencia","Enviado a gerencia por cumplimiento",motivoDevolucion); 
this.EnviarBD("Revision Gerencia","Revision Contabilidad","Enviado a contabilidad por Gerencia",'none');
this.EnviarBD("Revision Contabilidad","Validacion ADV","Aprobado por contabilidad",motivoDevolucion); 
//DEVOLVER
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Aprobaciones","Revision ADV","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Cumplimiento","Revision ADV","Devuelto a ADV por cumplimiento",motivoDevolucion); 
this.EnviarBD("Revision Gerencia","Revision ADV","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);
//RECHAZO
this.EnviarBD("Aprobaciones","Rechazado Jefatura","Rechazado por Jefatura",motivoDevolucion);
this.EnviarBD("Cumplimiento","Rechazado Cumplimiento","Rechazado por Cumplimiento",motivoDevolucion); 
this.EnviarBD("Revision Gerencia","Rechazado Gerencia","Rechazado por Gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);

//TIPO : OP. CON NOTA DE CREDITO - Devolución por ítem (para aplicar a nuevo comprobante)
//ENVIO
this.EnviarBD("Registrado","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Revision ADV","Revision ADV","Enviado a ADV",'none');
this.EnviarBD("Revision ADV","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Aprobaciones","Revision Gerencia","Enviado a gerencia por Jefatura",'none');
this.EnviarBD("Aprobaciones","Revision Contabilidad","Enviado a contabilidad por Jefatura",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Revision Contabilidad","Enviado a contabilidad por Gerencia",motivoDevolucion); 
this.EnviarBD("Revision Contabilidad","Validacion ADV","Aprobado por contabilidad",motivoDevolucion); 
//DEVOLVER
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Aprobaciones","Registrado","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Aprobaciones","Revision ADV","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Registrado","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Revision ADV","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Registrado","Devuelto a ADV por contabilidad",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);

//RECHAZO
this.EnviarBD("Aprobaciones","Rechazado Jefatura","Rechazado por Jefatura",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Rechazado Gerencia","Rechazado por Gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);

//TIPO : OP. CON NOTA DE CREDITO - Solicitud Por descuento
//ENVIO

this.EnviarBD("Registrado","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Revision ADV","Revision ADV","Enviado a ADV",'none');
this.EnviarBD("Revision ADV","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Aprobaciones","Revision Gerencia","Enviado a cumplimiento por Jefatura",'none');
this.EnviarBD("Aprobaciones","Revision Contabilidad","Enviado a contabilidad por Jefatura",'none');
this.EnviarBD("Aprobaciones","Revision Cumplimiento","Enviado a cumplimiento por Jefatura",'none');
this.EnviarBD("Cumplimiento","Revision Gerencia","Aprobado por cumplimiento",motivoDevolucion); 
this.EnviarBD("Cumplimiento","Revision Contabilidad","Aprobado por cumplimiento",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Revision Contabilidad","Aprobado por gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Validacion ADV","Aprobado por contabilidad",motivoDevolucion);
//DEVOLVER
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Registrado","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Revision ADV","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Cumplimiento","Registrado","Devuelto a ADV por cumplimiento",motivoDevolucion);
this.EnviarBD("Cumplimiento","Revision ADV","Devuelto a ADV por cumplimiento",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Registrado","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Revision ADV","Devuelto a ADV por gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Registrado","Devuelto a ADV por contabilidad",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);
//RECHAZAR
this.EnviarBD("Aprobaciones","Rechazado Jefatura","Rechazado por jefatura",motivoDevolucion);
this.EnviarBD("Cumplimiento","Rechazado Cumplimiento","Rechazado por cumplimiento",motivoDevolucion);
this.EnviarBD("Revision Gerencia","Rechazado Gerencia","Rechazado por Gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);

//TIPO : OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)
//ENVIO

this.EnviarBD("Revision ADV","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Aprobaciones","Revision Contabilidad","Enviado a contabilidad por Jefatura",'none');
this.EnviarBD("Revision Contabilidad","Validacion ADV","Aprobado por contabilidad",motivoDevolucion); 
//DEVOLVER
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Aprobaciones","Revision ADV","Devuelto a ADV por jefatura",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);
//RECHAZO
this.EnviarBD("Aprobaciones","Rechazado Jefatura","Rechazado por Jefatura",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);
//TIPO : OP. SIN NOTA DE CREDITO - Pago EPDP
//ENVIO

this.EnviarBD("Registrado","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Revision Gerencia","Revision Tesoreria","Enviado a Tesoreria por Gerencia",'none');
this.EnviarBD("Revision Gerencia","Revision Contabilidad EPDP","Enviado a contabilidad por Gerencia",'none');
this.EnviarBD("Revision Contabilidad EPDP","Revision Tesoreria","Enviado a tesoreia por Contabilidad",motivoDevolucion);
//DEVOLVER
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);
//RECHAZO
this.EnviarBD("Revision Gerencia","Rechazado Gerencia","Rechazado por Gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);

//TIPO : OP. SIN NOTA DE CREDITO - Pago EPDP Parcial 
//ENVIO 
this.EnviarBD("Registrado","Aprobaciones","Enviado a aprobacion por ADV",'none');
this.EnviarBD("Revision Gerencia","Revision Contabilidad","Enviado a contabilidad por Gerencia",'none');
this.EnviarBD("Revision Gerencia","Revisado Conforme SAP","Revisado conforme SAP por Gerencia",'none');
this.EnviarBD("Revision Contabilidad","Revision Tesoreria","Enviado a tesoreia por Contabilidad",motivoDevolucion);
//DEVOLVER
this.EnviarBD("Revision ADV","Registrado","Devuelto al asesor por ADV",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Revision ADV","Devuelto a ADV por contabilidad",motivoDevolucion);
//RECHAZO
this.EnviarBD("Revision Gerencia","Rechazado Gerencia","Rechazado por Gerencia",motivoDevolucion);
this.EnviarBD("Revision Contabilidad","Rechazado Contabilidad","Rechazado por Contabilidad",motivoDevolucion);