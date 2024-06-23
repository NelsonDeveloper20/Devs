import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { NavigationExtras, Router } from '@angular/router'; 
import { IUsersResponse, Solicitud, Solicitud2, SolicitudReporteResponse, Usuario } from 'src/app/services/request.model';
import { RequestService } from 'src/app/services/request.service';
import * as XLSX from 'xlsx'; 
  

import { environment } from 'src/environments/environment'; 
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { OperacionesConstruccionService } from 'src/app/services/operacionesconstruccion.service';
import Swal from 'sweetalert2';
import { OrdenproduccionGrupoService } from 'src/app/services/ordenproducciongrupo.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetalleProductosComponent } from 'src/app/solicitud-pendiente/detalle-productos/detalle-productos.component';
import jsPDF from 'jspdf';
export interface ElementoTabla {
  cotizacion: number;
  codOp: string;
  nombreProyecto: string;
  estadoOp: string;
  tipoOperacion: string;
  ruc: string;
  nombreCliente: string;
  fechaCreacion: string;
  fechaFin: string;
  id: number; // Asegúrate de ajustar el tipo de dato según corresponda
}

@Component({
  selector: 'app-reporte-nc',
  templateUrl: './reporte-nc.component.html',
  styleUrls: ['./reporte-nc.component.css'],
  encapsulation: ViewEncapsulation.None, //TOOLTIP
})
export class ReporteNCComponent implements OnInit {
  displayedColumns: string[] = ['cotizacion', 'codOp', 'OpGrupo','nombreProyecto', 'estadoOp', 'tipoOperacion', 'ruc', 'nombreCliente', 'fechaCreacion', 'fechaFin', 'acciones', 'estado'];
 
