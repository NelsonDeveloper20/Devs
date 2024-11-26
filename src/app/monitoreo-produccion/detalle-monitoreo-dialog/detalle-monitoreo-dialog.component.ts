import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MonitoreoService } from 'src/app/services/monitoreo.service';
import { SapService } from 'src/app/services/sap.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-monitoreo-dialog',
  templateUrl: './detalle-monitoreo-dialog.component.html',
  styleUrls: ['./detalle-monitoreo-dialog.component.css']
})
export class DetalleMonitoreoDialogComponent implements OnInit {

 DatosGrupo:any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private toaster: Toaster,
  private dialogRef: MatDialogRef<DetalleMonitoreoDialogComponent>,
  private spinner: NgxSpinnerService,     
  private _service: MonitoreoService,
  private router: Router,
  private apiSap:SapService
) {
  this.DatosGrupo=data;
  
  this.ListarComponteProductoByGrupo(data.cotizacionGrupo);
  
}

  ngOnInit(): void {
  }

  save(): void {    
    
  }  
  close() {
    this.dialogRef.close();
  }

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

onNombreChange2(event: any, element: any) {
  console.log(event);
  const value = event.value;  
  console.log(element);
  // Función para asignar propiedades comunes
  const asignarPropiedades = (selectedOption: any) => {    
    console.log(selectedOption);
    if (selectedOption) {
      element.nombre = selectedOption.nombre;
      element.codigo = selectedOption.codigo;
      element.unidadMedida = selectedOption.unidad || '';
      element.color = selectedOption.color || '';
    }
  }; 
  if (element.componente !== 'Agregado' && !this.DatosGrupo.cotizacionGrupo.includes('-0')) {
    console.log("ingresa producto");
    const selectedOption = this.lisComponente.find(option =>
      option.codigo === value && option.codigoProducto === element.codigoProducto.substring(0, 5)
    );
    asignarPropiedades(selectedOption);
  } else {
    const selectedOption = this.lisComponente.find(option =>
      option.codigo === value
    );
    console.log("ingresa agregado");
    asignarPropiedades(selectedOption);
  }
}
getSelectedOption(value: string, componente: string): any {
  return this.lisComponente.find(option => 
    option.codigo === value &&
    (componente === 'Agregado' || option.codigoProducto.startsWith(componente.substring(0, 5)))
  );
}

onNombreChange(event: any, element: any) {
  const value = event.value;
  const selectedOption = this.getSelectedOption(value, element.componente);
  if (selectedOption) {
    element.nombre = selectedOption.nombre;
    element.codigo = selectedOption.codigo;
    element.unidadMedida = selectedOption.unidad || '';
    element.color = selectedOption.color || '';
  }
}

