import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrdenproduccionGrupoService } from 'src/app/services/ordenproducciongrupo.service';
//import { ProductosDialogComponent } from '../productos-dialog/productos-dialog.component';
import { OrdenproduccionService } from 'src/app/services/ordenproduccion.service';
import { ProductosDialogComponent } from 'src/app/registro-cotizacions/productos-dialog/productos-dialog.component';

@Component({
  selector: 'app-detalle-productos',
  templateUrl: './detalle-productos.component.html',
  styleUrls: ['./detalle-productos.component.css']
})
export class DetalleProductosComponent implements OnInit {
  Grupo:String="";
  Cotizacion:String="";
  CodigoSisgeco:String="";
  estado:string="";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialog: MatDialog,
    private dialogRef: MatDialogRef<DetalleProductosComponent>,
    private spinner: NgxSpinnerService,  private ordenproduccionGrupoService: OrdenproduccionGrupoService, 
  
    private _OrdenService: OrdenproduccionService, ) {
      this.Grupo = data.CotizacionGrupo;   
      this.Cotizacion= data.Cotizacion, 
      this.CodigoSisgeco= data.CodigoSisgeco ;
      this.estado=data.estado;
     }

  ngOnInit(): void {
    this.ListarFiltros(); 
    
  }
validarPrt(codigo:any){
  var codigoProducto=codigo.slice(0, 3);
    if(codigoProducto=="PRT"){
      return true;
    }else{
      return false;
    }
}
  listProductos: any[] = [];
  ListarFiltros() {
    this.spinner.show()
    this.ordenproduccionGrupoService.ListatarProductosDetallePorGrupo(this.Grupo)
      .subscribe(
        data => {this.spinner.hide()
          if (data.status === 200) {
            var datos = data.json;
  this.listProductos=datos;
  this.listarAmbientes(this.Cotizacion);
          }
        },
        error => {this.spinner.hide()
          console.error('Error al obtener el detalle del grupo:', error);
        }
      );
  }
  
  close() {
    this.dialogRef.close();
  }

  
  TblAmbiente: any[] = [];
  
  listarAmbientes(numerocotizacion:any){  
    console.log("BUSCADO:  "+numerocotizacion);
    this._OrdenService
      .listarAmbiente(numerocotizacion)
      .subscribe(
        (response) => { 
          console.log("AMBIENTES");
          console.log(response);
           this.TblAmbiente=response;   
        },
        () => { 
        }
      );
   }
  openRegisterProd(producto:any): void {   
    producto["estadoOp"]=this.estado; 
    console.log(producto);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true; 
    dialogConfig.panelClass = 'custom-dialog-container';
    //const cadenaCompleta = 'PRTRS0054'; 
    const dataToSend = { 
      producto: producto,
      Cotizacion: this.Cotizacion, 
      CodigoSisgeco:this.CodigoSisgeco,
      ambiente:this.TblAmbiente
    };
     
    dialogConfig.data = dataToSend;
    /*
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      width: '650px', // Ancho del popup
      data: { name: 'Angular' } // Datos opcionales que puedes pasar al popup
    });*/
    dialogConfig.width ='1104px';
    const dialogRef = this.dialog.open(  ProductosDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: data => {   
       if (data) {
        this.ListarFiltros(); 
          //this.listarProductosSisgecoAndDcBlinds();
      } 
    },
    error: error => { 
        var errorMessage = error.message;
        console.error('There was an error!', error); 
        /*this.toaster.open({
          text: errorMessage,
          caption: 'Ocurrio un error',
          type: 'danger',
        });*/
      }
    });
  }
}
