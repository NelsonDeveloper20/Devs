import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
 
@Component({
    selector: 'dialog-data',
    templateUrl: 'dialog_user.html',
  })
  export class Dialog_userComponent {
    constructor( 
    private dialogRef: MatDialogRef<Dialog_userComponent>,) {}


    close() {
      this.dialogRef.close();
    }
  }