  dataSource=new MatTableDataSource<any>();//this.ELEMENT_DATA

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  } 
  verProduccionProd(id: number) {
    // Implementa la lógica para ver la producción del producto según el ID proporcionado
    console.log('Ver producción del producto con ID:', id);
  }
 
  estaciones(){
    
    this.router.navigate(['/Estacion-Trabajo']);
    } 

  solicitud: Array<SolicitudReporteResponse> = [];
  clientes: Array<Solicitud2> = [];
  private urlBase: string; 
  constructor(
    private router: Router,
    private toaster: Toaster,
    private spinner: NgxSpinnerService,
    private requestService: RequestService, private http: HttpClient,
    private _service: OperacionesConstruccionService,
    private ordenproduccionGrupoService: OrdenproduccionGrupoService,
    private dialog: MatDialog,
  ) { 
    this.urlBase = `${environment.baseUrl}/api/listas`; 
  }
 
  ListOP:any=[];
  Fecha:Date=new Date();
  ListarOp() {
    const fecInicio = moment(this.Fecha, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    ); 
    
    this.spinner.show();
    this._service.ListarOperacionesConstruccion(fecInicio).subscribe(
      (data: any) => {
        if (data && data.status === 200) { 
          this.ListOP = data.json;
          this.spinner.hide(); 
          //this.groupData();           
      this.dataSource = new MatTableDataSource<any>(this.ListOP);
        } else {
          this.spinner.hide();
          console.error('Error: No se pudo obtener datos.');
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error al obtener datos:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    );
  }

  
  ngOnInit(): void {  
    this.ListarOp();
  }  

  ListGrupos:any  =[];
  EnviarGrupoMasivo(){ 
    if(this.ListGrupos.length === 0){
      this.toaster.open({
        text: "Debe seleccionar cotizaciones que desee enviar",
        caption: 'Mensaje',
        type: 'danger',
        // duration: 994000
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      title: "¿Desea Enviar?",
      html: `¿Esta seguro de enviar a Pendiente Venta?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, Enviar',
      cancelButtonText: 'Cancelar',
    })
      .then((result) => {
        if (result.isConfirmed) { 
          
    const jsonData = JSON.stringify(this.ListGrupos);
    console.log(jsonData);
    this.spinner.show();
    this.ordenproduccionGrupoService.CambiarEstadoGrupo("Venta",jsonData)
      .subscribe({
        next: response => {
          this.spinner.hide();
          if (response.status == 200) { 
                const respuesta = response.json.respuesta;
                const id = response.json.id; 
                Swal.fire({
                title: 'Mensaje',
                text: 'Operacion realizada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false
                }); 
               this.ListarOp();
            }else{
              this.toaster.open({
                text: "Ocurrio un error al enviar",
                caption: 'Mensaje',
                type: 'danger',
                // duration: 994000
              });
            }
        },
        error: error => {
          this.spinner.hide();
          var errorMessage = error.message;
          console.error('There was an error!', error);
          this.toaster.open({
            text: errorMessage,
            caption: 'Ocurrio un error',
            type: 'danger',
            // duration: 994000
          });
        }
      });
        }else{
          this.ListGrupos=[];
        }
      });
  } 
  EnviarAOperaciones(item:any){
    const userDataString = JSON.parse(localStorage.getItem('UserLog'));     
    this.ListGrupos.push({
      id:item.id,
      usuarioId:userDataString.id
    });
    this.EnviarGrupoMasivo();
  }
  
  AbrirPopupDetalleProducto(item,grupo:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;  
    const dataToSend = {  
      CotizacionGrupo: grupo,  
      Cotizacion: item.numeroCotizacion, 
      CodigoSisgeco:item.codigoSisgeco,
      estado:item.estadoOp
    };
    dialogConfig.data = dataToSend; 
    dialogConfig.width ='804px';
    const dialogRef = this.dialog.open(DetalleProductosComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: data => {   
       
    },
    error: error => { 
        var errorMessage = error.message;
        console.error('There was an error!', error); 
        this.toaster.open({
          text: errorMessage,
          caption: 'Ocurrio un error',
          type: 'danger',
        });
      }
    });
  }
   
    exportToExcel() {
      const dataToExport = this.dataSource.data.map(row => ({
        'N° Cotiz': row.numeroCotizacion,
        'COD OP': row.codigoSisgeco,
        'Grupo OP': row.cotizacionGrupo,
        'Nombre Proyecto': row.nombreProyecto,
        'Estado OP': row.estadoOp,
        'Tipo de Operación': row.tipoOperacion,
        'RUC': row.rucCliente,
        'Nombre Cliente': row.nombreCliente,
        'Fec. Creación OP': new Date(row.fechaCreacion).toLocaleDateString() + ' ' + new Date(row.fechaCreacion).toLocaleTimeString(),
        'Fec. Producción': new Date(row.fechaProduccion).toLocaleDateString() + ' ' + new Date(row.fechaProduccion).toLocaleTimeString()
      }));
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'DataSheet.xlsx');
    }
  
    exportToPDF() {
        // Crear una instancia de jsPDF con orientación horizontal
  const doc = new jsPDF('l');
      const col = ['N° Cotiz', 'COD OP', 'Grupo OP', 'Nombre Proyecto', 'Estado OP', 'Tipo de Operación', 'RUC', 'Nombre Cliente', 'Fec. Creación OP', 'Fec. Producción'];
      const rows = this.dataSource.data.map(row => [
        row.numeroCotizacion,
        row.codigoSisgeco,
        row.cotizacionGrupo,
        row.nombreProyecto,
        row.estadoOp,
        row.tipoOperacion,
        row.rucCliente,
        row.nombreCliente,
        new Date(row.fechaCreacion).toLocaleDateString() + ' ' + new Date(row.fechaCreacion).toLocaleTimeString(),
        new Date(row.fechaProduccion).toLocaleDateString() + ' ' + new Date(row.fechaProduccion).toLocaleTimeString()
      ]);
  
      (doc as any).autoTable(col, rows);
      doc.save('ReporteOP.pdf');
    }
}

