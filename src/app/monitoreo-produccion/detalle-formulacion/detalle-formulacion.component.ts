
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { firstValueFrom } from 'rxjs';
import { MonitoreoService } from 'src/app/services/monitoreo.service';
import { ProductoService } from 'src/app/services/productoservice';
import { SapService } from 'src/app/services/sap.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detalle-formulacion',
  templateUrl: './detalle-formulacion.component.html',
  styleUrls: ['./detalle-formulacion.component.css']
})
export class DetalleFormulacionComponent  implements OnInit {

DatosGrupo:any;
idUsuario:any;

mostrarPRTRS = false;
mostrarPRTRSMot=false;
mostrarPRTRZ = false;
mostrarPRTRH00000001 = false;
mostrarPRTCV = false;

mostrarPRTRM00000001 = false;
mostrarPRTRF00000001 = false;
mostrarPRTLU0000000123 = false;
mostrarPRTRM00000016=false;
// Agrega más según lo que necesites


constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private toaster: Toaster,
  private dialogRef: MatDialogRef<DetalleFormulacionComponent>,
  private spinner: NgxSpinnerService,     
  private _service: MonitoreoService,
  private router: Router,
  private apiSap:SapService,
  private _productoService: ProductoService,
) {
  this.DatosGrupo=data;
  
  const productosArray = this.DatosGrupo?.productos
    ?.split(',')
    .map(p => p.trim()) || [];

     
  this.mostrarPRTRS = productosArray.includes('PRTRSMan');
  this.mostrarPRTRSMot = productosArray.includes('PRTRSMot');
  this.mostrarPRTRZ = productosArray.includes('PRTRZ');
  this.mostrarPRTRH00000001 = productosArray.includes('PRTRH00000001');
  //this.mostrarPRTCV = productosArray.includes('PRTCV');
  // Cambio aquí: usar some() con startsWith() en lugar de includes()
  this.mostrarPRTCV = productosArray.some(p => p.startsWith('PRTCV'));

  this.mostrarPRTRM00000001 = productosArray.includes('PRTRM00000001');
  this.mostrarPRTRF00000001 = productosArray.includes('PRTRF00000001');
  this.mostrarPRTRM00000016 = productosArray.includes('PRTRM00000016');
  this.mostrarPRTLU0000000123 = ['PRTLU00000001', 'PRTLU00000002', 'PRTLU00000003']
    .some(p => productosArray.includes(p));

  const userDataString = JSON.parse(localStorage.getItem('UserLog'));   
  this.idUsuario= userDataString.id.toString(); 
  this.ListarComponteProductoByGrupo(data.cotizacionGrupo);


  this.dialogRef.updateSize('80vw', '80vh');
  this.dialogRef.disableClose = true;
  
}
ngAfterViewInit() {
  // Habilitar redimensionamiento del diálogo
  this.makeDialogResizable();
}

makeDialogResizable() {
  const element = document.querySelector('.mat-dialog-container') as HTMLElement;
  if (element) {
    // Agregar manijas de redimensionamiento
    this.addResizeHandle(element);
  }
}

addResizeHandle(element: HTMLElement) {
  // Crear elemento para la manija de redimensionamiento
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  element.appendChild(resizeHandle);
  
  // Aplicar estilo a la manija
  element.style.position = 'relative';
  resizeHandle.style.position = 'absolute';
  resizeHandle.style.bottom = '0';
  resizeHandle.style.right = '0';
  resizeHandle.style.width = '15px';
  resizeHandle.style.height = '15px';
  resizeHandle.style.cursor = 'nwse-resize';
  resizeHandle.style.background = '#ccc';
  resizeHandle.style.clipPath = 'polygon(100% 0, 100% 100%, 0 100%)';
  
  // Lógica de redimensionamiento
  let startX: number, startY: number, startWidth: number, startHeight: number;
  
  const initResize = (e: MouseEvent) => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };
  
  const resize = (e: MouseEvent) => {
    const width = startWidth + e.clientX - startX;
    const height = startHeight + e.clientY - startY;
    
    if (width > 300 && height > 200) {
      element.style.width = width + 'px';
      element.style.height = height + 'px';
    }
  };
  
  const stopResize = () => {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  };
  
  resizeHandle.addEventListener('mousedown', initResize);
}
  ngOnInit(): void {
  }

  save(): void {    
    
  }  
  close() {
    this.dialogRef.close();
  } 
isOptionInFilteredOptions(codigo: string, filteredOptions: any[]): boolean {
  // Si filteredOptions es null o undefined, devolver falso.
  if (!filteredOptions || filteredOptions.length === 0) {
    return false;
  }

  return filteredOptions.some(option => option.codigo === codigo);
}
 
 
onNombreChange(event: any, element: any) {
  const selectedCodigo = event.value; // Código seleccionado
  if(!selectedCodigo){
    return;
  }
  console.log(selectedCodigo);
    
  const selectedOption = element.filteredOptionsOriginal.find(item => item.codigoTipo.toUpperCase() === selectedCodigo.toUpperCase());
console.log(selectedOption.descripcionTipo);
  if (selectedOption){//}  && element.agregado == 'true') {
    console.log("ingresa");
    element.nombre = selectedOption.nombre; // Actualiza el nombre
    element.unidadMedida = selectedOption.unidadMedida || ''; // Actualiza unidad de medida
    element.color = selectedOption.color || ''; // Actualiza el color
    element.descripcionTipo=selectedCodigo.descripcionTipo || '';

    // Fallback methods
    if (!element.descripcionTipo) {
      element.descripcionTipo = selectedOption['descripcion_tipo'] || '';
    }
    if (!element.descripcionTipo) {
      element.descripcionTipo = selectedOption.descripcionTipo || '';
    }
  } else {
    console.log("no ingresa");
    // Si no se encuentra, limpia los valores
    element.nombre = '';
    element.unidadMedida = '';
    element.color = '';
    
  }
}

