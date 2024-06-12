import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ScanestacionDialogComponent } from './scanestacion-dialog/scanestacion-dialog.component';
import { Toaster } from 'ngx-toast-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estaciones-trabajo',
  templateUrl: './estaciones-trabajo.component.html',
  styleUrls: ['./estaciones-trabajo.component.css']
})
export class EstacionesTrabajoComponent  implements OnInit { 
  constructor(
    private dialog: MatDialog,
    private toaster: Toaster,private router: Router, 
  
  ) { }

  ngOnInit(): void {
  }
  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    console.log('Archivo seleccionado:', selectedFile);
    // Puedes realizar más acciones con el archivo seleccionado aquí, como cargarlo a un servicio o procesarlo.
  } 
  atras(){
    
    this.router.navigate(['/Op-Construccion']);
    }
  openEstation(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ScanestacionDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: data => {   
       if (data) { 
       /* this.toaster.open({
          text: `Se registro al usuario ${data.correo}.`,
          caption: 'Mensaje',
          type: 'success',
          position:'bottom-right'
        });*/
        this.router.navigate(['/Fabricacion'],  { state: data } );
        //this.router.navigate(['/Fabricacion']);
//init

        //end
        
      } 
    },
    error: error => { 
        var errorMessage = error.message;
        console.error('There was an error!', error); 
        this.toaster.open({
          text: errorMessage,
          caption: 'Ocurrio un error',
          type: 'danger',
        });
      }
    });
  }
  
}
 