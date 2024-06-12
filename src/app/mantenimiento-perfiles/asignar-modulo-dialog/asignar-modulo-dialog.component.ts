import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { PerfilGrupoService } from 'src/app/services/perfilservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-modulo-dialog',
  templateUrl: './asignar-modulo-dialog.component.html',
  styleUrls: ['./asignar-modulo-dialog.component.css']
})
export class AsignarModuloDialogComponent implements OnInit {

  IdRol=0;
  Nombre="";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toaster: Toaster,
    private dialogRef: MatDialogRef<AsignarModuloDialogComponent>,
    private spinner: NgxSpinnerService, 
    private _service: PerfilGrupoService,   ) {
      this.IdRol = data.idrol;
      this.Nombre=data.Modulo;
      console.log("DATA RECIBIDO:");
      console.log(data);
      this.ObtenerModulosPorRol();
     }

  ngOnInit(): void {
  }
  
       
  close() {
    this.dialogRef.close();
  }

  dataSource: any[] = [];
  displayedColumns: string[] = ['IdModulo', 'Modulo', 'Asignado', 'FechaAsignado'];  
  ListModuloPerfil:any=[];
  ObtenerModulosPorRol() { 
    this.spinner.show();
    this._service.ListarModulosPorRol(this.IdRol)
      .subscribe(
        data => {          
          this.spinner.hide();
          if(data.status==200){ 
            this.ListModuloPerfil=data.json; 
            this.dataSource = this.ListModuloPerfil;
          }
        },
        error => {
          this.spinner.hide();
          console.error('Error al obtener el detalle del grupo:', error);
        }
      );
  }  
  save(): void {
    const jsonData = JSON.stringify(this.dataSource);
    console.log(jsonData);
    this.spinner.show();
    this._service.AgregarModuloRol(this.IdRol,jsonData)
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
                var requests={
                agegados:"OK"
                };
                this.dialogRef.close(requests);
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
  isAssigned(value: number): boolean {
    return value === 1;
  }
  toggleAssigned(element: any): void {
    element.asignado = element.asignado === 1 ? 0 : 1;
  }
}
