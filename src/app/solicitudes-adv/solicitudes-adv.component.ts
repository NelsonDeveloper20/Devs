import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { RequestService } from '../services/request.service';
import { Solicitud, Solicitud2 } from './solicitud.model';
import { DataService } from '../shared/data.service';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { User, Usuario } from '../usuarios/users.model';
import { IUsersResponse } from '../services/user.model';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-solicitudes-adv',
  templateUrl: './solicitudes-adv.component.html',
  styleUrls: ['./solicitudes-adv.component.css'],
})
export class SolicitudesAdvComponent implements OnInit {



  searchControl = new FormControl('');
  get filteredUsuarios() {
    const searchTerm = this.searchControl.value.toLowerCase();
    return this.usuario.filter((item) =>
      item.nombre.toLowerCase().includes(searchTerm)
    );
  }
  searchControlCliente = new FormControl('');
  get filteredClientes() {
    const searchTerm = this.searchControlCliente.value.toLowerCase();
    return this.clientes.filter((item) =>
      item.clienteRazonSocial.toLowerCase().includes(searchTerm)
    );
  }
  FechaInicio = new Date();
  FechaFin = new Date();
  AprobadoPor: any; //string="Todos";
  ClienteSelect: string = 'Todos';
  Otro: string = '';
  EstadoSolicitud: string = 'Todos';
  clientes: Array<Solicitud2> = [];



  constructor(
    private router: Router,
    private toaster: Toaster,
    private spinner: NgxSpinnerService,
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
   /* this.FechaInicio.setDate(this.FechaInicio.getDate() - 15);
    this.getuser();
    this.getCliente();

    setTimeout(() => {
      this.getSolicitud();

    }, 300);*/
  }
  
