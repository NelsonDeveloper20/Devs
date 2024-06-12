import { Component, OnInit, ViewChild } from '@angular/core';
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
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  treeFormGroup = this._formBuilder.group({
    treeCtrl: ['', Validators.required],
  });
  isEditable = true;
 
constructor(private _formBuilder: FormBuilder,
  private dialogRef: MatDialogRef<ScanestacionDialogComponent>,
  private _service: OperacionesConstruccionService,
  private spinner: NgxSpinnerService, 
  private toaster: Toaster,) {}
  
  ngOnInit(): void { 
  } 
  closeDialog(): void {
  this.dialogRef.close();
  } 

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
   
  @ViewChild('stepper') stepper: MatStepper;
  async validarYAvanzar() {
    const currentIndex = this.stepper.selectedIndex;
    let isValid = false;
  
    switch (currentIndex) {
      case 0:
        const valorFirstCtrl = this.firstFormGroup.get('firstCtrl').value;
        try {
          this.spinner.show();
          const data = await this._service.ValidarEstacion("USUARIO", valorFirstCtrl).toPromise();
          console.log(data);
          if (data.status === 200) {
            const dataResponse=data.json;
            this.spinner.hide();
            if (dataResponse.existe == "NO") {
              this.toaster.open({
                text: "No existe usuario con el código ingresado",
                caption: 'Mensaje',
                type: 'danger',
              });
            } else {
              console.log(dataResponse);
              this.DataUsuario = dataResponse.data[0];
              isValid = true; // Indicar que la validación fue exitosa
            }
          } else {
            this.spinner.hide();
            this.toaster.open({
              text: "Error al obtener datos",
              caption: 'Ocurrió un error en el API',
              type: 'danger',
            });
          }
        } catch (error) {
          this.spinner.hide();
          console.error(error);
          this.toaster.open({
            text: "Error al obtener datos: " + error,
            caption: 'Ocurrió un error en el API',
            type: 'danger',
          });
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
            } else {
              console.log(dataResponse);
              this.DataEstacion = dataResponse.data[0];
              isValid = true; // Indicar que la validación fue exitosa
            }
          } else {
            this.spinner.hide();
            this.toaster.open({
              text: "Error al obtener datos",
              caption: 'Ocurrió un error en el API',
              type: 'danger',
            });
          }
        } catch (error) {
          this.spinner.hide();
          console.error(error);
          this.toaster.open({
            text: "Error al obtener datos: " + error,
            caption: 'Ocurrió un error en el API',
            type: 'danger',
          });
        }
        break;
      // Agrega más casos para cada paso del stepper si es necesario
    }
  
    if (isValid) {
      this.stepper.next();
    }
  }
 
  close() {
    this.dialogRef.close();
  }
 
  }