capitalizeFirstLetter(value: string): string { 
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

    async listarComponentes(codigoProducto: string): Promise<any[]> {
      this.spinner.show();
      try {
        const response = await firstValueFrom(
          this._productoService.listarAccesorioXProducto(codigoProducto)
        );
        this.spinner.hide();
        return response || [];
      } catch (error) {
        console.log("error: ", error);
        this.spinner.hide();
        return [];
      }
    }
lisComponente: any[] = []; 
// Nuevo método usando async/await

//PENDIENTE
async listarComponentesTelaRielTubo(tipo: string,codigoProducto:any,nombreProducto:any): Promise<any[]> {
  this.spinner.show();
  try {
    const response = await firstValueFrom(
      this._productoService.listarTelaRielTubo(
        tipo,
       codigoProducto,
       nombreProducto
      )
    );
    this.spinner.hide();
    return response || [];
  } catch (error) {
    console.log("error: ", error);
    this.spinner.hide();
    return [];
  }
}
private async listarComponestePorCodigoProdsOFICIAL(destinoList,codProducto) {  
// Obtener el tipo de producto
let tipoProducto =codProducto;//PRTRS ,PRTRZ,PRTRM00000016, PRTRM00000001, PRTRH00000001, PRTRF00000001, PRTLU00000001_2_3 
if(codProducto.toUpperCase().includes('PRTCV')){
        tipoProducto='PRTRH00000001';
        codProducto='PRTRH00000001';
      }
// Obtener componentes desde la API
const response = await this.listarComponentes(tipoProducto);//ACCESORIO DIFERENTES A 
if (response) {
        
      // Transformador general
      const transformarItem = (item: any) => ({
        codigoTipo: item.codigo,
        descripcionTipo: item.descripcion,
        unidadMedida: item.unidad,
        color: item.color,
        serie: item.serie,
        lote: item.lote
      });

      // Transformación base
      const transformedData = response.map(transformarItem);

      // Agregar opción "Ninguno" al inicio
      transformedData.unshift({
        codigoTipo: "Ninguno",
        descripcionTipo: "Ninguno",
        unidadMedida: "",
        color: "",
        serie: "",
        lote: ""
      });

      // Lista de productos especiales
      const productosEspeciales = [
        "PRTRM00000016", "PRTRM00000001",
        "PRTRH00000001", "PRTRF00000001",
        "PRTLU00000001_2_3", "PRTLU00000001",
        "PRTLU00000002", "PRTLU00000003"
      ];
      const normalizar = (texto: string) =>
        texto.trim().toLowerCase().replace(/es$|s$/i, ''); // quita plurales simples
      
      if (productosEspeciales.includes(codProducto)) {
        // Si son productos especiales, se asume que response es un array de grupos con subgrupos  
        destinoList
          .forEach(comp => {
            comp.filteredOptions.push({
              codigoTipo: "Ninguno",
              descripcionTipo: "Ninguno",
              unidadMedida: "",
              color: "",
              serie: "",
              lote: ""
            });
            comp.filteredOptionsOriginal.push({
              codigoTipo: "Ninguno",
              descripcionTipo: "Ninguno",
              unidadMedida: "",
              color: "",
              serie: "",
              lote: ""
            });
            comp.error = false;
          });
        response.forEach((grupo: any) => {
          const dataTransformada = transformarItem(grupo);             
          const subGrupo = normalizar(grupo.subGrupo);  
          destinoList
            .filter(elem => normalizar(elem.descripcionTipo).includes(normalizar(grupo.subGrupo))) //elem.descripcionTipo.trim().toLowerCase().includes(subGrupo))
            .forEach(comp => {
              comp.filteredOptions.push(dataTransformada);
              comp.filteredOptionsOriginal.push(dataTransformada);
              comp.error = false;
            });
        });
        
      } else {
        // Para accesorios normales
        destinoList
          .filter(comp => comp.tipoDesc.replace('ACCESORIOS', 'ACCESORIO') === "ACCESORIO")
          .forEach(comp => {
            comp.filteredOptions = transformedData;
            comp.filteredOptionsOriginal = transformedData;
            comp.error = false;
          });
      }
      }
// Obtener valores únicos con mayúscula/minúscula corregida y excluir "ACCESORIO"
let componentesUnicos = [...new Set( //PARA LISTAR RIEL,TELA, ETC
  destinoList.filter(item=> item.tipoDesc.replace("ACCESORIOS",'ACCESORIO') !== "ACCESORIO")
    .map(comp => this.capitalizeFirstLetter(comp.tipoDesc ?? "")) 
)];  
//elimina duplicados de tela,tubo, etc
 componentesUnicos = [...new Set(componentesUnicos)];

console.log("BUSCADOS==>",componentesUnicos);
  if(codProducto=='PRTRSMan' || codProducto=='PRTRSMot' || codProducto=='PRTRZ'){

    for (const componente of componentesUnicos) {
      this.spinnerMessage = `Cargando Componentes: ${componente}`;
      this.spinner.show('cargandoProductos');
        const maestro = this.ListMaestroArticulos.find(item => item.nombreGrupo === componente);
        console.log("COMPONENTES BUSCADOS");
        console.log(componente);
        
        destinoList
        .filter(comp => this.capitalizeFirstLetter(comp.tipoDesc ?? "")  === componente)
        .forEach(comp => {
            comp.filteredOptions = null;
            comp.filteredOptionsOriginal=null;
            comp.error = false;
        });
        if (maestro) {
            // Marca los componentes en estado de carga 
            try {
                // Intentar obtener datos con reintentos
                const data = await this.obtenerDatosConReintentos(maestro, componente)as any[];   
              const transformedData = data.map((item: any) => ({
                codigoTipo: item.codigo,
                descripcionTipo: item.nombre,
                unidadMedida: item.unidadMedida,
                color: item.color,
                serie: item.serie,
                lote: item.lote,
              }));
     
              console.log("RESULTADO ===>",componente);
              console.log(transformedData);             
              
                // Agregar elemento "Ninguno" al inicio del array
                transformedData.unshift({
                  codigoTipo: "Ninguno", // o algún valor especial como 0 o -1
                  descripcionTipo: "Ninguno",
                  unidadMedida: "",
                  color: "",
                  serie: "",
                  lote: "",
                });
                // Actualizar componentes con los datos obtenidos  
              destinoList
              .filter(comp => 
                [//"Tela", "Tela altura",
                   componente].includes(this.capitalizeFirstLetter(comp.tipoDesc ?? ""))
              )
              .forEach(comp => {
                comp.filteredOptions = transformedData;
                comp.filteredOptionsOriginal = transformedData;
                comp.error = false;
              });   
            } catch (error) {
              this.spinner.hide('cargandoProductos');
                console.error(`Error al cargar datos para el componente ${componente}:`, error);
                this.spinner.hide();
                // Mostrar mensaje de error solo si es error de COM object
                if (error.error?.ErrorDescription?.includes('COM object')) {
                    this.toaster.open({
                        text: `Error de conexión SAP para el componente ${componente}. Reintentando...`,
                        caption: 'Error',
                        type: 'warning',
                    });
                }
            }
        }
    }
  
  }
  
}
// Método auxiliar para reintentos
private async obtenerDatosConReintentos(maestro, componente, maxIntentos = 3) {
  for (let intento = 1; intento <= maxIntentos; intento++) {
      try {
          return await new Promise((resolve, reject) => {
              const subscription = this.apiSap
                  .ListarArticulosPorFamiliaGrupo(maestro.codigoGrupo, maestro.identificador)
                  .subscribe({
                      next: (data) => {
                          resolve(data);
                          subscription.unsubscribe();
                      },
                      error: (error) => {
                          reject(error);
                          subscription.unsubscribe();
                      }
                  });
          });
      } catch (error) {
        this.spinner.hide();
          if (intento === maxIntentos || !error.error?.ErrorDescription?.includes('COM object')) {
              throw error;
          }
          // Esperar antes de reintentar
          await new Promise(resolve => setTimeout(resolve, 1000 * intento));
      }
  }
}


filteredListComponente = this.lisComponente;    
// Método para filtrar opciones según el input de búsqueda 
applyFilter(event: any, comp: any) {
  const valor = event.target.value.toLowerCase();
  if (!valor) {
    // Restaura las opciones originales si no hay búsqueda
    comp.filteredOptions = [...comp.filteredOptionsOriginal];
  } else {
    // Filtra por código o nombre
    comp.filteredOptions = comp.filteredOptionsOriginal.filter(option =>
      option.codigoTipo.toLowerCase().includes(valor) || // Coincidencia en el código
      option.descripcionTipo.toLowerCase().includes(valor)   // Coincidencia en el nombre
    );
  }
}

spinnerMessage: string = 'Cargando...';

ListComponenteProducto:any=[];
ListComponenteProductoMot:any=[];
ListComponenteProductoPRTRZ:any=[];
ListComponenteProductoPRTRM00000016:any=[];
ListComponenteProductoPRTRM00000001:any=[];
ListComponenteProductoPRTRH00000001:any=[];
ListComponenteProductoPRTCV:any=[];
ListComponenteProductoPRTRF00000001:any=[];
ListComponenteProductoPRTLU00000001_2_3:any=[];
async ListarComponteProductoByGrupo(Grupo) {  
     // Si la lista está vacía, esperamos a que se complete la carga
 if (this.ListMaestroArticulos.length === 0) {  
  console.log("FUE A BD");
  this.spinner.show();
  await this.ListarMaestroArticulos();
  this.spinner.hide();
}else{
  console.log("NO IR A BD");
}
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
  // Extraer los productos de DatosGrupo.Productos o ProductosContados
  let productosArray = [];  
  // Procesar la columna ProductosContados
  console.log(this.DatosGrupo);
  productosArray = this.DatosGrupo.productos.split(', ');  
  // Procesar cada producto
  for (const element of productosArray) { 
    const codigoProducto = element.trim();
    
    // Productos especiales PRTRS/PRTRZ
    if (codigoProducto === "PRTRSMan") {
      this.spinnerMessage = `Cargando producto: ${codigoProducto}`;
      this.spinner.show('cargandoProductos');
      await this.procesarProducto(Grupo, codigoProducto, this.ListComponenteProducto);
      this.spinner.hide('cargandoProductos');
      this.spinner.hide();
    } 
    if (codigoProducto === "PRTRSMot") {
      this.spinnerMessage = `Cargando producto: ${codigoProducto}`;
      this.spinner.show('cargandoProductos');
      await this.procesarProducto(Grupo, codigoProducto, this.ListComponenteProductoMot);
      this.spinner.hide('cargandoProductos');
      this.spinner.hide();
    } 
    if (codigoProducto === "PRTRZ") {
      this.spinnerMessage = `Cargando producto: ${codigoProducto}`;
      this.spinner.show('cargandoProductos');
      await this.procesarProducto(Grupo, codigoProducto, this.ListComponenteProductoPRTRZ);
      this.spinner.hide('cargandoProductos');
      this.spinner.hide();
    } 
    // PRTRM00000016
    else if (codigoProducto === "PRTRM00000016") {
      this.spinnerMessage = `Cargando producto: ${codigoProducto}`;
      this.spinner.show('cargandoProductos');
      await this.procesarProducto(Grupo, codigoProducto, this.ListComponenteProductoPRTRM00000016);
      this.spinner.hide('cargandoProductos');
      this.spinner.hide();
    } 
    // PRTRM00000001
    else if (codigoProducto === "PRTRM00000001") {
      this.spinnerMessage = `Cargando producto: ${codigoProducto}`;
      this.spinner.show('cargandoProductos');
      await this.procesarProducto(Grupo, codigoProducto, this.ListComponenteProductoPRTRM00000001);
      this.spinner.hide('cargandoProductos');
      this.spinner.hide();
    } 
    // PRTRH00000001
    else if (codigoProducto === "PRTRH00000001") {
      this.spinnerMessage = `Cargando producto: ${codigoProducto}`;
      this.spinner.show('cargandoProductos');
      await this.procesarProducto(Grupo, codigoProducto, this.ListComponenteProductoPRTRH00000001);
      this.spinner.hide('cargandoProductos');
      this.spinner.hide();
    } 
    else if (codigoProducto.toUpperCase().includes('PRTCV')) {

      this.spinnerMessage = `Cargando producto: ${codigoProducto}`;
      this.spinner.show('cargandoProductos');
      await this.procesarProducto(Grupo, codigoProducto, this.ListComponenteProductoPRTCV);
      this.spinner.hide('cargandoProductos');
      this.spinner.hide();
    } 
    // PRTRF00000001
    else if (codigoProducto === "PRTRF00000001") {
      this.spinnerMessage = `Cargando producto: ${codigoProducto}`;
      this.spinner.show('cargandoProductos');
      await this.procesarProducto(Grupo, codigoProducto, this.ListComponenteProductoPRTRF00000001);
      this.spinner.hide('cargandoProductos');
      this.spinner.hide();
    } 
    // PRTLU00000001, PRTLU00000002, PRTLU00000003
    else if (["PRTLU00000001", "PRTLU00000002", "PRTLU00000003"].includes(codigoProducto)) {
      this.spinnerMessage = `Cargando producto: ${codigoProducto}`;
      this.spinner.show('cargandoProductos');
      await this.procesarProducto(Grupo, codigoProducto, this.ListComponenteProductoPRTLU00000001_2_3);
      this.spinner.hide('cargandoProductos');
      this.spinner.hide();
    }else{

      this.spinner.hide();
    }
  } 
} 
// Método para procesar un producto específico y asignar los resultados a la lista correspondiente
async procesarProducto(Grupo, codigoProducto, listaDestino) { 
  var accionamiento = this.DatosGrupo.accionamiento;
var partes = accionamiento.split(',').map(p => p.trim());
var resultadoAcionamiento = partes.includes("Motorizado") ? "Motorizado" : partes[0];

  return new Promise((resolve, reject) => {
    this._service.ListarFormulacionRollerShade("-", Grupo, codigoProducto, resultadoAcionamiento)
      .subscribe(
        async (data: any) => {
          this.spinner.hide();
          this.spinner.hide('cargandoProductos');
          if (data && data.status === 200) {
            const ordenPersonalizado = ['TUBO', 'TELA', 'RIEL'];
            
            let productosOrdenados;  
              let dataproductos=data.json; 
              dataproductos = dataproductos.map(p => ({
                ...p,
                lote: "" // o null, 0, etc., lo que necesites como valor inicial
              }));          
            if (codigoProducto === "PRTRSMan" || codigoProducto === "PRTRSMot" || codigoProducto === "PRTRZ") {
              productosOrdenados = dataproductos.sort((a, b) => {
              const iA = ordenPersonalizado.indexOf(a.tipoDesc);
              const iB = ordenPersonalizado.indexOf(b.tipoDesc);
              return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB);
               });
               
            }else{
              productosOrdenados = dataproductos;
            }            
            // Si es la lista de PRTLU, hacemos un push
            if (listaDestino === this.ListComponenteProductoPRTLU00000001_2_3) {
              // Corregir el operador de asignación aquí
              listaDestino.push(...productosOrdenados.map(item => ({
                ...item,
                filteredOptions: [],
                filteredOptionsOriginal: []
              })));
            } else {
              // Para las demás listas, asignamos directamente
              Object.assign(listaDestino, productosOrdenados.map(item => ({
                ...item,
                filteredOptions: [],
                filteredOptionsOriginal: []
              })));
            }
             
            const resultado = '';
            if (listaDestino.length > 0) {
              //if (codigoProducto === "PRTRS" || codigoProducto === "PRTRZ") {
                this.spinnerMessage = `Cargando Componentes para: ${codigoProducto}`;
                this.spinner.show('cargandoProductos');
                await this.listarComponestePorCodigoProdsOFICIAL(listaDestino,codigoProducto); 
              //}
            }
            resolve(true);
          } else {
            this.spinner.hide('cargandoProductos');
            this.spinner.hide();
            console.error('Error: No se pudo obtener datos.');
            reject('No se pudo obtener datos');
          }
        },
        (error: any) => {
          this.spinner.hide('cargandoProductos');
  
          this.spinner.hide();
          console.error('Error al obtener datos:', error);
          reject(error);
        }
      );
  });
}

