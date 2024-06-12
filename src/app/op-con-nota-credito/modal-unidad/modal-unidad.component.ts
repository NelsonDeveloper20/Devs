 
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-unidad',
  templateUrl: './modal-unidad.component.html',
  styleUrls: ['./modal-unidad.component.css']
})
export class ModalUnidadComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalUnidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  selectRow(row: any) {
    this.dialogRef.close(row);
  }  

}
