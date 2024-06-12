import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  
const ELEMENT_DATA = [
  { title: 'Div 1', color: 'red', name: 'Anulación por anticipo para aplicar a nuevo comprobante', route: 'CN-NotaCredito-Nuevo-Comprobante/item' },
  { title: 'Div 2', color: 'green', name: 'Anulación por anticipo para devolución al cliente / error de pago', route: 'CN-NotaCredito-Devolucion-Cliente/item' },
  { title: 'Div 2', color: 'green', name: 'Anulación por factura o boleta para devolución al cliente / error de pago', route: 'CN-NotaCredito-Devolucion-Factura-Cliente/item' },//NUEVO
  { title: 'Div 3', color: 'blue', name: 'Cambio de datos (boleta por factura, nombre, dirección etc.)', route: 'CN-NotaCredito-Datos-Boleta/:FactId' },
  { title: 'Div 3', color: 'blue', name: 'Carta cruzada (para aplicar a nuevo comprobante)', route: 'CN-NotaCredito-Carta-Cruzada/:FactId' },
  { title: 'Div 3', color: 'blue', name: 'Desistimiento de compra (con entrega) (vehículos)', route: 'CN-NotaCredito-Compra-CN-Entrega/:FactId' },
  { title: 'Div 3', color: 'blue', name: 'Desistimiento de compra (sin entrega) (vehículos) tipo de NC', route: 'CN-NotaCredito-Compra-SN-Cruzada/:FactId' },
  { title: 'Div 3', color: 'blue', name: 'Devolución por ítem (para aplicar a nuevo comprobante)', route: 'CN-NotaCredito-Devolucion/:FactId' },
  { title: 'Div 3', color: 'blue', name: 'Solicitud Por descuento', route: 'CN-NotaCredito-Descuento/:FactId' },
];
@Component({
  selector: 'app-op-con-nota-credito',
  templateUrl: './op-con-nota-credito.component.html',
  styleUrls: ['./op-con-nota-credito.component.css']
})
export class OPConNotaCreditoComponent implements OnInit {
  Grid = [];
  constructor( 
    private router: Router){}
  ngOnInit(): void {  
  }
  navigate(routes, name) {
    localStorage.setItem('Formactivo', 'OP. CON NOTA DE CREDITO - ' + name);
    this.router.navigate(['/' + routes]);
  } 
  FilterItemenList() { 
    this.Grid = [];
    try {
       
      const rolesPermitidos = {
        //IGUALES: vehículos,corporativo,
        //IGUALES PERO DIFERENTE PROCESO: seminuevos
        vehículos: [
          'Anulación por anticipo para aplicar a nuevo comprobante',
          'Anulación por anticipo para devolución al cliente / error de pago',
          'Anulación por factura o boleta para devolución al cliente / error de pago',
          'Cambio de datos (boleta por factura, nombre, dirección etc.)',
          'Carta cruzada (para aplicar a nuevo comprobante)',
          'Desistimiento de compra (con entrega) (vehículos)',
          'Desistimiento de compra (sin entrega) (vehículos) tipo de NC',
          'Devolución por ítem (para aplicar a nuevo comprobante)',
          'Solicitud Por descuento'
        ],//nueva unidad
        motos: [
          'Anulación por anticipo para aplicar a nuevo comprobante',
          'Anulación por anticipo para devolución al cliente / error de pago',
          'Anulación por factura o boleta para devolución al cliente / error de pago',
          'Cambio de datos (boleta por factura, nombre, dirección etc.)',
          'Carta cruzada (para aplicar a nuevo comprobante)',
          'Desistimiento de compra (con entrega) (vehículos)',
          'Desistimiento de compra (sin entrega) (vehículos) tipo de NC',
          'Devolución por ítem (para aplicar a nuevo comprobante)',
          'Solicitud Por descuento'
        ],//add  
        corporativo: [
          'Anulación por anticipo para aplicar a nuevo comprobante',
          'Anulación por anticipo para devolución al cliente / error de pago',
          'Anulación por factura o boleta para devolución al cliente / error de pago',
          'Cambio de datos (boleta por factura, nombre, dirección etc.)',
          'Carta cruzada (para aplicar a nuevo comprobante)',
          'Desistimiento de compra (con entrega) (vehículos)',
          'Desistimiento de compra (sin entrega) (vehículos) tipo de NC',
          'Devolución por ítem (para aplicar a nuevo comprobante)',
          'Solicitud Por descuento'
        ],
        //IGUALES [repuestos,accesorios,servicios]
        repuestos: [
          'Anulación por anticipo para aplicar a nuevo comprobante',
          'Anulación por anticipo para devolución al cliente / error de pago',
          'Anulación por factura o boleta para devolución al cliente / error de pago',
          'Cambio de datos (boleta por factura, nombre, dirección etc.)',
          'Devolución por ítem (para aplicar a nuevo comprobante)',
          'Solicitud Por descuento'
        ], //add
        accesorios: [
          'Anulación por anticipo para devolución al cliente / error de pago',
          'Anulación por factura o boleta para devolución al cliente / error de pago',
          'Cambio de datos (boleta por factura, nombre, dirección etc.)',
          'Devolución por ítem (para aplicar a nuevo comprobante)',
          'Solicitud Por descuento'
        ],
        servicios: [
          'Anulación por anticipo para aplicar a nuevo comprobante',
          'Anulación por anticipo para devolución al cliente / error de pago',
          'Anulación por factura o boleta para devolución al cliente / error de pago',
          'Cambio de datos (boleta por factura, nombre, dirección etc.)',
          'Devolución por ítem (para aplicar a nuevo comprobante)',
          'Solicitud Por descuento'
        ],

        //add
        seminuevos: [
          'Anulación por anticipo para aplicar a nuevo comprobante',
          'Anulación por anticipo para devolución al cliente / error de pago',
          'Anulación por factura o boleta para devolución al cliente / error de pago',
          'Cambio de datos (boleta por factura, nombre, dirección etc.)',
          'Carta cruzada (para aplicar a nuevo comprobante)',
          'Desistimiento de compra (con entrega) (vehículos)',
          'Desistimiento de compra (sin entrega) (vehículos) tipo de NC',
          'Devolución por ítem (para aplicar a nuevo comprobante)',
          'Solicitud Por descuento'
        ],
      };

      
  const jsonStringunidad = localStorage.getItem('unselected_'); 
  var unidades=jsonStringunidad;  
      const jsonString = localStorage.getItem('RolsUser');
      const jsonObject = JSON.parse(jsonString);
 

     // var unidades = '';
      var roles = '';
      jsonObject.forEach(element => {
       // unidades += element.unidad.descripcion + ',';
        roles += element.rol.nombre + ',';
      });
     // unidades = unidades.slice(0, -1); // Corregir la asignación de la variable unidades
      roles = roles.slice(0, -1); // Corregir la asignación de la variable roles 

      const unidadesNegocio = unidades.split(',').map(unidad => unidad.trim().replace(" ", "").toLowerCase());
      if (roles.includes('admin')) {
        this.Grid = ELEMENT_DATA;
      } else {
        this.Grid = ELEMENT_DATA.filter(item => {
          for (const unidad of unidadesNegocio) {
            if (rolesPermitidos[unidad] && rolesPermitidos[unidad].includes(item.name)) {
              return true;
            }
          }
          return false;
        });
      }

    } catch (error) {
      //console.log(error)
    }
  }
}
