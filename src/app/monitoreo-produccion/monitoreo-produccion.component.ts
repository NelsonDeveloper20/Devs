import { Component, ElementRef, OnInit, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { MonitoreoService } from '../services/monitoreo.service';
import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
declare var $: any; // Declara la variable $ para usar jQuery
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetalleMonitoreoDialogComponent } from './detalle-monitoreo-dialog/detalle-monitoreo-dialog.component';
import { SapService } from '../services/sap.service';
import { DetalleSalidaEntradaSapComponent } from './detalle-salida-entrada-sap/detalle-salida-entrada-sap.component';
import { DetalleFormulacionComponent } from './detalle-formulacion/detalle-formulacion.component';
import { DetalleFormulacionRollerzebraComponent } from './detalle-formulacion-rollerzebra/detalle-formulacion-rollerzebra.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
declare var $: any; // Declara la variable $ para usar jQuery
@Component({
  selector: 'app-monitoreo-produccion',
  templateUrl: './monitoreo-produccion.component.html',
  styleUrls: ['./monitoreo-produccion.component.css']
})
export class MonitoreoProduccionComponent implements OnInit {
  color: ThemePalette = 'primary'; //accent   //warn
  mode: ProgressBarMode = 'buffer';
  value = 50;
  bufferValue = 75;
  
  displayedColumns: string[] = ['expand', 'ruc', 'razonSocial', 'cotizacion', 'producto', 'codProducto', 'accionamiento', 'cantidad', 'cantProducto', 'estado', 'tipoOperacion', 'subtable'];
 
  estaciones(){
    
    this.router.navigate(['/Estacion-Trabajo']);
    }
      
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private toaster: Toaster,
    private spinner: NgxSpinnerService, 
    private _service: MonitoreoService,private renderer: Renderer2,
    private _sapService:SapService,
        private modalService: NgbModal,
  ) {  
  } 
   // Método para guardar las fechas seleccionadas en localStorage
   guardarFechasExplocion() {
    localStorage.setItem('fechaInicioExplocion', this.fechaInicio);
    localStorage.setItem('fechaFinExplocion', this.fechaFin);
  }
  // Método para guardar las fechas seleccionadas en localStorage
  guardarFechasSapEntradaSalida() {
   localStorage.setItem('fechaInicioSap', this.fechaInicioSap);
   localStorage.setItem('fechaFinSap', this.fechaFinSap);
 }
  ngOnInit(): void {  
    
    // Recuperar la fecha guardada en localStorage (si existe)
    const storedFechaInicio = localStorage.getItem('fechaInicioExplocion');
    const storedFechaFin = localStorage.getItem('fechaFinExplocion');
    const fecInicio = new Date();
    const fecIFin = new Date();
    // Ajustar la hora a medianoche para evitar problemas de zona horaria
    fecInicio.setHours(0, 0, 0, 0);
    fecIFin.setHours(0, 0, 0, 0);
    // Si ya hay una fecha guardada, usarla
    if (storedFechaInicio) {
    this.fechaInicio = storedFechaInicio;
    } else {
    // Si no hay fecha guardada, asignar la fecha actual menos un día
    fecInicio.setDate(fecInicio.getDate() - 1);
    this.fechaInicio = fecInicio.toISOString().split('T')[0];  // YYYY-MM-DD
    }
    // Usar la fecha actual para fechaFin
    this.fechaFin = storedFechaFin ? storedFechaFin : fecIFin.toISOString().split('T')[0]; // YYYY-MM-DD


    //SAP
    
    // Recuperar la fecha guardada en localStorage (si existe)
    const storedFechaInicioSap = localStorage.getItem('fechaInicioSap');
    const storedFechaFinSap = localStorage.getItem('fechaFinSap');
    const fecInicioSap = new Date();
    const fecIFinSap = new Date();
    // Ajustar la hora a medianoche para evitar problemas de zona horaria
    fecInicioSap.setHours(0, 0, 0, 0);
    fecIFinSap.setHours(0, 0, 0, 0);
    // Si ya hay una fecha guardada, usarla
    if (storedFechaInicioSap) {
      this.fechaInicioSap = storedFechaInicioSap;
    } else {
      // Si no hay fecha guardada, asignar la fecha actual menos un día
      fecInicioSap.setDate(fecInicioSap.getDate() - 1);
      this.fechaInicioSap = fecInicioSap.toISOString().split('T')[0];  // YYYY-MM-DD
    }
    // Usar la fecha actual para fechaFin
    this.fechaFinSap = storedFechaFinSap ? storedFechaFinSap : fecIFinSap.toISOString().split('T')[0]; // YYYY-MM-DD


    this.ListarMonitoreoExplocion();     
  }  
showfilter=false; 


showfilter2=false; 
showfilter3=false;
showfilter4=false;
cotizacion2: string; 
fechaInicio2: Date;
fechaFin2: Date;  
showFilter(){ 
  if(this.indexTab==3){
    this.showFilter4();//SALIDA ENTRADA SAP 

  }else 
  if(this.indexTab==2){
    this.showFilter3();//SALIDA ENTRADA SAP 
   
  }else{
    
  if(this.indexTab!=0){
    this.showFilter2();
   }else{
     this.showfilter=!this.showfilter; 
   }
  }

setTimeout(() => {       
  $('#cboCotizacion1Select').select2({
    placeholder: '--Seleccione--'
  });         
  $('#cboCotizacion2Select').select2({
    placeholder: '--Seleccione--'
  });   
}, 1000);
}
showFilter2(){
this.showfilter2=!this.showfilter2; 

setTimeout(() => { 
  $('#cboCotizacion2Select').select2({
    placeholder: '--Seleccione--'
  });   
}, 1000);
} 

showFilter3(){
  this.showfilter3=!this.showfilter3; 
   
  } 
