import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { RequestService } from '../services/request.service';
import { DataService } from '../shared/data.service';
import { NavigationExtras, Router } from '@angular/router';
import { HistorialSolicitudResponse, IUsersResponse, Solicitud2, Usuario } from '../services/request.model';
import { HistorialSolicitud, HistorialSolicitudlist } from './historialsolicitud.model';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import * as XLSX from 'xlsx'; 
@Component({
  selector: 'app-historial-solicitud',
  templateUrl: './historial-solicitud.component.html',
  styleUrls: ['./historial-solicitud.component.css']
})
export class HistorialSolicitudComponent implements OnInit {

  FechaInicio = new Date();
  FechaFin = new Date();
  AprobadoPor: any;//string="Todos";
  EstadoSolicitud: string = "Todos";
  solicitud: Array<HistorialSolicitudlist> = [];
  constructor(private router: Router, private toaster: Toaster,
    private spinner: NgxSpinnerService,
    private requestService: RequestService
  ) {


  }

  ngOnInit(): void {
    this.FechaInicio.setDate(this.FechaInicio.getDate() - 5);

    this.getCliente();
    this.getuser();
    this.getHistorialSolicitud();
  }
  displayedColumns: string[] = ['IdSolicitud', "cliente", 'Estado', 'SubEstado', 'Motivo', 'Comentario', 'SolicitudFec', 'Usuario'];
  dataSource = new MatTableDataSource<HistorialSolicitudlist>();//ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getHistorialSolicitud() {
    var idUser = localStorage.getItem('ByUser');
    const fecInicio = moment(this.FechaInicio, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const fecFin = moment(this.FechaFin, 'DD/MM/YYYY').format('YYYY-MM-DD');

    if (idUser == null || fecInicio == "" || fecFin == ""
    ) {
      return;
    }
    this.spinner.show();
    this.solicitud=[];
    this.requestService.getHistorialSolicitudAdv(idUser, fecInicio, fecFin, this.AprobadoPor?.id, this.EstadoSolicitud, 'General', this.ClienteSelect).subscribe((response) => {
      this.spinner.hide();
      //       this.solicitud = response;
      response.forEach(elem => {
        this.solicitud.push({
          id: elem.id,
          idSolicitud: elem.idSolicitud,
          estadoSolicitud: elem.estadoSolicitud,
          subEstado: elem.subEstado,
          motivo: elem.motivo,
          comentario: elem.comentario,
          paso: elem.paso,
          usuarioCreacion: elem.usuarioCreacion,
          fechaCreacion: elem.fechaCreacion,
          solicitud: elem.solicitud[0]?.clienteRazonSocial,
          usuario: elem.usuario[0]?.nombre
        })
      })
      this.dataSource = new MatTableDataSource<any>(this.solicitud);
      this.dataSource.paginator = this.paginator;

    },
      () => {
        this.spinner.hide();
      }
    );
  }
  
  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.querySelector('#tableToExcel'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    XLSX.writeFile(wb, 'Reporte.xlsx');
  }

  ClienteSelect: string = "Todos";
  clientes: Array<Solicitud2> = [];
  searchControl = new FormControl('');
  get filteredUsuarios() {
    const searchTerm = this.searchControl.value.toLowerCase();
    return this.usuario.filter(item => item.nombre.toLowerCase().includes(searchTerm));
  }
  searchControlCliente = new FormControl('');
  get filteredClientes() {
    const searchTerm = this.searchControlCliente.value.toLowerCase();
    return this.clientes.filter(item => item.clienteRazonSocial.toLowerCase().includes(searchTerm));
  }

  getCliente() {
    var idUser = localStorage.getItem('ByUser');
    const fecInicio = moment(this.FechaInicio, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const fecFin = moment(this.FechaFin, 'DD/MM/YYYY').format('YYYY-MM-DD');

    this.spinner.show();
    this.requestService.getClienteSolicitud(idUser, fecInicio, fecFin)
      .pipe(
        map(response => response.filter(
          (cliente, index, self) =>
            index === self.findIndex(c => c.clienteRazonSocial === cliente.clienteRazonSocial)
        ))
      )
      .subscribe((response) => {
        this.spinner.hide();
        this.clientes = response;
      },
        () => {
          this.spinner.hide();
        }
      );
  }
  SendAdvDatos(item: HistorialSolicitud) {
    //const datos = { nombre: 'John', edad: 25 };
    //console.log(item);
    //this.dataService.setData(item);
    //const data = item;//{ nombre: 'John', edad: 30 };
    //this.router.navigate(['/CN-NotaCredito-Nuevo-Comprobante'], { state: data });
    let navigationExtras: NavigationExtras = {
      state: {
        soliditud: item,
      },
    };
    this.router.navigate(["/CN-NotaCredito-Nuevo-Comprobante/item"], navigationExtras);
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

  buscar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toUpperCase();
  }


}