lisComponente: any[] = [];
/*alistarComponestePorCodigoProds(productos){    
  this.spinner.show();   
this._service.ListarComponentesPorCodigosProducto(productos,this.DatosGrupo.cotizacionGrupo).subscribe(
  (data: any) => { 
      this.lisComponente =  data; 
      this.spinner.hide();    
      // Actualiza la lista de opciones filtradas para cada componente
      this.ListComponenteProducto.forEach(comp => {
        comp.filteredOptions = this.lisComponente; // Inicializa con la lista completa
      });

  },
  (error: any) => {
    this.spinner.hide();
    console.error('Error al obtener Componentes:', error); 
  }
);
}*/
listarComponestePorCodigoProds2(prods) {
  const componentesUnicos = [...new Set(this.ListComponenteProducto.map(comp => comp.componente))];
  componentesUnicos.forEach(componente => {
    const maestro = this.ListMaestroArticulos.find(item => item.identificador === componente);
    if (maestro) {
      // Indicar que está en estado de carga
      this.ListComponenteProducto
        .filter(comp => comp.componente === componente)
        .forEach(comp => comp.filteredOptions = null);

      this.apiSap.ListarArticulosPorFamiliaGrupo(maestro.identificador, maestro.codigoGrupo).subscribe({
        next: (data) => {
          this.ListComponenteProducto
            .filter(comp => comp.componente === componente)
            .forEach(comp => comp.filteredOptions = data);
        },
        error: (err) => {
          console.error(`Error al cargar datos para el componente ${componente}:`, err);
          this.ListComponenteProducto
            .filter(comp => comp.componente === componente)
            .forEach(comp => comp.filteredOptions = []);
        }
      });
    }
  });
}
listarComponestePorCodigoProds(prods) {
  const componentesUnicos = [...new Set(this.ListComponenteProducto.map(comp => comp.componente))];
  componentesUnicos.forEach(componente => {
    const maestro = this.ListMaestroArticulos.find(item => item.identificador === componente);
    if (maestro) {
      this.ListComponenteProducto
        .filter(comp => comp.componente === componente)
        .forEach(comp => {
          comp.filteredOptions = null; // Estado de carga
          comp.error = false;         // Limpia errores previos
        });
/*
      this.apiSap.ListarArticulosPorFamiliaGrupo(maestro.identificador, maestro.codigoGrupo).subscribe({
        next: (data) => {
          this.ListComponenteProducto
            .filter(comp => comp.componente === componente)
            .forEach(comp => comp.filteredOptions = data);
        },
        error: (err) => {
          console.error(`Error al cargar datos para el componente ${componente}:`, err);
          this.ListComponenteProducto
            .filter(comp => comp.componente === componente)
            .forEach(comp => {
              comp.filteredOptions = [];
              comp.error = true; // Marca error
            });
        }
      });*/

      this.apiSap.ListarArticulosPorFamiliaGrupo(maestro.identificador, maestro.codigoGrupo).pipe(
        retry(3), // Intenta la solicitud hasta 3 veces
        catchError((err) => {
          console.error(`Error al intentar cargar datos para el componente ${componente}:`, err);
          return throwError(() => err);
        })
      ).subscribe({
        next: (data) => {
          this.ListComponenteProducto
            .filter(comp => comp.componente === componente)
            .forEach(comp => comp.filteredOptions = data);
        },
        error: (err) => {
          this.ListComponenteProducto
            .filter(comp => comp.componente === componente)
            .forEach(comp => {
              comp.filteredOptions = [];
              comp.error = true;
            });
          alert(`Error definitivo en la comunicación con SAP para el componente ${componente}.`);
        }
      });
    }
  });
}
listarComponestePorCodigoProdsOFICIAL(prods) {
  const componentesUnicos = [...new Set(this.ListComponenteProducto.map(comp => comp.componente))];
  componentesUnicos.forEach(componente => {
    const maestro = this.ListMaestroArticulos.find(item => item.identificador === componente);
    if (maestro) {
      this.ListComponenteProducto
        .filter(comp => comp.componente === componente)
        .forEach(comp => {
          comp.filteredOptions = null; // Estado de carga
          comp.error = false; // Limpia errores previos
        });
      
      this.apiSap.ListarArticulosPorFamiliaGrupo(maestro.identificador, maestro.codigoGrupo).subscribe({
        next: (data) => {
          this.ListComponenteProducto
            .filter(comp => comp.componente === componente)
            .forEach(comp => comp.filteredOptions = data);
        },
        error: (err) => {
          console.error(`Error al cargar datos para el componente ${componente}:`, err);
          this.ListComponenteProducto
            .filter(comp => comp.componente === componente)
            .forEach(comp => {
              comp.filteredOptions = [];
              comp.error = true; // Marca error
            });

          // Opcional: muestra un mensaje de error específico
          if (err.error && err.error.ErrorDescription) {
            alert(`Error en SAP para el componente ${componente}: ${err.error.ErrorDescription}`);
          }
        }
      });
    }
  });
}




