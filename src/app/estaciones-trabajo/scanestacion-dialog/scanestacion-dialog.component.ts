import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { OperacionesConstruccionService } from 'src/app/services/operacionesconstruccion.service';

@Component({
  selector: 'app-scanestacion-dialog',
  templateUrl: './scanestacion-dialog.component.html',
  styleUrls: ['./scanestacion-dialog.component.css']
})
export class ScanestacionDialogComponent  implements OnInit { 
  @ViewChild('firstCtrlInput', { static: false }) firstCtrlInput: ElementRef;
  @ViewChild('secondCtrlInput', { static: false }) secondCtrlInput: ElementRef;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  treeFormGroup = this._formBuilder.group({
    treeCtrl: ['', Validators.required],
  }); 
constructor(private _formBuilder: FormBuilder,
  private dialogRef: MatDialogRef<ScanestacionDialogComponent>,
  private _service: OperacionesConstruccionService,
  private spinner: NgxSpinnerService, 
  private toaster: Toaster,) {
 
  }
  ngAfterViewInit(): void {
    // Activar el foco en el input firstCtrl después de que la vista se haya inicializado completamente
    setTimeout(() => {
      if (this.firstCtrlInput && this.firstCtrlInput.nativeElement) {
        this.firstCtrlInput.nativeElement.focus();
      }
    }, 500); // Aumentar el tiempo de espera si es necesario
  }

  ngOnInit(): void {  
  } 
  closeDialog(): void {
  this.dialogRef.close();
  } 

  
   
  @ViewChild('stepper') stepper: MatStepper;
  async validarYAvanzar() {
    const currentIndex = this.stepper.selectedIndex;
    let isValid = false;
  
    switch (currentIndex) {
      case 0: 
        const valorFirstCtrl = this.firstFormGroup.get('firstCtrl').value;
        try {
          const valorSecondCtrl = this.secondFormGroup.get('secondCtrl').value;
          const valorTreeCtrl = this.treeFormGroup.get('treeCtrl').value;
          console.log('Valor de firstCtrl:', valorFirstCtrl);
          console.log('Valor de secondCtrl:', valorSecondCtrl);
          console.log('Valor de treeCtrl:', valorTreeCtrl);
          const data = await  this._service.ValidarEstacion("COTIZACION",valorFirstCtrl).toPromise();            
              this.spinner.hide();  
              if (data.status === 200) {           
                const dataResponse=data.json;
                if(dataResponse.existe=="NO"){    
                  this.toaster.open({
                    text: "No existe cotizacion con el codigo ingresado",
                    caption: 'Mensaje',
                    type: 'danger',
                  });    
                  this.firstFormGroup.get('firstCtrl').setValue('');
                  if (this.firstCtrlInput && this.firstCtrlInput.nativeElement) {
                    this.firstCtrlInput.nativeElement.focus();
                  }
                }else{
                  console.log(dataResponse);
                  this.DataCotizacion=dataResponse.data[0];
                  var json={
                    numTrabajador:valorFirstCtrl,
                    numEstacion:valorSecondCtrl,
                    numCotizacion:valorTreeCtrl,
                    datosUsuario:this.DataUsuario,
                    datosMaquina:this.DataEstacion,
                    datosCotizacion:this.DataCotizacion
      
                  };
                  console.log("--->: "+isValid);
                  
              isValid = true; // Indicar que la validación fue exitosa
              console.log("--->2: "+isValid);
                }          
              }else{          
                this.toaster.open({
                  text: "Consulta de api",
                  caption: 'Ocurrio un error en el API SAP',
                  type: 'danger',
                });
                this.firstFormGroup.get('firstCtrl').setValue('');
                if (this.firstCtrlInput && this.firstCtrlInput.nativeElement) {
                  this.firstCtrlInput.nativeElement.focus();
                }
              }    
        } catch (error) {
          this.spinner.hide();
          console.error(error);
          this.toaster.open({
            text: "Error al obtener datos: " + error,
            caption: 'Ocurrió un error en el API',
            type: 'danger',
          });
          this.firstFormGroup.get('firstCtrl').setValue('');
          if (this.firstCtrlInput && this.firstCtrlInput.nativeElement) {
            this.firstCtrlInput.nativeElement.focus();
          }
        }
        break;
      case 1:
        const valorSecondCtrl = this.secondFormGroup.get('secondCtrl').value;
        try {
          this.spinner.show();
          const data = await this._service.ValidarEstacion("MAQUINA", valorSecondCtrl).toPromise();
          console.log(data);
          if (data.status === 200) {
            const dataResponse=data.json;
            this.spinner.hide();
            if (dataResponse.existe == "NO") {
              this.toaster.open({
                text: "No existe estación con el código ingresado",
                caption: 'Mensaje',
                type: 'danger',
              });  
              this.firstFormGroup.get('secondCtrl').setValue('');                    
              if (this.secondCtrlInput && this.secondCtrlInput.nativeElement) {
                this.secondCtrlInput.nativeElement.focus();
              }
            } else {
              console.log(dataResponse);
              this.DataEstacion = dataResponse.data[0];                    
              if (this.secondCtrlInput && this.secondCtrlInput.nativeElement) {
                this.secondCtrlInput.nativeElement.focus();
              }
                  
          this.toaster.open({
            text: "LISTO",
            caption: 'OKEY',
            type: 'success',
          });
            }
          } else {
            this.spinner.hide();
            this.toaster.open({
              text: "Error al obtener datos",
              caption: 'Ocurrió un error en el API',
              type: 'danger',
            });                
            this.firstFormGroup.get('secondCtrl').setValue('');    
            if (this.secondCtrlInput && this.secondCtrlInput.nativeElement) {
              this.secondCtrlInput.nativeElement.focus();
            }
          }
        } catch (error) {
          this.spinner.hide();
          console.error(error);
          this.toaster.open({
            text: "Error al obtener datos: " + error,
            caption: 'Ocurrió un error en el API',
            type: 'danger',
          });               
          this.firstFormGroup.get('secondCtrl').setValue('');     
          if (this.secondCtrlInput && this.secondCtrlInput.nativeElement) {
            this.secondCtrlInput.nativeElement.focus();
          }
        }
        break;
      // Agrega más casos para cada paso del stepper si es necesario
    }
  
    if (isValid) { 
      this.stepper.next();
      setTimeout(() => {
        if (this.secondCtrlInput && this.secondCtrlInput.nativeElement) {
          this.secondCtrlInput.nativeElement.focus();
        }
      }, 500); // Ajusta el tiempo de espera según sea necesario
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

  DataUsuario:any={};
  DataEstacion:any={};
  DataCotizacion:any={};
  save(): void {     
    const valorFirstCtrl = this.firstFormGroup.get('firstCtrl').value;
    const valorSecondCtrl = this.secondFormGroup.get('secondCtrl').value;
    const valorTreeCtrl = this.treeFormGroup.get('treeCtrl').value;
    console.log('Valor de firstCtrl:', valorFirstCtrl);
    console.log('Valor de secondCtrl:', valorSecondCtrl);
    console.log('Valor de treeCtrl:', valorTreeCtrl);
    this._service.ValidarEstacion("COTIZACION",valorTreeCtrl).subscribe(
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
              datosUsuario:this.DataUsuario,
              datosMaquina:this.DataEstacion,
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
