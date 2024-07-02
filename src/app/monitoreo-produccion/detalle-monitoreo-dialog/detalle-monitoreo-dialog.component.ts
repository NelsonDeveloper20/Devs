import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { MonitoreoService } from 'src/app/services/monitoreo.service';
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
isOptionInFilteredOptions(codigo: string, filteredOptions: any[]): boolean {
  return filteredOptions.some(option => option.codigo === codigo);
}
onNombreChange(event: any, element: any) {
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

lisComponente: any[] = [];
listarComponestePorCodigoProds(productos){    
  this.spinner.show();   
this._service.ListarComponentesPorCodigosProducto(productos,this.DatosGrupo.cotizacionGrupo).subscribe(
  (data: any) => { 
      this.lisComponente =  data;
      console.log(this.lisComponente);
      this.spinner.hide();   
      //this.filteredListComponente = this.lisComponente;

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
}
filteredListComponente = this.lisComponente;    
// Método para filtrar opciones según el input de búsqueda
applyFilter(event: any, comp: any) {
  const valor = event.target.value.toLowerCase();
  comp.filteredOptions = this.lisComponente.filter(option => 
    option.codigo.toLowerCase().includes(valor)
  );
} 

ListComponenteProducto:any=[];
ListarComponteProductoByGrupo(Grupo) { 
  
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
        this.spinner.hide();    
        const codigos = this.ListComponenteProducto
        .map(item => item.codigoProducto.substring(0, 5)) // Obtener los primeros 5 caracteres
        .filter((value, index, self) => self.indexOf(value) === index) // Eliminar duplicados si es necesario
        .join("','");  
        const resultado = `'${codigos}'`; // Agregar comillas al inicio y al final
        console.log(resultado); // 'PRTRS','PRTSZ'
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
agregarComponente(){
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
  this.ListComponenteProducto.push(
    {

      codigoProducto:'Agregado',
      nombreProducto:'Agregado',
      //componentes
      componente:"Agregado",
      codigo:"",
      nombre:"",
      agregado:true,
      color:'',
      unidadMedida:'',
      merma:'',

      NumeroCotizacion:this.DatosGrupo.cotizacion,
      Grupo:this.DatosGrupo.cotizacionGrupo,
      Usuario:idUsuario,  
      filteredOptions: this.lisComponente
      
  });
}

guardarComponentes() {
 
  const datosJSON = JSON.stringify(this.ListComponenteProducto);
  console.log('Datos en formato JSON:', datosJSON);
  console.log('DATOS ENDS');
  var counter=0;
  this.ListComponenteProducto.forEach(item => {
     if(item.codigo==""){
      counter++;
     }
     if(item.nombre==""){
      counter++;
     }     
     if(item.cantidadUtilizada==""){
      counter++;
     }
     if(item.merma==""){
      counter++;
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
        
  //const jsonData = JSON.stringify(this.ListComponenteProducto);
  const jsonData = JSON.stringify(this.ListComponenteProducto.map(item => {
    const { filteredOptions, agregado, ...rest } = item;
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
    agregado:item.agregado,
    color:item.color,
    unidadMedida:item.unidadMedida,
    merma:item.merma,

    NumeroCotizacion:this.DatosGrupo.cotizacion,
    Grupo:this.DatosGrupo.cotizacionGrupo,
    Usuario:idUsuario,  
    filteredOptions: this.lisComponente 
  }); 
}
//#endregion
}
