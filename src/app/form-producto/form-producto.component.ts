import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'; 
import { ObjConfigs } from '../configuration';
import { ProductoService } from '../services/productoservice';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { DatePipe } from '@angular/common';
import { Toaster } from 'ngx-toast-notifications';
import Swal from 'sweetalert2';
declare var $: any; // Declara la variable $ para usar jQuery
export interface IAgregarUsuarioRequest {
  nombre?:string;
  correo?: string;
  roles?: Array<number>;
  usuario?: string;
  idUnidadNegocio?:string;
}
interface ConfiguracionAtributos {
  [key: string]: {
    [key: string]: {
      visible: number;
      required: number;
    };
  };
}
@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html',
  styleUrls: ['./form-producto.component.css']
})
export class FormProductoComponent implements OnInit {
  tiposProducto: string[];
  tipoProductoSeleccionado: string; 

  TblAmbiente: any[] =  [];
  getTiposProducto(): string[] {
    // Obtenemos los nombres únicos de los productos de ObjConfigs
    return Object.keys(this.objConfiguracionAtributos);
  } 
  listAtributs:any;
  getAtributos(): string[] {
    if (this.tipoProductoSeleccionado) {
      return Object.keys(this.objConfiguracionAtributos[this.tipoProductoSeleccionado]);
    } else {
      return [];
    }
  }
  filtrarAtributos() {
    this.listAtributs= this.getAtributos().filter(atributo => this.objConfiguracionAtributos[this.tipoProductoSeleccionado][atributo]);
  }
  guardarCambios() {
    // Aquí puedes enviar los cambios a tu backend para guardarlos
    console.log('Cambios guardados:', this.objConfiguracionAtributos);
  }
  //EENNNNNDS
  @Input() JsonItemHijo: any; // Objeto de entrada
  @Output() JsonProuctoDelHijo: EventEmitter<any> = new EventEmitter(); // Evento de salida
  attributosProducto = {};// Objeto que contendrá los datos del formulario 
  objConfiguracionAtributos:ConfiguracionAtributos=ObjConfigs;
  TipoProducto:string=""; 
  constructor(private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private toaster: Toaster,
    private _productoService: ProductoService,private cdr: ChangeDetectorRef
  
  ) {
    
    this.tiposProducto = this.getTiposProducto(); 
  } 
  // Método para emitir el objeto actualizado cuando se modifican los campos del formulario
  
  actualizarProducto() {
    var itemsEcuadra=[];
    if(this.escuadraVisible==true){
      itemsEcuadra=  this.TblEscuadraItems;
    }
    this.JsonProuctoDelHijo.emit(
      { Formulario: this.attributosProducto,
        Escuadra: itemsEcuadra}
    );
  }
   IdProducto:string="";
    ngOnInit(): void {      


    this.TipoProducto=this.JsonItemHijo.tipo; 
    this.IdProducto=this.JsonItemHijo.producto.id;   
    this.TblAmbiente=this.JsonItemHijo.ambiente; 
     
      if(this.JsonItemHijo.producto.id!="" && this.JsonItemHijo.producto.escuadra=="SI"){        
        this.ObtenerEcuadra(this.IdProducto);   
    this.labelPosition = this.JsonItemHijo.producto.escuadra; 
    this.escuadraVisible = this.JsonItemHijo.producto.escuadra === "SI" ? true : false; 

      }else{
        this.escuadraVisible=false;
        this.labelPosition =  "NO";

      }
    }
    ngAfterViewInit() {
      // Llamar al método para asignar valores después de que se haya renderizado completamente el HTML 
      this.spinner.show();          
        this.CargarItemsCombos(this.JsonItemHijo.producto);   
      this.spinner.hide();

    }
    sets(){      
      this.CargarItemsCombos(this.JsonItemHijo.producto);
    }
    set2(){
      this.setFormValues(this.JsonItemHijo.producto);
    }
  // Método para detectar los cambios en los campos del formulario y emitir la salida de datos
  onInputChange() {
    this.obtener();
  }
   