filteredListComponente = this.lisComponente;    
// Método para filtrar opciones según el input de búsqueda
applyFilter1(event: any, comp: any) {
  const valor = event.target.value.toLowerCase();
  comp.filteredOptions = this.lisComponente.filter(option => 
    option.codigo.toLowerCase().includes(valor)
  );
} 
applyFilterv2(event: any, comp: any) {
  const valor = event.target.value.toLowerCase();
  if (comp.filteredOptions) {
    comp.filteredOptions = comp.filteredOptions.filter(option =>
      option.codigo.toLowerCase().includes(valor) ||
      option.nombre.toLowerCase().includes(valor)
    );
  }
}
applyFilter(event: any, comp: any) {
  const valor = event.target.value.toLowerCase();
  // Si el valor de búsqueda está vacío, restablece las opciones
  if (valor === '') {
    comp.filteredOptions = this.lisComponente.filter(option =>
      option.codigo.toLowerCase().includes(valor)
    );
  } else {
    // Si hay texto de búsqueda, filtra las opciones
    comp.filteredOptions = this.lisComponente.filter(option =>
      option.codigo.toLowerCase().includes(valor)
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
  this._service.ListarComponenteDelProducto(Grupo,"1").subscribe(
    (data: any) => {
      if (data && data.status === 200) {  
        
        this.ListComponenteProducto = data.json.map(item => (
          { ...item, 
            NumeroCotizacion:this.DatosGrupo.cotizacion,
            Grupo:Grupo,
            Usuario:idUsuario, 
            agregado: false ,  
            merma:"",
            filteredOptions: [] // Inicializa como una lista vacía
             }));
             console.log(this.ListComponenteProducto);
             console.log("::::::::::::::______________::::::");
        this.spinner.hide();    
        const codigos = this.ListComponenteProducto
        .map(item => item.codigoProducto.substring(0, 5)) // Obtener los primeros 5 caracteres
        .filter((value, index, self) => self.indexOf(value) === index) // Eliminar duplicados si es necesario
        .join("','");  
        const resultado = `'${codigos}'`; // Agregar comillas al inicio y al final
       
        this.listarComponestePorCodigoProds(resultado);
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
 
  /*const datosJSON = JSON.stringify(this.ListComponenteProducto);
  console.log('Datos en formato JSON:', datosJSON);
  console.log('DATOS ENDS');*/
  var counter=0;
  this.ListComponenteProducto.forEach(item => {
    
     if(item.codigo==""){
      console.log("codigo: "+item.codigo);
      counter++;
     }
     if(item.nombre==""){
      console.log("nombre: "+item.nombre);
      counter++;
     }     
     if(item.cantidadUtilizada==""){
      console.log("cantidadUtilizada: "+item.cantidadUtilizada);
      counter++;
     }
     if(item.merma==""){
      console.log("merma: "+item.merma);
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
    this.GuardarExplocion();
  }else{
    this.toaster.open({
      text: "Debe ingresar todos los datos",
      caption: 'Mensaje',
      type: 'danger',
      // duration: 994000
    });
  }
}


ListGrupos:any  =[];
GuardarExplocion(){ 
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
    title: "¿Desea Explocionar?",
    html: `Al explocionar finalizara todo el proceso`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Si, Enviar',
    cancelButtonText: 'Cancelar',
  })
    .then((result) => {
      if (result.isConfirmed) { 
        
  // QUITA DEL ARRAY LOS CAMPOS   filteredOptions, agregado,idProducto
  const jsonData = JSON.stringify(this.ListComponenteProducto.map(item => {
    const { filteredOptions, agregado,idProducto, ...rest } = item;
    return rest;
  }));
   
  console.log(jsonData);
  this.spinner.show();
  this._service.GuardarExplocion(jsonData)
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
        <th style="text-align: center !important;">Familia</th>
        <th style="text-align: center !important;">Grupo</th>
        <th style="text-align: center !important;">Acción</th>
      </tr>
    </thead>
    <tbody>`;

    // Recorrer los datos y agregar las filas
    console.log("RESULTADOS::::::");
    console.log(this.ListMaestroArticulos);
    this.ListMaestroArticulos.forEach((item, index) => {
      tableHTML += `
        <tr>
          <td>${item.identificador }</td>
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
      width: '30%',
      didOpen: () => {
        // Agregar eventos a cada botón de la tabla
        this.ListMaestroArticulos.forEach((item, index) => {
          document.getElementById(`action-${index}`)?.addEventListener('click', () => {
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
     // Llamada al servicio para obtener componentes
  const listComponentes = await this.ListarArticulosPorFamiliaGrupoIndividual(this.popupComponenteSelected.identificador);
// Agregar nuevo componente a la lista
    this.ListComponenteProducto.push(
      {
  
        codigoProducto: ultimoItem.codigoProducto,
        nombreProducto: ultimoItem.nombreProducto,
        familia:ultimoItem.familia,
        //componentes
        componente:this.popupComponenteSelected.identificador+"-Agregado",
        codigo:"",
        nombre:"",
        agregado:true,
        color:'',
        unidadMedida:'',
        merma:'',
  
        NumeroCotizacion:this.DatosGrupo.cotizacion,
        Grupo:this.DatosGrupo.cotizacionGrupo,
        Usuario:idUsuario,  
        filteredOptions: listComponentes
        
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
  async ListarArticulosPorFamiliaGrupoIndividual(componente: string): Promise<any[]> {
    this.spinner.show(); // Muestra el spinner
    
    const maestro = this.ListMaestroArticulos.find(item => item.identificador === componente);
  
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
        .ListarArticulosPorFamiliaGrupo(maestro.identificador, maestro.codigoGrupo)
        .toPromise(); // Convertir observable en promesa
  
      if (!data || data.length === 0) {
        this.toaster.open({
          text: "No se encontraron artículos para el componente",
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
    codigoProducto:item.codigoProducto,
    nombreProducto:item.nombreProducto,
    //componentes
    componente: item.componente+"-Clonado",
    codigo:item.codigo,
    nombre:item.nombre,
    agregado:true,
    color:item.color,
    unidadMedida:item.unidadMedida,
    merma:item.merma,
    cantidadUtilizada:item.cantidadUtilizada,
    NumeroCotizacion:this.DatosGrupo.cotizacion,
    Grupo:this.DatosGrupo.cotizacionGrupo,
    Usuario:idUsuario,  
    filteredOptions: this.lisComponente 
  }); 
}



}
