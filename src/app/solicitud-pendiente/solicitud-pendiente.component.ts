import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { RequestService } from '../services/request.service';
//import { Solicitud, Solicitud2 } from './solicitud.model'; 
import { NavigationExtras, Router } from '@angular/router'; 
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OrdenproduccionGrupoService } from '../services/ordenproducciongrupo.service';
import { LayoutComponent } from '../layout/layout.component';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetalleProductosComponent } from './detalle-productos/detalle-productos.component';
import { OrdenproduccionService } from '../services/ordenproduccion.service';

export interface ElementoTabla {
  checkbox: any;
  actions: any;
  cotizacion: number;
  op: string;
  fCotizacion: string;
  fVenta: string;
  rucDni: string;
  razonSocial: string;
  proyecto: string;
  tipoOperacion: string;
  tipoCambio: number;
  tipoMoneda: string;
  total: number;
  igv: number;
  monto: number;
  fProduccion: string;
  rs: string;
  zb: string;
  ph: string;
  cv: string;
  sh: string;
  ce: string;
  pj: string;
  otros: string;
  tipoCliente: string;
  vendendor: string;
  distritoVenta: string;
  provincia: string;
  departamento: string;
  destino: string;
  fechaEntrega: string;
  estadoPedido: string;
  mail: string;
  observacion: string;
  observacion2: string;
  nivel: number;
  subNivel: number;
  reproceso: string;
  cotiPrincipal: string;
  fSisgeco: string;
  detalle: string;
} 
@Component({
  selector: 'app-solicitud-pendiente',
  templateUrl: './solicitud-pendiente.component.html',
  styleUrls: ['./solicitud-pendiente.component.css'],
  encapsulation: ViewEncapsulation.None, //TOOLTIP
})
export class SolicitudPendienteComponent implements OnInit {
  displayedColumns: string[] = ['select', 'actions', 'cotizacion',
  'op',
  'grupo',
  'fCotizacion',
  'fVenta',
  'rucDni',
  'razonSocial',
  'proyecto',
  'tipoOperacion',
  'tipoCambio',
  'tipoMoneda',
  'total',
  'igv',
  'monto',
  'fProduccion',
  'rs',
  'zb',
  'ph',
  'cv',
  'sh',
  'ce',
  'pj',
  'otros',
  'tipoCliente',
  'vendendor',
  'distritoVenta',
  'provincia',
  'departamento',
  'destino',
  //'fechaEntrega',
  'estadoPedido',
  'mail',
  'observacion',
  //'observacion2',
  'nivel',
  'subNivel',
  'reproceso',
  //'cotiPrincipal',
  //'fSisgeco',
  'detalle',
  'layout'
];

  //dataSource = ELEMENT_DATA;
  selection = new SelectionModel<any>(true, []);
  //selection = new SelectionModel<any>(true, []);
  dataSource=new MatTableDataSource<any>();//ELEMENT_DATA
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  @ViewChild(LayoutComponent) layoutComponent: LayoutComponent;
  GenerarLayout(cotizacionGrupo:any,tipoProducto:any) {
    if (this.layoutComponent) {
      this.layoutComponent.ejecutarAccionConParametro(cotizacionGrupo,tipoProducto);
    }
  }
  constructor(private router: Router, private toaster: Toaster, 
    private spinner: NgxSpinnerService, private requestService: RequestService,
    private ordenproduccionGrupoService: OrdenproduccionGrupoService,
    private dialog: MatDialog,
    private _OrdenService: OrdenproduccionService,
  
  ) { }

  showfilter=false;
  showFilter(){
  this.showfilter=!this.showfilter;
  }
  nuevaOP(){    
  this.router.navigate(['/Registro-Cotizacion']);
  }  
  razonSocial: string;
  tipoCliente: string;
  fechaInicio: Date;
  fechaFin: Date;
  op: string;
  ruc: string;
  proyecto: string;
  
  //ENDS
  ngOnInit(): void { 
    this.ListarFiltros();
    this.obtenerDetalleOpGrupo();
  }
  ListVenta:any=[];
  obtenerDetalleOpGrupo() {
    
    const request = { 
      Vendedor: this.selectedVendedor ? this.selectedVendedor : '--', 
      NumeroCotizacion: this.selectedCotizacion ? this.selectedCotizacion : '--',
      Cliente: this.razonSocial ? this.razonSocial : '--', 
      FechaInicio: this.fechaInicio ? this.fechaInicio : '--', 
      FechaFin: this.fechaFin ? this.fechaFin : '--',
      CodigoSisgeco: this.selectedGrupo ? this.selectedGrupo : '--', 
      RucCliente: this.selectedRuc ? this.selectedRuc : '--', 
      IdProyecto: this.selectedProyecto ? this.selectedProyecto.id : '--',
      TipoCliente: this.selectedTipoCliente ? this.selectedTipoCliente.id : '--',
    };    
    this.spinner.show();
    this.dataSource = new MatTableDataSource<any>();
    this.ordenproduccionGrupoService.listarDetalleOpGrupo(request)
      .subscribe(
        data => {
          this.spinner.hide();
          if(data.status==200){
            this.ListVenta=data.json;
            //this.datosDetalleOpGrupo = data.json;
            this.dataSource = new MatTableDataSource<any>(data.json);
          }
        },
        error => {
          this.spinner.hide();
          console.error('Error al obtener el detalle del grupo:', error);
        }
      );
  }
 