  ObtenerEcuadra(id:any){
    console.log("OBTENIENDOOO");
    this.spinner.show();
    this._productoService
      .obtenerEscuadra(id)
      .subscribe(
        (response) => { 
          console.log("OBTIENE");
          console.log(response);
          if(response){  
console.log("entra");
            if(response.length>0){
              var data = response;   
              this.TblEscuadraItems=[];   
              var ids=0;     
              data.forEach(item=>{
                ids++;
                this.TblEscuadraItems.push(
                  {Id:ids, Codigo:item.codigo,Descripcion:item.descripcion,Cantidad:item.cantidad } 
                );
              });
               console.log("llenado");
               console.log(this.TblEscuadraItems);
      

            }
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
   }
 //#region ASIGNA VALORES A TODOS LOS FORMULARIOS QUE SE MUESTRA:::::::::::::::::::::::::::::::::::::::::::::::
   setFormValues(values:any) {
  // Seleccionar todos los elementos del formulario
  const formElements = document.querySelectorAll('#formularionuevoDetalleOP input, #formularionuevoDetalleOP select, #formularionuevoDetalleOP textarea');
  // Iterar sobre los elementos del formulario
  formElements.forEach((element) => {
      // Verificar si el elemento es un input, select o textarea
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
          // Obtener el nombre del atributo
          const attributeName = element.getAttribute('name'); 
          // Asignar un valor basado en el nombre del atributo 
           
          switch (attributeName) {
          //::::::::::::::::::::::::::::::::::::...COMBOS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//case "IndexDetalle": (element as HTMLSelectElement).value = element.value = values.indexDetalle ? values.indexDetalle : "0";  break;
case "IndiceAgrupacion": (element as HTMLSelectElement).value =element.value = values.indiceAgrupacion ? values.indiceAgrupacion : "0";  break;
case "IdTbl_Ambiente": (element as HTMLSelectElement).value = values.idTbl_Ambiente;  break;

case "Ambiente": (element as HTMLSelectElement).value = element.value = values.ambiente ? values.ambiente : "--Seleccione--";  break;
case "Turno":  (element as HTMLSelectElement).value = element.value = values.turno ? values.turno : "--Seleccione--"; 
break;
case "CodigoTela": (element as HTMLSelectElement).value = element.value = values.codigoTela ? values.codigoTela : "--Seleccione--";  break;
case "SoporteCentral": (element as HTMLSelectElement).value = element.value = values.soporteCentral ? values.soporteCentral : "--Seleccione--";  break;
case "TipoSoporteCentral": (element as HTMLSelectElement).value = element.value = values.tipoSoporteCentral ? values.tipoSoporteCentral : "--Seleccione--";  break;
case "Caida": (element as HTMLSelectElement).value = element.value = values.caida ? values.caida : "--Seleccione--";  break;
case "Accionamiento": (element as HTMLSelectElement).value = element.value = values.accionamiento ? values.accionamiento : "--Seleccione--";  break;
case "CodigoTubo": (element as HTMLSelectElement).value = element.value = values.codigoTubo ? values.codigoTubo : "--Seleccione--"; 
 
  $('#nomb_tubo').select2({
    placeholder: '--Seleccione--'
  });  

  $('#nomb_tubo').on('change', (event) => {
    this.ChangeTubo(event);
  }); 
break;
case "Mando":(element as HTMLSelectElement).value = element.value = values.mando ? values.mando : "--Seleccione--" ;  break;
case "TipoMecanismo": (element as HTMLSelectElement).value = element.value = values.tipoMecanismo ? values.tipoMecanismo : "--Seleccione--";  break;
case "ModeloMecanismo": (element as HTMLSelectElement).value = element.value = values.modeloMecanismo ? values.modeloMecanismo : "--Seleccione--";  break;
case "TipoCadena":
console.log("TIPO DE CADENA")  ;
console.log(values.tipoCadena);
                     (element as HTMLSelectElement).value = element.value = values.tipoCadena ? values.tipoCadena : "--Seleccione--";  break;
case "CodigoCadena": (element as HTMLSelectElement).value = element.value = values.codigoCadena ? values.codigoCadena : "--Seleccione--";  break;
case "TipoRiel": (element as HTMLSelectElement).value = element.value = values.tipoRiel ? values.tipoRiel : "0";  break;
case "TipoInstalacion": (element as HTMLSelectElement).value = element.value = values.tipoInstalacion ? values.tipoInstalacion : "--Seleccione--";  break;
case "CodigoRiel": (element as HTMLSelectElement).value = element.value = values.codigoRiel ? values.codigoRiel : "0";  break;
case "TipoCassete": (element as HTMLSelectElement).value = element.value = values.tipoCassete ? values.tipoCassete : "--Seleccione--";  break;
case "Lamina": (element as HTMLSelectElement).value = element.value = values.lamina ? values.lamina : "--Seleccione--";  break;
case "Apertura": (element as HTMLSelectElement).value = element.value = values.apertura ? values.apertura : "--Seleccione--";  break;
case "ViaRecogida": (element as HTMLSelectElement).value = element.value = values.viaRecogida ? values.viaRecogida : "--Seleccione--";  break;
case "TipoSuperior": (element as HTMLSelectElement).value = element.value = values.tipoSuperior ? values.tipoSuperior : "--Seleccione--";  break;
case "CodigoBaston": (element as HTMLSelectElement).value = element.value = values.codigoBaston ? values.codigoBaston : "0";  break; 
case "NumeroVias": (element as HTMLSelectElement).value = element.value = values.numeroVias ? values.numeroVias : "--Seleccione--";  break;
case "TipoCadenaInferior": (element as HTMLSelectElement).value = element.value = values.tipoCadenaInferior ? values.tipoCadenaInferior : "--Seleccione--";  break;
case "MandoCordon": (element as HTMLSelectElement).value = element.value = values.mandoCordon ? values.mandoCordon : "--Seleccione--";  break;
case "MandoBaston": (element as HTMLSelectElement).value = element.value = values.mandoBaston ? values.mandoBaston : "--Seleccione--";  break;
case "CodigoBastonVarrilla": (element as HTMLSelectElement).value = element.value = values.codigoBastonVarrilla ? values.codigoBastonVarrilla : "--Seleccione--";  break;
case "Cabezal": (element as HTMLSelectElement).value = element.value = values.cabezal ? values.cabezal : "--Seleccione--";  break;
case "CodigoCordon": (element as HTMLSelectElement).value = element.value = values.codigoCordon ? values.codigoCordon : "--Seleccione--";  break;
case "CodigoCordonTipo2": (element as HTMLSelectElement).value = element.value = values.codigoCordonTipo2 ? values.codigoCordonTipo2 : "--Seleccione--";  break;
case "Cruzeta": (element as HTMLSelectElement).value = element.value = values.cruzeta ? values.cruzeta : "--Seleccione--";  break;
case "Dispositivo": (element as HTMLSelectElement).value = element.value = values.dispositivo ? values.dispositivo : "--Seleccione--";  break;
case "CodigoControl": (element as HTMLSelectElement).value = element.value = values.codigoControl ? values.codigoControl : "--Seleccione--";  break;
case "CodigoSwitch": (element as HTMLSelectElement).value = element.value = values.codigoSwitch ? values.codigoSwitch : "--Seleccione--";  break;
case "LlevaBaston": (element as HTMLSelectElement).value = element.value = values.llevaBaston ? values.llevaBaston : "--Seleccione--";  break;
case "MandoAdaptador": (element as HTMLSelectElement).value = element.value = values.mandoAdaptador ? values.mandoAdaptador : "--Seleccione--";  break;
case "CodigoMotor": (element as HTMLSelectElement).value = element.value = values.codigoMotor ? values.codigoMotor : "--Seleccione--"; 

  $('#nomb_motor').select2({
    placeholder: '--Seleccione--'
  });   
  $('#nomb_motor').on('change', (event) => {
    this.cancheCbopNombreMotor(event);
  }); 

break;
//::::::::::::::::::::::::::::::::::::...INPUTS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::

case "Motor": (element as HTMLInputElement).value = values.motor;break;
case "Familia": (element as HTMLInputElement).value = values.familia;  break;
case "SubFamilia": (element as HTMLInputElement).value = values.subFamilia;  break;
case "Precio": (element as HTMLInputElement).value = values.precio;  break;
case "PrecioInc": (element as HTMLInputElement).value = values.precioInc;  break;
case "Igv": (element as HTMLInputElement).value = values.igv;  break;
case "Lote": (element as HTMLInputElement).value = values.lote;  break;

case "Tela": (element as HTMLInputElement).value = values.tela;

  $('#tela').select2({
    placeholder: '--Seleccione--'
  });  
  $('#tela').on('change', (event) => {
    this.ChangeTela(event);
  });
break;
case "NombreTubo": (element as HTMLInputElement).value = values.nombreTubo;  break;
case "Cadena": (element as HTMLInputElement).value = values.cadena;  break;
case "Riel": (element as HTMLInputElement).value = values.riel;  break;
case "Baston": (element as HTMLInputElement).value = values.baston;  break;
case "BastonVarrilla": (element as HTMLInputElement).value = values.bastonVarilla;  break;
case "Cordon": (element as HTMLInputElement).value = values.cordon;  break;
case "CordonTipo2": (element as HTMLInputElement).value = values.cordonTipo2;  break;
case "Control": (element as HTMLInputElement).value = values.control;  break;
case "Switch": (element as HTMLInputElement).value = values.switch;  break;


case "Linea": (element as HTMLInputElement).value = values.linea;  break;
case "Id": (element as HTMLInputElement).value = values.id;  break;
case "CodigoProducto":(element as HTMLInputElement).value = values.codigoProducto; break;
case "NombreProducto":(element as HTMLInputElement).value = values.nombreProducto; break;
case "UnidadMedida":(element as HTMLInputElement).value = values.unidadMedida; break;
case "Cantidad":
  let cantidadString: string;
  if (typeof values.cantidad === 'string') {
    cantidadString = values.cantidad.replace(',', '.');
  } else {
    cantidadString = values.cantidad.toString();
  }
  (element as HTMLInputElement).value = parseFloat(cantidadString).toFixed(3);  
//(element as HTMLInputElement).value = parseFloat(values.cantidad.replace(',', '.')).toFixed(3); 
break;
case "FechaProduccion": 
const fechaString = values.fechaProduccion; 
var fechaFormateada=fechaString; 
if(  this.JsonItemHijo.producto.id!==""){  
      fechaFormateada =this.formatearFecha(fechaString); 
}
  (element as HTMLInputElement).value = fechaFormateada; break;
case "FechaEntrega": 
const fechaString2 = values.fechaEntrega;
var fechaFormateada2=fechaString2; 
if(this.JsonItemHijo.producto.id!==""){
    fechaFormateada2 =this.formatearFecha(fechaString2); 
}
  (element as HTMLInputElement).value = fechaFormateada2; 
break;
case "Nota":(element as HTMLInputElement).value = values.nota; break;
case "Ancho":
  let AnchoString: string;
  if (typeof values.ancho === 'string') {
    AnchoString = values.ancho.replace(',', '.');
  } else {
    AnchoString = values.ancho.toString();
  }
  (element as HTMLInputElement).value = parseFloat(AnchoString).toFixed(3);  
//(element as HTMLInputElement).value = parseFloat(values.ancho.replace(',', '.')).toFixed(3);
 break;
case "Alto":
  let altoString: string;
  if (typeof values.alto === 'string') {
    altoString = values.alto.replace(',', '.');
  } else {
    altoString = values.alto.toString();
  }
  (element as HTMLInputElement).value = parseFloat(altoString).toFixed(3); 
  //(element as HTMLInputElement).value = parseFloat(values.alto.replace(',', '.')).toFixed(3); 
  break;
case "Color":(element as HTMLInputElement).value = values.color; break;
case "Cenefa":(element as HTMLInputElement).value = values.cenefa; break;
case "NumeroMotores":(element as HTMLInputElement).value = values.numeroMotores; break;
case "Serie":(element as HTMLInputElement).value =values.serie; break;
case "AlturaCadena":
  console.log("AULTRAAA:::::::::::::::::::::::::.");
  console.log(values.id);
  if(values.id==""){
    const alturaCadena = parseFloat(values.alto);//.replace(',', '.')).toFixed(3); 
    // Lógica de cálculo
    const rptAlturaCadena = this.calcularAlturaCadena(this.TipoProducto, alturaCadena);
    console.log('Altura de Cadena:', rptAlturaCadena);
    
    if (this.TipoProducto == "PRTCV" || this.TipoProducto == "PRTPH") {
      var altura_cadena = (rptAlturaCadena * 2);
      (element as HTMLInputElement).value = altura_cadena.toFixed(3);
    }    
    if (this.TipoProducto !== "PRTRF" && this.TipoProducto !== "PRTRH" && this.TipoProducto !== "PRTRM") {
      if (this.TipoProducto.substring(0, 4) == "PRTR") {
        var altura_cadena = (rptAlturaCadena * 2);
        (element as HTMLInputElement).value = altura_cadena.toFixed(3);
      }
    }

  }else{ 
  let alturaCadenaString: string; 

  if (typeof values.alturaCadena === 'string') {
    alturaCadenaString = values.alturaCadena.replace(',', '.');
  } else if (values.alturaCadena !== null && values.alturaCadena !== undefined) {
    alturaCadenaString = values.alturaCadena.toString();
  } else {
    alturaCadenaString = ''; // O algún valor por defecto que tenga sentido en tu contexto
  }
  (element as HTMLInputElement).value = parseFloat(alturaCadenaString).toFixed(3);  
    //(element as HTMLInputElement).value = parseFloat(values.alturaCadena.replace(',', '.')).toFixed(3); 
  }
break;
case "AlturaCordon":(element as HTMLInputElement).value = values.alturaCodon; break;
case "MarcaMotor":(element as HTMLInputElement).value = values.marcaMotor; break;
case "WhsCode":(element as HTMLInputElement).value = values.whsCode;  break;
default :
break;
            
        }
      }
  }); 


  }
  //#endregion
  formatearFecha(fechainicial) {
    console.log(fechainicial);
    // Dividir la fecha y la hora
    const [datePart, timePart] = fechainicial.split(' ');
    // Dividir la fecha en día, mes y año
    const [day, month, year] = datePart.split('/');
    // Crear un nuevo objeto Date
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    // Formatear la fecha a 'yyyy-MM-dd'
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
    // Método para verificar si el valor está dentro del rango
    range(value: number, min: number, max: number, inclusive: boolean): boolean {
      return inclusive ? value >= min && value <= max : value > min && value < max;
    }
   // Método para calcular la altura de la cadena
  calcularAlturaCadena(keyProduct: string, alturaCadena: any): number { 
    let rptAlturaCadena = 0;

    if (keyProduct !== 'PRTRF' && keyProduct !== 'PRTRH' && keyProduct !== 'PRTRM') {
      if (keyProduct === 'PRTCV' || keyProduct === 'PRTPH' || keyProduct.substring(0, 4) === 'PRTR') {
        const windowSize = alturaCadena;

        if (this.range(windowSize, 1.000, 1.200, true)) {
          rptAlturaCadena = 1.000;
        } else if (this.range(windowSize, 1.210, 1.400, true)) {
          rptAlturaCadena = 1.100;
        } else if (this.range(windowSize, 1.410, 1.600, true)) {
          rptAlturaCadena = 1.200;
        } else if (this.range(windowSize, 1.610, 1.700, true)) {
          rptAlturaCadena = 1.300;
        } else if (this.range(windowSize, 1.710, 1.800, true)) {
          rptAlturaCadena = 1.400;
        } else if (this.range(windowSize, 1.810, 2.000, true)) {
          rptAlturaCadena = 1.500;
        } else if (this.range(windowSize, 2.010, 2.100, true)) {
          rptAlturaCadena = 1.600;
        } else if (this.range(windowSize, 2.110, 2.200, true)) {
          rptAlturaCadena = 1.700;
        } else if (this.range(windowSize, 2.210, 2.400, true)) {
          rptAlturaCadena = 1.800;
        } else if (this.range(windowSize, 2.410, 2.500, true)) {
          rptAlturaCadena = 1.900;
        } else if (this.range(windowSize, 2.510, 2.600, true)) {
          rptAlturaCadena = 2.000;
        } else if (this.range(windowSize, 2.610, 2.800, true)) {
          rptAlturaCadena = 2.100;
        } else if (this.range(windowSize, 2.810, 2.900, true)) {
          rptAlturaCadena = 2.200;
        } else if (this.range(windowSize, 3.000, 3.100, true)) {
          rptAlturaCadena = 2.200;
        } else if (this.range(windowSize, 3.110, 3.200, true)) {
          rptAlturaCadena = 2.300;
        } else if (this.range(windowSize, 3.210, 3.400, true)) {
          rptAlturaCadena = 2.400;
        } else if (this.range(windowSize, 3.410, 3.500, true)) {
          rptAlturaCadena = 2.500;
        } else if (this.range(windowSize, 3.510, 3.600, true)) {
          rptAlturaCadena = 2.600;
        } else if (this.range(windowSize, 3.610, 3.800, true)) {
          rptAlturaCadena = 2.700;
        } else if (this.range(windowSize, 3.810, 3.900, true)) {
          rptAlturaCadena = 2.800;
        } else if (this.range(windowSize, 4.000, 4.100, true)) {
          rptAlturaCadena = 2.900;
        } else if (this.range(windowSize, 4.110, 4.200, true)) {
          rptAlturaCadena = 3.000;
        } else if (this.range(windowSize, 4.210, 4.400, true)) {
          rptAlturaCadena = 3.100;
        } else if (this.range(windowSize, 4.410, 4.500, true)) {
          rptAlturaCadena = 3.200;
        } else if (this.range(windowSize, 4.510, 4.600, true)) {
          rptAlturaCadena = 3.300;
        } else if (this.range(windowSize, 4.610, 4.800, true)) {
          rptAlturaCadena = 3.400;
        } else if (this.range(windowSize, 4.810, 4.900, true)) {
          rptAlturaCadena = 3.500;
        } else if (this.range(windowSize, 5.000, 5.100, true)) {
          rptAlturaCadena = 3.600;
        } else if (this.range(windowSize, 5.110, 5.200, true)) {
          rptAlturaCadena = 3.700;
        } else if (this.range(windowSize, 5.210, 5.400, true)) {
          rptAlturaCadena = 3.800;
        } else if (this.range(windowSize, 5.410, 5.500, true)) {
          rptAlturaCadena = 3.900;
        } else if (this.range(windowSize, 5.510, 5.600, true)) {
          rptAlturaCadena = 4.000;
        } else if (this.range(windowSize, 5.610, 5.800, true)) {
          rptAlturaCadena = 4.100;
        } else if (this.range(windowSize, 5.810, 5.900, true)) {
          rptAlturaCadena = 4.200;
        } else if (this.range(windowSize, 6.000, 6.100, true)) {
          rptAlturaCadena = 4.300;
        } else if (this.range(windowSize, 6.110, 6.200, true)) {
          rptAlturaCadena = 4.400;
        } else if (this.range(windowSize, 6.210, 6.400, true)) {
          rptAlturaCadena = 4.500;
        } else if (this.range(windowSize, 6.410, 6.500, true)) {
          rptAlturaCadena = 4.600;
        } else if (this.range(windowSize, 6.510, 6.600, true)) {
          rptAlturaCadena = 4.700;
        } else if (this.range(windowSize, 6.610, 6.800, true)) {
          rptAlturaCadena = 4.800;
        } else if (this.range(windowSize, 6.810, 6.900, true)) {
          rptAlturaCadena = 4.900;
        }
      }
    }

    return rptAlturaCadena;
  }
  //#region   OBTIENE DE TODOS LOS CAMPOS VISIBLES 
    obtener(): void {   
  // Seleccionar todos los elementos del formulario
  const formElements = document.querySelectorAll('#formularionuevoDetalleOP input, #formularionuevoDetalleOP select, #formularionuevoDetalleOP textarea');
  // Iterar sobre los elementos del formulario
  formElements.forEach((element) => {
      // Verificar si el elemento es un input, select o textarea
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
          // Obtener el nombre del atributo y su valor
          const attributeName = element.getAttribute('name');
          let attributeValue = element.value; // Puedes usar .value para input, select y textarea  
          // Almacenar el nombre del atributo y su valor en el objeto
          //this.attributosProducto[attributeName] = attributeValue;

              // Verificar si es un elemento select
            if (element instanceof HTMLSelectElement && (attributeName=="CodigoTela" || attributeName=="CodigoTubo" || attributeName=="CodigoMotor") ) {

              const formulario = document.getElementById('formularionuevoDetalleOP') as HTMLFormElement;
              var valor="";
              switch(attributeName){
                case 'CodigoTela':
                  valor = formulario['CodigoTela'].value;
                  break;
                case 'CodigoTubo':
                  valor = formulario['CodigoTubo'].value;
                  break;
                case 'CodigoMotor':
                  if(formulario['Accionamiento'].value=="Manual"){
                    attributeValue="";
                  }                  
                  //valor = formulario['CodigoTubo'].value;
                  break; 
              }
              // Almacenar el nombre del atributo y su valor en el objeto
              this.attributosProducto[attributeName] = attributeValue;
          } else {             
            if(this.JsonItemHijo.producto.id==""){

              switch(attributeName){
                case "Ancho":
                var  tubo_medida=parseFloat(attributeValue.replace(',', '.')) - 0.025;
                this.attributosProducto["TuboMedida"] = tubo_medida.toString();
                var  tela_medida=parseFloat(tubo_medida.toString().replace(',', '.')) - 0.001;
                this.attributosProducto["TelaMedida"] = tela_medida.toString(); 
                    break;
                case "Alto":
                var  altura_medida=altura_medida = parseFloat(attributeValue.replace(',', '.')) + 0.20;                
                this.attributosProducto["AlturaMedida"] = altura_medida.toString();
                  break;
              } 
            }
              // Almacenar el nombre del atributo y su valor en el objeto
              this.attributosProducto[attributeName] = attributeValue;
          }
      }
  });
   
    const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
    this.attributosProducto["IdUsuarioCrea"] = userDataString.id.toString();
    
    var itemsEcuadra=[];
    if(this.escuadraVisible==true){
      itemsEcuadra=  this.TblEscuadraItems;
    }
    this.JsonProuctoDelHijo.emit(
      { Formulario: this.attributosProducto,
        Escuadra: itemsEcuadra}
    );

    }
    //#endregion
    obtenerarticulos(tipo, subfamilia) {
      return this._productoService.ObtenerArticulo(tipo, subfamilia);
    }
 

//GUARDAR CODIGO Y NOMBRE
CboTela=[{codigo:0,nombre:"--Seleccione--"}];listarCboTela(codsubfamilia){
  if(codsubfamilia=='CS'){ //cellular
    codsubfamilia='TELCS';
} 
  this.CboTela=[{codigo:0,nombre:"--Seleccione--"}]; 
  this.spinner.show();  
  this.obtenerarticulos("Tela", codsubfamilia).subscribe(
    (response) => {
      if (response) { 
        this.CboTela.push(...response); 
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
    }
  );  
 
}

ChangeTela(event: any): void { 
  const value = event.target.value;  
  const Tela = document.getElementById("Tela") as HTMLInputElement ;
  const item = this.CboTela.find(element => element.codigo === value);
  if (Tela && item) {
    Tela.value = item.nombre; 
  }
}

CboIndiceAgrupacion=[{id:"--Seleccione--",indice:0,nombre:"--Seleccione--"}];listarCboIndiceAgrupacion(){  

  //this.CboIndiceAgrupacion=[{id:"--Seleccione--",indice:0,nombre:"--Seleccione--"}]; 
 
  this.TblAmbiente.forEach(element => {
    this.CboIndiceAgrupacion.push({
      id: element.id,
      indice:element.indice,
      nombre: element.ambiente
    });
  });
}
CboAmbiente=[{id:"--Seleccione--",indice:0,nombre:"--Seleccione--"}];listarCboAmbiente(){  
  //this.CboAmbiente=[{id:"--Seleccione--",indice:0,nombre:"--Seleccione--"}];
   
  this.TblAmbiente.forEach(element => {
    this.CboAmbiente.push({
      id: element.id,
      indice:element.indice,
      nombre: element.ambiente
    });
  });
}
formatDate(dateString: string): string {
  return this.datePipe.transform(dateString, 'yyyy-MM-dd');
}
showAlert(mensaje:any) { 
  /*Swal.fire({
    title: 'Advertencia',
    text: mensaje,
    icon: 'warning',
    confirmButtonText: 'Cerrar'
  });*/
  Swal.fire({
    title: 'Advertencia',
    html: mensaje,
    icon: 'warning',
    confirmButtonText: 'Cerrar'
  });
}
changeIndiceAgrupacion(event: any): void {
  console.log(this.TblAmbiente);
  const value = event.target.value; 
  const _ambiente = this.TblAmbiente.find(item => item.indice == value);  
  const IdTbl_Ambiente = document.getElementById("IdTbl_Ambiente") as HTMLInputElement;
  const detalle_ambiente = document.getElementById("detalle_ambiente") as HTMLSelectElement;

  const indice_agrupacion = document.getElementById("indice_agrupacion") as HTMLSelectElement;
  const fecha_produccion = document.getElementById("fecha_produccion") as HTMLInputElement;
  const turno = document.getElementById("turno") as HTMLSelectElement;
  console.log(fecha_produccion.value);
  console.log(turno.value);
  console.log("------END SELECCIONADO------");
  if(!fecha_produccion.value || !turno.value.replace("--Seleccione--","")){//si ninguno no esta seleccionado

    if (indice_agrupacion) {
      indice_agrupacion.value = "0";
    } 
    this.showAlert("Primero debe seleccionar <b>fecha producción</b> y <b>turno</b>");
    return;
  }
  if(_ambiente.stock>0){
 
    if(_ambiente.turno && _ambiente.fechaProduccion){      
    //YA ESTA ASGINADO A OTRO GRUPO

    
    console.log(_ambiente.fechaProduccion);
    console.log(_ambiente.turno);
    console.log("------END AMBIENTE------");
    //ENDS
     
        var fechaAmbienteGrupo = _ambiente.fechaProduccion; 
        fechaAmbienteGrupo = this.formatDate(fechaAmbienteGrupo);  
        console.log("fecha formateada");
        console.log(fechaAmbienteGrupo);

        if(fecha_produccion.value==fechaAmbienteGrupo && turno.value==_ambiente.turno){

        }else{  
          if (indice_agrupacion) {
            indice_agrupacion.value = "0";
          } 
          this.showAlert(`El índice <b>${value}</b> ya está asociada a otro grupo con fecha Prod: <b>${fechaAmbienteGrupo}</b> y turno: <b>${_ambiente.turno}</b>`);
          return;
        } 
    }
    

    if (_ambiente) {
      if (IdTbl_Ambiente) {
        IdTbl_Ambiente.value = _ambiente.id.toString();
      }
      if (detalle_ambiente) { 
        detalle_ambiente.value = _ambiente.ambiente;
      }
    } else {
      if (IdTbl_Ambiente) {
        IdTbl_Ambiente.value = "";
      }
      if (detalle_ambiente) {
        detalle_ambiente.value = "";
      }
    }


  }else{
    //NO HAY STOCK     
    if (indice_agrupacion) {
      indice_agrupacion.value = "0";
    } 
    this.showAlert(`La cantidad del producto ha alcanzado su <b>límite</b> para el índice seleccionado <b>${value}</b>.`);
  }
}
onFechaProduccionChange(event: any): void {
  const fechaProduccion = event.target.value;
  console.log('Fecha Producción seleccionada:', fechaProduccion); 
  const IdTbl_Ambiente = document.getElementById("IdTbl_Ambiente") as HTMLInputElement;
  const detalle_ambiente = document.getElementById("detalle_ambiente") as HTMLSelectElement;
 const indice_agrupacion=document.getElementById("indice_agrupacion") as HTMLSelectElement;
      if (IdTbl_Ambiente) {
        IdTbl_Ambiente.value = "";
      }
      if (detalle_ambiente) {
        detalle_ambiente.value = "";
      } 
      if(indice_agrupacion){
        indice_agrupacion.value="0";
      }
} 
changeTurno(event: any): void { 
  const value = event.target.value; 
  const IdTbl_Ambiente = document.getElementById("IdTbl_Ambiente") as HTMLInputElement;
  const detalle_ambiente = document.getElementById("detalle_ambiente") as HTMLSelectElement;
 const indice_agrupacion=document.getElementById("indice_agrupacion") as HTMLSelectElement;
      if (IdTbl_Ambiente) {
        IdTbl_Ambiente.value = "";
      }
      if (detalle_ambiente) {
        detalle_ambiente.value = "";
      } 
      if(indice_agrupacion){
        indice_agrupacion.value="0";
      }
}
CboTurno:any[]=[{id:0,nombre:"--Seleccione--"}];listarCboTurno(){
  this.CboTurno=[
  {id:0,nombre:"--Seleccione--"},
  {id:1,nombre:"Mañana"},
  {id:2,nombre:"Tarde"}]; 
}
CboSoporteCentral=[{id:0,nombre:"--Seleccione--"}];listarCboSoporteCentral(){  
  this.CboSoporteCentral=[
  {id:0,nombre:"--Seleccione--"},
  {id:1,nombre:"Si"},
  {id:2,nombre:"No"}]; 
}
changeCboSoporteCentral(event: any) {
  const valorSeleccionado = event.target.value;
  
  if (valorSeleccionado === "Si") {
    // Habilitar el segundo select y establecer el atributo 'required'
    /*document.getElementById("tipo_sop_central").removeAttribute('disabled');
    document.getElementById("tipo_sop_central").setAttribute('required', 'true');*/
    this.objConfiguracionAtributos[this.TipoProducto]['tipoSopCentral'].visible=1;
    this.listarCboTipoSoporteCentral();
  } else {
    this.objConfiguracionAtributos[this.TipoProducto]['tipoSopCentral'].visible=0;
    // Deshabilitar el segundo select y eliminar el atributo 'required'
   /* document.getElementById("tipo_sop_central").setAttribute('disabled', 'true');
    document.getElementById("tipo_sop_central").removeAttribute('required');*/
  } 
}

CboTipoSoporteCentral=[];listarCboTipoSoporteCentral(){  
  this.CboTipoSoporteCentral=[{id:0,nombre:"--Seleccione--"},{id:1,nombre:"Fijo"},{id:2,nombre:"Transmision"}]; 
}
CboCaida=[{id:0,nombre:"--Seleccione--"}];listarCboCaida(){  
  this.CboCaida=[{id:0,nombre:"--Seleccione--"},
  {id:1,nombre:"ADENTRO"},
  {id:2,nombre:"AFUERA"}]; 
}
defaultAccionamientoId: number;
CboAccionamiento=[{id:0,nombre:"--Seleccione--"}];listarCboAccionamiento(tipoProducto,nombre_prod){  
  this.defaultAccionamientoId = 0; 
  this.CboAccionamiento=[
    {id:0,nombre:"--Seleccione--"}];
    var data=[
  {id:1,nombre:"Manual"},
  {id:2,nombre:"Motorizado"},
  {id:3,nombre:"Manual + Motorizado"}];   
  for (let i = 0; i < data.length; i++) {  
    if (data[i].id == 3) {
      var str = nombre_prod.toUpperCase();
      var valorsearch = 'M1';
      var values = str.includes(valorsearch);
      if (!values && tipoProducto == 'PRTTO') {
        this.CboAccionamiento.push(data[i]);
      }
    } else {
      if (tipoProducto == 'PRTCS' && data[i].id != 2) { // CELULAR SHADE
        this.CboAccionamiento.push(data[i]);
      } else {
        if (tipoProducto == 'PRTCV' || tipoProducto == 'PRTPH' || tipoProducto == 'PRTRH' || tipoProducto == 'PRTRF') { // PERSIANA VERTICAL // RIEL HOTELERO: FLEXIBLE
          if (data[i].id == 1) { 
            this.CboAccionamiento.push(data[i]);
            this.defaultAccionamientoId = data[i].id; // Establecer la opción por defecto
          }
        } else {
          if (tipoProducto == 'PRTRM' && data[i].id != 1) { // solo motorizado
            this.CboAccionamiento.push(data[i]);
          } else {
            this.CboAccionamiento.push(data[i]);
          }
        }
      }
    }
  };
}
//region ACCIONAMIENTO
codProd: string = '';
nomProducto: string = '';
async existeMotor(event: any, tipo: any) {
  let valMotor = "";
  if (tipo == "html") {
    valMotor = event.target.value;
  } else {
    valMotor = event;
  }

  let codProd = this.codProd;
  let nomProducto = this.nomProducto.toUpperCase();

  // MOTORIZED
  if (valMotor == 'Motorizado' || valMotor == 'Manual + Motorizado') {
    
    if (codProd == 'PRTPJ') {
      this.objConfiguracionAtributos[this.TipoProducto]['baston'].visible = 0;
    } else if (codProd == 'PRTTO') {
      const element = document.getElementById("nom_producto") as HTMLInputElement;
      let str = element.value.toUpperCase();
      let valorsearch = 'M1';
      let values = str.includes(valorsearch);
      if (values) {
        this.objConfiguracionAtributos[this.TipoProducto]['baston'].visible = 0;
      } else {
        if (valMotor == "Motorizado") {
          this.objConfiguracionAtributos[this.TipoProducto]['baston'].visible = 0;
        }
      }
    }

    // Enable fields
    this.setElementDisabled("num_motores", false);
    this.setElementDisabled("nomb_motor", false);
    this.setElementDisabled("marcamotor", false);
    this.setElementDisabled("serie", false);

    // Disable fields
    this.setElementDisabled("tipoMecanismo", true);
    this.setElementDisabled("modeloMecanismo", true);
    if (codProd != 'PRTRM') {
      this.setElementDisabled("tipo_cadena", true);
    }
    this.setElementDisabled("altura_cadena", true);

    // Set visibility
    this.objConfiguracionAtributos[this.TipoProducto]['tipoCadena'].visible = 1;
    this.objConfiguracionAtributos[this.TipoProducto]['tipoCadena'].required = 0;

  } else if (valMotor == "Manual") { // MANUAL
    if (codProd == 'PRTPJ') {
      this.objConfiguracionAtributos[this.TipoProducto]['baston'].visible = 1;
    } else if (codProd == 'PRTTO') {
      const element = document.getElementById("nom_producto") as HTMLInputElement;
      let str = element.value.toUpperCase();
      let valorsearch = 'M1';
      let values = str.includes(valorsearch);
      if (values) {
        this.objConfiguracionAtributos[this.TipoProducto]['baston'].visible = 1;
      } else {
        this.objConfiguracionAtributos[this.TipoProducto]['baston'].visible = 1;
      }
    }

    // Enable fields   FALSE // El elemento está habilitado, se puede interactuar con él y modificar su valor
    this.setElementDisabled("tipoMecanismo", false);
    this.setElementDisabled("modeloMecanismo", false);
    this.setElementDisabled("altura_cadena", false);
    if (codProd == 'PRTPH') {
      this.setElementDisabled("tipo_cadena", false);
      this.objConfiguracionAtributos[this.TipoProducto]['tipoCadena'].visible = 0;
    } else if (['PRTCS', 'PRTRH', 'PRTRF'].includes(codProd)) {
      this.setElementDisabled("tipo_cadena", false);
    } else {
      this.setElementDisabled("tipo_cadena", false);
      this.objConfiguracionAtributos[this.TipoProducto]['tipoCadena'].visible = 1;
      
    }

    // Disable fields   TRUE // El elemento está deshabilitado, no se puede interactuar con él
    this.setElementDisabled("num_motores", true);
    this.setElementDisabled("nomb_motor", true);
    this.setElementDisabled("marcamotor", true);
    this.setElementDisabled("serie", true);

  } else { // Default handling
    this.setElementDisabled("num_motores", false);
    this.setElementDisabled("nomb_motor", false);
    this.setElementDisabled("marcamotor", false);
    this.setElementDisabled("serie", false);
    this.setElementDisabled("tipoMecanismo", false);
    this.setElementDisabled("modeloMecanismo", false);
    this.setElementDisabled("tipo_cadena", true);
    this.setElementDisabled("altura_cadena", false);

    // Set height of chain calculation if applicable
    const altura_cadena = document.getElementById("altura_cadena") as HTMLInputElement;
    if (altura_cadena) {
      if (tipo == "html") {
        console.log("INGRESO A ALTURA CADENA EXIST MOTOR");
      let alturaCadena = parseFloat(this.JsonItemHijo.producto.alto);//.replace(',', '.')).toFixed(3); 
      const rptAlturaCadena = this.calcularAlturaCadena(this.TipoProducto, alturaCadena);
      if (this.TipoProducto == "PRTCV" || this.TipoProducto == "PRTPH") {
        altura_cadena.value = (rptAlturaCadena * 2).toFixed(3);
      }
      if (this.TipoProducto !== "PRTRF" && this.TipoProducto !== "PRTRH" && this.TipoProducto !== "PRTRM") {
        if (this.TipoProducto.startsWith("PRTR")) {
          altura_cadena.value = (rptAlturaCadena * 2).toFixed(3);
        }
      }
      }
      
    }
  }
 //await this.listarCboTipoCadena(); 
  if(this.JsonItemHijo.producto.id!="" && this.JsonItemHijo.producto.tipoCadena){
  const element = document.getElementById("tipo_cadena") as  HTMLSelectElement;
    if (element) {  
      element.value = this.JsonItemHijo.producto.tipoCadena;
    }
  }
 
}

private setElementDisabled(id: string, disabled: boolean) {
  const element = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
  if (element) {
    element.disabled = disabled;
    if (disabled) {
      element.value = ''; // reset value if disabled
    }
  }
}
 
//endregion 
//GUARDAR NOMBRE Y CODIGO
CboNombreTubo=[{codigo:0,nombre:"--Seleccione--"}];
listarCboNombreTubo(familia,tipoProducto){  
  this.CboNombreTubo=[{codigo:0,nombre:"--Seleccione--"}]; 
  this.spinner.show();  
  this.obtenerarticulos("Nombretubo", familia).subscribe(
    (response) => {
      if (response) {  
      var data = response; 
      console.log("CARRGANDO EL TUBO");
      console.log(tipoProducto);
      for (var i = 0; i < data.length; i++) {
       
          for (var i = 0; i < data.length; i++) {
            if (tipoProducto === 'PRTRS') {
              if (!['PALRS00000001', 'PALRS00000002'].includes(data[i].codigo)) {
                this.CboNombreTubo.push(data[i]);
              }
            } else if (tipoProducto === 'PRTRZ') {
              if (!['PALRS00000001', 'PALRS00000002'].includes(data[i].codigo)) {
                this.CboNombreTubo.push(data[i]);
              }
            } else if (tipoProducto === 'PRTRS') {
              if (!['PALRS00000001', 'PALRS00000002', 'PALRS00000005', 'PALRZ00000026', 'PALRZ00000011'].includes(data[i].codigo)) {
                this.CboNombreTubo.push(data[i]);
              }
            } else {
              this.CboNombreTubo.push(data[i]);
            }
          }
      } 
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
    }
  );  
}

ChangeTubo(event: any): void {
  const value = event.target.value;  
  const Tela = document.getElementById("NombreTubo") as HTMLInputElement ;
  const item = this.CboNombreTubo.find(element => element.codigo === value);
  if (Tela && item) {
    Tela.value = item.nombre; 
  }
}

CboMando=[{id:0,nombre:"--Seleccione--"}];listarCboMando(tipoProducto){  
  this.CboMando=[{id:0,nombre:"--Seleccione--"}];
  var data=[ 
  {id:1,nombre:"Izquierda"} , 
  {id:2,nombre:"Derecha"}, 
  {id:3,nombre:"Ambos"}, 
  {id:4,nombre:"Ninguno"},
  {id:5,nombre:"No Aplica"}  ]; 
  for (let i = 0; i < data.length; i++) {
    if (
      (tipoProducto === 'PRTPJ' || tipoProducto === 'PRTRH' || tipoProducto === 'PRTRF') &&
      (tipoProducto !== 'PRTRH' && tipoProducto !== 'PRTRF' || data[i].id !== 4)
    ) {
      this.CboMando.push(data[i]);
    } else if (tipoProducto === 'PRTCV' || (data[i].id !== 3 && data[i].id !== 4)) {
      this.CboMando.push(data[i]);
    }
  } 


}
CboTipoMecanismo=[{id:0,nombre:"--Seleccione--"}];listarCboTipoMecanismo(){
  this.CboTipoMecanismo=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"ROLLEASE"},
    {id:2,nombre:"STANDARD 38/GENERICO"},
    {id:3,nombre:"VERTILUX"}, 

  ]; 
}
CboModeloMecanismo=[{id:0,nombre:"--Seleccione--",idTipoMecanismo:"0"}];listarCboModeloMecanismo(event: Event,tipo:any){ 
  var valor="";
  if(tipo=="html"){
    valor=(event.target as HTMLSelectElement).value;
  }else{
    valor=tipo;
  }
  const valorSeleccionado = valor;
  this.CboModeloMecanismo=[
    {id:0,nombre:"--Seleccione--",idTipoMecanismo:"0"},
    {id:0,nombre:"SL15",idTipoMecanismo:"ROLLEASE"},
    {id:0,nombre:"SL20",idTipoMecanismo:"ROLLEASE"},
    {id:0,nombre:"GALAXY 200",idTipoMecanismo:"ROLLEASE"},
    {id:0,nombre:"GALAXY 400",idTipoMecanismo:"ROLLEASE"},
    {id:0,nombre:"VTX17",idTipoMecanismo:"VERTILUX"},
    {id:0,nombre:"VTX20",idTipoMecanismo:"VERTILUX"},
    {id:0,nombre:"32MM",idTipoMecanismo:"STANDARD 38/GENERICO"},
    {id:0,nombre:"38MM",idTipoMecanismo:"STANDARD 38/GENERICO"}, 
  ]; 
  var result=this.CboModeloMecanismo.filter(elem=>{elem.idTipoMecanismo==valorSeleccionado});
  this.CboModeloMecanismo=result;
}
CboTipoCadena=[{id:"0",nombre:"--Seleccione--"}];listarCboTipoCadena(){  
  this.CboTipoCadena=[
    {id:"",nombre:"--Seleccione--"},
    {id:"Plastico",nombre:"Plastico"},
    {id:"Metal",nombre:"Metal"}
  ]; 
}
//GUARDAR CODIGO Y NOMBRE
CboCodigoCadena=[{codigo:"0",nombre:"--Seleccione--",tipocadena:"0",producto:""}];listarCboCodigoCadena(event: Event,tipo:any){  
  var valor="";
  if(tipo=="html"){
    valor=(event.target as HTMLSelectElement).value;
  }else{
    valor=tipo;
  }
  const valorSeleccionado = valor;
  var result
  this.CboCodigoCadena=[
    {codigo:"0",nombre:"--Seleccione--",tipocadena:"0",producto:""}];
    
  var data=[
    {codigo:"0",nombre:"--Seleccione--",tipocadena:"0",producto:""},
    {codigo:"ACCRS00000001",nombre:"Cadena Plastica gruesa/ while accrs 01",tipocadena:"Plastico",producto:"PRTCV"},
    {codigo:"ACCRS00000002",nombre:"Cadena plastico gruesa/ para mando accrs 02 ivory",tipocadena:"Plastico",producto:"PRTCV"},

    {codigo:"ACCCV00000012",nombre:"Cadena metal grueso/ para mando acccv 12",tipocadena:"Metal",producto:""},
    {codigo:"ACCCV00000013",nombre:"Cadena metalica delgada  accv13",tipocadena:"Metal",producto:""},
    {codigo:"ACCCV00000014",nombre:"Cadena plastica delgada inferior accv14",tipocadena:"Metal",producto:""}];
  
  if(this.codProd=='PRTCV'){ 
    if(valor=="Plastico"){ //plastico 
        result=data.filter(elem=>{elem.tipocadena=="Plastico"});
    }
    if(valor=="Metal"){ //Metal 
        result=data.filter(elem=>{elem.tipocadena=="Metal"});
    }   
}else{
    result=data.filter(elem=>{elem.tipocadena==valorSeleccionado});
}
  this.CboCodigoCadena=result;
}
ChangeCadena(event: any): void {
  const value = event.target.value;  
  const Tela = document.getElementById("Cadena") as HTMLInputElement ;
  const item = this.CboCodigoCadena.find(element => element.codigo === value);
  if (Tela && item) {
    Tela.value = item.nombre; 
  }
}
CboTipoRiel=[{id:0,nombre:"--Seleccione--"}];listarCboTipoRiel(){  
  this.CboTipoRiel=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"EXCLUSIVE"},
    {id:2,nombre:"CLASSIC"},
    {id:3,nombre:"EUROSLIM"},
    {id:4,nombre:"RIEL INFERIOR CLASSIC"},
    {id:5,nombre:"RIEL INFERIOR NEOLUX"},
    {id:6,nombre:"RIEL INFERIOR SHANGRILLA"},
  ]; 
}
CboTipoInstalacion=[{id:0,nombre:"--Seleccione--"}];listarCboTipoInstalacion(){  
  this.CboTipoInstalacion=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"TECHO"},
    {id:2,nombre:"PARED"},
  ]; 
} 
//GUARDAR CODIGO Y NOMBRE
CboRiel=[{codigo:0,nombre:"--Seleccione--"}];listarCboRiel(subfamilia){  
  this.CboRiel=[{codigo:0,nombre:"--Seleccione--"}]; 
  this.spinner.show();
  this.obtenerarticulos("Familia", subfamilia).subscribe(
    (response) => {
      if (response) { 
        this.CboRiel.push(...response);
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
    }
  ); 
}
ChangeRiel(event: any): void {
  const value = event.target.value;  
  const Tela = document.getElementById("Riel") as HTMLInputElement ;
  const item = this.CboRiel.find(element => element.codigo === value);
  if (Tela && item) {
    Tela.value = item.nombre; 
  }
}
CboTipoCassete=[{id:0,nombre:"--Seleccione--"}];listarCboTipoCassete(){  
  this.CboTipoCassete=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"Cassete Redondo 100"},
    {id:2,nombre:"Cassete Redondo 120"},
    {id:3,nombre:"Cassete Plano 100"},
    {id:4,nombre:"Cassete Plano 120"}, 
  ]; 
}
CboLamina=[{id:0,nombre:"--Seleccione--"}];listarCboLamina(){  
  this.CboLamina=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"LAMINA DE PVC CURVED 90mm"},
    {id:2,nombre:"LAMINA DE ALUMINIO 25mm"}, 
  ]; 
}
CboApertura=[{id:0,nombre:"--Seleccione--"}];listarCboApertura(){  
  this.CboApertura=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"Izquierda"},
    {id:2,nombre:"Derecha"},
    {id:3,nombre:"Ambos"},  
  ]; 
}
CboViaRecogida=[{id:0,nombre:"--Seleccione--"}];listarCboViaRecogida(){  
  this.CboViaRecogida=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"Normal"},
    {id:2,nombre:"Invertida"},
  
  ]; 
}
CboTipoSuperior=[{id:0,nombre:"--Seleccione--"}];listarCboTipoSuperior(){  
  this.CboTipoSuperior=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"VERSARAIL"},
    {id:2,nombre:"CELLULAR"}, 
  
  ]; 
}