  solicitud: Array<Solicitud2> = [];
  displayedColumns: string[] = [
    'ID',
    'TipoSoli',
    'Cliente',
    'Estado',
    'SolicitudCreada',
    'Aprobador',
    'RechazadoPor',
    'Motivo',
    'Unidad',
    'Sede',
    'Accion',
  ];
  dataSource = new MatTableDataSource<Solicitud>(); 
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  sortingData: Sort = { active: '', direction: '' };
  getSolicitud() {
    var idUser = localStorage.getItem('ByUser');
    const fecInicio = moment(this.FechaInicio, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );
    const fecFin = moment(this.FechaFin, 'DD/MM/YYYY').format('YYYY-MM-DD');

    if (idUser == null || fecInicio == '' || fecFin == '') {
      return;
    }

    this.spinner.show();
    this.requestService
      .getSolicitudAdv(
        idUser,
        fecInicio,
        fecFin,
        this.AprobadoPor?.id,
        this.EstadoSolicitud,
        'General',
        this.ClienteSelect,
        this.Otro
      )
      .subscribe(
        (response) => {
          this.solicitud = response; 
          this.dataSource = new MatTableDataSource<any>(this.solicitud);
          this.dataSource.paginator = this.paginator; 
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
  }
  sortData(column: string) {
    if (this.sortingData.active === column) {
      // Cambia la dirección de ordenación si se hace clic en la misma columna
      this.sortingData.direction = this.sortingData.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Establece la nueva columna de ordenación
      this.sortingData.active = column;
      this.sortingData.direction = 'asc';
    }
    if (this.sortingData.active && this.sortingData.direction) {
      const isAsc = this.sortingData.direction === 'asc';
      this.solicitud = this.solicitud.sort((a, b) => {
        switch (this.sortingData.active) {
          case 'ID':
            return (a.id < b.id ? -1 : 1) * (isAsc ? 1 : -1);
          case 'TipoSoli':
            // Agrega lógica de ordenación para la columna 'TipoSoli'
            // ...
          // Repite para otras columnas si es necesario
          default:
            return 0;
        }
      });
    }
    this.dataSource = new MatTableDataSource<any>(this.solicitud);
   
  }
  getCliente() {
    var idUser = localStorage.getItem('ByUser');
    const fecInicio = moment(this.FechaInicio, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );
    const fecFin = moment(this.FechaFin, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.spinner.show();
    this.requestService
      .getClienteSolicitud(idUser, fecInicio, fecFin)
      .pipe(
        map((response) =>
          response.filter(
            (cliente, index, self) =>
              index ===
              self.findIndex(
                (c) => c.clienteRazonSocial === cliente.clienteRazonSocial
              )
          )
        )
      )
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.clientes = response;
        },
        () => {
          this.spinner.hide();
        }
      );
  }
  SendAdvDatos(item: Solicitud2) {
 
    let navigationExtras: NavigationExtras = {
      state: {
        soliditud: item,
      },
    };
    var tipoSolicitud = item.tipoSolicitud[0].id;
    switch (tipoSolicitud) {
      case 1:
        localStorage.setItem(
          'Formactivo',
          'OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante'
        );
        this.router.navigate(
          ['/CN-NotaCredito-Nuevo-Comprobante/item'],
          navigationExtras
        );
        break;
      case 2:
        localStorage.setItem(
          'Formactivo',
          'OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago'
        );
        this.router.navigate(
          ['/CN-NotaCredito-Devolucion-Cliente/item'],
          navigationExtras
        );
        break;
      case 3: //APROBADO POR CONTABILIDAD
        localStorage.setItem(
          'Formactivo',
          'OP. CON NOTA DE CREDITO - Cambio de datos (boleta por factura, nombre, dirección etc.)'
        );
        this.router.navigate(
          ['/CN-NotaCredito-Datos-Boleta/item'],
          navigationExtras
        );
        break;
      case 4:
        localStorage.setItem(
          'Formactivo',
          'OP. CON NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)'
        );
        this.router.navigate(
          ['/CN-NotaCredito-Carta-Cruzada/item'],
          navigationExtras
        );
        break;
      case 5:
        localStorage.setItem(
          'Formactivo',
          'OP. CON NOTA DE CREDITO - Desistimiento de compra (con entrega) (vehículos)'
        );
        this.router.navigate(
          ['/CN-NotaCredito-Compra-CN-Entrega/item'],
          navigationExtras
        );
        break;
      case 6:
        localStorage.setItem(
          'Formactivo',
          'OP. CON NOTA DE CREDITO - Desistimiento de compra (sin entrega) (vehículos) tipo de NC'
        );
        this.router.navigate(
          ['/CN-NotaCredito-Compra-SN-Cruzada/item'],
          navigationExtras
        );
        break;
      case 7:
        localStorage.setItem(
          'Formactivo',
          'OP. CON NOTA DE CREDITO - Devolución por ítem (para aplicar a nuevo comprobante)'
        );
        this.router.navigate(
          ['/CN-NotaCredito-Devolucion/item'],
          navigationExtras
        );
        break;
      case 8:
        localStorage.setItem(
          'Formactivo',
          'OP. CON NOTA DE CREDITO - Solicitud Por descuento'
        );
        this.router.navigate(
          ['/CN-NotaCredito-Descuento/item'],
          navigationExtras
        );
        break;
      case 9:
        localStorage.setItem(
          'Formactivo',
          'OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)'
        );
        this.router.navigate(['/SN-PagoExceso/item'], navigationExtras);
        break;
      case 10:
        localStorage.setItem(
          'Formactivo',
          'OP. SIN NOTA DE CREDITO - Pago EPDP'
        );
        this.router.navigate(['/SN-PartePago-Epdp/item'], navigationExtras);
        break;
      case 11:
        localStorage.setItem(
          'Formactivo',
          'OP. SIN NOTA DE CREDITO - Pago EPDP Parcial'
        );
        this.router.navigate(['/SN-Pago-Epdp-parcial/item'], navigationExtras);
        break;
        
      case 12:
        localStorage.setItem(
          'Formactivo',
          'OP. SIN NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)'
        );
        this.router.navigate(
          ['/SN-Carta-Cruzada/item'],
          navigationExtras
        );
        break;
        case 13:
          localStorage.setItem(
            'Formactivo',
            'OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'
          );
          this.router.navigate(
            ['/CN-NotaCredito-Devolucion-Factura-Cliente/item'],
            navigationExtras
          );
          break;
      default:
        console.log('-');
        break;
    }
  }
  getColorForEstado(estadoSolicitud: string): string {
    // Aquí definimos las condiciones y los colores asociados
    switch (estadoSolicitud) {
      case 'Rechazado Jefatura':
      case 'Rechazado Contabilidad':
      case 'Aplicado Tesoreria':
      case 'Observado Tesoreria':
      case 'Rechazado Cumplimiento':
      case 'Rechazado Gerencia':
      case 'Finalizado por ADV':
        return '#E40421'; // Rojo
      default:
        return '#0cb951'; // verde por defecto
    }
  }
  //usuario: Array<User> = [];
  usuario: Usuario[] = [];
  getuser() {
    this.spinner.show();
    this.requestService.getusuarios().subscribe(
      (response: IUsersResponse) => {
        this.spinner.hide();
        this.usuario = response;
      },
      () => {
        this.spinner.hide();
      }
    );
  }
  getSelectedNombre(): string {
    const selectedUsuario = this.filteredUsuarios.find(
      (usuario) => usuario.id.toString() === this.AprobadoPor
    );
    return selectedUsuario ? selectedUsuario.nombre : '';
  }
  buscar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toUpperCase();
  }
  
  checkUncheckAll(event: any) {
    var checkboxes = document.getElementsByTagName('input');
    if (event.target.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = true;
            }
        }
    } else {
        for (var i = 0; i < checkboxes.length; i++) { 
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = false;
            }
        }
    }
}
}
