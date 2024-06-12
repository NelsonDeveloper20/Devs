

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../services/service.model';
import { NgxSpinnerService } from 'ngx-spinner';
export interface ListasModel {
  isSelected: boolean;
  id: number;
  descripcion: string; 
  valor: string;
  isEdit: boolean;
}

export const UserColumns = [
    
  {
    key: 'descripcion',
    type: 'text',
    label: 'Nombre',
    required: true,
  },  
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];


export const parametroColumns = [
    
  {
    key: 'descripcion',
    type: 'text',
    label: 'Nombre',
    required: true,
  },   
  {
    key: 'valor',
    type: 'number',
    label: 'Monto',
    required: true,
  },  
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {
  displayedColumns: string[] = UserColumns.map((col) => col.key);
  columnsSchema: any = UserColumns;

  
  displayedParametroColumns: string[] = parametroColumns.map((col) => col.key);
  columnsParametroSchema: any = parametroColumns;

  dataSource = new MatTableDataSource<ListasModel>();
  dataSourceFormaPago = new MatTableDataSource<ListasModel>();
  dataSourceFormaPagoCarta = new MatTableDataSource<ListasModel>();
  dataSourceParametro = new MatTableDataSource<ListasModel>();
  valid: any = {};

private urlBase: string; 
  constructor(public dialog: MatDialog,
    private spinner: NgxSpinnerService, private http: HttpClient) {
    
    this.urlBase = `${environment.baseUrl}/api/listas`;
  }

 
  ngOnInit() {
   this.listar();
  }
  listar(){
    this.spinner.show();
    this.getList('Banco').subscribe((res: any) => { 
      this.dataSource.data = res;
    });    
    this.spinner.hide();
    
    this.spinner.show();
    this.getList('FormaPago').subscribe((res: any) => { 
      this.dataSourceFormaPago.data = res;
    });
    this.spinner.hide();
    
    this.spinner.show();
    this.getList('FormaPagoCarta').subscribe((res: any) => { 
      this.dataSourceFormaPagoCarta.data = res;
    });
    this.spinner.hide();
    this.spinner.show();
    this.getList('Parametro').subscribe((res: any) => { 
      this.dataSourceParametro.data = res;
    });
    this.spinner.show();

    this.getList('Vinculo').subscribe((res: any) => { 
      this.dataSourceVinculo.data = res;
    });
    this.spinner.hide();

  }

  editRow(row,tabla) {
    if (row.id === 0) {
      this.addUser(row,tabla);
        row.isEdit = false; 
    } else {
      this.updateUser(row,tabla); 
      row.isEdit = false;
    }
  }

  addRow() {
    const newRow: ListasModel = {
      id: 0,
      descripcion: '',  
      isEdit: true,
      isSelected: false,
      valor:''
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  dataSourceVinculo = new MatTableDataSource<ListasModel>();
  addRowVinculo() {
    const newRow: ListasModel = {
      id: 0,
      descripcion: '',  
      isEdit: true,
      isSelected: false,
      valor:''
    };
    this.dataSourceVinculo.data = [newRow, ...this.dataSourceVinculo.data];
  }
 
  addRowFormaPago() {
    const newRow: ListasModel = {
      id: 0,
      descripcion: '',  
      isEdit: true,
      isSelected: false,
      valor:''
    };
    this.dataSourceFormaPago.data = [newRow, ...this.dataSourceFormaPago.data];
  }
  addRowFormaPagoCarta() {
    const newRow: ListasModel = {
      id: 0,
      descripcion: '',  
      isEdit: true,
      isSelected: false,
      valor:''
    };
    this.dataSourceFormaPagoCarta.data = [newRow, ...this.dataSourceFormaPagoCarta.data];
  }
  addRowParametro() {
    const newRow: ListasModel = {
      id: 0,
      descripcion: '',  
      isEdit: true,
      isSelected: false,
      valor:''
    };
    this.dataSourceParametro.data = [newRow, ...this.dataSourceParametro.data];
  }
 
 

  isAllSelected() {
    return this.dataSource.data.every((item) => item.isSelected);
  }

  isAnySelected() {
    return this.dataSource.data.some((item) => item.isSelected);
  }

  selectAll(event) {
    this.dataSource.data = this.dataSource.data.map((item) => ({
      ...item,
      isSelected: event.checked,
    }));
  }

  inputHandler(e: any, id: number, key: string) {
    if (!this.valid[id]) {
      this.valid[id] = {};
    }
    this.valid[id][key] = e.target.validity.valid;
  }

  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false);
    }
    return false;
  } 
  //
  //apis
     
  getList(tabla:string): Observable<ListasModel[]> {
    return this.http
      .get(this.urlBase+'?table='+tabla)
      .pipe<ListasModel[]>(map((data: any) => data));
  }
cancelar(element:any){
  element.isEdit = !element.isEdit;
  
  this.listar();
}
  updateUser(user: ListasModel,tabla:string) {   

    this.spinner.show();
    const formData = new FormData();
    formData.append('ids', user.id.toString());
    formData.append('nombre', user.descripcion);
    formData.append('accion', "modificar");
    formData.append('tabla', tabla); 
    formData.append('valor', user.valor); 
    this.http.post<IApiResponse>(`${this.urlBase}`, formData).subscribe(
        (response: IApiResponse) => {
          // La solicitud se completó correctamente, se recibió una respuesta exitosa.
          // Puedes acceder a los datos de la respuesta utilizando la variable "response". 
    
          this.spinner.hide();
          this.listar();
    
    
        },
        (error: any) => {
          // Ocurrió un error en la solicitud.
          // Puedes manejar el error aquí mostrando un mensaje al usuario o realizando otras acciones necesarias.
          console.error(error);
    this.spinner.hide();
        }
      );
  }

  addUser(user: ListasModel,tabla:string){
    
    this.spinner.show();
    const formData = new FormData();
    formData.append('ids', user.id.toString());
    formData.append('nombre', user.descripcion);
    formData.append('accion', "agregar");
    formData.append('tabla', tabla); 
    formData.append('tabla', user.valor); 
      this.http.post<IApiResponse>(`${this.urlBase}`, formData).subscribe(
        (response: IApiResponse) => {
          // La solicitud se completó correctamente, se recibió una respuesta exitosa.
          // Puedes acceder a los datos de la respuesta utilizando la variable "response".
         
    this.spinner.hide();
    this.listar();
        },
        (error: any) => {
          // Ocurrió un error en la solicitud.
          // Puedes manejar el error aquí mostrando un mensaje al usuario o realizando otras acciones necesarias.
          console.error(error);
          
    this.spinner.hide();
        }
      );

  }

  deleteUser(id: number,tabla:string) {
    
    this.spinner.show();
    const formData = new FormData();
    formData.append('ids', id.toString());
    formData.append('nombre', "");
    formData.append('accion', "eliminar");
    formData.append('tabla', tabla); 
  this.http.post<IApiResponse>(`${this.urlBase}`, formData).subscribe(
    (response: IApiResponse) => {
    
      this.spinner.hide();
    this.listar();
    },
    (error: any) => {
      // Ocurrió un error en la solicitud.
      // Puedes manejar el error aquí mostrando un mensaje al usuario o realizando otras acciones necesarias.
      
    this.spinner.hide();
      console.error(error);
    }
  );
  
  }
 
} 
