 
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { OperacionesConstruccionService } from 'src/app/services/operacionesconstruccion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fabricacion-estacion',
  templateUrl: './fabricacion-estacion.component.html',
  styleUrls: ['./fabricacion-estacion.component.css']
})
export class FabricacionEstacionComponent  implements OnInit {
  centesimas: number = 0;
  segundos: number = 0;
  minutos: number = 0;
  horas: number = 0;
  control: any;
  isRunning: boolean = true; // Inicializamos en `true` para que el cronómetro comience automáticamente al cargar el componente

  constructor( 
    private toaster: Toaster,private router: Router, 
    private route: ActivatedRoute,
    private _service: OperacionesConstruccionService,
    private spinner: NgxSpinnerService,  
  ) { }
  DataFabricacion:any={};
  
  showStepNumber1: boolean = false;
  showStepNumber2: boolean = false;
  showStepNumber3: boolean = false;
  ngOnInit(): void { 
     // Suscribirse a cambios en los parámetros de estado
  this.route.paramMap.subscribe(params => {
    const state = history.state;
    if (state) {
      console.log("--------DATOS---------");
      console.log(state); 
      this.DataFabricacion=state;
    }
  });
   
    this.start(); // Comenzamos el cronómetro automáticamente al cargar el componente
    this.listarProductoEstacionPorGrupo();
    this.ListarAvanceEstacionProducto();
  }
 toggleStepNumber(step: number) {
    switch (step) {
      case 1:
        this.showStepNumber1 = !this.showStepNumber1;
        break;
      case 2:
        this.showStepNumber2 = !this.showStepNumber2;
        break;
      case 3:
        this.showStepNumber3 = !this.showStepNumber3;
        break;
    }
  }
  ngOnDestroy() {
    clearInterval(this.control);
  }

  start() {
    this.control = setInterval(() => {
      this.cronometro();
    }, 10);
    this.isRunning = true; // Actualizamos el estado a corriendo
  }

  stop() {
    clearInterval(this.control);
    this.isRunning = false; // Actualizamos el estado a detenido
    console.log('Fecha y hora actual: '+this.obtenerFechaYHora())
  }

  startStop() {
    if (this.isRunning) {
      this.stop(); // Si está corriendo, detener
    } else {
      this.start(); // Si está detenido, iniciar
    }
    console.log('Fecha y hora actual: '+this.obtenerFechaYHora())
  }

  cronometro() {
    this.centesimas++;
    if (this.centesimas === 100) {
      this.centesimas = 0;
      this.segundos++;
    }
    if (this.segundos === 60) {
      this.segundos = 0;
      this.minutos++;
    }
    if (this.minutos === 60) {
      this.minutos = 0;
      this.horas++;
    }
  }
 
  obtenerFechaYHora(): string {
    const fechaHoraActual = new Date();
    const fechaFormateada = `${fechaHoraActual.getFullYear()}-${fechaHoraActual.getMonth() + 1}-${fechaHoraActual.getDate()}`;
    const horaFormateada = `${fechaHoraActual.getHours()}:${fechaHoraActual.getMinutes()}:${fechaHoraActual.getSeconds()}`;
    const tiempoFormateado = `${this.formatTime(this.horas)}:${this.formatTime(this.minutos)}:${this.formatTime(this.segundos)}:${this.formatTime(this.centesimas)}`;
    return fechaFormateada + ' ' + horaFormateada + ' ' + tiempoFormateado;
  }

  formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  atras(){
    
    this.router.navigate(['/Estacion-Trabajo']);
  }
  ListProducto:any=[];
  listarProductoEstacionPorGrupo(){
    this.spinner.show();
    this._service.ListarProductoXEstacionGrupo(this.DataFabricacion.numCotizacion,
      this.DataFabricacion.datosMaquina.nombre
    ).subscribe(
      (data: any) => {
        if (data && data.status === 200) { 
          this.ListProducto = data.json;
          this.spinner.hide(); 
          //this.groupData();            
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
  
  ListAvance:any=[];
  inicioestacionFecha:string="PENDIENTE";
  finestacionFecha:string="PENDIENTE";
  inicioestacionUsuario:string="";
  finestacionUsuario:string="";
  fechaTermino:string="PENDIENTE";
  guardarHabilitado: boolean = true; //ACTIVO POR DEFECTO
  nombreBoton:string="Enviar al siguiente Estación";
  validacionPrimeraEstacion=false;
  validacionPrimeraEstacionpasada=false;
  ListarAvanceEstacionProducto(){
    this.spinner.show();
    this._service.ListarAvanceEstacion(this.DataFabricacion.numCotizacion
    ).subscribe(
      (data: any) => {
        console.log(":::::::::::::..NNN:::::::::::::::::::");
        console.log(data);
        if (data && data.status === 200) { 
          this.ListAvance = data.json; 
          if (this.ListAvance && this.ListAvance.length > 0) { 
            this.spinner.hide(); 
            var terminado=0;
            //this.groupData();      
            var counter=0;
            var counterEstacion1=0;
            this.ListAvance.forEach(element => {
              counter++;
              switch(element.codigoEstacion){
                case "100001":
                this.inicioestacionFecha=this.formatearFecha(element.fechaCreacion) +" - "+element.usuario;
                this.inicioestacionUsuario=element.usuario;
                this.showStepNumber2= true;
                this.nombreBoton="Finalizar";
                counterEstacion1++;
                terminado++;
                break;
                case "100002": 
                this.guardarHabilitado= false;
                  this.finestacionFecha=this.formatearFecha(element.fechaCreacion)+" - "+element.usuario;
                  this.showStepNumber2= false;
                  this.showStepNumber3 = true; 
                  this.finestacionUsuario=element.usuario+" - "+element.usuario;
                  this.fechaTermino="TERMINADO";
                  this.nombreBoton="Finalizado";
                  terminado++;
                  this.stop();
                break;
  
              }
              
            });
            if(counter==0){
              console.log("entro 0"); 
              this.showStepNumber1= true;
                //desbloquea              
                this.guardarHabilitado= true;
                this.stop();
            }
            if(counterEstacion1!=0 && this.DataFabricacion.datosMaquina.codigoEstacion=="100001"){
              this.stop();
              this.guardarHabilitado = false; // NO PUEDE VOLVER A PASAR  POR LA ESTACION 1
              this.validacionPrimeraEstacionpasada=true;
            }
            if(terminado>=2){ //YA PASO POR AMBOS ESTACIONES
              this.validacionPrimeraEstacion=false;
              this.validacionPrimeraEstacionpasada=false;
            }
          }else{
            console.log("entro no existe");
            this.guardarHabilitado= true;
            console.log("NO EXISTE RESULTS 2:==>");
            console.log(this.ListAvance);
            if(this.DataFabricacion.datosMaquina.codigoEstacion=="100002"){
              this.stop();
              this.guardarHabilitado = false; // NO PUEDE INICIAR POR LA ESTACION 2
              this.validacionPrimeraEstacion=true;
            }
          }          
        } else {
          this.spinner.hide(); 
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error al obtener datos:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    );
  }
 
  formatearFecha(fecha: any): string {
    const fechaOriginal = new Date(fecha);
    const dia = fechaOriginal.getDate();
    const mes = fechaOriginal.getMonth() + 1; // Se suma 1 porque los meses van de 0 a 11
    const año = fechaOriginal.getFullYear();
    const horas = fechaOriginal.getHours();
    const minutos = fechaOriginal.getMinutes();
  
    // Agregar un cero inicial si el número es menor que 10
    const diaStr = dia < 10 ? '0' + dia : dia;
    const mesStr = mes < 10 ? '0' + mes : mes;
    const horasStr = horas < 10 ? '0' + horas : horas;
    const minutosStr = minutos < 10 ? '0' + minutos : minutos;
  
    return `${diaStr}-${mesStr}-${año} ${horasStr}:${minutosStr}`;
  }
  GuardarProduccion() {
    const userDataString = localStorage.getItem('UserLog'); 
    var idusuario=0;
    if (userDataString) {   
      idusuario=JSON.parse(userDataString).id;
    } else { 
      this.router.navigate(['/']);
    }

    this.stop();
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de guardar Producción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
    var reque= {
      "idEstacion": this.DataFabricacion.datosMaquina.id,
      "numeroCotizacion": this.DataFabricacion.datosCotizacion.codigoSisgeco,
      "cotizacionGrupo": this.DataFabricacion.datosCotizacion.cotizacionGrupo,
      "codigoUsuario": this.DataFabricacion.datosUsuario.codigoUsuario,
      "fechaInicio": this.DataFabricacion.datosMaquina.id,
      "fechaFin": this.DataFabricacion.datosMaquina.id,
      "idUsuarioCreacion": idusuario,
    }
    const jsonData = JSON.stringify(reque); 
    this.spinner.show();
    this._service.InsertarEstacionProducto(jsonData)
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
              }).then((result) => {
                  if (result.isConfirmed) {
                      // Aquí puedes llamar a tu método
                      this.atras();
                  }
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
        
    this.start();
      }
    });


    // Aquí puedes hacer lo que necesites con el JSON, como enviarlo a un servicio o mostrarlo en la consola.
  }
  @ViewChild('stepper') stepper: MatStepper;

  goToStep(index: number) {
    this.stepper.selectedIndex = index;
  }

  nextStep() {
    this.stepper.next();
  }

  previousStep() {
    this.stepper.previous();
  }
/*
<button mat-button (click)="goToStep(0)">Go to Step 1</button>
<button mat-button (click)="goToStep(1)">Go to Step 2</button>
  */
}
