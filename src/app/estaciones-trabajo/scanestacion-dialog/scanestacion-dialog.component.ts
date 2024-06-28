import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { OperacionesConstruccionService } from 'src/app/services/operacionesconstruccion.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-scanestacion-dialog',
  templateUrl: './scanestacion-dialog.component.html',
  styleUrls: ['./scanestacion-dialog.component.css'] ,
  providers: [DatePipe]
})
export class ScanestacionDialogComponent  implements OnInit { 
  @ViewChild('firstCtrlInput', { static: false }) firstCtrlInput: ElementRef;
  @ViewChild('secondCtrlInput', { static: false }) secondCtrlInput: ElementRef;
  @ViewChild('treeCtrlInput', { static: false }) treeCtrlInput: ElementRef;
  @ViewChild('stepper') stepper: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  treeFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ScanestacionDialogComponent>,
    private _service: OperacionesConstruccionService,
    private spinner: NgxSpinnerService,
    private toaster: Toaster,private datePipe: DatePipe
  ) {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.treeFormGroup = this._formBuilder.group({
      treeCtrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.firstCtrlInput && this.firstCtrlInput.nativeElement) {
        this.firstCtrlInput.nativeElement.focus();
      }
    }, 500);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
 
  DataCotizacion: any = {}; 

  grupoScan="";
  async validarYAvanzar() {
    const currentIndex = this.stepper.selectedIndex;
    let isValid = false;
    const userDataString = localStorage.getItem('UserLog');
    const idusuario = JSON.parse(userDataString).id;
    const valorGrupo = this.firstFormGroup.get('firstCtrl').value;
    const valorEstacion1 = this.secondFormGroup.get('secondCtrl').value;
    const valorEstacion2 = this.treeFormGroup.get('treeCtrl').value;

    switch (currentIndex) {
      case 0:
        isValid = await this.validarGrupo(valorGrupo, idusuario);
        this.grupoScan="  -  Grupo Escaneado:" +valorGrupo;
        break;
      case 1:
        isValid = await this.validarEstacion1(valorEstacion1, valorGrupo, idusuario);      
        break;
      case 2:
        isValid = await this.validarEstacion2(valorEstacion2, valorGrupo, idusuario);
        if (isValid) {
          this.toaster.open({
            text: 'Construcción terminada',
            caption: 'Mensaje',
            type: 'success',
          });
          this.finalizado=true;
        }
        break;
    }
    if (isValid) {
      console.log(currentIndex +"  -  "+this.DataCotizacion.length); 
      if (currentIndex === 0 && this.DataCotizacion && this.DataCotizacion.length === 1) { 
        this.estacionesEstado=true;
        console.log("Avanzando automáticamente al paso 2");
        this.stepper.next(); // Avanza al paso 1
        // Asigna un valor predeterminado a secondCtrl
        this.secondFormGroup.get('secondCtrl').patchValue("100001");
        // Avanza automáticamente al paso 1 y luego al paso 2 después de un tiempo
        setTimeout(() => {
          console.log("Avanzando al paso 2 automáticamente");
          this.stepper.next(); // Avanza al paso 2 
          setTimeout(() => {
            this.focusNextInput(currentIndex+ 2); // Foco en el paso 3 (índice 2 en base 0)
          }, 500);
        }, 900); // Ajusta el tiempo según sea necesario
      } else {
        console.log("NO ENTRA");
        this.stepper.next();
        setTimeout(() => {
          this.focusNextInput(currentIndex); // Foco en el siguiente paso
        }, 500); // Ajusta el tiempo según sea necesario
      }
    }
  }

  estacionesEstado = false;
  finalizado=false;
  activarEstacion(estaciones: any) {
    console.log("-------GRUPO------");
    console.log(estaciones);
    if (estaciones) {
      console.log("INGRESA VALIDACION 1");
      if (estaciones.length === 1) {
        console.log("INGRESA SUB VALIDACION 1");
        this.estacionesEstado = true;
        this.inicioestacionFecha=this.transformDate(estaciones[0].fechaCreacion);
      }else if(estaciones.length>1){
        console.log("INGRESA SUB VALIDACION 2");
        this.estacionesEstado=true;
        this.inicioestacionFecha=this.transformDate(estaciones[0].fechaCreacion);
        this.finestacionFecha=this.transformDate(estaciones[1].fechaCreacion);
        this.finalizado=true;
      } 
    }
  }
  
  activarEstacion1(estaciones: any) {
    console.log("-------------");
    console.log(estaciones);
    if (estaciones) {
      console.log("INGRESA VALIDACION 1");
      if (estaciones.length === 1) {
        console.log("INGRESA SUB VALIDACION 1");
        this.estacionesEstado = true;
        this.inicioestacionFecha=this.transformDate(estaciones[0].fechaCreacion);
      }else if(estaciones.length>1){
        console.log("INGRESA SUB VALIDACION 2");
        this.estacionesEstado=true;
        this.inicioestacionFecha=this.transformDate(estaciones[0].fechaCreacion);
        this.finestacionFecha=this.transformDate(estaciones[1].fechaCreacion);
        this.finalizado=true;
      }else{
        console.log("INGRESA SUB VALIDACION 3");
        this.estacionesEstado = true;
        this.inicioestacionFecha=this.transformDate(estaciones.fechaCreacion); 
      }
    }
  }
  
  activarEstacion2(estaciones: any) {
    console.log("-------------");
    console.log(estaciones);
    if (estaciones) {
      console.log("INGRESA VALIDACION 1");
      if (estaciones.length === 1) {
        console.log("INGRESA SUB VALIDACION 1");
        this.estacionesEstado = true;
        this.inicioestacionFecha=this.transformDate(estaciones[0].fechaCreacion);
      }else if(estaciones.length>1){
        console.log("INGRESA SUB VALIDACION 2");
        this.estacionesEstado=true;
        this.inicioestacionFecha=this.transformDate(estaciones[0].fechaCreacion);
        this.finestacionFecha=this.transformDate(estaciones[1].fechaCreacion);
        this.finalizado=true;
      }else{
        console.log("INGRESA SUB VALIDACION 3");
        this.estacionesEstado = true;
        this.finestacionFecha=this.transformDate(estaciones.fechaCreacion); 
      }
    }
  }
  transformDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd hh:mm a');
  }
  private async validarGrupo(grupo: string, idusuario: string): Promise<boolean> {
    try {
      this.spinner.show();
      const data = await this._service.ValidarEstacion('COTIZACION', 'codigoEstacion', idusuario, grupo).toPromise();
      this.spinner.hide();
      if (data.status === 200) {
        console.log(data);
        const dataResponse = data.json;
        if (dataResponse.existe === 'NO') {
          if(dataResponse.mensaje=='El grupo no existe.'){
            this.mostrarMensajeError('No existe cotización con el código ingresado');
          }else{
            this.mostrarMensajeError(dataResponse.mensaje);
          }
          this.resetControl(this.firstFormGroup, 'firstCtrl', this.firstCtrlInput);
          return false;
        } else {
          this.DataCotizacion = dataResponse.estacionProduccion;
          console.log(this.DataCotizacion);
          this.activarEstacion(this.DataCotizacion);
          return true;
        }
      } else {
        this.mostrarMensajeError('Ocurrió un error en el API SAP');
        this.resetControl(this.firstFormGroup, 'firstCtrl', this.firstCtrlInput);
        return false;
      }
    } catch (error) {
      this.spinner.hide();
      console.error(error);
      this.mostrarMensajeError('Error al obtener datos: ' + error);
      this.resetControl(this.firstFormGroup, 'firstCtrl', this.firstCtrlInput);
      return false;
    }
  }

  private async validarEstacion1(estacion: string, grupo: string, idusuario: string): Promise<boolean> {
    if (estacion === '100002') {
      this.mostrarMensajeError('Ingrese código de la estación 1');
      this.resetControl(this.secondFormGroup, 'secondCtrl', this.secondCtrlInput);
      return false;
    }
    try {
      this.spinner.show();
      const data = await this._service.ValidarEstacion('MAQUINA', estacion, idusuario, grupo).toPromise();
      this.spinner.hide();
      if (data.status === 200) {
        const dataResponse = data.json;
        if (dataResponse.existe === 'NO') {
          this.mostrarMensajeError('No existe estación con el código ingresado');
          this.resetControl(this.secondFormGroup, 'secondCtrl', this.secondCtrlInput);
          return false;
        } else { 
          this.DataCotizacion = dataResponse.estacionProduccion;
          console.log("ESTACION 1 REGISTRADO :");
          console.log(data);
          console.log(this.DataCotizacion);
          this.activarEstacion1(this.DataCotizacion);
          return true;
        }
      } else {
        this.mostrarMensajeError('Ocurrió un error en el API');
        this.resetControl(this.secondFormGroup, 'secondCtrl', this.secondCtrlInput);
        return false;
      }
    } catch (error) {
      this.spinner.hide();
      console.error(error);
      this.mostrarMensajeError('Error al obtener datos: ' + error);
      this.resetControl(this.secondFormGroup, 'secondCtrl', this.secondCtrlInput);
      return false;
    }
  }

  private async validarEstacion2(estacion: string, grupo: string, idusuario: string): Promise<boolean> {
    if (estacion === '100001') {
      this.mostrarMensajeError('Ingrese código de la estación 2');
      this.resetControl(this.treeFormGroup, 'treeCtrl', this.treeCtrlInput);
      return false;
    }
    try {
      this.spinner.show();
      const data = await this._service.ValidarEstacion('MAQUINA', estacion, idusuario, grupo).toPromise();
      this.spinner.hide();
      if (data.status === 200) {
        const dataResponse = data.json;
        if (dataResponse.existe === 'NO') {
          this.mostrarMensajeError('No existe estación con el código ingresado');
          this.resetControl(this.treeFormGroup, 'treeCtrl', this.treeCtrlInput);
          return false;
        } else {  
          
          this.DataCotizacion = dataResponse.estacionProduccion;
          console.log("ESTACION 2 REGISTRADO :");
          console.log(data);
          console.log(this.DataCotizacion);
          this.activarEstacion2(this.DataCotizacion);


          return true;
        }
      } else {
        this.mostrarMensajeError('Ocurrió un error en el API');
        this.resetControl(this.treeFormGroup, 'treeCtrl', this.treeCtrlInput);
        return false;
      }
    } catch (error) {
      this.spinner.hide();
      console.error(error);
      this.mostrarMensajeError('Error al obtener datos: ' + error);
      this.resetControl(this.treeFormGroup, 'treeCtrl', this.treeCtrlInput);
      return false;
    }
  }

  private mostrarMensajeError(mensaje: string) {
    this.toaster.open({
      text: mensaje,
      caption: 'Mensaje',
      type: 'danger',
    });
  }

  private resetControl(formGroup: FormGroup, controlName: string, elementRef: ElementRef) {
    formGroup.get(controlName).reset();
    setTimeout(() => {
      if (elementRef && elementRef.nativeElement) {
        elementRef.nativeElement.focus();
      }
    }, 500);
  }

  private focusNextInput(currentIndex: number) {
    console.log("INDICE");
    console.log(currentIndex);
    switch (currentIndex) {
      case 1:
        if (this.secondCtrlInput && this.secondCtrlInput.nativeElement) {
          this.secondCtrlInput.nativeElement.focus();
        }
        break;
      case 2:
        if (this.treeCtrlInput && this.treeCtrlInput.nativeElement) {
          this.treeCtrlInput.nativeElement.focus();
        }
        break;
    }
  }

 
  close() {
    this.dialogRef.close();
  }
 
  

  DataFabricacion:any={};
  
  showStepNumber1: boolean = false;
  showStepNumber2: boolean = false;
  showStepNumber3: boolean = false;
  
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

  save(): void {     
    const valorFirstCtrl = this.firstFormGroup.get('firstCtrl').value;
    const valorSecondCtrl = this.secondFormGroup.get('secondCtrl').value;
    const valorTreeCtrl = this.treeFormGroup.get('treeCtrl').value;
    console.log('Valor de firstCtrl:', valorFirstCtrl);
    console.log('Valor de secondCtrl:', valorSecondCtrl);
    console.log('Valor de treeCtrl:', valorTreeCtrl);
    this._service.ValidarEstacion("COTIZACION",valorTreeCtrl,1,"").subscribe(
      (data: any) => {
        this.spinner.hide();  
        if (data.status === 200) {           
          const dataResponse=data.json;
          if(dataResponse.existe=="NO"){    
            this.toaster.open({
              text: "No existe cotizacion con el codigo ingresado",
              caption: 'Mensaje',
              type: 'danger',
            });   
          }else{
            console.log(dataResponse);
            this.DataCotizacion=dataResponse.data[0];
            var json={
              numTrabajador:valorFirstCtrl,
              numEstacion:valorSecondCtrl,
              numCotizacion:valorTreeCtrl, 
              datosCotizacion:this.DataCotizacion

            }
            
            this.dialogRef.close(json);
          }          
        }else{          
          this.toaster.open({
            text: "Consulta de api",
            caption: 'Ocurrio un error en el API SAP',
            type: 'danger',
          });
        }  
      },
      (error: any) => {
        this.spinner.hide(); 
        console.error(error);       
        this.toaster.open({
          text: "Error al obtener datos: "+error,
          caption: 'Ocurrio un error en el API SAP',
          type: 'danger',
        });
      }
    ); 
  }
  }
