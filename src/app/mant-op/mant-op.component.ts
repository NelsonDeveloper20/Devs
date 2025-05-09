import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MantenimientoOPService } from '../services/mantenimiento-op.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-mant-op',
  templateUrl: './mant-op.component.html',
  styleUrls: ['./mant-op.component.css']
})
export class MantOpComponent implements OnInit {
  displayedColumns: string[] = ['cotizacion',   'rucCliente','cliente','vendedor','destrito', 'fechaCreacion','acciones'];
  dataSource=new MatTableDataSource<any>();//this.ELEMENT_DATA
  constructor(
    private toaster: Toaster, 
    private spinner: NgxSpinnerService,
    private _service: MantenimientoOPService
  ) { 
    
  }

  ngOnInit(): void {
    this.ListarOp();
  }

  ListOP:any=[];
  Fecha:Date=new Date();
  ListarOp() {
    const fecInicio = moment(this.Fecha, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    ); 
    
    this.spinner.show();
    this._service.ListarOP(fecInicio).subscribe(
      (data: any) => {
        if (data && data.status === 200) { 
          this.ListOP = data.json;
          this.spinner.hide(); 
          //this.groupData();           
      this.dataSource = new MatTableDataSource<any>(this.ListOP);
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
  
  EliminarOP(id:any) {
    Swal.fire({
      title: '¿Estás seguro que desea elminar?',
      text: 'Al realizar este proceso, se eliminaran todos los productos incluido los grupos relacionados con este número de cotización.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       this.spinner.show();
    this._service.EliminarOp(id)
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
    this.ListarOp();
    
  }else{
    this.toaster.open({
      text: response.json.respuesta,
      caption: "Mensaje",
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
          text: "Mensaje",
          caption: 'Ocurrio un error ' +error,
          type: 'danger',
          // duration: 994000
        });
      }
    });
      
      }
    });

   }
   
  applyFilterTable(filterValues: any) {
    var value=filterValues.target.value
    var filterValue = value.trim().toLowerCase(); // Eliminar espacios en blanco y convertir a minúsculas
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const accumulator = (currentTerm: string, key: string) => currentTerm + (data[key] ? data[key] : '');
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
    this.dataSource.filter = filterValue;
  }
}
