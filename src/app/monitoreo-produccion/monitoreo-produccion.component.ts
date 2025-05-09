import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
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
    private _sapService:SapService
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
cotizacion2: string; 
fechaInicio2: Date;
fechaFin2: Date;  
showFilter(){ 
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
  
    const tieneFormulacion = productosArray.some(p => productosConFormulacion.includes(p));
  
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
    
    console.log("ABRIENDO GRUPO =======> ",item);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true; 
    dialogConfig.panelClass = 'custom-dialog-container';
    //const cadenaCompleta = 'PRTRS0054';  
    dialogConfig.data = item; 
        this.dialogRef=this.dialog.open(DetalleFormulacionComponent,//DetalleMonitoreoDialogComponent,
           dialogConfig); 
       this.dialogRef.afterClosed().subscribe({
      next: data => {   
       if (data) {
           
        Swal.fire({
          title: 'Mensaje',
          text: 'Explocion realizada',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
          }); 
          this.ListMonitoreoExplocion=[];
          this.ListarMonitoreoExplocion();
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

enviarSalidaSap(item:any){
  
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
enviarEntradaSap(item:any){
  
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
