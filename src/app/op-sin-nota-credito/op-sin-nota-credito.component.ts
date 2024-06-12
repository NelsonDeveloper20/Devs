import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 

const ELEMENT_DATA = [
    { title: 'Pago en exceso', color: 'red',name:'Pago en exceso (Devoluciones de caja)',route:'SN-PagoExceso/item'   },
    { title: 'Pago EPDP', color: 'green',name:'Pago EPDP', route:'SN-PartePago-Epdp/item'},
    { title: 'Pago EPDP Parcial', color: 'blue',name:'Pago EPDP Parcial', route:'SN-Pago-Epdp-parcial/:FactId' },
    { title: 'Div 3', color: 'blue', name: 'Carta cruzada (para aplicar a nuevo comprobante)', route: 'SN-Carta-Cruzada/:FactId' },
];
@Component({
  selector: 'app-op-sin-nota-credito',
  templateUrl: './op-sin-nota-credito.component.html',
  styleUrls: ['./op-sin-nota-credito.component.css']
})
export class OPSinNotaCreditoComponent implements OnInit {
/*
Anulación por anticipo para aplicar a nuevo comprobante
Anulación por anticipo para devolucion al cliente / error de pago
Cambio de datos (boleta por factura, nombre, dirección etc)
Devolución por item (para aplicar a nuevo comprobante)
Por descuento

  */
  Grid = []
  constructor( 
    private router: Router) { }

  ngOnInit(): void { 
  }
navigate(routes,name){

  localStorage.setItem('Formactivo',  'OP. SIN NOTA DE CREDITO - '+ name);
    this.router.navigate(['/'+routes]);
}


FilterItemenList() {
  
  this.Grid = [];
  try{

  const rolesPermitidos = {
    vehículos: ['Pago en exceso (Devoluciones de caja)','Carta cruzada (para aplicar a nuevo comprobante)'  ],
    motos: ['Pago en exceso (Devoluciones de caja)','Carta cruzada (para aplicar a nuevo comprobante)'  ],//nuevo
    corporativo: ['Pago en exceso (Devoluciones de caja)',  ],
    repuestos: ['Pago en exceso (Devoluciones de caja)', ],
    accesorios: ['Pago en exceso (Devoluciones de caja)', ],//add
    servicios: ['Pago en exceso (Devoluciones de caja)', ],
    seminuevos: ['Pago en exceso (Devoluciones de caja)','Pago EPDP','Pago EPDP Parcial','Carta cruzada (para aplicar a nuevo comprobante)'],
    admin: ['Pago en exceso (Devoluciones de caja)','Pago EPDP', 'Pago EPDP Parcial','Carta cruzada (para aplicar a nuevo comprobante)'],
  };
  
  const jsonStringunidad = localStorage.getItem('unselected_'); 
  var unidades=jsonStringunidad;  
  const jsonString = localStorage.getItem('RolsUser');
  const jsonObject = JSON.parse(jsonString);

  //var unidades = '';
  var roles = '';

  jsonObject.forEach(element => {
   // unidades += element.unidad.descripcion + ',';
    roles += element.rol.nombre + ',';
  });

  //unidades = unidades.slice(0, -1);
  roles = roles.slice(0, -1);

  const unidadesNegocio = unidades.split(',').map(unidad => unidad.trim().replace(" ","") .toLowerCase());
  const role = roles.split(',').map(unidad => unidad.trim().toLowerCase());
  if (role.includes('admin')) {
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

}catch(error){
  //console.log(error)
}
}

}

