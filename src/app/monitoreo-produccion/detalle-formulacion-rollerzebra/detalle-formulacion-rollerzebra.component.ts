
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
  selector: 'app-detalle-formulacion-rollerzebra',
  templateUrl: './detalle-formulacion-rollerzebra.component.html',
  styleUrls: ['./detalle-formulacion-rollerzebra.component.css']
})
export class DetalleFormulacionRollerzebraComponent implements OnInit {

DatosGrupo:any;
idUsuario:any;
 constructor(@Inject(MAT_DIALOG_DATA) public data: any,
 private toaster: Toaster,
   private dialogRef: MatDialogRef<DetalleFormulacionRollerzebraComponent>,
   private spinner: NgxSpinnerService,     
   private _service: MonitoreoService,
   private router: Router,
   private apiSap:SapService,
   private _productoService: ProductoService,
 ) {
   this.DatosGrupo=data;
   
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
 //#region  TODOS LISATOS CLONADOS,AGREGADO,ELIMINADO
 //#region LISTAR COMPONENTE DEL PRODDUCTO POR GRUPO
 // Método para manejar el cambio de selección en mat-select
 /*
 isOptionInFilteredOptions(codigo: string, filteredOptions: any[]): boolean {
   return filteredOptions.some(option => option.codigo === codigo);
 }*/
 isOptionInFilteredOptions(codigo: string, filteredOptions: any[]): boolean {
   // Si filteredOptions es null o undefined, devolver falso.
   if (!filteredOptions || filteredOptions.length === 0) {
     return false;
   }
 
   return filteredOptions.some(option => option.codigo === codigo);
 }
  
  
 onNombreChange(event: any, element: any) {
   const selectedCodigo = event.value; // Código seleccionado
   console.log(selectedCodigo);
     
   const selectedOption = element.filteredOptionsOriginal.find(item => item.codigoTipo === selectedCodigo);
 console.log(selectedOption.descripcionTipo);
   if (selectedOption  && element.agregado == 'true') {
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
 private async listarComponestePorCodigoProdsOFICIAL(prods) { 
   
     // Obtener valores únicos con mayúscula/minúscula corregida y excluir "ACCESORIO"
     let componentesUnicos = [...new Set(
       this.ListComponenteProducto.filter(item=> item.tipoDesc !== "ACCESORIOS")
         .map(comp => this.capitalizeFirstLetter(comp.tipoDesc ?? "")) 
     )];  
 // Obtener el tipo de producto
 let tipoProducto = this.ListComponenteProducto[0]?.producto ?? "";
 // Normalizar tipo de producto
 if (tipoProducto === "ROLLER ZEBRA") {
   tipoProducto = "PRTRZ";
 }
 // Obtener componentes desde la API
 const response = await this.listarComponentes(tipoProducto);
 if (response) {
   // Filtrar accesorios y actualizar propiedades en un solo `forEach`
   const transformedData = response.map((item: any) => ({
     codigoTipo: item.codigo,
     descripcionTipo: item.descripcion,
     unidadMedida: item.unidad,
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
   this.ListComponenteProducto
     .filter(comp => comp.tipoDesc === "ACCESORIOS")
     .forEach(comp => {
       comp.filteredOptions = transformedData;
       comp.filteredOptionsOriginal = transformedData;
       comp.error = false;
     });
 }
 //elimina duplicados de tela,tubo, etc
  componentesUnicos = [...new Set(componentesUnicos)];
 
 console.log("BUSCADOS==>",componentesUnicos);
   for (const componente of componentesUnicos) {
       const maestro = this.ListMaestroArticulos.find(item => item.nombreGrupo === componente);
       console.log("COMPONENTES BUSCADOS");
       console.log(componente);
       
       this.ListComponenteProducto
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
             this.ListComponenteProducto
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
               console.error(`Error al cargar datos para el componente ${componente}:`, error);
                
 
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
  
 applyFilters(event: any, comp: any) {
   const valor = event.target.value.toLowerCase();
   if (!valor) {
     comp.filteredOptions = [...comp.filteredOptionsOriginal]; // Restaura las opciones originales
   } else {
     comp.filteredOptions = comp.filteredOptionsOriginal.filter(option =>
       option.codigo.toLowerCase().includes(valor)
     );
   }
 }
  
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
 
 
 ListComponenteProducto:any=[];
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
   this.spinner.show();
   this._service.ListarFormulacionRollerShade("-",Grupo,this.DatosGrupo.productos,this.DatosGrupo.accionamiento).subscribe(
     async (data: any) => {
       if (data && data.status === 200) {  
         this.spinner.hide();    
         //this.ListComponenteProducto = data.json;
         const ordenPersonalizado = ['TUBO', 'TELA', 'RIEL'];

          const productosOrdenados =  data.json.sort((a, b) => {
            const iA = ordenPersonalizado.indexOf(a.tipoDesc);
            const iB = ordenPersonalizado.indexOf(b.tipoDesc);
            return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB);
          });


           this.ListComponenteProducto = productosOrdenados.map(item => (
           { ...item,  
             filteredOptions: [], // Inicializa como una lista vacía
             filteredOptionsOriginal: [], // Inicializa como una lista vacía             
              })); 
         const resultado ='';// `'${codigos}'`; // Agregar comillas al inicio y al final
        if(this.ListComponenteProducto){
         await  this.listarComponestePorCodigoProdsOFICIAL(resultado); 
        }  
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

 guardarComponentes() {
  var counter=0;
  for (const item of this.ListComponenteProducto) {
    // Primero validamos el código para todos los componentes
 
    // Para todos los componentes si es ninguno no validar nada
    if (item.codigoTipo === "Ninguno") {
      continue;
    }
    if (item.codigoTipo === "" || item.codigoTipo === null) {
      this.toaster.open({
        text: `Seleccione código de ${item.descripcionTipo}`,
        caption: 'Mensaje',
        type: 'danger'
      });
      counter++;
      break;
    }
    
    // Validaciones de cantidades y cálculos solo para los 3 tipos
    if (!item.cantidadRoller || item.cantidadRoller === "") {
      this.toaster.open({
        text: `Ingrese cantidad de ${item.descripcionTipo}`,
        caption: 'Mensaje',
        type: 'danger'
      });
      counter++;
      break;
    }
    
    // Determinar si es uno de los tipos específicos
    const isTuboTelaRiel = (item.tipoDesc === 'TUBO' || item.tipoDesc === 'RIEL' || item.tipoDesc === 'TELA');
    
    // Para los demás componentes que no son TUBO, RIEL o TELA, no hacemos más validaciones
    if (!isTuboTelaRiel) {
      continue;
    }
    // Validación de números negativos
    if (Number(item.cantidadRoller) < 1 || Number(item.calculoFinal) < 1) {
      this.toaster.open({
        text: `Evite ingresar números negativos en cantidad y calculo final de ${item.descripcionTipo}`,
        caption: 'Mensaje',
        type: 'danger',
        position: 'top-right',
        duration: 3000
      });
      counter++;
      break;
    }
    // A partir de aquí solo validaciones para TUBO, RIEL y TELA
    
    // Validación específica según tipo
    if (item.tipoDesc === 'TUBO' || item.tipoDesc === 'RIEL') {
      // Solo validar ancho para TUBO y RIEL
      if (!item.ancho || Number(item.ancho) < 1) {
        this.toaster.open({
          text: `Ingrese un ancho válido para ${item.descripcionTipo}`,
          caption: 'Mensaje',
          type: 'danger'
        });
        counter++;
        break;
      }
    }
    
    if (item.tipoDesc === 'TELA') {
      // Validar ancho y alto para TELA
      if (!item.ancho || Number(item.ancho) < 1) {
        this.toaster.open({
          text: `Ingrese un ancho válido para ${item.descripcionTipo}`,
          caption: 'Mensaje',
          type: 'danger'
        });
        counter++;
        break;
      }
      
      if (!item.alto || Number(item.alto) < 1) {
        this.toaster.open({
          text: `Ingrese un alto válido para ${item.descripcionTipo}`,
          caption: 'Mensaje',
          type: 'danger'
        });
        counter++;
        break;
      }
    }
    if (!item.calculoFinal || item.calculoFinal === "") {
      this.toaster.open({
        text: `Ingrese cálculo final de ${item.descripcionTipo}`,
        caption: 'Mensaje',
        type: 'danger'
      });
      counter++;
      break;
    }
    

  };
  if(counter==0){
    this.GuardarExplocion();
  }else{
   /*
    this.toaster.open({
      text: "Debe ingresar todos los datos",
      caption: 'Mensaje',
      type: 'danger',
      // duration: 994000
    });*/
  }
}

 
 ListGrupos:any  =[];
 GuardarExplocion(){  
   // QUITA DEL ARRAY LOS CAMPOS   filteredOptions, agregado,producto
   const jsonData = JSON.stringify(this.ListComponenteProducto.map(item => {
     const { filteredOptions, producto,codigo,nombre,
       cantidadRoller,valorAjuste,ajusteTubo,valorAjusteXroller, 
       error,filteredOptionsOriginal,indiceAgrupacion,cantXGrupoIndiceAgrupacion,valorPor1Roller,valorPor2Rollers,valorPor3Rollers,valorPor4Rollers,detalleCompleto,
       calculoFinalXgrupo,altoXgrupo,
       ...rest } = item;
     
   return {
     ...rest,
     cantidad: rest.calculoFinal, // Renombra 'calculo fina' a 'cantidad'
     grupo: rest.cotizacionGrupo,
     numeroCotizacion:rest.numeroCotizacion,
     descrip_Componente: rest.tipoDesc,
     codigo_Componente:rest.codigoTipo,
     componente: rest.descripcionTipo,
     cantidadUtilizada:rest.calculoFinal,
     usuario:this.idUsuario
   };
   })); 
   console.log(jsonData);
   if(this.ListComponenteProducto.length === 0){
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
 
 eliminarItemAgregado(item: any) {
   const index = this.ListComponenteProducto.indexOf(item);
   if (index !== -1) {
     this.ListComponenteProducto.splice(index, 1);
   }
 }
 //#endregion
   // Datos que simulan la carga desde un JSON
  
   popupComponenteSelected:any;
   // Método para abrir el popup
   async openTablePopup() {
      
 
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
             this.executeAction(item);
           });
         });
       }
     });
   }
 
   // Método que se ejecuta cuando se hace clic en la acción
   executeAction(item: any): void {
     console.log('Acción ejecutada para:', item);
     this.popupComponenteSelected=item;
     this.agregarComponente(); 
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
   async  agregarComponente(){
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
     const ultimoItem = this.ListComponenteProducto[this.ListComponenteProducto.length - 1];
      let listComponentes =[];
      if (this.popupComponenteSelected.codigoGrupo === "TODOS") {
       // recorre todos los codigos de componentes para ejecutar api y luego acumular cada una
       for (const item of this.ListMaestroArticulos.filter(filt => filt.codigoGrupo !== 'TODOS')) {
         
      // Llamada al servicio para obtener componentes de SAP
         const result = await this.ListarArticulosPorFamiliaGrupoIndividual(item.nombreGrupo);
         if (result) {
           listComponentes.push(...result);
         }
       }
       console.log("RESULTADO FINAL==>");
       console.log(listComponentes);
  
     } else {
       // Llamada al servicio para obtener componentes de SAP
       const result = await this.ListarArticulosPorFamiliaGrupoIndividual(this.popupComponenteSelected.nombreGrupo);
       //listComponentes = result ? [result] : [];  
       if (result) {
         listComponentes.push(...result);
       }
       console.log("RESULTADO POR INDIVIDUAL==>");
       console.log(listComponentes);
     }
      
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
 // Agregar nuevo componente a la lista
     this.ListComponenteProducto.push(
       { 
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
         agregado:"true",
         filteredOptions: transformedData,
         filteredOptionsOriginal:transformedData ,
         familia: ultimoItem.familia,
         subFamilia: ultimoItem.subFamilia
     });
     
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
   
 clonarComponente(item:any){  
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
   // Encuentra el índice del elemento seleccionado
   const index = this.ListComponenteProducto.indexOf(item);
    
   this.ListComponenteProducto.splice(index + 1, 0, {    
     producto: item.producto,
     numeroCotizacion: item.numeroCotizacion,
     cotizacionGrupo: item.cotizacionGrupo,
     codigoTipo: item.codigoTipo,
     descripcionTipo: item.descripcionTipo,
     tipoDesc: item.tipoDesc,
     codigo: item.codigo,
     nombre:item.nombre,
     alto: "",
     ancho: "",
     cantidadRoller: item.cantidadRoller,
     valorAjuste: null,
     ajusteTubo: null,
     valorAjusteXroller: null,
     calculoFinal: 0,
     merma: 0,
     agregado:"true",
     filteredOptions: item.filteredOptions,
     filteredOptionsOriginal:item.filteredOptionsOriginal,
     familia: item.familia,
     subFamilia: item.subFamilia
   }); 
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
 
 getValoresTotal(cantXGrupo: string, element: any): any[] {
   const cantidades = cantXGrupo ? cantXGrupo.split(',') : [];
   let resul: any[] = [];
 
   cantidades.forEach(item => {
     const cantidad = Number(item);
     let valor: string = '0.00';
     
     switch(true) {
       case cantidad === 1:
         valor = (Number(parseFloat(element.valorPor1Roller).toFixed(3))*cantidad).toFixed(3).toString();
         break;
       case cantidad === 2:
         valor = (Number(parseFloat(element.valorPor2Rollers).toFixed(3))*cantidad).toFixed(3).toString();
         break;
       case cantidad === 3:
         valor = (Number(parseFloat(element.valorPor3Rollers).toFixed(3))*cantidad).toFixed(3).toString();
         break;
       case cantidad >= 4:
         valor = (Number(parseFloat(element.valorPor4Rollers).toFixed(3))*cantidad).toFixed(3).toString();
         break;
       default:
         console.warn(`Unhandled roller quantity: ${cantidad}`);
     }
     
     resul.push(valor);
   });
  
   return resul;
 }
 sum(valores: any[]): number {
   if (!valores || valores.length === 0) return 0;
   
   return valores.reduce((acc, current) => {
     // Convert to number, handling potential string inputs
     const numValue = Number(parseFloat(current).toFixed(3))  
     
     return acc + numValue;
   }, 0).toFixed(3);
 }
 isFormulacion: boolean = false;
   toggleVisibilityFormulation(): void {
     this.isFormulacion = !this.isFormulacion;
   }
 
   mostrar(comp:any){ 
     if(comp.descripcionTipo=="CINTA DOBLE CONTACTO" || comp.descripcionTipo=='CINTA ADHESIVA CLEAR'){
       return true;
     }else
     if(comp?.agregado!='true' && comp.tipoDesc == 'ACCESORIO'){
       return true;
     }else{
       return false;
     }
   }
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
   this.autoCalculateComponent(component);
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
 