import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-detalle-salida-entrada-sap',
  templateUrl: './detalle-salida-entrada-sap.component.html',
  styleUrls: ['./detalle-salida-entrada-sap.component.css']
})
export class DetalleSalidaEntradaSapComponent implements OnInit {

  detallesSalida: any[] = [];
  detallesEntrada: any[] = [];
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private toaster: Toaster,
  private dialogRef: MatDialogRef<DetalleSalidaEntradaSapComponent>,
  private spinner: NgxSpinnerService,  
) {
  this.detallesSalida=data.detallesSalida;
  this.detallesEntrada=data.detallesEntrada;
   
  
} 

ngOnInit(): void {
}
close() {
  this.dialogRef.close();
}
}
