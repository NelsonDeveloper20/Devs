import {Component, Inject} from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
 
 
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