changeViaTipoSuperior(event: any) {
  var valVia = event.target.value;  
  if(this.codProd=='PRTCS'){

if(valVia=='VERSARAIL'){ 
  this.objConfiguracionAtributos[this.TipoProducto]['cordontipo2'].visible=1;
  this.objConfiguracionAtributos[this.TipoProducto]['cordon'].visible=1; 
}else{
   
  this.objConfiguracionAtributos[this.TipoProducto]['cordontipo2'].visible=1;
  this.objConfiguracionAtributos[this.TipoProducto]['cordon'].visible=1;  
}

  }
} 
//GUARDAR CODIGO Y NOMBRE
CboBaston=[{codigo:0,nombre:"--Seleccione--"}];listarCboBaston(subfamilia){  
  this.CboBaston=[
    {codigo:0,nombre:"--Seleccione--"}, 
  ];   
  this.spinner.show();
  this.obtenerarticulos("Familia", subfamilia).subscribe(
    (response) => {
      if (response) { 
        this.CboBaston.push(...response);
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
    }
  ); 
}
ChangeBaston(event: any): void {
  const value = event.target.value;  
  const Tela = document.getElementById("Baston") as HTMLInputElement ;
  const item = this.CboBaston.find(element => element.codigo === value);
  if (Tela && item) {
    Tela.value = item.nombre; 
  }
}

CboNumeroVias=[{id:0,nombre:"--Seleccione--"}];listarCboNumeroVias(){  
  this.CboNumeroVias=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"1 Via"},
    {id:2,nombre:"2 Vias"},
    {id:3,nombre:"3 Vias"},
    {id:4,nombre:"4 Vias"},
    {id:5,nombre:"5 Vias"},
  ]; 
}
CboTipoCadenaInferior=[{id:0,nombre:"--Seleccione--"}];listarCboTipoCadenaInferior(){  
  this.CboTipoCadenaInferior=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"Plastico"},
    {id:2,nombre:"Metal"},
  ]; 
}
CboMandoCordon=[{id:0,nombre:"--Seleccione--"}];listarCboMandoCordon(){  
  this.CboMandoCordon=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"Izquierda"},
    {id:2,nombre:"Derecha"}, 
  ]; 
}
CboMandoBaston=[{id:0,nombre:"--Seleccione--"}];listarCboMandoBaston(){  
  this.CboMandoBaston=[   
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"Izquierda"},
    {id:2,nombre:"Derecha"}, 
  ]; 
} 
//GUARDAR CODIGO Y NOMBRE
CboBastonVarrilla=[{codigo:0,nombre:"--Seleccione--"}];listarCboBastonVarrilla(subfamilia){  
  this.CboBastonVarrilla=[{codigo:0,nombre:"--Seleccione--"}]; 
  this.spinner.show();
  this.obtenerarticulos("Varrilla", subfamilia).subscribe(
    (response) => {
      if (response) { 
        this.CboBastonVarrilla.push(...response);
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
    }
  ); 
}
ChangeBastonVarrilla(event: any): void {
  const value = event.target.value;  
  const Tela = document.getElementById("BastonVarrilla") as HTMLInputElement ;
  const item = this.CboBastonVarrilla.find(element => element.codigo === value);
  if (Tela && item) {
    Tela.value = item.nombre; 
  }
}
CboCabezal=[{id:0,nombre:"--Seleccione--"}];listarCboCabezal(){  
  this.CboCabezal=[   
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"1"},
    {id:2,nombre:"2"}, 
    {id:3,nombre:"3"}, 
  ]; 
} 
//GUARDAR CODIGO Y NOMBRE
CboCordon=[{codigo:0,nombre:"--Seleccione--"}];listarCboCordon(subfamilia){  
  this.CboCordon=[{codigo:0,nombre:"--Seleccione--"}]; 
  this.spinner.show();
  this.obtenerarticulos("Cordon", subfamilia).subscribe(
    (response) => {
      if (response) { 
        this.CboCordon.push(...response);
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
    }
  ); 
} 
ChangeCordon(event: any): void {
  const value = event.target.value;  
  const Tela = document.getElementById("Cordon") as HTMLInputElement ;
  const item = this.CboCordon.find(element => element.codigo === value);
  if (Tela && item) {
    Tela.value = item.nombre; 
  }
}
   //GUARDAR CODIGO Y NOMBRE
CboCordonTipo2=[{codigo:0,nombre:"--Seleccione--"}];listarCboCordonTipo2(subfamilia){  
  this.CboCordonTipo2=[{codigo:0,nombre:"--Seleccione--"}]; 
  this.spinner.show();
  this.obtenerarticulos("Varrilla", subfamilia).subscribe(
    (response) => {
      if (response) { 
        this.CboCordonTipo2.push(...response);
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
    }
  ); 
}

ChangeCordonTipo2(event: any): void {
  const value = event.target.value;  
  const Tela = document.getElementById("CordonTipo2") as HTMLInputElement ;
  const item = this.CboCordonTipo2.find(element => element.codigo === value);
  if (Tela && item) {
    Tela.value = item.nombre; 
  }
}

CboCruzeta=[{id:0,nombre:"--Seleccione--"}];listarCboCruzeta(){  
  this.CboCruzeta=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"LATERAL IZQ"},
    {id:2,nombre:"LATERAL DER"},
    {id:3,nombre:"AMBOS LADOS"},
  ]; 
}
CboDispositivo=[{id:"0",nombre:"--Seleccione--"}];listarCboDispositivo(){  
  this.CboDispositivo=[
    {id:"0",nombre:"--Seleccione--"},
    {id:"Control",nombre:"Control"},
    {id:"Switch",nombre:"Switch"},
    {id:"Control + Swichtol",nombre:"Control + Swichtol"},
    {id:"Ninguno",nombre:"Ninguno"}, 
  ]; 
}
chamgeDispositivo(event: any) { 
    var valor= event.target.value;// existeMotor 
    var valDispositivo =valor;
if(valDispositivo=='Control'){
  this.objConfiguracionAtributos[this.TipoProducto]['control'].visible=1; 
  this.objConfiguracionAtributos[this.TipoProducto]['swicth'].visible=0; 
}
if(valDispositivo=='Switch'){
  this.objConfiguracionAtributos[this.TipoProducto]['control'].visible=0; 
  this.objConfiguracionAtributos[this.TipoProducto]['swicth'].visible=1; 
}
if(valDispositivo=='Control + Swicht'){
  this.objConfiguracionAtributos[this.TipoProducto]['control'].visible=1; 
  this.objConfiguracionAtributos[this.TipoProducto]['swicth'].visible=0; 
}
if(valDispositivo=='Ninguno'){
  this.objConfiguracionAtributos[this.TipoProducto]['control'].visible=0; 
  this.objConfiguracionAtributos[this.TipoProducto]['swicth'].visible=0;  
}
}
    //GUARDAR CODIGO y NOMBRE