tieneProducto(codigo: string): boolean {
  console.log("===============>: "+codigo);
  const productosArray = this.DatosGrupo?.productos
    ?.split(',')
    .map(p => p.trim()) || [];
  console.log(productosArray);
  return productosArray.includes(codigo);
}


//#region VALIACIONES SOLO NUMERICOS


validateAndFormatInput(event: Event): void {
  const input = event.target as HTMLInputElement;
 
  const regex = /^[0-9]*\.?[0-9]*$/;
  if (!regex.test(input.value)) {
    // Revert to previous valid value
    input.value = input.value.replace(/[^0-9.]/g, '');
  }
}

//#endregion 

// Método para validar componentes con soporte para diferentes tipos de lista
guardarComponentes() {
  // Array para almacenar todas las listas a validar
  const tablas_lista = ["PRTRSMan","PRTRSMot", "PRTRZ", "PRTRM00000016", "PRTRM00000001", "PRTRH00000001","PRTCV", "PRTRF00000001", "PRTLU00000001_2_3"];
  let hayErrores = false;

  // Validar cada lista individualmente
  for (const tabla_lista of tablas_lista) {
    const lista = this.getComponentList(tabla_lista); 
    var nombreTabla=tabla_lista.replace('PRTRSMan','PRTRS').replace('PRTRSMot','PRTRS').replace('PRTLU00000001_2_3','PRTLU0000000');
    if (!lista || lista.length === 0) {
      // Si la lista está vacía, simplemente la omitimos
      continue;
    }

    // Validar componentes de la lista actual
    for (const item of lista) {
      // Para todos los componentes si es ninguno no validar nada
      if (item.codigoTipo === "Ninguno") {
        continue;
      }
      if (item.codigoTipo === "" || item.codigoTipo === null) {
        this.toaster.open({
          text: `Seleccione código de ${item.descripcionTipo} en ${nombreTabla}`,
          caption: 'Mensaje',
          type: 'danger'
        });
        hayErrores = true;
        break;
      }
      
      // Validaciones de cantidades y cálculos solo para los 3 tipos
      if (!item.cantidadRoller || item.cantidadRoller === "") {
        this.toaster.open({
          text: `Ingrese cantidad de ${item.descripcionTipo} en ${nombreTabla}`,
          caption: 'Mensaje',
          type: 'danger'
        });
        hayErrores = true;
        break;
      }
      
      // Determinar si es uno de los tipos específicos
      const isTuboTelaRiel = (item.tipoDesc === 'TUBO' || item.tipoDesc === 'RIEL' || item.tipoDesc === 'TELA');
      
      // Para los demás componentes que no son TUBO, RIEL o TELA, no hacemos más validaciones
      if (!isTuboTelaRiel) {
        continue;
      }
      // Validación de números negativos
      if (Number(item.cantidadRoller) < 0 || Number(item.calculoFinal) < 0) {
        this.toaster.open({
          text: `Evite ingresar números negativos en cantidad y calculo final de ${item.descripcionTipo} en ${nombreTabla}`,
          caption: 'Mensaje',
          type: 'danger',
          position: 'top-right',
          duration: 3000
        });
        hayErrores = true;
        break;
      }
      
      // Validación específica según tipo
      if (item.tipoDesc === 'TUBO' || item.tipoDesc === 'RIEL') {
        // Solo validar ancho para TUBO y RIEL
        if (!item.ancho || Number(item.ancho) < 0) {
          this.toaster.open({
            text: `Ingrese un ancho válido para ${item.descripcionTipo} en ${nombreTabla}`,
            caption: 'Mensaje',
            type: 'danger'
          });
          hayErrores = true;
          break;
        }
      }
      
      if (item.tipoDesc === 'TELA') {
        // Validar ancho y alto para TELA
        if (!item.ancho || Number(item.ancho) < 0) {
          this.toaster.open({
            text: `Ingrese un ancho válido para ${item.descripcionTipo} en ${nombreTabla}`,
            caption: 'Mensaje',
            type: 'danger'
          });
          hayErrores = true;
          break;
        }
        
        if (!item.alto || Number(item.alto) < 0) {
          this.toaster.open({
            text: `Ingrese un alto válido para ${item.descripcionTipo} en ${nombreTabla}`,
            caption: 'Mensaje',
            type: 'danger'
          });
          hayErrores = true;
          break;
        }
      }
      if (!item.calculoFinal || item.calculoFinal === "") {
        this.toaster.open({
          text: `Ingrese cálculo final de ${item.descripcionTipo} en ${nombreTabla}`,
          caption: 'Mensaje',
          type: 'danger'
        });
        hayErrores = true;
        break;
      }
    }

    // Si encontramos errores en una lista, salimos del ciclo
    if (hayErrores) {
      break;
    }
  }

  // Si no hay errores, procedemos a guardar
  if(!hayErrores){
    this.GuardarExplocion();
  }
}
ListGrupos:any  =[];
// Método para guardar todos los componentes de todas las listas en un solo JSON
GuardarExplocion(){  
  // Array para almacenar todas las listas a guardar
  const tablas_lista = ["PRTRSMan", "PRTRSMot", "PRTRZ", "PRTRM00000016", "PRTRM00000001", "PRTRH00000001", "PRTRF00000001", "PRTLU00000001_2_3","PRTCV"];
  let todosLosComponentes = [];
  let hayComponentes = false;
  
  // Recopilar componentes de todas las listas
  for (const tabla_lista of tablas_lista) {
    const lista = this.getComponentList(tabla_lista);
    var nombreTabla=tabla_lista.replace('PRTRSMan','PRTRS').replace('PRTRSMot','PRTRS').replace('PRTLU00000001_2_3','PRTLU');
    if (lista && lista.length > 0) {
      // Transformar los componentes de esta lista
      console.log("LLISTAR ================>: "+tabla_lista);
      console.log(lista);
      const componentesTransformados = lista.map(item => {
        const { 
          filteredOptions,  codigo, nombre,
          cantidadRoller, valorAjuste, ajusteTubo, valorAjusteXroller, 
          error, filteredOptionsOriginal, indiceAgrupacion, cantXGrupoIndiceAgrupacion,
          valorPor1Roller, valorPor2Rollers, valorPor3Rollers, valorPor4Rollers,
          detalleCompleto, calculoFinalXgrupo, altoXgrupo,
          ...rest 
        } = item;
        
        return {
          ...rest,
          cantidad: rest.calculoFinal, // Renombra 'calculoFinal' a 'cantidad'
          grupo: rest.cotizacionGrupo,
          numeroCotizacion: rest.numeroCotizacion,
          descrip_Componente: rest.tipoDesc,
          codigo_Componente: rest.codigoTipo,
          componente: rest.descripcionTipo,
          cantidadUtilizada: rest.calculoFinal,
          usuario: this.idUsuario,
          tipoProducto: nombreTabla //tabla_lista // Añadimos el tipo de producto como identificador
        };
      });
      
      // Agregar los componentes transformados al array general
      todosLosComponentes = [...todosLosComponentes, ...componentesTransformados];
      hayComponentes = true;
    }
  } 
  
  // Verificar si hay componentes para guardar
  if (!hayComponentes) {
    this.toaster.open({
      text: "Debe ingresar componentes en al menos una lista",
      caption: 'Mensaje',
      type: 'danger',
    });
    return;
  } 

  // Convertir todos los componentes a JSON
  const jsonData = JSON.stringify(todosLosComponentes);
  console.log(jsonData);
  Swal.fire({
    allowOutsideClick: false,
    title: "¿Desea Guardar?",
    html: `Al guardar, finalizará todo el proceso y quedará pendiente enviarlo a SAP`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Si, Guardar',
    cancelButtonText: 'Cancelar',
  })
    .then((result) => {
      if (result.isConfirmed) { 
        
  this.spinner.show();
  this._service.GuardarFormulacionRollerShade(jsonData)
    .subscribe({
      next: response => {
        this.spinner.hide();
        console.log(response);
        if (response.status == 200) { 
          this.spinner.hide();
              const respuesta = response.json.respuesta;
              const id = response.json.id; 
              console.log("RESPUESTA");
             if(respuesta=="OK"){       
              var rpt={
                id:id,
                result:respuesta
              };      
            this.dialogRef.close(rpt);
             }
          }else{
            this.spinner.hide();
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
      }else{
        this.ListGrupos=[];
      }
    });
} 

 
// Método para eliminar un componente de una lista específica
eliminarItemAgregado(item: any, tabla_lista: string) {
  // Obtener la lista correspondiente según tabla_lista
  const lista = this.getComponentList(tabla_lista);
  if (!lista) {
    this.toaster.open({
      text: `Lista no encontrada para ${tabla_lista}`,
      caption: 'Error',
      type: 'danger',
      position: 'bottom-right',
      duration: 2000
    });
    return;
  }
  // Encuentra el índice del elemento seleccionado en la lista correcta
  const index = lista.indexOf(item);
  if (index === -1) {
    this.toaster.open({
      text: "No se encontró el componente para eliminar",
      caption: 'Error',
      type: 'danger',
      position: 'bottom-right',
      duration: 2000
    });
    return;
  }
  // Eliminar el elemento de la lista
  lista.splice(index, 1);
  /*
  // Notificar al usuario que el componente ha sido eliminado
  this.toaster.open({
    text: "Componente eliminado exitosamente",
    caption: 'Éxito',
    type: 'success',
    position: 'bottom-right',
    duration: 2000
  });*/
}
//#endregion 
 // Definir un mapa para asociar cada código con su lista correspondiente
private componentListsMap = {
  "PRTRSMan": () => this.ListComponenteProducto,
  "PRTRSMot": () => this.ListComponenteProductoMot,
  "PRTRZ": () => this.ListComponenteProductoPRTRZ,
  "PRTRM00000016": () => this.ListComponenteProductoPRTRM00000016,
  "PRTRM00000001": () => this.ListComponenteProductoPRTRM00000001,
  "PRTRH00000001": () => this.ListComponenteProductoPRTRH00000001,
  "PRTRF00000001": () => this.ListComponenteProductoPRTRF00000001,
  "PRTLU00000001_2_3": () => this.ListComponenteProductoPRTLU00000001_2_3,
  "PRTCV":()=>this.ListComponenteProductoPRTCV
};// Método para obtener la lista correspondiente según el tipo
private getComponentList(tabla_lista: string): any[] {
  const listGetter = this.componentListsMap[tabla_lista];
  if (!listGetter) {
    console.error(`Lista no encontrada para el tipo: ${tabla_lista}`);
    return [];
  }
  return listGetter();
}
// Método para agregar un componente a la lista correspondiente
private addComponentToList(tabla_lista: string, newComponent: any): void {
  const list = this.getComponentList(tabla_lista);
  if (list) {
    list.push(newComponent);
  }
}
// Método para obtener el último elemento de una lista
private getLastItemFromList(tabla_lista: string): any {
  const list = this.getComponentList(tabla_lista);
  return list && list.length > 0 ? list[list.length - 1] : null;
}
  popupComponenteSelected:any;
  // Método para abrir el popup
  async openTablePopup(tipo:string) {
     

    // Crear el contenido HTML para la tabla
    let tableHTML = '<table class="table table-responsive-sm mb-0">';
    tableHTML += `<thead>
      <tr>
        <th style="text-align: center !important;">Componente</th>
        <th style="text-align: center !important;">Codigo Grupo</th>
        <th style="text-align: center !important;">Acción</th>
      </tr>
    </thead>
    <tbody>`;

    // Recorrer los datos y agregar las filas
    console.log("RESULTADOS::::::");
    console.log(this.ListMaestroArticulos); 
    // Verificar si existe un elemento con codigoGrupo="TODOS"
  const existeTodos = this.ListMaestroArticulos.some(item => item.codigoGrupo === "TODOS");
  
  // Si no existe, agregar opción "TODOS"
  if (!existeTodos) {
    this.ListMaestroArticulos.push({
      "id": 1,
      "identificador": "TODOS",
      "codigoGrupo": 'TODOS',
      "nombreGrupo": "OTROS",
      "observacion": "TODOS"
    });
  }
  
    this.ListMaestroArticulos.forEach((item, index) => {
      tableHTML += `
        <tr>
          <td>${item.nombreGrupo }</td>
          <td>${item.codigoGrupo}</td>
          <td><button class="btn btn-primary" id="action-${index}">Agregar</button></td>
        </tr>
      `;
    });

    tableHTML += '</tbody></table>';

    // Usar Swal para mostrar el popup con la tabla
    Swal.fire({
      title: 'Seleccione componente que desea agregar',
      html: tableHTML,
      showConfirmButton: false,
      showCancelButton:true,
      cancelButtonText:"Cerrar",
      width: '45%',
      didOpen: () => {
        // Agregar eventos a cada botón de la tabla
        this.ListMaestroArticulos.forEach((item, index) => {
          document.getElementById(`action-${index}`)?.addEventListener('click', () => {
            console.log("===============>");
            console.log(item);
            this.executeAction(item,tipo);
          });
        });
      }
    });
  }

  // Método que se ejecuta cuando se hace clic en la acción
  executeAction(item: any,tabla_lista:any): void {
    console.log('Acción ejecutada para:', item);
    this.popupComponenteSelected=item;
    this.agregarComponente(tabla_lista); 
  }

  ListMaestroArticulos:any=[]; 
  ListarMaestroArticulos() {
    return new Promise<void>((resolve, reject) => {
      this._service.ListarMaestroArticulos().subscribe({
        next: (data: any) => {
          console.log("RESULTADOS===========>");
          console.log(data);
          this.ListMaestroArticulos = data;
          resolve();
        },
        error: (error: any) => {
          console.error('Error al obtener datos:', error);
          reject(error);
        }
      });
    });
  }
  @ViewChild('tableElement') tableElement: ElementRef;
  async  agregarComponente(tabla_lista:any){
    console.log("EJECUTANDO AGREGAR");
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
     // Obtener el último elemento de la lista correspondiente 
  const ultimoItem = this.getLastItemFromList(tabla_lista); 
  if (!ultimoItem) {
    this.toaster.open({
      text: "No se encontró información del producto",
      caption: 'Error',
      type: 'danger',
      position: 'bottom-right',
      duration: 2000
    });
    return;
  }
  
     // Obtener los componentes según la selección
  let listComponentes = [];
  if (this.popupComponenteSelected.codigoGrupo === "TODOS") {
    // Recorre todos los códigos de componentes para ejecutar api y acumular resultados
    for (const item of this.ListMaestroArticulos.filter(filt => filt.codigoGrupo !== 'TODOS')) {
      const result = await this.ListarArticulosPorFamiliaGrupoIndividual(item.nombreGrupo);
      if (result) {
        listComponentes.push(...result);
      }
    }
    console.log("RESULTADO FINAL==>");
    console.log(listComponentes);
  } else {
    // Llamada al servicio para obtener componentes de SAP por grupo individual
    const result = await this.ListarArticulosPorFamiliaGrupoIndividual(this.popupComponenteSelected.nombreGrupo);
    if (result) {
      listComponentes.push(...result);
    }
    console.log("RESULTADO POR INDIVIDUAL==>");
    console.log(listComponentes);
  }
     // Transformar datos para la interfaz
  const transformedData = listComponentes.map((item: any) => ({
    codigoTipo: item.codigo,
    descripcionTipo: item.nombre,
    unidadMedida: item.unidadMedida,
    color: item.color,
    serie: item.serie,
    lote: item.lote,
  }));
  
  // Agregar elemento "Ninguno" al inicio del array
  transformedData.unshift({
    codigoTipo: "Ninguno", // o algún valor especial como 0 o -1
    descripcionTipo: "Ninguno",
    unidadMedida: "",
    color: "",
    serie: "",
    lote: "",
  }); 
    // Crear el nuevo componente con los datos del ultimoItem
  const newComponent = { 
    producto: ultimoItem.producto,
    numeroCotizacion: ultimoItem.numeroCotizacion,
    cotizacionGrupo: ultimoItem.cotizacionGrupo,
    codigoTipo: "",
    descripcionTipo: this.popupComponenteSelected.nombreGrupo.toUpperCase(),
    tipoDesc: "ACCESORIO",
    codigo: "",
    nombre: "",
    alto: "0",
    ancho: "0",
    cantidadRoller: ultimoItem.cantidadRoller,
    valorAjuste: null,
    ajusteTubo: null,
    valorAjusteXroller: null,
    calculoFinal: 0,
    merma: 0,
    agregado: "true",
    filteredOptions: transformedData,
    filteredOptionsOriginal: transformedData,
    familia: ultimoItem.familia,
    subFamilia: ultimoItem.subFamilia,
    lote:""
  };
  // Agregar el nuevo componente a la lista correspondiente
  this.addComponentToList(tabla_lista, newComponent);
 // Cerrar el popup y mostrar mensaje de éxito
  Swal.close();
  this.toaster.open({
    text: "Componente agregado",
    caption: 'Mensaje',
    type: 'success',
    position: 'bottom-right',
    duration: 2000
  });
  
  // Desplazar el scroll hacia el final
  this.scrollToBottom();
  }
  tipoDescColors: { [key: string]: string } = {
    'ACCESORIO': 'rgb(129 129 129 / 6%)',
    'RIEL': 'rgb(247 186 194 / 10%)',
    'TELA': 'rgb(234 255 223 / 41%)',
    'TUBO': 'white'
  }; 
  getBackgroundColor(tipoDesc: string | null | undefined): string {
    if (!tipoDesc) return 'white'; // Si no tiene valor, usa blanco
    return this.tipoDescColors[tipoDesc] || 'white';
  }
  isEditableCalculo: boolean = true; 
  isEditableMerma: boolean = true;
  isEditableTipo:boolean=true;
  async ListarArticulosPorFamiliaGrupoIndividual(componente: string): Promise<any[]> {
    this.spinner.show(); // Muestra el spinner
    
    const maestro = this.ListMaestroArticulos.find(item => item.nombreGrupo === componente);
  
    if (!maestro) {
      this.spinner.hide();
      this.toaster.open({
        text: "Maestro artículo no encontrado",
        caption: 'Mensaje',
        type: 'danger',
      });
      return []; // Retornar array vacío si no se encuentra el maestro
    }
  
    try {
      const data = await this.apiSap
        .ListarArticulosPorFamiliaGrupo(maestro.codigoGrupo, maestro.identificador)
        .toPromise(); // Convertir observable en promesa
  
      if (!data || data.length === 0) {
        this.toaster.open({
          text: "No se encontraron artículos en SAP para el componente "+componente,
          caption: 'Mensaje',
          type: 'warning',
        });
        return [];
      }
  
      return data; // Devuelve los datos si están disponibles
    } catch (error) {
      this.toaster.open({
        text: "Error al cargar datos para el componente individual (SAP)",
        caption: 'Mensaje',
        type: 'danger',
      });
      console.error(`Error al cargar datos para el componente ${componente}:`, error);
      return []; // Retornar array vacío en caso de error
    } finally {
      this.spinner.hide(); // Asegura que el spinner se oculta
    }
  }
  
  // Método para desplazar el scroll
  scrollToBottom(): void {
    try {
      const tableElement = this.tableElement.nativeElement;
      tableElement.scrollTop = tableElement.scrollHeight;
    } catch (err) {
      console.error('Error desplazando el scroll:', err);
    }
  }
  
clonarComponente(item:any,tabla_lista:string){
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
   
  // Obtener la lista correspondiente según tabla_lista
  const lista = this.getComponentList(tabla_lista);
  if (!lista) {
    this.toaster.open({
      text: `Lista no encontrada para ${tabla_lista}`,
      caption: 'Error',
      type: 'danger',
      position: 'bottom-right',
      duration: 2000
    });
    return;
  }
  
  // Encuentra el índice del elemento seleccionado en la lista correcta
  const index = lista.indexOf(item);
  if (index === -1) {
    this.toaster.open({
      text: "No se encontró el componente para clonar",
      caption: 'Error',
      type: 'danger',
      position: 'bottom-right',
      duration: 2000
    });
    return;
  }

  // Crear el clon con los datos del componente original
  const clonedComponent = {    
    producto: item.producto,
    numeroCotizacion: item.numeroCotizacion,
    cotizacionGrupo: item.cotizacionGrupo,
    codigoTipo: item.codigoTipo,
    descripcionTipo: item.descripcionTipo,
    tipoDesc: item.tipoDesc,
    codigo: item.codigo,
    nombre: item.nombre,
    alto: "",  // Reset alto
    ancho: "", // Reset ancho
    cantidadRoller: item.cantidadRoller,
    valorAjuste: null,
    ajusteTubo: null,
    valorAjusteXroller: null,
    calculoFinal: 0,
    merma: 0,
    agregado: "true",
    filteredOptions: item.filteredOptions,
    filteredOptionsOriginal: item.filteredOptionsOriginal,
    familia: item.familia,
    subFamilia: item.subFamilia,
    lote:item.lote
  };  
  // Insertar el clon justo después del componente original
  lista.splice(index + 1, 0, clonedComponent);
/*
// Notificar al usuario que el componente ha sido clonado
this.toaster.open({
  text: "Componente clonado exitosamente",
  caption: 'Éxito',
  type: 'success',
  position: 'bottom-right',
  duration: 2000
});*/


}
getGrupos(indiceAgrupacion: string): string[] {
  return indiceAgrupacion ? indiceAgrupacion.split(',') : [];
}

getCantidades(cantXGrupo: string): string[] {
  return cantXGrupo ? cantXGrupo.split(',') : [];
} 
getValores(cantXGrupo: string, element: any): any[] {
  const cantidades = cantXGrupo ? cantXGrupo.split(',') : [];
  let resul: any[] = [];

  cantidades.forEach(item => {
    const cantidad = Number(item);
    let valor: string = '0.00';
    
    switch(true) {
      case cantidad === 1:
        valor = element.valorPor1Roller;
        break;
      case cantidad === 2:
        valor = element.valorPor2Rollers ;
        break;
      case cantidad === 3:
        valor = element.valorPor3Rollers;
        break;
      case cantidad >= 4:
        valor = element.valorPor4Rollers;
        break;
      default:
        console.warn(`Unhandled roller quantity: ${cantidad}`);
    }
    
    resul.push(valor);
  });
 
  return resul;
}



isFormulacion: boolean = false;
  //#endregion

//#region CALCULADORA
// Auto-calculation method
// Auto-calculation method
autoCalculateComponent(component: any) { 
  if(component.descripcionTipo=="CINTA DOBLE CONTACTO" || component.descripcionTipo=='CINTA ADHESIVA CLEAR'){
    
  }else
  if(component?.agregado!='true' && component.tipoDesc !== 'ACCESORIO'){
     
  }else{
    return;
  }

  switch (component.tipoDesc) {
    case 'TUBO':
    case 'RIEL':
      this.calculateTuboRielComponent(component);
      break;
    case 'TELA':
      this.calculateTelaComponent(component);
      break;
    case 'ACCESORIO':
     this.calculateAccesorioComponent(component);
      break;
  }
}

// Calculation for Tubo and Riel
calculateTuboRielComponent(component: any) { 
  if (component.cantidadRoller >= 4) {
    component.calculoFinal = (component.ancho - component.valorPor4Rollers).toFixed(3);
  } else {
    switch (component.cantidadRoller) {
      case 1:
        component.calculoFinal = (component.ancho - component.valorPor1Roller).toFixed(3);
        break;
      case 2:
        component.calculoFinal = (component.ancho - component.valorPor2Rollers).toFixed(3);
        break;
      case 3:
        component.calculoFinal = (component.ancho - component.valorPor3Rollers).toFixed(3);
        break; 
    } 
  }
}

// Calculation for Tela 
calculateTelaComponent(component: any) {  
 let tuboFila= this.ListComponenteProducto.filter(comp=>{
    comp?.agregado!='true' && comp.tipoDesc == 'TELA'
    && comp.codigo==component.codigo
  })[0];
    var valortubo=tuboFila.calculoFinal;
  if (component.cantidadRoller >= 4) {   
    component.calculoFinal = ((valortubo-component.valorPor4Rollers)+(component.alto+component.valorPor4Rollers)).toFixed(3);
  } else { 
    // Different calculation for Tela Ancho and Tela Altura 
      switch (component.cantidadRoller) {
        case 1:
          component.calculoFinal = ((valortubo-component.valorPor1Roller)+(component.alto+component.valorPor1Roller)).toFixed(3);
          break;
        case 2:
          component.calculoFinal = ((valortubo-component.valorPor2Rollers)+(component.alto+component.valorPor2Rollers)).toFixed(3);
          break;
        case 3:
          component.calculoFinal = ((valortubo-component.valorPor3Rollers)+(component.alto+component.valorPor3Rollers)).toFixed(3);
          break; 
      } 
  }
}

// Calculation for Accessories
calculateAccesorioComponent(component: any) { 
   
  if (component.cantidadRoller >= 4) {
    component.calculoFinal = (component.ancho - component.valorPor4Rollers).toFixed(3);
  } else {
    switch (component.cantidadRoller) {
      case 1:
        component.calculoFinal = (component.ancho - component.valorPor1Roller).toFixed(3);
        break;
      case 2:
        component.calculoFinal = (component.ancho - component.valorPor2Rollers).toFixed(3);
        break;
      case 3:
        component.calculoFinal = (component.ancho - component.valorPor3Rollers).toFixed(3);
        break; 
    } 
  }
}

// Method to bind to input changes
onComponentInputChange(component: any) {
 // this.autoCalculateComponent(component);
}
 

parseDetalleCompleto(comp: any): any[] {
  if (!comp.detalleCompleto) {
    return [];
  }
  
  try {
    // If it's already an object, return it
    if (typeof comp.detalleCompleto === 'object') {
      return comp.detalleCompleto;
    }
    
    // Parse JSON string into an array
    return JSON.parse(comp.detalleCompleto);
  } catch (e) {
    console.error('Error parsing detalleCompleto:', e);
    return [];
  }
}
//#endregion
}