  AbrirPopupDetalleProducto(item:any, grupo:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;  
    const dataToSend = {  
      CotizacionGrupo: grupo,   
      Cotizacion: item.numeroCotizacion, 
      CodigoSisgeco:item.codigoSisgeco,
      estado:item.estadoPedido
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
  //#region  LISTAR COMBOS FILTRO
  vendedores: any[] = [];
  filteredVendedores: any[] = [];
  cotizaciones: any[] = [];
  filteredCotizaciones: any[] = [];
  proyectos: any[] = [];
  grupos: any[] = [];
  filteredProyectos: any[] = [];
  tiposClientes: any[] = [];
  filteredTiposClientes: any[] = [];
  rucs: any[] = [];
  filteredRucs: any[] = [];
  filteredGrupos: any[] = [];

  selectedVendedor: string="--";
  selectedCotizacion: string="--";
  selectedGrupo: string="--";
  selectedRuc: string="--";
  selectedTipoCliente: any; // Cambia el tipo de variable a 'any' o define una interfaz para este objeto
  selectedProyecto: any; // Cambia el tipo de variable a 'any' o define una interfaz para este objeto
 
  ListarFiltros() {
    this.ordenproduccionGrupoService.ListarFiltros()
      .subscribe(
        data => {
          if (data.status === 200) {
            var datos = data.json;

            this.vendedores = datos.vendedores;
            this.filteredVendedores = datos.vendedores;

            this.cotizaciones = datos.cotizaciones;
            this.filteredCotizaciones = datos.cotizaciones;

            this.proyectos = datos.proyectos;
            this.filteredProyectos = datos.proyectos;

            this.tiposClientes = datos.tiposClientes;
            this.filteredTiposClientes = datos.tiposClientes;

            this.rucs = datos.rucs;
            this.filteredRucs = datos.rucs;
            
            this.grupos = datos.grupos;
            this.filteredGrupos = datos.grupos; 

            
          }
        },
        error => {
          console.error('Error al obtener el detalle del grupo:', error);
        }
      );
  }
  descargarArchivo(nombre: string) {
    this.spinner.show();
    this._OrdenService.DescargarArchivo(nombre).subscribe(
      (blob: Blob) => {
        this.spinner.hide();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre; // Especificar el nombre del archivo
        document.body.appendChild(a);
        a.click();

        // Limpieza
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        this.spinner.hide();
        console.error('Error al descargar el archivo:', error);
      }
    );
  }
  filterVendedores(event: any) {    
    var valor = event.target ? event.target.value : '';
    this.filteredVendedores = this.vendedores.filter(v => v.toLowerCase().includes(valor.toLowerCase()));
  }

  filterCotizaciones(event: any) {  
    var valor = event.target ? event.target.value : '';
    this.filteredCotizaciones = this.cotizaciones.filter(c => c.toLowerCase().includes(valor.toLowerCase()));
  }
 
  filterRucs(event: any) {  
    var valor = event.target ? event.target.value : '';
    this.filteredRucs = this.rucs.filter(r => r.toLowerCase().includes(valor.toLowerCase()));
  }
  
  filterTiposClientes(event: any) {  
    var valor = event.target ? event.target.value : '';
    this.filteredTiposClientes = this.tiposClientes.filter(tc => tc.nombre.toLowerCase().includes(valor.toLowerCase()));
  }
  
  filterProyectos(event: any) {  
    var valor = event.target ? event.target.value : '';
    this.filteredProyectos = this.proyectos.filter(p => p.nombre.toLowerCase().includes(valor.toLowerCase()));
  } 
  filterGrupos(event: any) {  
    var valor = event.target ? event.target.value : '';
    this.filteredGrupos = this.grupos.filter(r => r.toLowerCase().includes(valor.toLowerCase()));
  }
  
 //#endregion
    

  //#region  ENVIOS Y FILTROS
  @ViewChild('tableRef') tableRef: ElementRef;
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tableRef.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tabla1');
    XLSX.writeFile(wb, 'tabla.xlsx');
  } 
  checkboxLabel(row?: ElementoTabla): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }
/*
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }*/
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter(row => row.estadoPedido === "Pendiente Venta" && row.tipoGrupo === 'Producto').length;
    //console.log(`isAllSelected: numSelected=${numSelected}, numRows=${numRows}`);
    return numSelected === numRows;
  }
  
  toggleAllRows() { 
    if (this.isAllSelected()) {
      this.selection.clear(); 
      this.ListGrupos = [];
    } else {
      this.dataSource.data.forEach(row => {
        if (row.estadoPedido === "Pendiente Venta" && row.tipoGrupo =='Producto') {        
          this.selection.select(row);
        }
      });
    }

    const userDataString = localStorage.getItem('UserLog');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.selection.selected.forEach(element => {
        this.ListGrupos.push({
          id: element.idGrupo,
          usuarioId: userData.id
        });
      });
    }
  }
  toggleRowSelection(row: any) {
    if (this.selection.isSelected(row)) {
      // Si la fila ya está seleccionada, deseleccionarla y quitarla de ListGrupos
      this.selection.deselect(row);
      this.ListGrupos = this.ListGrupos.filter(item => item.id !== row.idGrupo);
    } else {
      // Si la fila no está seleccionada, seleccionarla y agregarla a ListGrupos
      this.selection.select(row);
      const userDataString = localStorage.getItem('UserLog');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        this.ListGrupos.push({
          id: row.idGrupo,
          usuarioId: userData.id
        });
      }
    }
  
    // Logging the final state for debugging
    console.log("Final ListGrupos after toggle:", this.ListGrupos);
    console.log("Final selection after toggle:", this.selection.selected);
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
      html: `¿Esta seguro de enviar a Operaciones Construcción?`,
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
    this.ordenproduccionGrupoService.CambiarEstadoGrupo("Operaciones",jsonData)
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
               this.obtenerDetalleOpGrupo();
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
      id:item.idGrupo,
      usuarioId:userDataString.id
    });
    this.EnviarGrupoMasivo();
  }
  //#endregion
}