CboControl=[{codigo:0,nombre:"--Seleccione--"}];listarCboControl(subfamilia){  
  this.CboControl=[{codigo:0,nombre:"--Seleccione--"}];  
  this.spinner.show();
  this.obtenerarticulos("Articulo", subfamilia).subscribe(
    (response) => {
      if (response) { 
        this.CboControl.push(...response);
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
    }
  ); 
} 

ChangeControl(event: any): void {
  const value = event.target.value;  
  const Tela = document.getElementById("Control") as HTMLInputElement ;
  const item = this.CboControl.find(element => element.codigo === value);
  if (Tela && item) {
    Tela.value = item.nombre; 
  }
}
    //GUARDAR EN BD CODIGO Y NOMBRE
CboSwitch=[{codigo:0,nombre:"--Seleccione--"}];listarCboSwitch(subfamilia){  
  this.CboSwitch=[{codigo:0,nombre:"--Seleccione--"}]; 
  this.spinner.show();
  this.obtenerarticulos("Articulo", subfamilia).subscribe(
    (response) => {
      if (response) { 
        this.CboControl.push(...response);
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
    }
  ); 
}

ChangeSwitch(event: any): void {
  const value = event.target.value;  
  const Tela = document.getElementById("Switch") as HTMLInputElement ;
  const item = this.CboSwitch.find(element => element.codigo === value);
  if (Tela && item) {
    Tela.value = item.nombre; 
  }
}
CboLlevaBaston=[{id:0,nombre:"--Seleccione--"}];listarCboLlevaBaston(){  
  this.CboLlevaBaston=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"Si"},
    {id:2,nombre:"No"},
  ]; 
}
CboMandoAdaptador=[{id:0,nombre:"--Seleccione--"}];listarCboMandoAdaptador(){  
  this.CboMandoAdaptador=[
    {id:0,nombre:"--Seleccione--"},
    {id:1,nombre:"Si"},
    {id:2,nombre:"No"},

  ]; 
} 
//GUARDAR CODIGO Y NOMBRE
CboMotor=[{codigo:0,nombre:"--Seleccione--"}];listarCboMotor(tupoProducto){  
  this.CboMotor=[{codigo:0,nombre:"--Seleccione--"}];
  this.spinner.show();
  this.obtenerarticulos("Motor", tupoProducto).subscribe(
    (response) => {
      if (response) { 
        this.CboMotor.push(...response); 
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
    }
  );  
} 
 
cancheCbopNombreMotor(event: any) {
  //BUSCA
  /*const valorSeleccionado = event.target.value;
  const motor = this.CboMotor.find(opcion => opcion.codigo === valorSeleccionado);
  this.selectedMotorName = motor ? motor.nombre : '';*/
  const valorSeleccionado = event.target.value;
  const motor = this.CboMotor.find(opcion => opcion.codigo === valorSeleccionado);
  const motorName = motor ? motor.nombre : '';
  // Acceder y asignar valor directamente al elemento del DOM
  const inputElement = document.getElementById('marcamotor') as HTMLInputElement;
  if (inputElement) {
    inputElement.value = motorName;
  }
  const Motor = document.getElementById("Motor") as HTMLInputElement ;
  const item = this.CboMotor.find(element => element.codigo === valorSeleccionado); 
  if (Motor && item) {
    Motor.value = item.nombre; 
  }

  }
    CargarItemsCombos(values){
      
  this.spinner.show();
  var tipoProducto = String(values.familia+values.subFamilia); 
  var subFamiliaProd = String(values.subFamilia);  
  var nombreProd=values.nombreProducto;
  this.codProd=values.codigoProducto;
  this.nomProducto=nombreProd;
  var accionamiento="--";
      const formElements = document.querySelectorAll('#formularionuevoDetalleOP select');
  // Iterar sobre los elementos del formulario
  formElements.forEach((element) => {
      // Verificar si el elemento es un input, select o textarea
      if (element instanceof HTMLSelectElement) {
          // Obtener el nombre del atributo y su valor
          const attributeName = element.getAttribute('name');          
          switch (attributeName) {
            //::::::::::::::::::::::::::::::::::::...COMBOS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
case "IndiceAgrupacion":this.listarCboIndiceAgrupacion();(element as HTMLSelectElement).value = "0" ;
break;
case "Ambiente":this.listarCboAmbiente();break;
case "Turno":this.listarCboTurno();break;
case "SoporteCentral":this.listarCboSoporteCentral();break;
case "TipoSoporteCentral":this.listarCboTipoSoporteCentral();break;
case "Caida":this.listarCboCaida();break;
case "Accionamiento":this.listarCboAccionamiento(tipoProducto,nombreProd); accionamiento="SI" ;break;
case "CodigoTela":this.listarCboTela(subFamiliaProd);break;
case "CodigoTubo": 
this.listarCboNombreTubo(subFamiliaProd,tipoProducto);break; 
case "Mando":this.listarCboMando(tipoProducto);break;
case "TipoMecanismo":this.listarCboTipoMecanismo();break;
case "ModeloMecanismo":this.listarCboModeloMecanismo(null,"0");break;
case "TipoCadena":this.listarCboTipoCadena();break;
case "CodigoCadena":this.listarCboCodigoCadena(null,"0");break;
case "TipoRiel":this.listarCboTipoRiel();break;
case "TipoInstalacion":this.listarCboTipoInstalacion();break;
case "CodigoRiel":this.listarCboRiel(subFamiliaProd);break;
case "TipoCassete":this.listarCboTipoCassete();break;
case "Lamina":this.listarCboLamina();break;
case "Apertura":this.listarCboApertura();break;
case "ViaRecogida":this.listarCboViaRecogida();break;
case "TipoSuperior":this.listarCboTipoSuperior();break;
case "CodigoBaston":this.listarCboBaston(subFamiliaProd);break;
case "NumeroVias":this.listarCboNumeroVias();break;
case "TipoCadenaInferior":this.listarCboTipoCadenaInferior();break;
case "MandoCordon":this.listarCboMandoCordon();break;
case "MandoBaston":this.listarCboMandoBaston();break;
case "CodigoBastonVarrilla":this.listarCboBastonVarrilla(subFamiliaProd);break;
case "Cabezal":this.listarCboCabezal();break;
case "CodigoCordon":this.listarCboCordon(subFamiliaProd);break;
case "CodigoCordonTipo2":this.listarCboCordonTipo2(subFamiliaProd);break;
case "Cruzeta":this.listarCboCruzeta();break;
case "Dispositivo":this.listarCboDispositivo();break;
case "CodigoControl":this.listarCboControl(subFamiliaProd);break;
case "CodigoSwitch":this.listarCboSwitch(subFamiliaProd);break;
case "LlevaBaston":this.listarCboLlevaBaston();break;
case "MandoAdaptador":this.listarCboMandoAdaptador();break;
case "CodigoMotor":this.listarCboMotor(tipoProducto);break;
            default :
            break;
            }
      }

  });
  
  this.spinner.hide();
  //asignar:  
  this.spinner.show();
      setTimeout(() => {       
        this.spinner.show();  
        this.setFormValues(this.JsonItemHijo.producto); 
        if(accionamiento=="SI"){
          this.existeMotor(values.accionamiento,"edit");
        }
        this.spinner.hide();
      }, 2000);
      this.cdr.detectChanges();
      $('#tela').select2({
        placeholder: '--Seleccione--'
      });  
      $('#tela').on('change', (event) => {
        this.ChangeTela(event);
      });
      $('#nomb_motor').select2({
        placeholder: '--Seleccione--'
      });   
      $('#nomb_motor').on('change', (event) => {
        this.cancheCbopNombreMotor(event);
      }); 
      $('#nomb_tubo').select2({
        placeholder: '--Seleccione--'
      });  
    
      $('#nomb_tubo').on('change', (event) => {
        this.ChangeTubo(event);
      });     
    }

    //#endregion
    labelPosition:string="NO";
    //#region  MANTENIMIENTO ESCUADRA
    escuadraVisible: boolean = false;
    defaultDescription: string = "ESCUADRA (L) 6x14x2.5cm x 2.5mm - WHITE";
    CboEcuadra=[
      {Codigo:"ACCRS00000505", Descripcion:"ESCUADRA (L) 6x14x2.5cm x 2.5mm - WHITE", },
      {Codigo:"ACCRS00000506", Descripcion:"ESCUADRA (L) 5x6x2.5cm x 2.5mm - WHITE", },
      {Codigo:"ACCRS00000507", Descripcion:"ESCUADRA (L) 10x16.5x4cm x 4.0mm - WHITE", }
    ];
    TblEscuadraItems=[
      {Id:1, Codigo:"ACCRS00000505",Descripcion:"ESCUADRA (L) 6x14x2.5cm x 2.5mm - WHITE",Cantidad:"" }
    ];
    chengeescuadra(event: string) { 
      this.escuadraVisible = event  === 'SI';
      if(event=="NO"){
        this.TblEscuadraItems=[
          {Id:1, Codigo:"ACCRS00000505",Descripcion:"ESCUADRA (L) 6x14x2.5cm x 2.5mm - WHITE",Cantidad:"" }
        ];
      }
    }
   
    updateDescription(event: any, item: any) {
      const selected = event.target.value;
      const selectedItem = this.CboEcuadra.find(cboItem => cboItem.Codigo === selected);
      if (selectedItem) {
        item.Codigo = selected;
        item.Descripcion = selectedItem.Descripcion;
      }
    }
   
    addProduct(elem: any) {
      // Encontrar el último ID en TblEscuadraItems
      let lastId = 0;
      this.TblEscuadraItems.forEach(item => {
        if (item.Id > lastId) {
          lastId = item.Id;
        }
      });    
      // Incrementar el último ID para la nueva fila
      const newId = lastId + 1;    
      // Agregar la nueva fila con el ID incrementado
      const newItem = { Id: newId, Codigo: elem.Codigo, Descripcion: elem.Descripcion, Cantidad: "" };
      this.TblEscuadraItems.push(newItem);
    }
    deleteProduct(event: any) {
      this.TblEscuadraItems = this.TblEscuadraItems.filter(item => item.Id !== event.Id);
    }  
    //#endregion 

    onBlurCantidad(item: any) {
      if (item.Cantidad < 0) {
        item.Cantidad = 0; // Puedes cambiar esto a '' si prefieres dejar el campo vacío
      }
    }
    }