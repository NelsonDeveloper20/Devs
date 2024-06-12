import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { IApiResponse } from 'src/app/services/service.model';
interface Proyecto {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-proyecto-dialog',
  templateUrl: './proyecto-dialog.component.html',
  styleUrls: ['./proyecto-dialog.component.css']
})
export class ProyectoDialogComponent implements OnInit {
 
  nombreProyecto: string = ''; // Variable para almacenar el nombre del nuevo proyecto
  proyectoEditandoId: number = null; // ID del proyecto que se está editando actualmente
  proyectoEditado: string = ''; // Nombre editado del proyecto

  proyectos: MatTableDataSource<Proyecto>; // Fuente de datos para la tabla
  columnas: string[] = ['id', 'nombre', 'accion']; // Columnas de la tabla

  constructor(
    private toaster: Toaster,   
    private spinner: NgxSpinnerService,    
    private _proyectoService: ProyectoService,
    private dialogRef: MatDialogRef<ProyectoDialogComponent>) { 
  }

  ListarProyecto(){
    this.spinner.show();
    this._proyectoService
      .ListarProyecto()
      .subscribe(
        (response) => { 
    this.proyectos = new MatTableDataSource(response);
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
   }
  // Función para agregar un nuevo proyecto
  guardarProyecto() {
    // Simulación de la creación de un nuevo proyecto
   /* const nuevoId = this.proyectos.data.length + 1;
    const nuevoProyecto: Proyecto = { id: nuevoId, nombre: this.nombreProyecto };

    this.proyectos.data.push(nuevoProyecto);
    this.proyectos._updateChangeSubscription(); // Actualizar la tabla
    this.nombreProyecto = ''; // Limpiar el campo de entrada
    */
   if(this.nombreProyecto=="" || this.nombreProyecto==undefined || this.nombreProyecto==null || this.nombreProyecto==''){
    
    this.toaster.open({
      text: "Ingrese nombre del proyecto",
      caption: 'Mensaje',
      type: 'warning',
      position: 'bottom-right',
      //duration: 4000
    });
    return;
   }

  this.spinner.show();
  this._proyectoService.GuardarProyecto(this.nombreProyecto)
    .subscribe({
      next: data => {
        if (data.status == 200) {
          
    this.agregados++;
          let artcl: IApiResponse = JSON.parse(JSON.stringify(data));
          this.nombreProyecto="";
     this.ListarProyecto();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toaster.open({
            text: "Ocurrio un error,",
            caption: 'Mensaje',
            type: 'warning',
            position: 'bottom-right',
            //duration: 4000
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
  onInputChange(event: any) {
    this.proyectoEditado = event.target.value;
  }
  // Función para editar un proyecto
  editarProyecto(id: number) {
    // Establecer el ID del proyecto que se está editando y el nombre editado
    const proyectoEditando = this.proyectos.data.find(proyecto => proyecto.id === id);
    this.proyectoEditandoId = id;
    this.proyectoEditado = proyectoEditando.nombre;
  }

  // Función para guardar los cambios realizados en un proyecto
  guardarCambiosProyecto(id: number) { 
    // Actualizar el nombre del proyecto editado
    const proyectoEditado = this.proyectos.data.find(proyecto => proyecto.id === id);
    /*
    proyectoEditado.nombre = this.proyectoEditado;
    this.proyectos._updateChangeSubscription(); // Actualizar la tabla
    this.proyectoEditandoId = null; // Finalizar la edición
    this.proyectoEditado = ''; // Limpiar el nombre editado
    */
  this.spinner.show();
  this._proyectoService.ModificarProyecto(id,this.proyectoEditado)
    .subscribe({
      next: data => {
        if (data.status == 200) {
          
    this.agregados++;
          let artcl: IApiResponse = JSON.parse(JSON.stringify(data));          
    this.proyectos._updateChangeSubscription(); // Actualizar la tabla
    this.proyectoEditandoId = null; // Finalizar la edición
    this.proyectoEditado = ''; // Limpiar el nombre editado
     this.ListarProyecto();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toaster.open({
            text: "Ocurrio un error,",
            caption: 'Mensaje',
            type: 'warning',
            position: 'bottom-right',
            //duration: 4000
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

  // Función para cancelar la edición de un proyecto
  cancelarEdicion() {
    this.proyectoEditandoId = null;
    this.proyectoEditado = '';
  }
 agregados=0;
  ngOnInit(): void {
    this.ListarProyecto();
  }

  closeDialog(): void {
    this.dialogRef.close();
    } 
    save(): void { 
    }
       
    close() { 
      if(this.agregados!=0){
        var requests={
          agegados:"total: "+this.agregados
        }
        this.dialogRef.close(requests);
      }else{
        this.dialogRef.close();
      }
    }
  }
