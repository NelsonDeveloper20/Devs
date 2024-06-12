import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-forms',
  templateUrl: './modal-forms.component.html',
  styleUrls: ['./modal-forms.component.css']
})
export class ModalFormsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalFormsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  selectRow(row: any) {
    this.dialogRef.close(row);
  }
}