showFilter4(){
  this.showfilter4=!this.showfilter4; 
   
  } 
  //#region ABRIR EXPLOCIÓN
  dialogRef:any;
  AbrirExplocionComponentes(item:any): void {   

    const productosArray = item.productos.split(',').map(p => p.trim());

    const productosConFormulacion = [
      "PRTRSMan", "PRTRSMot", "PRTRZ",
      "PRTRM00000016", "PRTRM00000001",
      "PRTRH00000001", "PRTRF00000001",
      "PRTLU00000001", "PRTLU00000002", "PRTLU00000003"
    ];
  
    //const tieneFormulacion = productosArray.some(p => productosConFormulacion.includes(p));
  // Verificar si algún producto contiene "PRTCV" o está en la lista
  const tieneFormulacion = productosArray.some(p => {
    return productosConFormulacion.includes(p) || 
           p.toUpperCase().includes('PRTCV');
  });
    if (!tieneFormulacion) {
      Swal.fire({
        title: 'Mensaje',
        text: 'Ninguno de los productos tiene formulación.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      }); 
      return;
    }
/*
  this.router.navigate(['/Excel'], {
    state: { data: item }
  });
return;*/
    console.log("ABRIENDO GRUPO =======> ",item);

     // AQUÍ VA EL NUEVO CÓDIGO - Mostrar opciones de explosión
 Swal.fire({
  title: 'Seleccione tipo de explosión',
  text: '¿Qué tipo de explosión desea realizar?',
  icon: 'question',
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: 'Explosión Normal',
  denyButtonText: 'Explosión tipo Excel',
  cancelButtonText: 'Cancelar',
  confirmButtonColor: '#3085d6',
  denyButtonColor: '#28a745',
  cancelButtonColor: '#6c757d',
  allowOutsideClick: false,
  allowEscapeKey: false
}).then((result) => {
  if (result.isConfirmed) {
    // Opción 1: Explosión Normal (abre el diálogo)
    this.abrirExplosionNormal(item);
  } else if (result.isDenied) {
    // Opción 2: Explosión tipo Excel (navega a Excel)
    this.router.navigate(['/Excel'], {
      state: { data: item }
    });
  } else if (result.isDismissed) {
    // Opción 3: Cancelar (no hace nada)
    console.log('Acción cancelada por el usuario');
  }
});

  }
  // Extrae la lógica de explosión normal a un método separado
private abrirExplosionNormal(item: any): void {
  console.log("ABRIENDO GRUPO =======> ", item);
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.panelClass = 'custom-dialog-container';
  dialogConfig.data = item;

  this.dialogRef = this.dialog.open(DetalleFormulacionComponent, dialogConfig);

  this.dialogRef.afterClosed().subscribe({
    next: data => {
      if (data) {
        Swal.fire({
          title: 'Mensaje',
          text: 'Explosión realizada',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        }).then(() => {
          this.ListMonitoreoExplocion = [];
          this.ListarMonitoreoExplocion();
        });
      }
    },
    error: error => {
      var errorMessage = error.message;
      console.error('There was an error!', error);

      this.toaster.open({
        text: errorMessage,
        caption: 'Ocurrió un error',
        type: 'danger',
      });
    }
  });

  
}
  //#endregion

Fecha:Date=new Date();
//#region LISTAR PARA EXPLOCION

toggleExpand(item: any) {
  this.ListMonitoreoExplocion.forEach(data => {
    if (data !== item) {
      data.isExpand = false; // Cierra todos los elementos que no sean el seleccionado
    }
  });
  item.isExpand = !item.isExpand; // Abre o cierra el elemento seleccionado
}
ListMonitoreoExplocion:any=[];

cotizacion: string; 
fechaInicio: string;
fechaFin: string; 
ListarMonitoreoExplocion() { 
  this.guardarFechasExplocion();
  const cotizacion = this.cotizacion || "--";
    const fechaInicio = this.fechaInicio ? this.fechaInicio.toString() : "--";
    const fechaFin = this.fechaFin ? this.fechaFin.toString() : "--";

  this.spinner.show();
  this._service.ListarMonitoreo(cotizacion,fechaInicio,fechaFin).subscribe(
    (data: any) => {
      if (data && data.status === 200) {  
        this.ListMonitoreoExplocion = data.json.map(item => ({ ...item, isExpand: false }));
        this.spinner.hide();      
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
filterText: string = '';
filteredList() {
  if (!this.filterText) {
    return this.ListMonitoreoExplocion;
  }
  return this.ListMonitoreoExplocion.filter(item => {
    const keys = ['ruc', 'razonSocial', 'cotizacion', 'cotizacionGrupo', 'codigoProducto', 'nombreProducto', 'accionamiento', 'cantidad', 'cantidadProductos', 'estado'];
    return keys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(this.filterText.toLowerCase());
      }
      return false;
    });
  });
}
//#endregion

//#region LISTAR COMPONENTE DEL PRODDUCTO POR GRUPO
ListComponenteProducto:any=[];
ListarComponteProductoByGrupo(Grupo) { 
  this.spinner.show();
  this._service.ListarComponenteDelProducto(Grupo,"1").subscribe(
    (data: any) => {
      if (data && data.status === 200) {  
        this.ListComponenteProducto = data.json.map(item => ({ ...item, agregado: "NO" ,cantidad:"",merma:"" }));
        this.spinner.hide();      
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
agregarComponente(){
  this.ListComponenteProducto.push(
    {
      componente:"Agregado",
      codigo:"",
      nombre:"",
      agregado:"SI"
  });
}

guardarComponentes() {
  // Aquí tienes acceso a todos los datos, incluidos los cambios realizados por el usuario
  console.log('Datos de componentes:', this.ListComponenteProducto);
  
  // Si deseas convertir los datos a formato JSON
  const datosJSON = JSON.stringify(this.ListComponenteProducto);
  console.log('Datos en formato JSON:', datosJSON);
}
eliminarItemAgregado(item: any) {
  const index = this.ListComponenteProducto.indexOf(item);
  if (index !== -1) {
    this.ListComponenteProducto.splice(index, 1);
  }
}
clonarComponente(item:any){  
  // Encuentra el índice del elemento seleccionado
  const index = this.ListComponenteProducto.indexOf(item);
  
  // Inserta el nuevo elemento justo después del elemento seleccionado
  this.ListComponenteProducto.splice(index + 1, 0, {
    componente: "Clonado",
    codigo: item.codigo,
    nombre: item.nombre
  });
/*
  console.log(item);
  this.ListComponenteProducto.push(item);*/
}
//#endregion
isFilterButtonDisabled = false;
indexTab=0; 
onTabChange(event: MatTabChangeEvent) {
  this.indexTab=event.index;
  console.log('Index: ' + event.index);
  console.log('Tab Label: ' + event.tab.textLabel);
 
  if(event.index==2){ //SAP ENTRADA SALIDA
    if(this.ListMonitoreoExplocionSapSalidaEntrada.length==0){
      console.log("BUSCARA"); 
      this.ListarMonitoreoExplocionSapSalidaEntrada();
    }
  }
  if(event.index==3){ //SAP ENTRADA SALIDA
    if(this.ListMonitoreoExplocionSapSalidaEntradaRevertido.length==0){
      console.log("BUSCARA"); 
     // this.ListarMonitoreoExplocionSapSalidaEntradaRevertido();
    }
  }

}
//#region  Carga

files: any[] = []; 
existearchivo:boolean=false;
porCargar=true;
  onFileDropped($event) {
    this.porCargar=false;//archivo seleccionado
    this.prepareFilesList($event);
  } 
  fileBrowseHandler(files:any) {
    var value=files.target.files
    this.prepareFilesList(value);
  } 
  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.porCargar=true;
    this.error=false;
    this.existearchivo=false;
  } 
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        
    this.porCargar=false;//archivo seleccionado
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
            this.mostrarVistaPrevia(this.files[0]);
          } else {
            this.files[index].progress += 25;
          }
        }, 200);
      }
    }, 1000);
  } 
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  } 
  formatBytes(bytes:any, decimals:any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
 
error: boolean = false;
previewHeaders: string[] = [];
previewData: any[] = [];
dataExcelCarga:any;
 
htmlErrores = [];
mostrarVistaPrevia(file: any) {
  // Validar que el archivo sea Excel
  if (file.name.endsWith('.xlsx') || file.name.endsWith('.xlsm')) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0]; // Nombre de la primera hoja
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Obtener el rango específico desde B7 hasta P7 y hacia abajo
      const range = XLSX.utils.decode_range(worksheet['!ref'] || ''); // Obtener el rango completo
      range.s.r = 6; // Fila 7 (índice 6 porque es base 0)
      range.s.c = 1; // Columna B (índice 1)
      range.e.c = 15; // Columna P (índice 15)
      worksheet['!ref'] = XLSX.utils.encode_range(range); // Establecer el nuevo rango

      // Convertir el rango seleccionado en formato JSON
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Extraer las cabeceras desde B7 hasta P7
 /*
      // Convertir la primera tabla de la primera hoja en formato JSON
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); 
      // Mostrar vista previa
*/
      this.previewHeaders = jsonData[0] || [];
      this.previewData  = jsonData.slice(1); // Se excluye la primera fila de encabezados 
 
      this.existearchivo=true;
      // Cabeceras esperadas
      const expectedHeaders = [
        'COTIZACION',
        'GRUPOCOTIZACION',
        'ITEMCODE',
        'QUANTITY',
       // 'ACCTCODE',
        'COSTINGCODE',
        'COSTINGCODE2',
        'COSTINGCODE3',
        'COSTINGCODE4',
        'COSTINGCODE5',
        'FAMILIAPT',
        'SUBFAMILIAPT',
        'BATCHNUMBERCODE',
        'BATCHQUANTITY',
        'SERIALNUMBERCODE',
        'SERIALQUANTITY'
      ];

      // Columnas que pueden estar vacías
      const allowedEmptyColumns = [ 'COSTINGCODE',	'COSTINGCODE2',	'COSTINGCODE3',	'COSTINGCODE4',	'COSTINGCODE5',
       'BATCHNUMBERCODE',	'BATCHQUANTITY',	'SERIALNUMBERCODE',	'SERIALQUANTITY',
      ];

      // Función de normalización
      const normalize = (header: string) => header.trim().toUpperCase();

      // Limpiar errores previos
      this.htmlErrores = [];

      // Validar cabeceras
      const validateHeaders = (headers: string[], expected: string[]): boolean => {
        if (headers.length !== expected.length) {
          console.log('Número de cabeceras no coincide. Esperado:', expected.length, 'Recibido:', headers.length);
          this.htmlErrores.push(`ERROR: Número de cabeceras no coincide. Esperado: ${expected.length} Recibido: ${headers.length}`);
          return false;
        }
        for (let i = 0; i < headers.length; i++) {
          if (normalize(headers[i]) !== normalize(expected[i])) {
            console.log('Cabecera no coincide en la posición', i, 'Esperado:', normalize(expected[i]), 'Recibido:', normalize(headers[i]));
            this.htmlErrores.push(`ERROR: Cabecera no coincide en la posición ${i} Esperado: ${normalize(expected[i])} Recibido: ${normalize(headers[i])}`);
            return false;
          }
        }
        return true;
      };

      // Realizar la validación
      this.error = !validateHeaders(this.previewHeaders, expectedHeaders);

      // Validar las filas 
      const fullJsonData = jsonData.map((row, index) => {
        if (index === 0) {
          return null; // Saltar la fila de cabeceras
        }
        const obj: any = {};
        this.previewHeaders.forEach((header, i) => {
          obj[normalize(header)] = String(row[i] || '');
        });
 
        // Validar que otros campos no estén vacíos (excepto los permitidos)
        
        for (let key in obj) { 
          if (!allowedEmptyColumns.includes(key) && (!obj[key] || obj[key].trim() === '')) { 
            this.htmlErrores.push(`Error en la fila ${index + 0}: '${key}' está vacío.`);
            this.error = true;
          }
        }

        return obj;
      }).filter(row => row); // Filtrar filas nulas

      // Almacenar el JSON completo
      this.dataExcelCarga = fullJsonData;

    };
    reader.readAsBinaryString(file);
  } else {
    Swal.fire({
      title: 'Advertencia',
      text: 'Solo se pueden subir archivos Excel xlsm',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });
  }
}

  
  descargarArchivo() {
    this.spinner.show();
    this._service.DescargarPlantilla().subscribe(
      (blob: Blob) => {
        this.spinner.hide();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Plantilla_Carga.xlsm"; // Especificar el nombre del archivo
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

  CargarPlantilla(){
    const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
    var idUsuario= userDataString.id.toString(); 
    if (!userDataString) {   this.toaster.open({
      text: "Su sessión ha caducado",
      caption: 'Mensaje',
      type: 'danger',
      // duration: 994000
    });
      this.router.navigate(['/Home-main']);
      return;
    }  
    Swal.fire({
      title: '¿Cargar?',
      text: '¿Deseas cargar el archivo?',
      icon: 'question', // Cambié el icono a 'question' ya que estamos preguntando al usuario
      showCancelButton: true,
      confirmButtonText: 'Si, Cargar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        // Acción de carga del archivo, suponiendo que tienes una función para esto
        //this.cargarArchivo();
        /*
    console.log("ENVIADO");
    console.log(this.dataExcelCarga);
    this.dataExcelCarga = this.dataExcelCarga.map(item => (
      { ...item,  
        Usuario:idUsuario,  
         }));

  const jsonData = JSON.stringify(this.dataExcelCarga);
  console.log(jsonData);
  this.spinner.show();*/
  console.log("ENVIADO");
  console.log(this.dataExcelCarga);
  
  const requestData = {
    cotizacion: this.dataExcelCarga[0].COTIZACION,  // Usamos el primer item para cotizacion
    grupoCotizacion: this.dataExcelCarga[0].GRUPOCOTIZACION,  // Usamos el primer item para grupoCotizacion
    usuario: idUsuario.toString(),
    documentLines: this.dataExcelCarga.map(item => ({
      itemCode: item.ITEMCODE, // Convertir a camelCase
      quantity: parseFloat(item.QUANTITY),  // Convertir a decimal
     // acctCode: item.ACCTCODE, // Convertir a camelCase
      costingCode: item.COSTINGCODE, // Convertir a camelCase
      costingCode2: item.COSTINGCODE2, // Convertir a camelCase
      costingCode3: item.COSTINGCODE3, // Convertir a camelCase
      costingCode4: item.COSTINGCODE4, // Convertir a camelCase
      costingCode5: item.COSTINGCODE5, // Convertir a camelCase
      familiaPT: item.FAMILIAPT, // Convertir a camelCase
      subFamiliaPT:item.SUBFAMILIAPT,
      batchNumberCode: item.BATCHNUMBERCODE, // Convertir a camelCase
      batchQuantity: item.BATCHQUANTITY ? parseFloat(item.BATCHQUANTITY) : 0,  // Convertir a decimal si no está vacío
      serialNumberCode: item.SERIALNUMBERCODE, // Convertir a camelCase
      serialQuantity: item.SERIALQUANTITY ? parseFloat(item.SERIALQUANTITY) : 0  // Convertir a decimal si no está vacío
    }))
  };
  // Aseguramos que la estructura final es correcta
  const jsonData = JSON.stringify(requestData);
  console.log(jsonData);
  
this.spinner.show();
  this._service.CargarExplocionExcel(jsonData)
    .subscribe({
      next: response => {
        this.spinner.hide();
        console.log(response);
        if (response.status == 200) { 
              const respuesta = response.json.respuesta;
              const id = response.json.id; 
              console.log("RESPUESTA");
             if(respuesta=="OK"){  
        Swal.fire({
          title: 'Mensaje',
          text: 'Plantilla cargada correctamente y enviado a SAP',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });
        this.deleteFile(0); 
        this.ListarMonitoreoExplocion();
             }else{
              const listError = response.json.listaError;
              this.listErrrores=listError;
              this.showTablePopup();
             }
          }else{
            /*this.toaster.open({
              text: "Ocurrio un error al enviar",
              caption: 'Mensaje',
              type: 'danger',
              // duration: 994000
            });*/
            Swal.fire({
              title: 'Ocurrió un error al enviar',
              html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
              icon: 'warning',
              width: '600px', // Establece un tamaño fijo para la alerta
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false
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
    });
  }
  // Función que valida si el contenido es JSON o no
  processResponse(detalle) {
  // Intentamos parsear el contenido como JSON
  try {
    // Si el contenido ya es un objeto, no lo necesitamos parsear, solo procesamos el objeto
    if (typeof detalle === 'object') {
      return this.generateHtmlFromJson(detalle); // Procesamos como JSON
    }

    // Si es un string, intentamos parsearlo
    let parsedJson = JSON.parse(detalle);
    return this.generateHtmlFromJson(parsedJson);
  } catch (e) {
    // Si ocurre un error, es probable que no sea JSON, por lo que mostramos el contenido como texto
    return detalle; // Mostramos el texto tal cual
  }
}

// Función para generar el HTML a partir de un objeto JSON
  generateHtmlFromJson(jsonObj) {
  let htmlContent = '<ul>'; // Comenzamos una lista no ordenada
  for (let key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      // Si la propiedad es un objeto (como 'errors'), lo procesamos recursivamente
      if (typeof jsonObj[key] === 'object') {
        htmlContent += `<li><strong>${key}:</strong>${this.generateHtmlFromJson(jsonObj[key])}</li>`;
      } else {
        htmlContent += `<li><strong>${key}:</strong> ${jsonObj[key]}</li>`;
      }
    }
  }
  htmlContent += '</ul>'; // Cerramos la lista
  return htmlContent;
}
  listErrrores=[];
  showTablePopup() {
    const tableHTML = `
      <div class="table-responsive">
        <section tabindex="0" class="example-containerss" style="height: 323px !important;">
          <table class="table-sm table"   style="width: 100%;text-align: justify;font-size: 14px;">
            <thead class="sticky-top"> 
              <tr>
                <th nowrap>Cotización</th>
                <th nowrap>Grupo</th>
                <th nowrap>Producto</th>
                <th nowrap>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              ${this.listErrrores.map(item => `
                <tr>
                  <td nowrap>${item.cotizacion}</td>
                  <td nowrap>${item.grupo}</td>
                  <td nowrap>${item.producto}</td>
                  <td nowrap style="color: #e00a2a; font-weight: 600;">${item.mensaje}</td>
                </tr>
              `).join('')} 
            </tbody>
          </table>
        </section>
      </div> 
    `;
  
    Swal.fire({
      title: 'Errores al cargar',
      html: tableHTML,
      confirmButtonText: 'Cerrar',
      customClass: {
        container: 'my-swal-container', // Aplica la clase de contenedor personalizada
      },
    });
  }
//#endregion

//#region MANTENIMIENTO EXPLOCIÓN
lisComponente: any[] = [
  { codigo: 'ACCRS00000011', nombre: 'ACCRS00000011 : ADAPTADOR SL ROLLEASE 1-1/4 - COLOR:WHITE', color: "BLUE", unidad: "UNK" },
  { codigo: 'ACCRS00000012', nombre: 'ACCRS00000012 : ADAPTADOR SL ROLLEASE 1-1/4 - COLOR:BROWN', color: "BLUE", unidad: "UNK" },
  { codigo: 'ACCRS00000013', nombre: 'ACCRS00000013 : ADAPTADOR SL ROLLEASE 1-1/4 - COLOR:BLACK', color: "BLUE", unidad: "UNK" },
  { codigo: 'ACCRS00000014', nombre: 'ACCRS00000014 : ADAPTADOR SL ROLLEASE 1-1/2 - COLOR:WHITE', color: "BLUE", unidad: "UNK" }
];

filteredListComponente = this.lisComponente;

applyFilter(event: any) {
  const valor = event.target.value;
  this.filteredListComponente = this.lisComponente.filter(option => option.codigo.toLowerCase().includes(valor.toLowerCase()));
}

onNombreChange(event: any, element: any) {
  const selectedOption = this.lisComponente.find(option => option.codigo === event.value);
  if (selectedOption) {
    element.componente = selectedOption.codigo;
    element.descripcionComponente = selectedOption.nombre;
    element.unidadMedida = selectedOption.unidad;
    element.color = selectedOption.color;
  }
}
componentes: Componente[] = [
  {
    idExplocion: 2696,
    cotizacion: '008996',
    producto: 'null',
    componente: 'ACCRS00000013',
    opciones: [ 
    ],
    descripcionComponente: 'null',
    color: 'null',
    unidadMedida: 'null',
    cantidad: 5,
    merma: 0,
    codigoProducto: 'PRTRS',
    tipoProducto: 'PRTRS-MANUAL',
    codProducto: 'null',
    accionamiento: 'null',
    idDetalle: 622
  },
  {
    idExplocion: 2696,
    cotizacion: '008996',
    producto: 'null',
    componente: 'ACCRS00000014',
    opciones: [ 
    ],
    descripcionComponente: 'null',
    color: 'null',
    unidadMedida: 'null',
    cantidad: 5,
    merma: 0,
    codigoProducto: 'PRTRS',
    tipoProducto: 'PRTRS-MANUAL',
    codProducto: 'null',
    accionamiento: 'null',
    idDetalle: 622
  }
  // Otros componentes...
];
//COMBO COMPONENTE EN MANTENIMIENTO EXPLOCION
// Método para manejar el cambio de selección en mat-select
isOptionInFilteredOptions(codigo: string, filteredOptions: any[]): boolean {
  return filteredOptions.some(option => option.codigo === codigo);
}
onNombreChangeMantenimiento(event: any, element: any) {
  console.log(event);
  const value = event.value;  
  console.log(element);
  // Función para asignar propiedades comunes
  const asignarPropiedades = (selectedOption: any) => {    
    console.log(selectedOption);
    if (selectedOption) {
      element.descripcion = selectedOption.nombre;
      element.cod_componente = selectedOption.codigo;
      element.unidad = selectedOption.unidad || '';
      element.color = selectedOption.color || '';
    }
  }; 
  if (element.componente !== 'Agregado' && !this.CotizacionsBuscar.includes('-0')) {
    console.log("ingresa producto");
    const selectedOption = this.lisComponenteMantenimiento.find(option =>
      option.codigo === value && option.codigoProducto === element.codigo_Producto.substring(0, 5)
    );
    asignarPropiedades(selectedOption);
  } else {
    const selectedOption = this.lisComponenteMantenimiento.find(option =>
      option.codigo === value
    );
    console.log("ingresa agregado");
    asignarPropiedades(selectedOption);
  }
}

lisComponenteMantenimiento: any[] = [];
listarComponestePorCodigoProds(productos,grupo){    
  this.spinner.show();   
this._service.ListarComponentesPorCodigosProducto(productos,grupo).subscribe(
  (data: any) => { 
      this.lisComponenteMantenimiento =  data;
      console.log(this.lisComponenteMantenimiento);
      this.spinner.hide();   
      //this.filteredListComponente = this.lisComponente;

      // Actualiza la lista de opciones filtradas para cada componente
      this.ListMantenimeintoExplocion.forEach(comp => {
        comp.filteredOptions = this.lisComponenteMantenimiento; // Inicializa con la lista completa
      });

  },
  (error: any) => {
    this.spinner.hide();
    console.error('Error al obtener Componentes:', error); 
  }
);
}
filteredListComponenteMantenimiento = this.lisComponenteMantenimiento;    
// Método para filtrar opciones según el input de búsqueda
applyFilterMantenimiento(event: any, comp: any) {
  const valor = event.target.value.toLowerCase();
  comp.filteredOptions = this.lisComponenteMantenimiento.filter(option => 
    option.codigo.toLowerCase().includes(valor)
  );
} 

agregarComponenteMantenimiento(){
  const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
  var idUsuario= userDataString.id.toString(); 
  if (!userDataString) {   this.toaster.open({
    text: "Su sessión ha caducado",
    caption: 'Mensaje',
    type: 'danger',
    // duration: 994000
  });
    this.router.navigate(['/Home-main']);
    return;
  }  
  this.ListMantenimeintoExplocion.push(
    {
      id:0,
      codigo_Producto:'Agregado',
      nombre_Producto:'Agregado',
      //componentes
      componente:"Agregado",
      cod_Componente:"",
      descripcion:"",
      agregado:true,
      color:'',
      unidad:'',
      cantidad:'',
      merma:'',
      numeroCotizacion:this.ListMantenimeintoExplocion[0].numeroCotizacion,
      cotizacionGrupo:this.CotizacionsBuscar,//ES GRUPO
      idUsuarioCrea:idUsuario,  
      filteredOptions: this.lisComponenteMantenimiento
      
  });
}


eliminarItemAgregadoMantenimiento(item: any) {
  const index = this.ListMantenimeintoExplocion.indexOf(item);
  if (index !== -1) {
    this.ListMantenimeintoExplocion.splice(index, 1);
  }
}
//ENDREGION
CotizacionsBuscar:string='023177-1';
ListMantenimeintoExplocion:any=[];
ListarMantenimientoExplocion() { 
  const cotizacion = this.CotizacionsBuscar || "--"; //codigo grupo
  if(cotizacion=="--"){
    this.toaster.open({
      text: "Debe ingresar Cotización",
      caption: 'Mesanej',
      type: 'danger',
    });
    return;
  }
  this.spinner.show();
  this._service.ListarMantenimientoExplocion(cotizacion).subscribe(
    (data: any) => {
      if (data && data.status === 200) {  
        this.ListMantenimeintoExplocion = data.json.map(item => (
          { ...item,  
            agregado: false , 
            filteredOptions: [] // Inicializa como una lista vacía
             }));
             console.log(".MANT EXPLO");
             console.log(this.ListMantenimeintoExplocion);
        this.spinner.hide();      
        const codigos = this.ListMantenimeintoExplocion
        .map(item => item.codigo_Producto.substring(0, 5)) // Obtener los primeros 5 caracteres
        .filter((value, index, self) => self.indexOf(value) === index) // Eliminar duplicados si es necesario
        .join("','");  
        const resultado = `'${codigos}'`; // Agregar comillas al inicio y al final
        console.log(resultado); // 'PRTRS','PRTSZ'
        this.listarComponestePorCodigoProds(resultado,cotizacion);
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

guardarComponentesExplocion() {
 
  const datosJSON = JSON.stringify(this.ListMantenimeintoExplocion);
  console.log('Datos en formato JSON:', datosJSON);
  console.log('DATOS ENDS');
  var counter=0;
  this.ListMantenimeintoExplocion.forEach(item => {
     if(item.cod_Componente==""){
      counter++;
     }
     if(item.descripcion==""){
      counter++;
     }     
     if(item.cantidad==""){
      counter++;
     }
     if(item.merma==""){
      counter++;
     }    

     if (Number.parseInt(item.merma) < 1 || Number.parseInt(item.cantidadUtilizada) < 1) { 
      counter++;
      this.toaster.open({
        text: "Evite ingresar numeros negativos en merma y cantidad",
        caption: 'Mensaje',
        type: 'warning',
        position: 'top-right',
        duration: 3000
      });  
    }
  });
  if(counter==0){
    this.GuardarExplocionMantenimiento();
  }else{
    this.toaster.open({
      text: "Debe ingresar todos los datos",
      caption: 'Mensaje',
      type: 'danger',
      // duration: 994000
    });
  }
}
CancelarMantenimiento(){
  this.ListMantenimeintoExplocion=[];
}
GuardarExplocionMantenimiento(){ 
  if(this.ListMantenimeintoExplocion.length === 0){
    this.toaster.open({
      text: "Debe Ingresar componentes",
      caption: 'Mensaje',
      type: 'danger',
      // duration: 994000
    });
    return;
  }

  Swal.fire({
    allowOutsideClick: false,
    title: "¿Desea guardar Los cambios?",
    html: `Al guardar se modificarán los datos y si hay nuevos componentes agregados serán registrados.`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Si, Modificar',
    cancelButtonText: 'Cancelar',
  })
    .then((result) => {
      if (result.isConfirmed) { 
         
  const jsonData = JSON.stringify(this.ListMantenimeintoExplocion.map(item => {
    const { filteredOptions, agregado, ...rest } = item;
    return rest;
  }));
  console.log(jsonData);
  this.spinner.show();
  this._service.GuardarExplocionMantenimiento(jsonData)
    .subscribe({
      next: response => {
        this.spinner.hide();
        console.log(response);
        if (response.status == 200) { 
              const respuesta = response.json.respuesta;
              const id = response.json.id; 
              console.log("RESPUESTA");
             if(respuesta=="OK"){       
              Swal.fire({
                title: 'Mensaje',
                text: 'Explocion Modificada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false
                }); 
                this.ListMantenimeintoExplocion=[];
             }else{
              Swal.fire({
                title: 'Mensaje',
                text: respuesta,
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false
                }); 
             }
          }else{
            this.toaster.open({
              text: "Ocurrio un error al enviar: "+response,
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
      } 
    });
}  

clonarComponenteMantenimiento(item:any){  
  const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
  var idUsuario= userDataString.id.toString(); 
  if (!userDataString){   
    this.toaster.open({
    text: "Su sessión ha caducado",
    caption: 'Mensaje',
    type: 'danger',
    // duration: 994000
  });
    this.router.navigate(['/Home-main']);
    return;
  }  
  // Encuentra el índice del elemento seleccionado
  const index = this.ListMantenimeintoExplocion.indexOf(item);
  this.ListMantenimeintoExplocion.splice(index + 1, 0, {   
    id:0,
    codigo_Producto:item.codigo_Producto,
    nombre_Producto:item.nombre_Producto,
    //componentes
    componente:item.componente+"-Clonado",
    cod_Componente:item.cod_Componente,
    descripcion:item.descripcion, 
    agregado:true,
    color:item.color,
    unidad:item.unidad,
    cantidad:item.cantidad,
    merma:item.merma,
    numeroCotizacion:this.ListMantenimeintoExplocion[0].numeroCotizacion,
    cotizacionGrupo:this.CotizacionsBuscar,//ES GRUPO
    idUsuarioCrea:idUsuario,  
    filteredOptions: this.lisComponenteMantenimiento  
  });   
}

eliminarComponente(componente: Componente) {
  this.componentes = this.componentes.filter(c => c !== componente);
}

nuevoComponente() {
  const nuevoComponente: Componente = {
    idExplocion: this.componentes.length + 1,
    cotizacion: 'Nueva Cotizacion',
    producto: 'Nuevo Producto',
    componente: 'Nuevo Componente',
    opciones: [],
    descripcionComponente: '',
    color: '',
    unidadMedida: '',
    cantidad: 0,
    merma: 0,
    codigoProducto: '',
    tipoProducto: '',
    codProducto: '',
    accionamiento: '',
    idDetalle: 0
  };
  this.componentes.push(nuevoComponente);
}
//#endregion


//#region LISTAR REPORTE EXPLOCION
 
ListReporteExplocion:any=[];
ListarReporteExplocion() { 
  const cotizacion = this.cotizacion2 || "--";
    const fechaInicio = this.fechaInicio2 ? this.fechaInicio2.toString() : "--";
    const fechaFin = this.fechaFin2 ? this.fechaFin2.toString() : "--";

  this.spinner.show();
  this._service.ListarReporteExplocion(cotizacion,fechaInicio,fechaFin).subscribe(
    (data: any) => {
      if (data && data.status === 200) {  
        this.ListReporteExplocion = data.json;
        this.spinner.hide();      
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

//#endregion

@ViewChild('tableRef') tableRef: ElementRef;
exportToExcel(): void {
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tableRef.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tabla1');
  XLSX.writeFile(wb, 'ReportMonitoreo.xlsx');
}
//#region LISTAR EXPLOCION PARA SALIDA Y ENTRADA SAP

cotizacionSap: string; 
fechaInicioSap: string;
fechaFinSap: string;   

ListMonitoreoExplocionSapSalidaEntrada:any=[];
ListarMonitoreoExplocionSapSalidaEntrada() { 
  this.guardarFechasSapEntradaSalida();
  console.log("BUSCANDO");
  const cotizacion = this.cotizacionSap || "--";
  const fechaInicio = this.fechaInicioSap ? this.fechaInicioSap.toString() : "--";
  const fechaFin = this.fechaFinSap ? this.fechaFinSap.toString() : "--";
    
  this.spinner.show();
  this._service.ListarMonitoreoSapSalidaEntrada(cotizacion,fechaInicio,fechaFin).subscribe(
    (data: any) => {
      if (data && data.status === 200) {  
        this.ListMonitoreoExplocionSapSalidaEntrada = data.json;//.map(item => ({ ...item, isExpand: false }));
        
        this.spinner.hide();      
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


cotizacionSapRevertido: string; 
fechaInicioSapRevertido: string;
fechaFinSapRevertido: string;   

ListMonitoreoExplocionSapSalidaEntradaRevertido:any=[];
ListarMonitoreoExplocionSapSalidaEntradaRevertido() { 
  this.guardarFechasSapEntradaSalida();
  console.log("BUSCANDO");
  const cotizacion = this.cotizacionSapRevertido || "--";
  const fechaInicio = this.fechaInicioSapRevertido ? this.fechaInicioSapRevertido.toString() : "--";
  const fechaFin = this.fechaFinSapRevertido ? this.fechaFinSapRevertido.toString() : "--";
    
  this.spinner.show();
  this._service.ListarMonitoreoSapSalidaEntradaRevertido(cotizacion,fechaInicio,fechaFin).subscribe(
    (data: any) => {
      if (data && data.status === 200) {  
        this.ListMonitoreoExplocionSapSalidaEntradaRevertido = data.json;//.map(item => ({ ...item, isExpand: false }));
        
        this.spinner.hide();      
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

filterTextSapSalidaEntradaRevertido: string = '';
filteredListSapSalidaEntradaRevertido() {
  if (!this.filterTextSapSalidaEntradaRevertido) {
    return this.ListMonitoreoExplocionSapSalidaEntradaRevertido;
  }
  return this.ListMonitoreoExplocionSapSalidaEntradaRevertido.filter(item => {
    const keys = ['ruc', 'razonSocial', 'cotizacion', 'cotizacionGrupo', 'codigoProducto', 'nombreProducto', 'accionamiento', 'cantidad', 'cantidadProductos', 'estado'];
    return keys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(this.filterTextSapSalidaEntradaRevertido.toLowerCase());
      }
      return false;
    });
  });
}


filterTextSapSalidaEntrada: string = '';
filteredListSapSalidaEntrada() {
  if (!this.filterTextSapSalidaEntrada) {
    return this.ListMonitoreoExplocionSapSalidaEntrada;
  }
  return this.ListMonitoreoExplocionSapSalidaEntrada.filter(item => {
    const keys = ['ruc', 'razonSocial', 'cotizacion', 'cotizacionGrupo', 'codigoProducto', 'nombreProducto', 'accionamiento', 'cantidad', 'cantidadProductos', 'estado'];
    return keys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(this.filterTextSapSalidaEntrada.toLowerCase());
      }
      return false;
    });
  });
}

//#endregion
//#region ENVIO SAP MERMA

// 3. ENVIAR MERMA SAP
@ViewChild('modalMerma') modalMerma!: TemplateRef<any>;


  // Propiedades
  mermaData: any[] = [];
  cargandoMerma: boolean = false;
  enviandoMerma: boolean = false;
  modalRef: NgbModalRef | null = null;
  baseUrl: string = 'tu-url-base-api'; // Ajusta según tu configuración
  grupoSeleccionado: string = ''; // Obtén esto de donde corresponda 



  async enviarSalidaMermaSap(item: any) {
  var coti = item.numeroCotizacion;
  var grupo = item.cotizacionGrupo;
  const userDataString = JSON.parse(localStorage.getItem('UserLog'));
  var idUsuario = userDataString.id.toString();

  if (!userDataString) {
    this.toaster.open({
      text: "Su sesión ha caducado",
      caption: 'Mensaje',
      type: 'danger',
    });
    this.router.navigate(['/Home-main']);
    return;
  } 
  
  try {
      this.cargandoMerma = true;
      
      // Abrir modal
      this.modalRef = this.modalService.open(this.modalMerma, { 
        size: 'xl', 
        backdrop: 'static',
        keyboard: false,
        centered: true
      });

      // Cargar datos
      await this.cargarDatosMerma(grupo);
      
    } catch (error: any) {
      console.error('Error al cargar merma:', error);
      
      this.toaster.open({
        text: error.message || 'Error al cargar datos de merma',
        type: 'danger'
      });
      
      // Cerrar modal si hay error
      if (this.modalRef) {
        this.modalRef.dismiss();
      }
    } finally {
      this.cargandoMerma = false;
    }
/*
      // Opción: Enviar directamente 
  Swal.fire({
    title: '¿Está seguro?',
    text: 'Se enviará la salida de MERMA a SAP con los datos actuales.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, Enviar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.enviarDirectamenteMermaASap(coti, grupo, idUsuario);
    }
  }); */

    /*}
  });*/
}

  async cargarDatosMerma(cotizacionGrupo:any): Promise<void> {
    try {
      const response = await this._service.ListarMermaAModificar(cotizacionGrupo).toPromise();      
      this.mermaData = response || [];
      
      if (this.mermaData.length === 0) {
        throw new Error('No hay datos de merma para enviar');
      }

      console.log('Datos de merma cargados:', this.mermaData);
      
    } catch (error: any) {
      console.error('Error al cargar merma:', error);
      throw new Error(error.error?.mensaje || 'Error al cargar datos de merma');
    }
  }
  
    /**
     * Confirmar y enviar merma al API
     */
    async confirmarEnvioMerma(modal: any): Promise<void> {
      // Validación final
      if (!this.validarTodosLosDatos()) {
        this.toaster.open({
          text: 'Complete todos los campos requeridos correctamente',
          type: 'warning'
        });
        return;
      }
  
    // Verificar que haya al menos un ítem para enviar
    if (!this.hayItemsParaEnviar()) {
      this.toaster.open({
        text: 'Debe haber al menos un ítem con merma mayor a 0 para enviar',
        type: 'warning'
      });
      return;
    }
  // Contar ítems que se enviarán
    const itemsConMerma = this.mermaData.filter(item => {
      const mermaNum = parseFloat(item.merma);
      return !isNaN(mermaNum) && mermaNum > 0;
    });
  
    const itemsSinMerma = this.mermaData.length - itemsConMerma.length;
      // Mensaje de confirmación personalizado
    let textoConfirmacion = `Se enviarán ${itemsConMerma.length} ítem(s) con merma a SAP.`;
    if (itemsSinMerma > 0) {
      textoConfirmacion += `<br><small class="text-muted">${itemsSinMerma} ítem(s) con merma = 0 serán omitidos.</small>`;
    }
  
      // Confirmar con SweetAlert
      const confirmacion = await Swal.fire({
        title: '¿Confirmar envío?',
        html: textoConfirmacion, 
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f39c12',
        cancelButtonColor: '#6c757d'
      });
  
      if (!confirmacion.isConfirmed) {
        return;
      }
  
      // Preparar datos para enviar
      const datosEnviar = this.mermaData.map(item => ({
        id: item.id,
        itemCode: item.cod_Componente.trim(),
        itemDescription: item.descripcion.trim(),
        merma: item.merma,
        lote: item.lote ? item.lote.trim() : null
      }));
  
      console.log('Datos a enviar:', datosEnviar);
  
      // Enviar al API
      await this.guardarYEnviarMerma(datosEnviar, modal);
    }
    
      /**
       * Enviar datos al API
       */
      async guardarYEnviarMerma(datos: any[], modal: any): Promise<void> {
        this.enviandoMerma = true;
    
  const userDataString = JSON.parse(localStorage.getItem('UserLog'));
  const idusuario = userDataString.id.toString();
        try { 
          if (!idusuario) {
            throw new Error('No se pudo obtener el ID del usuario');
          }
     
          const response = await this._service.guardarYEnviarMerma(datos,idusuario).toPromise();
    
          console.log('Respuesta del servidor:', response);
     
    
            console.log("RESPUESTA");
            const respuesta = response.json.respuesta; 
            console.log("RESPUESTA");
            console.log(respuesta);
           if(respuesta=="OPERACION REALIZADA CORRECTAMENTE"){  
            // Cerrar modal
            modal.close();
            // Mostrar éxito 
            // Limpiar datos
            this.mermaData = [];
             const codigoMerma = response.json.codigo;

             
      Swal.fire({
        title: 'Mensaje',
        text: 'Salida de Merma enviado correctamente a SAP',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });  
      this.ListarMonitoreoExplocionSapSalidaEntrada();
           }else{ 

             
            Swal.fire({
              title: 'Ocurrió un error al enviar',
              html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
              icon: 'warning',
              width: '600px', // Establece un tamaño fijo para la alerta
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false
            });
           } 


        } catch (error: any) { 
          
      this.spinner.hide();
      var errorMessage = error.message;
      console.error('There was an error!====================>');
      console.log(error);
      this.toaster.open({
        text: errorMessage,
        caption: 'Ocurrio un error',
        type: 'danger',
        // duration: 994000
      }); 
      Swal.fire({
        title: 'Ocurrió un error al enviar',
        html: error.error.json.respuesta +'<b> DETALLE: <b/><br>'+this.processResponse(error.error.json.detalle),  // Usamos 'html' en lugar de 'text'
        icon: 'warning',
        width: '600px', // Establece un tamaño fijo para la alerta
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      
        }  finally {
          this.enviandoMerma = false;
        }
      }
/**
 * Verificar si hay al menos un ítem con merma mayor a 0 para enviar
 */
hayItemsParaEnviar(): boolean {
  return this.mermaData.some(item => {
    const mermaNum = parseFloat(item.merma);
    return !isNaN(mermaNum) && mermaNum > 0;
  });
}

/**
 * Validar todos los datos antes de enviar
 */
validarTodosLosDatos(): boolean {
  if (this.mermaData.length === 0) {
    return false;
  }

  // Todos los ítems deben tener merma válida
  return this.mermaData.every(item => !this.esMermaInvalida(item.merma));
}
/**
 * Validar si la merma es inválida
 */
esMermaInvalida(merma: any): boolean {
  // La merma es inválida si:
  // 1. Es null o undefined
  // 2. Es un string vacío
  // 3. Es menor a 0
  if (merma === null || merma === undefined || merma === '') {
    return true;
  }
  
  const mermaNum = parseFloat(merma);
  return isNaN(mermaNum) || mermaNum < 0;
} 


/**
 * Validar una fila individual
 * IMPORTANTE: Solo la merma es obligatoria, los demás campos pueden estar vacíos
 */
validarFila(item: any): boolean {
  // Solo validar que la merma sea válida
  return !this.esMermaInvalida(item.merma);
}


enviarDirectamenteMermaASap(numeroCotizacion: string, cotizacionGrupo: string, idUsuario: string) {
  this.spinner.show();  
  this._service.EnviarSalidaMermaSap(numeroCotizacion, cotizacionGrupo, idUsuario).subscribe({
    next: (response: any) => {
        this.spinner.hide();
      console.log("RESULLLT=>");
      console.log(response);
      if (response.status == 200) {  
            console.log("RESPUESTA");
            const respuesta = response.json.respuesta; 
            console.log("RESPUESTA");
            console.log(respuesta);
           if(respuesta=="OPERACION REALIZADA CORRECTAMENTE"){  
      Swal.fire({
        title: 'Mensaje',
        text: 'Salida de Merma enviado correctamente a SAP',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });  
      this.ListarMonitoreoExplocionSapSalidaEntrada();
           }else{ 

             
            Swal.fire({
              title: 'Ocurrió un error al enviar',
              html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
              icon: 'warning',
              width: '600px', // Establece un tamaño fijo para la alerta
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false
            });
           } 
        }else{
          Swal.fire({
            title: 'Ocurrió un error al enviar',
            html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
            icon: 'warning',
            width: '600px', // Establece un tamaño fijo para la alerta
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
          });
          
        }
    },
    error: (error) => {
      
      this.spinner.hide();
      var errorMessage = error.message;
      console.error('There was an error!====================>');
      console.log(error);
      this.toaster.open({
        text: errorMessage,
        caption: 'Ocurrio un error',
        type: 'danger',
        // duration: 994000
      }); 
      Swal.fire({
        title: 'Ocurrió un error al enviar',
        html: error.error.json.respuesta +'<b> DETALLE: <b/><br>'+this.processResponse(error.error.json.detalle),  // Usamos 'html' en lugar de 'text'
        icon: 'warning',
        width: '600px', // Establece un tamaño fijo para la alerta
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
    }
  });
}
//#endregion
enviarSalidaSap(item: any) {
  var coti = item.numeroCotizacion;
  var grupo = item.cotizacionGrupo;
  const userDataString = JSON.parse(localStorage.getItem('UserLog'));
  var idUsuario = userDataString.id.toString();

  if (!userDataString) {
    this.toaster.open({
      text: "Su sesión ha caducado",
      caption: 'Mensaje',
      type: 'danger',
    });
    this.router.navigate(['/Home-main']);
    return;
  }

  // Primer modal: Elegir entre Editar o Enviar Directamente
  Swal.fire({
    title: 'Enviar Salida a SAP',
    text: '¿Desea revisar/editar los datos antes de enviar o enviar directamente?',
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Editar Datos',
    denyButtonText: 'Enviar Directamente',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      // Opción: Editar datos
      this.mostrarVistaPreviaSAP(coti, grupo, idUsuario, true);
    } else if (result.isDenied) {
      // Opción: Enviar directamente
      this.confirmarEnvioDirecto(coti, grupo, idUsuario);
    }
  });
}
confirmarEnvioDirecto(numeroCotizacion: string, cotizacionGrupo: string, idUsuario: string) {
  Swal.fire({
    title: '¿Está seguro?',
    text: 'Se enviará la salida a SAP con los datos actuales sin modificaciones.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, Enviar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.enviarDirectamenteASap(numeroCotizacion, cotizacionGrupo, idUsuario);
    }
  });
}
enviarDirectamenteASap(numeroCotizacion: string, cotizacionGrupo: string, idUsuario: string) {
  this.spinner.show();  
  this._service.EnviarSalidaSap(numeroCotizacion, cotizacionGrupo, idUsuario).subscribe({
    next: (response: any) => {
        this.spinner.hide();
      console.log("RESULLLT=>");
      console.log(response);
      if (response.status == 200) {  
            console.log("RESPUESTA");
            const respuesta = response.json.respuesta; 
            console.log("RESPUESTA");
            console.log(respuesta);
           if(respuesta=="OPERACION REALIZADA CORRECTAMENTE"){  
      Swal.fire({
        title: 'Mensaje',
        text: 'Salida enviado correctamente a SAP',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });  
      this.ListarMonitoreoExplocionSapSalidaEntrada();
           }else{ 

             
            Swal.fire({
              title: 'Ocurrió un error al enviar',
              html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
              icon: 'warning',
              width: '600px', // Establece un tamaño fijo para la alerta
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false
            });
           } 
        }else{
          Swal.fire({
            title: 'Ocurrió un error al enviar',
            html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
            icon: 'warning',
            width: '600px', // Establece un tamaño fijo para la alerta
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
          });
          
        }
    },
    error: (error) => {
      
      this.spinner.hide();
      var errorMessage = error.message;
      console.error('There was an error!====================>');
      console.log(error);
      this.toaster.open({
        text: errorMessage,
        caption: 'Ocurrio un error',
        type: 'danger',
        // duration: 994000
      }); 
      Swal.fire({
        title: 'Ocurrió un error al enviar',
        html: error.error.json.respuesta +'<b> DETALLE: <b/><br>'+this.processResponse(error.error.json.detalle),  // Usamos 'html' en lugar de 'text'
        icon: 'warning',
        width: '600px', // Establece un tamaño fijo para la alerta
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
    }
  });
}
mostrarVistaPreviaSAP(numeroCotizacion: string, cotizacionGrupo: string, idUsuario: string, esEdicion: boolean = false) {
  this.spinner.show();
  
  // Llamar al API para obtener los datos de vista previa
  this._service.JSONEnviarSalidaSap(numeroCotizacion, cotizacionGrupo).subscribe({
    next: (response: any) => {
      this.spinner.hide();
      
      if (response.status === 200) {
        const data = JSON.parse(response.json.respuesta);
        this.mostrarModalEdicion(data, numeroCotizacion, cotizacionGrupo, idUsuario, esEdicion);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener los datos de vista previa',
          icon: 'error'
        });
      }
    },
    error: (error) => {
      this.spinner.hide();
      Swal.fire({
        title: 'Error',
        text: 'Error al conectar con el servidor',
        icon: 'error'
      });
    }
  });
}
mostrarModalEdicion(data: any, numeroCotizacion: string, cotizacionGrupo: string, idUsuario: string, esEdicion: boolean) {
  const documentLines = data.DocumentLines;
  
  // Función para determinar si un item es "tela" o "motor"
  const getTipoItem = (itemCode: string, descripcion: string): string => {
    const codigo = itemCode.toLowerCase();
    const desc = descripcion.toLowerCase();
    
    if (codigo.includes('tela') || desc.includes('tela')) {
      return 'tela';
    } else if (codigo.includes('motor') || desc.includes('motor')) {
      return 'motor';
    }
    return 'otro';
  };

  // Crear el HTML para la tabla editable con campos de lote y serie
  const htmlContent = `
    <div style="max-height: 500px; overflow-y: auto; overflow-x: auto;">
      <table class="table-sm" style="font-size: 11px; min-width: 1400px;">
        <thead class="thead-light" style="color: currentcolor !important;">
          <tr>
            <th style="min-width: 100px;">Producto</th>
            <th style="min-width: 100px;">Código</th>
            <th style="min-width: 150px;">Descripción</th>
            <th style="min-width: 80px;">Calculo Final</th>
            <th style="min-width: 80px;">Merma</th>
            <th style="min-width: 100px;">Lote</th> 
          </tr>
        </thead>
        <tbody id="tablaItems">
          ${documentLines.map((item: any, index: number) => {
            const tipoItem = getTipoItem(item.ItemCode, item.ItemDescription);  
            const loteActual = item.BatchNumbers && item.BatchNumbers.length > 0 ? item.BatchNumbers[0].BatchNumber : '';
            
            return `
            <tr>
            <td class="align-middle">
                <small>${item.SubFamiliaPT}</small>
              </td>
              <td>
                <input type="text" class="form-control-sm" 
                       value="${item.ItemCode}" 
                       data-field="ItemCode" 
                       data-index="${index}" 
                       data-id="${item.Id}" 
                       style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;">
              </td>
              <td>
                <input type="text" class="form-control-sm" 
                       value="${item.ItemDescription}" 
                       data-field="ItemDescription" 
                       data-index="${index}" 
                       data-id="${item.Id}" 
                       style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;">
              </td>
              <td>
                <input type="number" class="form-control-sm" 
                       value="${item.Quantity}" 
                       data-field="Quantity" 
                       data-index="${index}" 
                       data-id="${item.Id}" 
                       step="0.01" 
                       style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;">
              </td>
              <td>
                <input type="number" class="form-control-sm" 
                       value="${item.Merma}" 
                       data-field="Merma" 
                       data-index="${index}" 
                       data-id="${item.Id}" 
                       step="0.01" 
                       style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;">
              </td>
              <td>
                <input type="text" class="form-control-sm" 
                       value="${loteActual}" 
                       data-field="BatchNumber" 
                       data-index="${index}" 
                       data-id="${item.Id}" 
                       placeholder="${tipoItem === 'tela' ? 'Ingrese lote' : 'N/A'}"
                      style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;">
              </td> 
            </tr>
          `}).join('')}
        </tbody>
      </table>
    </div>
          <div style="margin-top: 15px; text-align: center;">
            <button id="btn-descargar-json" type="button" class="btn btn-info" 
                    style="background-color: #17a2b8; border-color: #17a2b8; color: white; 
                           padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer;">
              <i class="fas fa-download"></i> Descargar JSON
            </button>
          </div>
  `;
/*

    <div class="mt-3">
      <small class="text-muted">
        <strong>Leyenda:</strong> 
        <span style="background-color: #fff; padding: 2px 6px; border: 1px solid #dee2e6; border-radius: 3px; margin-right: 10px;">Editables</span>
        <span style="background-color: #f8f9fa; padding: 2px 6px; border: 1px solid #dee2e6; border-radius: 3px; margin-right: 10px;">Solo Lectura</span>
        <span style="background-color: #e9ecef; padding: 2px 6px; border: 1px solid #dee2e6; border-radius: 3px;">Sistema</span>
        <br><br>
        <strong>Campos especiales:</strong> 
        <span style="color: #28a745;">• Lote: Solo editable para items de "tela"</span>
        <span style="color: #007bff; margin-left: 20px;">• Serie: Solo editable para items de "motor"</span>
      </small>
    </div>    
  */
  const titulo = esEdicion ? 
    `Editar Datos - Cotización: ${cotizacionGrupo}` : 
    `Vista Previa - Cotización: ${cotizacionGrupo}`;
  
  const botonConfirmar = esEdicion ? 'Guardar Cambios' : 'Enviar a SAP';

  Swal.fire({
    title: titulo,
    html: htmlContent,
    width: '80%',
    showCancelButton: true,
    confirmButtonText: botonConfirmar,
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false,
    didOpen: () => {
      // Agregar evento al botón de descarga cuando se abre el modal
      const btnDescargar = document.getElementById('btn-descargar-json');
      if (btnDescargar) {
        btnDescargar.addEventListener('click', () => {
          this.descargarJSON(data, cotizacionGrupo);
        });
      }
    },
    preConfirm: () => {
      if (esEdicion) {
        return this.recopilarDatosModificados(documentLines);
      }
      return null;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      if (esEdicion) {
        this.guardarModificaciones(result.value, numeroCotizacion, cotizacionGrupo, idUsuario);
      } else {
        this.enviarDirectamenteASap(numeroCotizacion, cotizacionGrupo, idUsuario);
      }
    }
  });
}


guardarModificaciones(datosModificados: any[], numeroCotizacion: string, cotizacionGrupo: string, idUsuario: string) {
  this.spinner.show();
  
  this._service.ModificarEnviarSalidaSap(datosModificados).subscribe({
    next: (response: any) => {
      this.spinner.hide();
      if (response.status === 200) {
        Swal.fire({
          title: 'Modificado',
          text: 'Los datos han sido modificados correctamente.',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Enviar a SAP',
          cancelButtonText: 'Cerrar',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.enviarDirectamenteASap(numeroCotizacion, cotizacionGrupo, idUsuario);
          }
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Error al guardar las modificaciones: ' + response.message,
          icon: 'error'
        });
      }
    },
    error: (error) => {
      this.spinner.hide();
      Swal.fire({
        title: 'Error',
        text: 'Error al conectar con el servidor',
        icon: 'error'
      });
    }
  });
}

recopilarDatosModificados(originalData: any[]): any[] {
  const datosModificados: any[] = [];
   
  originalData.forEach((item, index) => {
    const itemCode = (document.querySelector(`input[data-field="ItemCode"][data-index="${index}"]`) as HTMLInputElement).value;
    const merma = (document.querySelector(`input[data-field="Merma"][data-index="${index}"]`) as HTMLInputElement).value;
    const itemDescription = (document.querySelector(`input[data-field="ItemDescription"][data-index="${index}"]`) as HTMLInputElement).value; 
    // Obtener valores de lote y serie
    const loteValue = (document.querySelector(`input[data-field="BatchNumber"][data-index="${index}"]`) as HTMLInputElement).value; 
          
    
    const itemModificado = {
      Id: item.Id,
      ItemCode: itemCode,
      ItemDescription: itemDescription,
      Quantity: parseFloat((document.querySelector(`input[data-field="Quantity"][data-index="${index}"]`) as HTMLInputElement).value),  
      BatchNumbers: loteValue.trim(),
      Merma:merma
    };
    
    datosModificados.push(itemModificado);
  });
  
  return datosModificados;
}

//#region  DATOS  ::::::::::::::::::NELSON

// Método principal modificado con opciones
enviarEntradaSap(item: any) {
  const userDataString = JSON.parse(localStorage.getItem('UserLog'));
  var idUsuario = userDataString.id.toString();
  
  if (!userDataString) {
    this.toaster.open({
      text: "Su sesión ha caducado",
      caption: 'Mensaje',
      type: 'danger',
    });
    this.router.navigate(['/Home-main']);
    return;
  }

  // Mostrar opciones: Editar o Enviar Directamente
  this.mostrarOpcionesEnvio(item, idUsuario);
}

// Método para mostrar opciones de envío
mostrarOpcionesEnvio(item: any, idUsuario: string) {
  Swal.fire({
    title: '¿Cómo desea proceder?',
    text: 'Seleccione una opción para continuar',
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Enviar Directamente',
    denyButtonText: 'Visualizar Datos',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false,
    confirmButtonColor: '#28a745',
    denyButtonColor: '#ffc107'
  }).then((result) => {
    if (result.isConfirmed) {
      // Enviar directamente a SAP
      this.enviarDirectamenteASapEntrada(item, idUsuario);
    } else if (result.isDenied) {
      // Mostrar vista previa para editar
      this.mostrarVistaPreviaEntrada(item, idUsuario);
    }
  });
}

// Método para envío directo a SAP
enviarDirectamenteASapEntrada(item: any, idUsuario: string) {
  Swal.fire({
    title: '¿Está seguro de enviar la Entrada a SAP?',
    text: 'Una vez enviado, el proceso se considerará finalizado y no podrá ser editado.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, Enviar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.ejecutarEnvioASap(item, idUsuario);
    }
  });
}

// Método para mostrar vista previa editable
mostrarVistaPreviaEntrada(item: any, idUsuario: string) {
  this.spinner.show();  
  // Llamada a la API para obtener los datos JSON
  this._service.JSONEnviarEntradaSap(item.numeroCotizacion, item.cotizacionGrupo)
    .subscribe({
      next: response => {
        this.spinner.hide();
          if (response.status === 200) {
        const datosPrevia = JSON.parse(response.json.respuesta);  
          this.mostrarModalEditable(datosPrevia, item, idUsuario,item.cotizacionGrupo);
        } else {
          this.mostrarError('Error al obtener datos de vista previa', response.json.detalle);
        }
      },
      error: error => {
        this.spinner.hide();
        this.mostrarError('Error al cargar vista previa', error.message);
      }
    });
}

// Método para mostrar modal editable con SweetAlert 
mostrarModalEditable(datos: any, item: any, idUsuario: string,grupo:any) {
  // Agregar estilos CSS al documento
  this.agregarEstilos();
  
  // Crear tabla HTML editable con los datos
  const tablaHTML = this.generarTablaEditable(datos.DocumentLines);
  
  Swal.fire({
    title: 'Vista previa de datos - Entrada SAP',
    html: `
      <div class="preview-container"> 
        <div class="items-container">
          <h5> Grupo :${grupo}</h5>
          <div class="table-scroll-container">
            ${tablaHTML}
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: #6c757d;">
            <i class="fas fa-info-circle"></i> Desplácese horizontalmente para ver todos los campos
          </div>
          <div style="margin-top: 15px; text-align: center;">
            <button id="btn-descargar-json" type="button" class="btn btn-info" 
                    style="background-color: #17a2b8; border-color: #17a2b8; color: white; 
                           padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer;">
              <i class="fas fa-download"></i> Descargar JSON
            </button>
          </div>
        </div>
      </div>
    `,
    width: '60%',
    showCancelButton: true,
    //confirmButtonText: 'Guardar Cambios',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false,
    customClass: {
      popup: 'swal2-popup-wide'
    },
    didOpen: () => {
      // Agregar evento al botón de descarga cuando se abre el modal
      const btnDescargar = document.getElementById('btn-descargar-json');
      if (btnDescargar) {
        btnDescargar.addEventListener('click', () => {
          this.descargarJSON(datos, grupo);
        });
      }
    },
    preConfirm: () => {
      // Recopilar datos modificados de la tabla
    //  const datosModificados = this.recopilarDatosModificadosEntrada();
      //return datosModificados;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Procesar datos modificados
    //  this.procesarDatosModificados(result.value, item, idUsuario);
    }
  });
}
// Método para descargar archivo JSON
descargarJSON(datos: any, grupo: any) { 
  console.log(datos);
      const datosParaDescargar = JSON.parse(JSON.stringify(datos));
  
  // Verificar si existe DocumentLines y es un array
  if (datosParaDescargar.DocumentLines && Array.isArray(datosParaDescargar.DocumentLines)) {
    datosParaDescargar.DocumentLines.forEach((item: any) => {
      delete item.Merma;  // ← Nota: es "Merma" con mayúscula
      //delete item.Id;     // También puedes eliminar otros campos si quieres
    });
  }
    // Convertir a JSON con formato legible
    const jsonString = JSON.stringify(datosParaDescargar, null, 2);
  
    // Crear blob y enlace de descarga
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    // Crear elemento 'a' temporal para la descarga
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = url;
    enlaceDescarga.download = `datos_${grupo}_${new Date().toISOString().split('T')[0]}.json`;
    
    // Agregar al DOM, hacer clic y remover
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
    
    // Limpiar URL del objeto
    window.URL.revokeObjectURL(url);
  
}
// Generar tabla HTML editable
// Generar tabla HTML editable con todos los campos
generarTablaEditable(documentLines: any[]): string {
  let tabla = `
    <table class="table-sm" style="width: 100%; font-size: 11px">
      <thead style="color: currentcolor !important;">
        <tr>
          <th>Código Artículo</th>
          <th>Descripción</th>
          <th>Cantidad</th>
          <th>Alto</th>
          <th>Ancho</th>
          <th>Codigo Salida/Merma</th>  
        </tr>
      </thead>
      <tbody>
  `;   
  console.log(documentLines);
  documentLines.forEach((line, index) => {
    tabla += `
      <tr>
        <td>
          <input type="text" class="form-control-sm"  
                 value="${line.ItemCode || ''}"   readonly
                 style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;  max-width: 100% !important;">
        </td>
        <td>
          <input type="text" class="form-control-sm"  
                 value="${line.ItemDescription || ''}"   readonly
                 style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;  max-width: 100% !important;">
        </td>
        <td>
          <input type="text" class="form-control-sm"  
                 value="${line.Quantity || ''}"   readonly
                 style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;  max-width: 100% !important;">
        </td>
        <td>
          <input type="text" class="form-control-sm"  
                 value="${line.Alto || ''}"   readonly
                 style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;  max-width: 100% !important;">
        </td>
        <td>
          <input type="text" class="form-control-sm"   
                 value="${line.Ancho || ''}"  readonly
                 style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;  max-width: 100% !important;">
        </td>
        <td>
          <input type="text" class="form-control-sm" 
                 value="${line.IdSalida || ''}"    readonly
                 style="font-size: 13px;border: 1px solid #c7c7c7;width: 100% !important;  max-width: 100% !important;">
        </td>  
      </tr>
    `;
  });
  
  tabla += `
      </tbody>
    </table>
  `;
  
  return tabla;
}
// Recopilar datos modificados del formulario
recopilarDatosModificadosEntrada(): any[] {
  const datosModificados: any[] = [];
  const inputs = document.querySelectorAll('.swal2-container input[data-index]');
  
  // Agrupar por índice/ID
  const itemsMap = new Map();
  
  inputs.forEach((input: any) => {
    const index = parseInt(input.dataset.index);
    const id = input.dataset.id;
    const field = input.dataset.field;
    const value = input.value;
    
    if (!itemsMap.has(index)) {
      itemsMap.set(index, { Id: parseInt(id) });
    }
    
    itemsMap.get(index)[field] = value;
  });
  
  // Convertir Map a Array
  itemsMap.forEach((item) => {
    datosModificados.push(item);
  });
  
  return datosModificados;
}

// Procesar datos modificados
procesarDatosModificados(datosModificados: any[], item: any, idUsuario: string) {
  this.spinner.show();
  
  // Llamar a la API de modificación
  this._service.ModificarEnviarEntradaSap(datosModificados)
    .subscribe({
      next: response => {
        this.spinner.hide();
        
        if (response.status == 200 && response.json.respuesta === "Modificado") {
          // Mostrar confirmación de modificación exitosa
          this.mostrarConfirmacionModificacion(item, idUsuario);
        } else {
          this.mostrarError('Error al modificar datos', response.json.detalle || response.json.respuesta);
        }
      },
      error: error => {
        this.spinner.hide();
        this.mostrarError('Error al modificar datos', error.message);
      }
    });
}

// Mostrar confirmación de modificación y preguntar si desea enviar a SAP
mostrarConfirmacionModificacion(item: any, idUsuario: string) {
  Swal.fire({
    title: '¡Datos Modificados!',
    text: 'Los datos han sido modificados correctamente. ¿Desea enviar a SAP ahora?',
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'Sí, Enviar a SAP',
    cancelButtonText: 'No, Finalizar',
    allowOutsideClick: false,
    confirmButtonColor: '#28a745'
  }).then((result) => {
    if (result.isConfirmed) {
      // Confirmar envío a SAP
      this.confirmarEnvioFinalASap(item, idUsuario);
    } else {
      // Finalizar sin enviar
      Swal.fire({
        title: 'Proceso Completado',
        text: 'Los datos han sido guardados. Puede enviar a SAP más tarde.',
        icon: 'info',
        confirmButtonText: 'Entendido'
      });
      
      // Refrescar la lista
//      this.ListarMonitoreoExplocionSapSalidaEntrada();
    }
  });
}

// Confirmar envío final a SAP
confirmarEnvioFinalASap(item: any, idUsuario: string) {
  Swal.fire({
    title: '¿Confirma el envío a SAP?',
    text: 'Una vez enviado, el proceso se considerará finalizado y no podrá ser editado.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, Enviar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.ejecutarEnvioASap(item, idUsuario);
    }
  });
}

// Ejecutar envío a SAP (método común)
ejecutarEnvioASap(item: any, idUsuario: string) {
  this.spinner.show();
  
  this._service.EnviarEntradaSap(item.numeroCotizacion, item.cotizacionGrupo, idUsuario)
    .subscribe({
      next: response => {
        this.spinner.hide();
        
        if (response.status == 200) {
          const respuesta = response.json.respuesta;
          
          if (respuesta == "OPERACION REALIZADA CORRECTAMENTE") {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Entrada enviada correctamente a SAP',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false
            });
            this.ListarMonitoreoExplocionSapSalidaEntrada();
          } else {
            this.mostrarError('Error al enviar a SAP', response.json.detalle);
          }
        } else {
          this.mostrarError('Error al enviar a SAP', response.json.detalle);
        }
      },
      error: error => {
        this.spinner.hide();
        const errorDetail = error.error?.json?.detalle || error.message;
        const errorResponse = error.error?.json?.respuesta || '';
        
        this.mostrarError('Error al enviar a SAP', `${errorResponse} ${errorDetail}`);
      }
    });
}

// Método auxiliar para mostrar errores
mostrarError(titulo: string, detalle: string) {
  Swal.fire({
    title: titulo,
    html: this.processResponse(detalle),
    icon: 'error',
    width: '600px',
    confirmButtonText: 'Aceptar',
    allowOutsideClick: false
  });
}

// Agregar estilos CSS
// Agregar estilos CSS actualizados
private agregarEstilos() {
  // Verificar si ya están agregados los estilos
  if (document.getElementById('sap-preview-styles')) {
    return;
  }
  
  const estilo = document.createElement('style');
  estilo.id = 'sap-preview-styles';
  estilo.innerHTML = `
    .preview-container {
      text-align: left;
    }
    .info-general {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }
    .info-general h4 {
      margin-bottom: 10px;
      color: #495057;
    }
    .items-container {
      margin-top: 20px;
    }
    .items-container h4 {
      margin-bottom: 15px;
      color: #495057;
    }
    .form-control-sm {
      padding: 4px 8px;
      font-size: 11px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      min-width: 80px;
      max-width: 120px;
    }
    .form-control-sm:focus {
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    .table {
      margin-bottom: 0;
      table-layout: fixed;
      width: 100%;
    }
    .table th {
      background-color: #e9ecef;
      font-weight: bold;
      padding: 8px 4px;
      text-align: center;
      border: 1px solid #dee2e6;
      font-size: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .table td {
      padding: 3px 2px;
      border: 1px solid #dee2e6;
      text-align: center;
      vertical-align: middle;
    }
    .table-striped tbody tr:nth-of-type(odd) {
      background-color: rgba(0, 0, 0, 0.05);
    }
    .table-bordered {
      border: 1px solid #dee2e6;
    }
    
    /* Ancho específico para cada columna */
    .table th:nth-child(1),
    .table td:nth-child(1) { width: 10%; } /* Código Artículo */
    .table th:nth-child(2),
    .table td:nth-child(2) { width: 15%; } /* Descripción */
    .table th:nth-child(3),
    .table td:nth-child(3) { width: 8%; }  /* Cantidad */
    .table th:nth-child(4),
    .table td:nth-child(4) { width: 8%; }  /* Almacén */
    .table th:nth-child(5),
    .table td:nth-child(5) { width: 10%; } /* Cta. Contable */
    .table th:nth-child(6),
    .table td:nth-child(6) { width: 8%; }  /* Centro Costo */
    .table th:nth-child(7),
    .table td:nth-child(7) { width: 8%; }  /* Centro Costo 2 */
    .table th:nth-child(8),
    .table td:nth-child(8) { width: 8%; }  /* Centro Costo 3 */
    .table th:nth-child(9),
    .table td:nth-child(9) { width: 8%; }  /* Centro Costo 4 */
    .table th:nth-child(10),
    .table td:nth-child(10) { width: 8%; } /* Centro Costo 5 */
    .table th:nth-child(11),
    .table td:nth-child(11) { width: 9%; } /* Familia PT */
    .table th:nth-child(12),
    .table td:nth-child(12) { width: 10%; } /* Sub Familia PT */
    
    /* Hacer el contenedor scrollable horizontalmente */
    .table-scroll-container {
      overflow-x: auto;
      overflow-y: auto;
      max-height: 400px;
      border: 1px solid #dee2e6;
      border-radius: 4px;
    }
    
   
  `;
  
  document.head.appendChild(estilo);
}
//#endregion
//::::::::::::::::::::::::::::END
enviarSalidaSapv1(item:any){  
  var coti=item.numeroCotizacion
  var grupo=item.cotizacionGrupo;

  const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
  var idUsuario= userDataString.id.toString(); 
  if (!userDataString) {   this.toaster.open({
    text: "Su sessión ha caducado",
    caption: 'Mensaje',
    type: 'danger',
    // duration: 994000
  });
    this.router.navigate(['/Home-main']);
    return;
  }  
  Swal.fire({
    title: '¿Está seguro de enviar la Salida a SAP?',
    text: 'Una vez enviada, quedará pendiente el envío de la entrada a SAP.',
    icon: 'question', // Cambié el icono a 'question' ya que estamos preguntando al usuario
    showCancelButton: true,
    confirmButtonText: 'Si, Enviar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed){     
this.spinner.show();
this._service.EnviarSalidaSap(item.numeroCotizacion,item.cotizacionGrupo,idUsuario)
  .subscribe({
    next: response => {
      this.spinner.hide();
      console.log("RESULLLT=>");
      console.log(response);
      if (response.status == 200) {  
            console.log("RESPUESTA");
            const respuesta = response.json.respuesta; 
            console.log("RESPUESTA");
            console.log(respuesta);
           if(respuesta=="OPERACION REALIZADA CORRECTAMENTE"){  
      Swal.fire({
        title: 'Mensaje',
        text: 'Salida enviado correctamente a SAP',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });  
      this.ListarMonitoreoExplocionSapSalidaEntrada();
           }else{ 

             
            Swal.fire({
              title: 'Ocurrió un error al enviar',
              html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
              icon: 'warning',
              width: '600px', // Establece un tamaño fijo para la alerta
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false
            });
           } 
        }else{
          Swal.fire({
            title: 'Ocurrió un error al enviar',
            html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
            icon: 'warning',
            width: '600px', // Establece un tamaño fijo para la alerta
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
          });
          
        }
    },
    error: error => {
      this.spinner.hide();
      var errorMessage = error.message;
      console.error('There was an error!====================>');
      console.log(error);
      this.toaster.open({
        text: errorMessage,
        caption: 'Ocurrio un error',
        type: 'danger',
        // duration: 994000
      }); 
      Swal.fire({
        title: 'Ocurrió un error al enviar',
        html: error.error.json.respuesta +'<b> DETALLE: <b/><br>'+this.processResponse(error.error.json.detalle),  // Usamos 'html' en lugar de 'text'
        icon: 'warning',
        width: '600px', // Establece un tamaño fijo para la alerta
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      
    }
  }); 
    }
  });
}
enviarEntradaSapV1(item:any){
  
  const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
  var idUsuario= userDataString.id.toString(); 
  if (!userDataString) {   this.toaster.open({
    text: "Su sessión ha caducado",
    caption: 'Mensaje',
    type: 'danger',
    // duration: 994000
  });
    this.router.navigate(['/Home-main']);
    return;
  }  
  Swal.fire({
    title: '¿Está seguro de enviar la Entrada a SAP?',
    text: 'Una vez enviado, el proceso se considerará finalizado y no podrá ser editado.',
    icon: 'question', // Cambié el icono a 'question' ya que estamos preguntando al usuario
    showCancelButton: true,
    confirmButtonText: 'Si, Enviar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed){ 
    
this.spinner.show();
this._service.EnviarEntradaSap(item.numeroCotizacion,item.cotizacionGrupo,idUsuario)
  .subscribe({
    next: response => {
      this.spinner.hide();
      console.log("RESULLLT=>");
      console.log(response);
      if (response.status == 200) {  
            console.log("RESPUESTA");
            const respuesta = response.json.respuesta; 
            console.log("RESPUESTA");
            console.log(respuesta);
           if(respuesta=="OPERACION REALIZADA CORRECTAMENTE"){  
      Swal.fire({
        title: 'Mensaje',
        text: 'Entrada enviada correctamente a SAP',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });  
      this.ListarMonitoreoExplocionSapSalidaEntrada();
           }else{ 

             
            Swal.fire({
              title: 'Ocurrió un error al enviar',
              html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
              icon: 'warning',
              width: '600px', // Establece un tamaño fijo para la alerta
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false
            });
           } 
        }else{
          Swal.fire({
            title: 'Ocurrió un error al enviar',
            html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
            icon: 'warning',
            width: '600px', // Establece un tamaño fijo para la alerta
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
          });
          
        }
    },
    error: error => {
      this.spinner.hide();
      var errorMessage = error.message;
      console.error('There was an error!====================>');
      console.log(error);
      this.toaster.open({
        text: errorMessage,
        caption: 'Ocurrio un error',
        type: 'danger',
        // duration: 994000
      }); 
      Swal.fire({
        title: 'Ocurrió un error al enviar',
        html: error.error.json.respuesta +'<b> DETALLE: <b/><br>'+this.processResponse(error.error.json.detalle),  // Usamos 'html' en lugar de 'text'
        icon: 'warning',
        width: '600px', // Establece un tamaño fijo para la alerta
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      
    }
  }); 
    }
  });
} 
validaMermaEnviadaSap(detalleSalida: any[]): boolean {
  for (let i = 0; i < detalleSalida.length; i++) {
    var dato = detalleSalida[i].codigoSalidaMermaSap;
    if (dato) {
      return true;
    }
  }
  return false;
}
DetalleSalidaSap(item:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true; 
  dialogConfig.panelClass = 'custom-dialog-container';
  //const cadenaCompleta = 'PRTRS0054'; 
   
  dialogConfig.width ='1604px'; 
  dialogConfig.data = {detallesEntrada:[],detallesSalida:item};
  const dialogRef = this.dialog.open(DetalleSalidaEntradaSapComponent, dialogConfig);
  dialogRef.afterClosed().subscribe({
    next: data => {   
     if (data) {
          
    } 
  },
  error: error => { 
      var errorMessage = error.message; 
    }
  });
}
DetalleEntradaSap(item:any){
   

  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true; 
  dialogConfig.panelClass = 'custom-dialog-container';
  //const cadenaCompleta = 'PRTRS0054'; 
   
  dialogConfig.width ='1604px';
  dialogConfig.data = {detallesEntrada:item,detallesSalida:[]};
  const dialogRef = this.dialog.open(DetalleSalidaEntradaSapComponent, dialogConfig);
  dialogRef.afterClosed().subscribe({
    next: data => {   
     if (data) { 
    } 
  },
  error: error => { 
      var errorMessage = error.message; 
    }
  });
}// En tu componente TypeScript
esFechaValida(fecha: string): boolean {
  return fecha && fecha !== '0001-01-01T00:00:00';
}
pendienteSalida(item:any){
  if(item.codigoSalidaSap){
    return item.codigoSalidaSap;
  }else{
    return "Pendiente envio"
  } 
}
pendienteEntrada(item:any){
  if(item.codigoSalidaSap){
    return item.codigoEntradaSap;
  }else{
    return ""
  } 
}
revertir(codigoGrupo: any) {
  Swal.fire({
    title: 'Reversión de Proceso',
    html: `
      <div style="text-align: left;">
        <p style="margin-bottom: 15px;">
          Para revertir el envío de salida a SAP, debe ingresar sus credenciales:
        </p>
        <label style="display: block; margin-bottom: 5px; font-weight: 600;">
          Código PIN de Usuario:
        </label>
        <input id="swal-ping" class="swal2-input" placeholder="Ingrese su PIN" 
               style="margin-top: 0; width: 90%;" autocomplete="off">
        
        <label style="display: block; margin-top: 15px; margin-bottom: 5px; font-weight: 600;">
          Motivo de Reversión:
        </label>
        <textarea id="swal-motivo" class="swal2-textarea" placeholder="Describa el motivo de la reversión" 
                  rows="3" style="width: 90%; resize: vertical;"></textarea>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar Reversión',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    focusConfirm: false,
    preConfirm: () => {
      const ping = (document.getElementById('swal-ping') as HTMLInputElement).value;
      const motivo = (document.getElementById('swal-motivo') as HTMLTextAreaElement).value;
      
      // Validaciones en frontend
      if (!ping || ping.trim() === '') {
        Swal.showValidationMessage('Debe ingresar su código PIN');
        return false;
      }
      
      if (!motivo || motivo.trim() === '') {
        Swal.showValidationMessage('Debe ingresar el motivo de la reversión');
        return false;
      }
      
      if (motivo.trim().length < 10) {
        Swal.showValidationMessage('El motivo debe tener al menos 10 caracteres');
        return false;
      }
      
      return { ping: ping.trim(), motivo: motivo.trim() };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      // Mostrar loading mientras se procesa
      Swal.fire({
        title: 'Procesando reversión...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Llamar al API
      this._service.revertirProcesoSap(codigoGrupo, result.value.ping, result.value.motivo)
    .subscribe({
      next: (response) => {
        if(response.status==200){ 
          Swal.fire({
            icon: 'success',
            title: 'Reversión Exitosa',
            html: `
              <p>${response.json.respuesta}</p>
              <small>Usuario: ${response.json.usuario}</small><br>
              <small>Fecha: ${response.json.fechaReversion}</small>
            `,
            confirmButtonColor: '#28a745',
  allowOutsideClick: false,  // No se cierra al hacer clic fuera
  allowEscapeKey: false,     // No se cierra con ESC
  allowEnterKey: true        // Se puede cerrar con Enter (opcional)
          }).then((result) => {
            if (result.isConfirmed) { 
              this.ListarMonitoreoExplocionSapSalidaEntrada()
            }
          });
          
        }else{
          
        Swal.fire({
          icon: 'warning',
          title: 'Error en Reversión',
          text: response.json.respuesta,
          confirmButtonColor: '#d33'
        });
        }
      },
      error: (error) => {
        let mensajeError = 'Error al procesar la reversión';
        let iconoError: any = 'error';
        
        // Manejar según status code
        if (error.status === 401) {
          mensajeError = 'Código PIN incorrecto. Verifique sus credenciales.';
          iconoError = 'warning';
        } else if (error.status === 404) {
          mensajeError = 'No se encontró el grupo especificado.';
        } else if (error.error?.json?.respuesta) {
          mensajeError = error.json.respuesta;
        }
        
        Swal.fire({
          icon: iconoError,
          title: 'Error en Reversión',
          text: mensajeError,
          confirmButtonColor: '#d33'
        });
      }
    });

    }
  });
}
 
}

interface Componente {
  idExplocion: number;
  cotizacion: string;
  producto: string;
  componente: string;
  opciones: { value: string, label: string }[];
  descripcionComponente: string;
  color: string;
  unidadMedida: string;
  cantidad: number;
  merma: number;
  codigoProducto: string;
  tipoProducto: string;
  codProducto: string;
  accionamiento: string;
  idDetalle: number;
}
