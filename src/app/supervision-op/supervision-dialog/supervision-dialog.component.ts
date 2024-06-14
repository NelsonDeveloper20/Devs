import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { DatePipe } from '@angular/common'; // Importa DatePipe


@Component({
  selector: 'app-supervision-dialog',
  templateUrl: './supervision-dialog.component.html',
  styleUrls: ['./supervision-dialog.component.css']
})
export class SupervisionDialogComponent implements OnInit {
  turno:string="";
  fechaProduccion:string="";
  cotizacion:string="";
  grupo:string="";
  formattedFechaProduccion: string = "";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialog: MatDialog,
    private dialogRef: MatDialogRef<SupervisionDialogComponent>,
    private spinner: NgxSpinnerService, 
    private datePipe: DatePipe // Inyecta DatePipe
    ) {
      this.turno = data.turno;   
      this.fechaProduccion= data.fechaProduccion;
      this.cotizacion=data.cotizacion;
      this.grupo=data.grupo; 
      this.fechaProduccion = this.formatDate(this.fechaProduccion); // Formatea la fecha
      console.log(this.fechaProduccion);


      
     }
     formatDate(fecha: string): string {
      return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }
  ngOnInit(): void {

  } 

  save(){
    var requests = {
      turno: this.turno,
      fechaProduccion: this.fechaProduccion, // Incluye la fecha formateada
      cotizacion: this.cotizacion,
      grupo: this.grupo
    }
    this.dialogRef.close(requests);
  }
  

  close() {  
      this.dialogRef.close(); 
  }
}
