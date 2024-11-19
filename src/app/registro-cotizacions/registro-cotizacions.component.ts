import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ProductosDialogComponent } from './productos-dialog/productos-dialog.component';
import { Toaster } from 'ngx-toast-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ITblOrdenProduccion, TblOrdenProduccion } from '../services/models/Tbl_OrdenProduccion.model';
import { OrdenproduccionService } from '../services/ordenproduccion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IApiResponse } from '../services/service.model';
import Swal from 'sweetalert2';
import { Observable, of, throwError } from 'rxjs';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProyectoDialogComponent } from './proyecto-dialog/proyecto-dialog.component';
import { ProyectoService } from '../services/proyecto.service';
import { ComunicacionService } from '../shared/comunicacion.service';
import { LayoutComponent } from '../layout/layout.component';
import { OrdenproduccionGrupoService } from '../services/ordenproducciongrupo.service';
import { SapService } from '../services/sap.service';
export interface ListasModel {
  isSelected: boolean;
  id: number;
  descripcion: string; 
  valor: string;
  isEdit: boolean;
}
@Component({
  selector: 'app-registro-cotizacions',
  templateUrl: './registro-cotizacions.component.html',
  styleUrls: ['./registro-cotizacions.component.css']
})
export class RegistroCotizacionsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  cotizacionNumber: string;
  tipoCliente: string="";
  total: string;
  nombreProyecto: string;
  destino: string="";
  tipoOperacion: string="";
  ruc: string;
  cliente: string;
  fechaSap: Date;
  subNivel: string;
  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private toaster: Toaster,private router: Router,   
    private spinner: NgxSpinnerService,
    private _OrdenService: OrdenproduccionService,
    private _proyectoService: ProyectoService,
    private ordenproduccionGrupoService: OrdenproduccionGrupoService,
    private comunicacionService: ComunicacionService,private sapService: SapService
  ) {  
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        filter(value => value.length >= 4),
        tap(() => this.isRequesting = true), // Filtrar solo cuando se ingresen al menos 3 caracteres
        switchMap(value => this.obtenerOrdenes(value)),
        catchError(error => { 
          //console.error('Error:', error);
          this.toaster.open({
            text: "Ocurio un error:"+error.message,
            caption: 'Mensaje',
            type: 'warning',
            position: 'top-right',
            //duration: 4000
          });
          return [];
        }),
        tap(() => this.isRequesting = false)
      );
   }
   
  @ViewChild(LayoutComponent) layoutComponent: LayoutComponent;
   valor: string = 'algunValor';
   GenerarLayout(cotizacionGrupo:any,tipoProducto:any) {
    if (this.layoutComponent) {
      if(tipoProducto=="-0"){
        tipoProducto="Componente";
      }else{
        tipoProducto="Producto";
      }
      this.layoutComponent.ejecutarAccionConParametro(cotizacionGrupo,tipoProducto);
    }
  }
   Productos: any=[];
   totalProductos=0; 
   totalComponentes=0;
   totalRegistrados=0;
   totalPorRegistrar=0;
   listarProductosSisgecoAndDcBlinds(){  //BOTON CARGAR
    this.spinner.show();
    this._OrdenService
      .ListarProductoSisgeco_DC( this.selectedState.numero)
      .subscribe(
        (response) => {
          var index_count=0;
          this.totalProductos=0; 
          this.totalComponentes=0;
          this.totalRegistrados=0;
          this.totalPorRegistrar=0;
          this.Productos=response; 
          console.log("RESULTS");
          console.log(response);
          this.Productos.forEach(item=> 
            {               
              this.totalRegistrados++;
              var cod_prod=item.codigoProducto.substring(0,3);
              if(cod_prod!=='PRT'){
                this.totalComponentes++;
                 item.indexDetalle="";
                }else{
                  this.totalProductos++;
                } 
            if(item.pase=="" && item.id!=="" && item.codigoProducto.substring(0,3)!=="PRT"){       //componentes ya guardados        
              item.pase='PASDIRECCT';
            }
          } 

          );        
          if(this.ordenes) { //SI HAY ORDENE SELCCIONADO

            const detalleSap= this.ordenes.Lineas;
            detalleSap.forEach(item=>  //AGREGAR LOS QUE AUN NO FUERON GUARDADOS EN LA BD
              {             
                this.Productos.push({
                  "id":"",
     "numeroCotizacion":this.ordenes.numero,
     "codigoSisgeco":this.ordenes.numero,
     "codigoProducto":item.codarticulo,
     "linea":item.linea,
     "nombreProducto":item.des,
     "unidadMedida":item.codunidad,
     "cantidad":item.cantidad,
     "alto":item.alto,
     "ancho":item.ancho,
     "indiceAgrupacion":"", //NO
     "indexDetalle":"",//NO
     "pase":"",//NO
     /*
       CASE
        WHEN SUBSTRING(cd.codarticulo, 1, 3) != 'PRT' THEN 'PASDIRECCT'
        ELSE ''
    END AS Pase,
     */
     "existe":"NO",
     "familia":item.Familia,
     "subFamilia":item.codsubfamilia,
     "precio":item.valor,
     "precioInc":item.valorinc,
     "igv":item.totalIGV,
     "lote":"0",
     "fechaProduccion":"",
     "fechaEntrega":"",
     "nota":"",
     "color":"",
     "idTbl_Ambiente":"",
     "ambiente":"",
     "turno":"",
     "soporteCentral":"",
     "tipoSoporteCentral":"",
     "caida":"",
     "accionamiento":"",
     "codigoTubo":"",
     "nombreTubo":"",
     "mando":"",
     "tipoMecanismo":"",
     "modeloMecanismo":"",
     "tipoCadena":"",
     "codigoCadena":"",
     "cadena":"",
     "tipoRiel":"",
     "tipoInstalacion":"",
     "codigoRiel":"",
     "riel":"",
     "tipoCassete":"",
     "lamina":"",
     "apertura":"",
     "viaRecogida":"",
     "tipoSuperior":"",
     "codigoBaston":"",
     "baston":"",
     "numeroVias":"",
     "tipoCadenaInferior":"",
     "mandoCordon":"",
     "mandoBaston":"",
     "codigoBastonVarrilla":"",
     "bastonVarrilla":"",
     "cabezal":"",
     "codigoCordon":"",
     "cordon":"",
     "codigoCordonTipo2":"",
     "cordonTipo2":"",
     "cruzeta":"",
     "dispositivo":"",
     "codigoControl":"",
     "control":"",
     "codigoSwitch":"",
     "switch":"",
     "llevaBaston":"",
     "mandoAdaptador":"",
     "codigoMotor":"",
     "motor":"",
     "codigoTela":"",
     "tela":"",
     "cenefa":"",
     "numeroMotores":"",
     "serie":"",
     "alturaCadena":"",
     "alturaCordon":"",
     "marcaMotor":"",
     "idUsuarioCrea":"",
     "idUsuarioModifica":"",
     "fechaCreacion":"",
     "fechaModifica":"",
     "idEstado":"",
     "cotizacionGrupo":"",
     "tipo":"Producto",
     "estadoOp":"2",
     "escuadra":"",
     "central":"",
     "whsCode":item.whsCode
                })
              }
            ); 
          }

          /*
          this.Productos.forEach(item=> 
            {
              
            if(item.id==""){   
              this.totalPorRegistrar++;                                      
              var cod_prod=item.codigoProducto.substring(0,3);
              if(cod_prod=='PRT'){
                  index_count++;
                  this.totalProductos++;
                  item.indexDetalle=index_count.toString()
                }else{      
                  this.totalComponentes++;            
                  item.indexDetalle=""
                }
            }else{
              this.totalRegistrados++;
              var cod_prod=item.codigoProducto.substring(0,3);
              if(cod_prod!=='PRT'){
                this.totalComponentes++;
                 item.indexDetalle="";
                }else{
                  this.totalProductos++;
                }
            }
            if(item.pase=="" && item.id!=="" && item.codigoProducto.substring(0,3)!=="PRT"){       //componentes ya guardados        
              item.pase='PASDIRECCT';
            }
          } VERSION SISGECO
          */
          this.spinner.hide();
          
    this.listarAmbientes(this.selectedState.numero);
        },
        () => {
          this.spinner.hide();
        }
      );
   }

  async ngOnInit() {
    try{
    await  this.ListarOrdenesSap();
   await  this.ListarProyecto();
    await this.listas();
    }catch(ex){      
    }
    this.route.params.subscribe(params => {
      const serializedItem = params['item'];
      if (serializedItem) {
       var param = JSON.parse(decodeURIComponent(serializedItem)); // Deserializa y decodifica
       console.log("NUEEVVVOS");
       console.log(param);
       this.onSelectState(param);
      }
    });
  }
  getRowSpan(index: number): number {
    if (index === 0 || 
        this.Productos[index].cotizacionGrupo !== this.Productos[index - 1].cotizacionGrupo ||
        this.Productos[index].tipo !== "Producto") {
      let count = 1;
      if (!this.Productos[index].cotizacionGrupo || this.Productos[index].tipo !== "Producto") {
        return 0;
      }
      for (let i = index + 1; i < this.Productos.length; i++) {
        if (this.Productos[i].cotizacionGrupo === this.Productos[index].cotizacionGrupo &&
            this.Productos[i].tipo === "Producto") {
          count++;
        } else {
          break;
        }
      }
      return count;
    }
    return 0;
  }

  AplicarCentral(itemproducto: any, event: any) {
    let valor = "";
    if (event.checked) {
      valor = "SI";
    } else {
      valor = "NO";
    }
    
    this.spinner.show();
    
    this.ordenproduccionGrupoService.AplicarCentral(itemproducto.cotizacionGrupo, itemproducto.id, valor)
      .subscribe({
        next: response => {
          this.spinner.hide();
          
          if (response.status === 200) {
            const respuesta = response.json.respuesta;
            const respuestacentral = response.json.central;
            itemproducto.central = respuestacentral;
            
            switch (respuesta) {
              case "OK":
                this.toaster.open({
                  text: "Central Aplicado",
                  caption: 'Mensaje',
                  type: 'success',
                  position: 'bottom-right',
                  duration:3000
                });
                break;
                
              case "Se ha quitado el central":
                this.toaster.open({
                  text: "Se ha quitado el central",
                  caption: 'Mensaje',
                  type: 'success',
                  duration:3000
                });
                break;
                
              default:
                this.toaster.open({
                  text: respuesta,
                  caption: 'Mensaje',
                  type: 'danger',
                  duration:3000
                });
                break;
            }
            
            // Actualizar el estado del checkbox basado en la respuesta del API
            event.source.checked = respuestacentral === 'SI';
          } else {
            // Revertir el estado del checkbox en caso de error
            event.source.checked = !event.checked;
            
            this.toaster.open({
              text: "Ocurrió un error al enviar",
              caption: 'Mensaje',
              type: 'danger',
              duration:3000
            });
          }
        },
        error: error => {
          this.spinner.hide();
          
          // Revertir el estado del checkbox en caso de error
          event.source.checked = !event.checked;
          
          console.error('There was an error!', error);
          this.toaster.open({
            text: error.message,
            caption: 'Ocurrió un error',
            type: 'danger',
            duration:3000
          });
        }
      });
  }
  
 
  listProyecto:any[]=[];
  ListarProyecto(){
    this.spinner.show();
    this._proyectoService
      .ListarProyecto()
      .subscribe(
        (response) => { 
          if(response){
            this.listProyecto = response;
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
   }
  archivo:any;
  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    this.archivo=selectedFile; 
    // Puedes realizar más acciones con el archivo seleccionado aquí, como cargarlo a un servicio o procesarlo.
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
   listarOrdenPorCotizacion(numCotizacion:any){
    this.spinner.show();
    this._OrdenService
      .ListarOrdenPorNumero( numCotizacion)
      .subscribe(
        (response) => {
          if(response){
            if(response.length>0){
              this.Orden = response[0]; 
            }
          }
          this.spinner.hide();
        },
        (error) => {
          console.log(error);
          this.Orden={};
          this.toaster.open({
            text: "Ocurrio un error en el servidor de datos",
            caption: 'Mensaje',
            type: 'warning',
            position: 'bottom-right',
            //duration: 4000
          });

          this.spinner.hide();
        }
      );
   }
   listDestino:any=[];
   listTipoOperacion:any=[];
   
    
   listTipoCliente:any=[];
   listas(){
    this.spinner.show(); 
   /* this._OrdenService.listas('TipoCliente').subscribe(
      (res: any) => {
        if(res){
          this.listTipoCliente = res;
        }
        this.checkSpinner();
      },
      (error) => {
        console.error("Error al obtener lista de tipo cliente:", error);
        this.checkSpinner();
      }
    );*/
  
    this._OrdenService.listas('Destino').subscribe(
      (res: any) => { 
        if(res){
          this.listDestino = res;
        }
        this.checkSpinner();
      },
      (error) => {
        console.error("Error al obtener lista de destinos:", error);
        this.checkSpinner();
      }
    );
  
    this._OrdenService.listas('TipoOperacion').subscribe(
      (res: any) => { 
        if(res){
          this.listTipoOperacion = res;
        }
        this.checkSpinner();
      },
      (error) => {
        console.error("Error al obtener lista de tipo de operación:", error);
        this.checkSpinner();
      }
    );
    
    this.spinner.hide();
  } 
  checkSpinner() {
    // Verifica si todas las solicitudes han sido completadas antes de ocultar el spinner
    if (//this.listTipoCliente && 
      this.listDestino && this.listTipoOperacion && this.listProyecto) {
      this.spinner.hide();
    }
  }  
  //Orden: ITblOrdenProduccion={};
  Orden: ITblOrdenProduccion = {} as ITblOrdenProduccion;
  Guardar(){
   
    if (!this.selectedState.numero){  
     this.toaster.open({
    text: "Por favor, complete todos los campos antes de guardar.",
    caption: 'Mensaje',
    type: 'warning',
    position: 'top-right',
    //duration: 4000
  });
      
      return; 
  }
  
  const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
  var idUser= userDataString.id.toString();
   this.Orden.idUsuarioCreacion=idUser.toString();
  this.spinner.show();
  this._OrdenService.RegistrarOrden(this.Orden,  this.archivo)
    .subscribe({
      next: data => {
        if (data.status == 200) { 
const respuesta = data.json.respuesta;
const idOrden = data.json.idOrden;
switch(respuesta){
  case "Ok":
    this.Orden.id=idOrden.toString();
    Swal.fire({
      title: 'Mensaje',
      text: 'Operacion realizada correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });
    break;
  case "Ya existe":
    Swal.fire({
      title: 'Mensaje',
      text: 'Ya existe la cotizacion '+this.Orden.numeroCotizacion,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });
    break;
  default:
    ;
}

      /*    let artcl = JSON.parse(JSON.stringify(data));
       console.log(artcl);
        Swal.fire({
      title: 'Mensaje',
      text: 'Operacion realizada correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });.then((result) => {
      if (result.isConfirmed) {
      this.listarOrdenPorCotizacion(this.cotizacionNumber);
      }
    });*/
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toaster.open({
            text: "Ocurrio un error, ingrese los datos correctamente",
            caption: 'Mensaje',
            type: 'warning',
            position: 'bottom-right',
            //duration: 4000
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

  
  }
  TblAmbiente: any[] = [];
  indice: string;
  ambiente: string;
  numProd: string; 
AgregarAmbiente() { 
  
   
  if (!this.selectedState?.numero){ 
    this.toaster.open({
   text: "Por favor, selecciona la cotizacion",
   caption: 'Mensaje',
   type: 'warning',
   position: 'top-right',
   //duration: 4000
 });
     
     return; 
   }
  // Verificar si alguno de los campos está vacío
  if (!this.indice || !this.ambiente || !this.numProd) {
      // Mostrar mensaje de error       
      this.toaster.open({
        text: "Por favor, complete todos los campos antes de agregar.",
        caption: 'Mensaje',
        type: 'warning',
        position: 'top-right',
        //duration: 4000
      }); 
      return; // Detener la ejecución del método si algún campo está vacío
  }
  if (Number.parseInt(this.indice) < 1 || Number.parseInt(this.numProd) < 1) { 
    this.toaster.open({
      text: "Evite ingresar numeros negativos",
      caption: 'Mensaje',
      type: 'warning',
      position: 'top-right',
      //duration: 4000
    }); 
    return;
  }
  // Verificar si el índice ya existe en el arreglo
  const indiceExistente = this.TblAmbiente.some(item => item.indice === this.indice);
  if (indiceExistente) {
      // Mostrar mensaje de error si el índice ya existe
      this.toaster.open({
        text: "El índice ya existe. Por favor, ingrese un índice único.",
        caption: 'Mensaje',
        type: 'warning',
        position: 'top-right',
        //duration: 4000
      }); 
      return; // Detener la ejecución del método si el índice ya existe
  }
  // Si todos los campos están completos y el índice no existe, agregar el ambiente al arreglo
  /*this.TblAmbiente.push({
      indice: this.indice,
      ambiente: this.ambiente,
      numProd: this.numProd
  });*/
  this.spinner.show();
  this._OrdenService.GuardarAmbiente(this.selectedState.numero, this.indice,this.ambiente,this.numProd)
    .subscribe({
      next: data => {
        if (data.status == 200) {
          let artcl: IApiResponse = JSON.parse(JSON.stringify(data)); 
          this.indice = "";
          this.ambiente = "";
          this.numProd = "";
          this.listarAmbientes(this.selectedState.numero);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toaster.open({
            text: "Ocurrio un error",
            caption: 'Mensaje',
            type: 'warning',
            position: 'bottom-right',
            //duration: 4000
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
  // Limpiar los campos después de agregar el ambiente

}
eliminarAmbiente(indice: number) {
  Swal.fire({
    title: 'Mensaje',
    text: '¿Desea eliminar el índice?',
    icon: 'question',
    showCancelButton: true, // Habilita el botón de cancelación
    confirmButtonText: 'Sí, Eliminar', // Texto del botón de confirmación
    cancelButtonText: 'Cancelar', // Texto del botón de cancelación
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.spinner.show();

      this._OrdenService.EliminarAmbiente(indice).subscribe({
        next: data => {
          this.spinner.hide();

          if (data.status == 200) {
            this.toaster.open({
              text: "Ambiente eliminado",
              caption: 'Mensaje',
              type: 'success',
              position: 'bottom-right',
              duration: 3000 // O duración deseada
            });

            this.listarAmbientes(this.selectedState.numero);
          } else {
            this.toaster.open({
              text: "Ocurrió un error",
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
              duration: 3000 // O duración deseada
            });
          }
        },
        error: error => {
          this.spinner.hide();

          const errorMessage = error.message || 'Ocurrió un error desconocido';
          console.error('There was an error!', error);

          this.toaster.open({
            text: errorMessage,
            caption: 'Ocurrió un error',
            type: 'danger',
            position: 'bottom-right',
            duration: 3000 // O duración deseada
          });
        }
      });
    }
  });
}

  listarAmbientes(numerocotizacion:any){ 
   this.spinner.show();
   this._OrdenService
     .listarAmbiente(numerocotizacion)
     .subscribe(
       (response) => { 
          this.TblAmbiente=response;  
         this.spinner.hide();
       },
       () => {
         this.spinner.hide();
       }
     );
  }
  atras(){
    
    this.router.navigate(['/SolicitudPendiente']);
    }
  
  openRegisterProd(producto:any): void {    
    console.log(producto);
    if(this.itemCopiado){ 
      var codigoProductoCopiado=this.itemCopiado.codigoProducto.slice(0, 5);// Salida: PRTRS
      var codigoProducto=producto.codigoProducto.slice(0, 5);// Salida: PRTRS
      if(codigoProductoCopiado==codigoProducto){
        this.itemCopiado.id="";
        this.itemCopiado.codigoProducto=producto.codigoProducto.toString();
        this.itemCopiado.linea=producto.linea.toString();
        this.itemCopiado.nombreProducto=producto.nombreProducto.toString();
        this.itemCopiado.unidadMedida=producto.unidadMedida.toString();
        this.itemCopiado.alto=producto.alto.toString();
        this.itemCopiado.ancho=producto.ancho.toString();
        this.itemCopiado.familia=producto.familia.toString();
        this.itemCopiado.subFamilia=producto.subFamilia.toString();
        this.itemCopiado.precio=producto.precio.toString();
        this.itemCopiado.precioInc=producto.precioInc.toString();
        this.itemCopiado.igv=producto.igv.toString();
        this.itemCopiado.lote=producto.lote.toString();
        this.itemCopiado.fechaProduccion=""; 
        this.itemCopiado.turno="";
        this.itemCopiado.indiceAgrupacion="";
        producto=this.itemCopiado;
        this.itemCopiado=null;

      }else{        
        this.toaster.open({
          text: "El producto debe ser igual al que fue copiado",
          caption: 'Mensaje',
          type: 'warning',
          position: 'bottom-right',
          //duration: 4000
        });
      return;
      }
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true; 
    dialogConfig.panelClass = 'custom-dialog-container';
    //const cadenaCompleta = 'PRTRS0054'; 
    const dataToSend = { 
      producto: producto,
      Cotizacion: this.selectedState.numero, 
      CodigoSisgeco:this.selectedState.numdocref,
      ambiente:this.TblAmbiente
    };
    dialogConfig.data = dataToSend;
   
    dialogConfig.width ='1104px';
    const dialogRef = this.dialog.open(ProductosDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: data => {   
       if (data) {
          this.listarProductosSisgecoAndDcBlinds();
          this.listarAmbientes(this.selectedState.numero);
      } 
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
  
  openEditProd(producto:any): void {    
    console.log("EDICION");
    console.log(producto);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true; 
    dialogConfig.panelClass = 'custom-dialog-container';
    //const cadenaCompleta = 'PRTRS0054'; 
    
    const dataToSend = { 
      producto: producto,
      Cotizacion: this.selectedState.numero, 
      CodigoSisgeco:this.selectedState.numdocref,
      ambiente:this.TblAmbiente
    };
    dialogConfig.data = dataToSend;
    const dialogRef = this.dialog.open(ProductosDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: data => {   
       if (data) {
          this.listarProductosSisgecoAndDcBlinds();
          this.listarAmbientes(this.selectedState.numero);
      } 
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
    capitalizeKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      return obj.map(item => this.capitalizeKeys(item));
    }
  
    const newObj: any = {};
    
    Object.keys(obj).forEach(key => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      newObj[capitalizedKey] = this.capitalizeKeys(obj[key]);
    });
  
    return newObj;
  }
  itemCopiado: any = null;
  CopiarAtributo(item: any) {
    this.itemCopiado = item;
    this.toaster.open({
      text: item.codigoProducto + "Copiado",
      caption: 'Mensaje',
      type: 'success',
      position: 'bottom-right',
      //duration: 4000
    }); 
  }  
  CancelarCopiado() {
    this.itemCopiado = null;  
  }

  RegistrarProductoComponente(data){ 
    const capitalizedJson = this.capitalizeKeys(data);
    const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
    var idUser= userDataString.id.toString();
    capitalizedJson["IdUsuarioCrea"]=idUser;
    console.log(capitalizedJson);
    this.spinner.show(); 
    this._OrdenService.RegistrarDetalleOrdenProduccionComponente(capitalizedJson,"Componente")
      .subscribe({
        next: response => {
          if (response.status == 200) { 
  const respuesta = response.json.respuesta;
  const id = response.json.id;
  switch(respuesta){
    case "Ok": 
      Swal.fire({
        title: 'Mensaje',
        text: 'Operacion realizada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      }); 
      this.listarProductosSisgecoAndDcBlinds();
      break;
    case "Ya existe":
      Swal.fire({
        title: 'Mensaje',
        text: 'Ya existe la cotizacion ',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      break;
    default:
      ;
       } 
            this.spinner.hide();
          } else {
            this.spinner.hide();
            console.log(response);
            this.toaster.open({
              text: "Ocurrio un error: "+response.json.respuesta,
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
              //duration: 4000
            });
          }
        },
        error: error => {
          this.spinner.hide();
          console.log(error);
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

   }
  openRegisterProyecto(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ProyectoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: data => {   
       if (data) { 
        this.ListarProyecto();
        /*
        this.toaster.open({
          text: `Proyecto agregado ${data.correo}.`,
          caption: 'Mensaje',
          type: 'success',
          position:'bottom-right'
        });*/
  
      } 
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
  //BUSQUEDA DINAMICA
   
   stateCtrl = new FormControl();
   filteredStates: Observable<any[]>;
   selectedState: any;
   isRequesting = false;
   obtenerOrdenes(value: string): Observable<any[]> {
   
    return this._OrdenService.obtenerOrdenesPorNumero(value)
      .pipe(
        catchError(error => {
          catchError(this.handleError)
          return [];
        })
      );
  }
  ordenes:any;
  onSelectState(state: any) { 
    console.log('El objeto seleccionado ha cambiado:', state);
    if(state){

      this.Orden.id="";
      this.Orden.numeroCotizacion =state.numero;
      this.Orden.codigoSisgeco=state.numdocref;
      this.Orden.numdoCref =state.numdocref;
      this.Orden.rucCliente=state.ruc;
      this.Orden.cliente=state.cliente;
      this.Orden.total=state.total;
      this.Orden.fechaCotizacion=state.fecha_cotizacion;
      this.Orden.fechaVenta=state.fechaVenta;
      this.Orden.tipoMoneda=state.tipomoneda;
      this.Orden.tipoCambio=state.tipocambio;
      this.Orden.subTotal =state.subtotal;
      this.Orden.monto=state.total;
      this.Orden.codigoVendedor=state.codvendedor;
      this.Orden.nombreVendedor=state.nomVendedor;
      this.Orden.distrito=state.distrito;
      this.Orden.provincia=state.provincia;
      this.Orden.departamento=state.departamento;
      this.Orden.observacion=state.observacion;
      this.Orden.observacion=state.observacion2;
      this.Orden.totalIgv=state.totalIGV;
      this.Orden.direccion=state.direccion;
      this.Orden.telefono=state.telefono;
      this.Orden.archivo=state.archivo;
      this.Orden.tipoCliente=state.tipoCliente;
      this.Orden.fechaSap=state.fecha_cotizacion;
      this.Orden.docEntrySap=state.docEntrySap;
      this.Orden.docStatusSap=state.docStatusSap;
      //this.Orden.pa=state.Pase; 
      this.selectedState = state;
      this.Productos=[];
       
      this.listarAmbientes(this.selectedState.numero);
      
      this.listarOrdenPorCotizacion(this.Orden.numeroCotizacion);
    }
  } 
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Ocurrió un error:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(`Código de error ${error.status}, ` + `body: ${error.error}`);
    }
    // Retorna un observable con un mensaje de error
    return throwError('Hubo un problema al obtener los datos. Por favor, intenta de nuevo más tarde.');
  }

  OrdeDeVentaPendiente=[];
  //#region  ::::::::::::::::::SAP
  async ListarOrdenesSap() {
    this.spinner.show();
    this.sapService.ListarOrdenes().subscribe(
      datas => {
        var data=datas.value;
        console.log('Datos originales:', data);
  
        // Verificar si la respuesta es un array
        if (!Array.isArray(data)) {
          console.error('La respuesta no es un array:', data);
          return; // Salir de la función si no es un array
        }
  
        const fieldMap = {
          DocEntry: 'docEntrySap',
          DocStatus:'docStatusSap',
          DocNum: 'numero',
          NumAtCard: 'numdocref',
          CardCode: 'ruc',
          CardName: 'cliente',
          DocTotal: 'total',
          DocDate: 'fecha_cotizacion',
          TaxDate: 'fechaVenta',
          DocCur: 'tipomoneda',
          DocRate: 'tipocambio',
          SubTotal: 'subtotal',
          SlpCode: 'codvendedor',
          SlpName: 'nomVendedor',
          ZipCode: 'distrito',
          County: 'provincia',
          State: 'departamento',
          Comments: 'observacion',
          VatSum: 'totalIGV',
          Street: 'direccion',
          Phone: 'telefono',
          GrpName: 'tipoCliente',
          ItemCode: 'codarticulo',
          LineNum: 'linea',
          ItemName: 'des',
          unitMsr: 'codunidad',
          Quantity: 'cantidad',
          Alto: 'alto',
          Ancho: 'ancho',
          Familia: 'Familia',
          CodFamilia: 'codfamilia',
          CodSubfamilia: 'codsubfamilia',
          Price: 'valor',
          PriceAfVAT: 'valorinc',
          //VatSum: 'igv'
        };
  
        const renameFields = (item: any) => {
          return Object.keys(item).reduce((acc, key) => {
            const newKey = fieldMap[key] || key; // Usa el nombre mapeado o deja el original si no hay mapeo
            acc[newKey] = item[key];
            return acc;
          }, {} as any);
        };
  
        // Renombrar los campos en la lista principal y en cada línea de los elementos
        this.OrdeDeVentaPendiente = data.map((order: any) => {
          const renamedOrder = renameFields(order);
          
          // Verificar que `Lineas` existe y es un array antes de mapearlo
          renamedOrder.Lineas = Array.isArray(order.Lineas) 
            ? order.Lineas.map((linea: any) => renameFields(linea))
            : [];
            
          return renamedOrder;
        });
  
        console.log('Datos con nombres renombrados:', this.OrdeDeVentaPendiente);
        
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        console.error('Error en la solicitud autenticada:', error);
      }
    );
  }
  
  
  
  //#endregion
  nuevaOPEdicion:boolean=true;
  NuevaOpSap(){
    this.nuevaOPEdicion= true;//INHABILITAR COMBO SAP
    this.Orden={};
    this.Productos=[];
    this.ordenes=null;
  }
  EdiatOpDc(){
    this.nuevaOPEdicion= false;//HABILITAR INPUT DECOBLINDS
    this.Orden={};
    this.Productos=[];
    this.ordenes=null;
  }
  

  selectedCotizacion: string = '--';
  filteredCotizaciones: any[] = [];
  cotizaciones: any[] = [];  // Este es el array original con todas las cotizaciones.
  searchValue: string = '';   // Para guardar el valor de búsqueda.
  
  filterCotizaciones2(event: any) {
    this.searchValue = event.target ? event.target.value : ''; // Captura el valor de búsqueda
    this.filteredCotizaciones = this.cotizaciones.filter(c =>
      c.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }
  
  // Método que se ejecuta cuando no se encuentran resultados en la búsqueda
  refreshCotizaciones(searchValue: string) {
    console.log("BUSCANDO ");
    console.log(searchValue);
    /*this.ordenproduccionGrupoService.ListarFiltrosByNum(searchValue)
      .subscribe(data => {
        if (data.status === 200) {
          const datos = data.json();
          this.cotizaciones = datos.cotizaciones;
          this.filteredCotizaciones = this.cotizaciones.filter(c =>
            c.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
      });*/
  }
}

