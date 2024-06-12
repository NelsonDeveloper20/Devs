import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../services/service.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComponentesService } from '../services/componentesservice';
import Swal from 'sweetalert2';
import { Toaster } from 'ngx-toast-notifications';

interface ListasModel {
  isSelected: boolean;
  id: number | null;
  nombre: string;
  codigo: string;
  descripcionComponente: string;
  color: string;
  unidad: string;
  subProducto: string;
  codigoProducto: string;
  isEdit: boolean;
}


@Component({
  selector: 'app-mantenimiento-componentes',
  templateUrl: './mantenimiento-componentes.component.html',
  styleUrls: ['./mantenimiento-componentes.component.css']
})
export class MantenimientoComponentesComponent implements OnInit {
  displayedColumns: string[] = [//'isSelected', 
  'id', 'nombre', 'codigo', 'descripcionComponente', 'color', 'unidad', 'subProducto', 'codigoProducto', 'acciones'];
  dataSource = new MatTableDataSource<ListasModel>([]); 

  constructor(
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private http: HttpClient, private toaster: Toaster, 
    private _service: ComponentesService,
  ) {
  }
  ngOnInit() {
    this.ObtenerComponentesSisgeco();
    this.listar();
  }
  
  listCombo:any=[]; 
  ObtenerComponentesSisgeco() { 
    this.spinner.show();
    this._service.ListarComponentesSsigeco()
      .subscribe(
        data => {          
          this.spinner.hide();
          if(data.status==200){ 
            this.listCombo=data.json; 
            this.filteredList=data.json;
          }
        },
        error => {
          this.spinner.hide();
          console.error('Error al obtener el detalle del grupo:', error);
        }
      );
  }  
  
  
  filteredList = this.listCombo; // Lista de opciones filtradas inicialmente igual a la lista completa

  applyFilter(filterValue: any) {
    var valor=filterValue.value;
    this.filteredList = this.listCombo.filter(option => option.des.toLowerCase().includes(valor.toLowerCase()));
  }
  onNombreChange(event: any, element: ListasModel) {
    const selectedOption = this.listCombo.find(option => option.des === event.value);
    if (selectedOption) {
      element.codigo = selectedOption.codigo;
      element.descripcionComponente=selectedOption.des;
      element.unidad=selectedOption.coduniad;
      element.nombre=selectedOption.des;
    }
  }
  /*onNombreChange(event: any, element: ListasModel) {
    console.log(event);
    if (event) {
      element.codigo = event.codigo;
      element.descripcionComponente = event.des;
      element.unidad = event.coduniad;
    }
  }*/

  addRowComponente() {
    const newRow: ListasModel = {
      isSelected: false,
      id: 0,
      nombre: '',
      codigo: '',
      descripcionComponente: '',
      color: '',
      unidad: '',
      subProducto: '',
      codigoProducto: '',
      isEdit: true,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  editRow(row: ListasModel) {
    row.isEdit = true;
  }

  cancelEdit(row: ListasModel) {
    if (row.id === 0) {
      this.deleteRow(row);
    } else {      
      row.isEdit = false;
    }
  }

  deleteRow(row: ListasModel) {
    this.dataSource.data = this.dataSource.data.filter(r => r !== row);
    // Aquí puedes realizar una llamada a la API para eliminar la fila si tiene un ID
  }
  
  listar() {
    this.spinner.show();
    this._service.ListarComponentes().subscribe(
      data => {
        this.spinner.hide();
        this.dataSource.data = data;
      },
      error => {
        this.spinner.hide();
        console.error('Error al obtener el detalle del grupo:', error);
      }
    );
  }

  EliminarPerfil(id:any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar este elemento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       
    this._service.EliminarComponente(id)
    .subscribe({
      next: response => {
        this.spinner.hide();
        if (response.status == 200) { 
const respuesta = response.json.respuesta;
const id = response.json.id; 
Swal.fire(
  'Eliminado',
  'El elemento ha sido eliminado correctamente',
  'success'
);
    this.listar();
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
    });

   }
   
  saveRow(row: ListasModel) {
    // Aquí puedes realizar una llamada a la API para guardar los cambios
    //row.isEdit = false;
    const jsonData = JSON.stringify(row);
    console.log(jsonData);
    this.spinner.show();
    this._service.GuardarCompoente(jsonData)
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
                }); 
                this.listar();
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

    // Aquí puedes hacer lo que necesites con el JSON, como enviarlo a un servicio o mostrarlo en la consola.
  }
}
/*

  getInputType(type: string): string {
    switch (type) {
      case 'ComboBox':
        return 'text'; // Cambia a 'text' si estás usando un ComboBox
      case 'text':
        return 'text';
      case 'textarea':
        return 'text'; // Cambia a 'textarea' si estás usando un textarea
      default:
        return 'text';
    }
  }
*/
