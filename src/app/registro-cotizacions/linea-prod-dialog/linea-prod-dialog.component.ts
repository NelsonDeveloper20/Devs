import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-linea-prod-dialog',
  templateUrl: './linea-prod-dialog.component.html',
  styleUrls: ['./linea-prod-dialog.component.css']
})
export class LineaProdDialogComponent implements OnInit {

  nombreDeVariable="ActualEnAdelante"
  constructor(
    private dialogRef: MatDialogRef<LineaProdDialogComponent>,) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }
}
