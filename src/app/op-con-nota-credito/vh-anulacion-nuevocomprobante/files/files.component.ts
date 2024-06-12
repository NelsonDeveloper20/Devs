import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { IApiResponse } from 'src/app/services/service.model';
import { environment } from 'src/environments/environment';

export interface TablaModelo {
  id:string,
  texto: string;
  archivo: File;
  nombrearchivo:string;
  tipo:string;
}
const ELEMENT_DATA: TablaModelo[] = [];
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {


  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @Input() EstadoSolicitud: string;
  @Input() filasData: TablaModelo[];
  @Input() filasDatasaved: TablaModelo[];
  @Output() dataChanged = new EventEmitter<TablaModelo[]>();
  @Output() dataChanged2 = new EventEmitter<TablaModelo[]>();

  sendData() {
    this.dataChanged.emit(this.filasData);
    this.dataChanged2.emit(this.filasDatasaved);
  }

  private urlBase: string;
  seletecFile=true;
  addFiles=true;
  //filasData= ELEMENT_DATA ;
  constructor(
    private toaster: Toaster,
    private spinner: NgxSpinnerService,private http: HttpClient,private changeDetectorRef: ChangeDetectorRef) {
    this.urlBase = `${environment.baseUrl}/api/`; }

  agregarFila(): void {
      //var nuevasfilas=
      var maxId =0;
      if(this.filasData){
          try{
            maxId=Number(this.filasData.reduce((max, obj) => obj.id > max ? obj.id : max, this.filasData[0].id));
          }catch(e){

          }

      }else{
          maxId=0;
      }
          maxId=maxId+1;
          this.filasData.push({id:maxId.toString(), texto: '', archivo: null ,nombrearchivo:null,tipo:"local"});
          this.filasData = [...this.filasData];
          this.changeDetectorRef.detectChanges();
          this.sendData();
  }



  eliminarFila(indice: number): void {
    this.filasData.splice(indice, 1);this.sendData();
  }
  cambiar(){
    this.sendData();
  }
  descargararchivo(fila:TablaModelo ){

    this.spinner.show();
    const formData = new FormData();
    formData.append("nombre",fila.nombrearchivo);
    // Realiza la solicitud POST al backend
    this.http.post(this.urlBase + 'SolicitudArchivo', formData, { responseType: 'blob' })
      .subscribe((blob: Blob) => {

        this.spinner.hide();
        let filename = fila.nombrearchivo; // Nombre por defecto
        // Crea un enlace temporal para iniciar la descarga
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download =  filename; // Nombre del archivo a descargar
        downloadLink.click();
        // Libera el objeto URL creado para la descarga
        window.URL.revokeObjectURL(url);
      });

      this.spinner.hide();
  }

  convertBlobToPdf(blob: Blob): Blob {
    return new Blob([blob], { type: 'application/pdf' });
  }
  verarchivo(fila:TablaModelo ){
    this.spinner.show();
    const formData = new FormData();
    formData.append("nombre",fila.nombrearchivo);
    this.http.post(this.urlBase + 'SolicitudArchivo', formData, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        this.spinner.hide();
        const texto = fila.nombrearchivo;
        const ultimosCuatro = texto.slice(-4);
        if(ultimosCuatro.toUpperCase()=='.PDF'){
          const pdfData = this.convertBlobToPdf(blob);
          const pdfUrl = URL.createObjectURL(pdfData);
          window.open(pdfUrl, '_blank');
        }else{
    const imageUrl = this.convertBlobToImageUrl(blob);
    const newWindow = window.open();
    newWindow.document.write(`<img src="${imageUrl}" />`);
        }
      });
      this.spinner.hide();
  }
  convertBlobToImageUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
  onchengefile(event: any,fila:TablaModelo ){

    debugger;
    const archivoSeleccionado = (event.target as HTMLInputElement).files[0];
    fila.archivo = archivoSeleccionado;
    fila.nombrearchivo=archivoSeleccionado.name;
    fila.tipo="local";
    this.sendData();
  }
  resetFileInput(fila: any) {
    const inputElement = document.getElementById(`file2${fila.id}`) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

  removeFile(filas:TablaModelo ){
    if(this.validar(Number(filas.id))==1){

      const nuevoArreglo = this.filasData.filter((fila) => fila.id !== filas.id);
      // Asignar el nuevo arreglo a la variable 'tabla'
      this.filasData = nuevoArreglo;
    }else{
    filas.archivo=null;
    filas.nombrearchivo="";
    this.resetFileInput(filas);
    }
    /*const nuevoArreglo = this.filasData.filter((fila) => fila.id !== filas.id);
    // Asignar el nuevo arreglo a la variable 'tabla'
    this.filasData = nuevoArreglo;*/
    this.sendData();
  }
  removeFileBd(filas:TablaModelo ){
    //return this.http.delete<GeneralResponse<number>>('/api/ruta-del-endpoint/' + id);
  this.spinner.show();
  this.http.delete<IApiResponse>(this.urlBase + 'Solicitud?id='+filas.id)
  .subscribe({
  next: data => {
    if(data.status==200){
      this.toaster.open({
        text: "Archivo eliminado",
        caption: 'Mensaje',
        type: 'success',
        position:'top-right'
      });
      this.spinner.hide();
    filas.nombrearchivo=""
    this.sendData();

    }else{

      this.spinner.hide();
    this.toaster.open({
      text: "Ocurrio un error",
      caption: 'Mensaje',
      type: 'warning',
      position:'bottom-right',
      //duration: 4000
    });
    }
  },
  error: error => {
  this.spinner.hide();
    var errorMessage = error.message;
    console.error('There was an error!', error);
    this.toaster.open({
      text: errorMessage,
      caption: 'Ocurrio un error'+error,
      type: 'danger',
     // duration: 994000
    });
  }
  });

    //this.sendData();
  }
validar(id:number){
  if(id>this.maximo){
    return 1;
  }else{
    return 0;
  }
  }
  maximo=0;


 removeFilesavedData(fila:TablaModelo ){
  //return this.http.delete<GeneralResponse<number>>('/api/ruta-del-endpoint/' + id);
  this.spinner.show();
  this.http.delete<IApiResponse>(this.urlBase + 'Solicitud?id='+fila.id)
  .subscribe({
  next: data => {
    if(data.status==200){

      this.toaster.open({
        text: "Archivo eliminado",
        caption: 'Mensaje',
        type: 'success',
        position:'top-right'
      });
      this.spinner.hide();

    const nuevoArreglo = this.filasDatasaved.filter((filas) => filas.id !== fila.id);
    // Asignar el nuevo arreglo a la variable 'tabla'
    this.filasDatasaved = nuevoArreglo;
    this.sendData();

    }else{

      this.spinner.hide();
    this.toaster.open({
      text: "Ocurrio un error",
      caption: 'Mensaje',
      type: 'warning',
      position:'bottom-right',
      //duration: 4000
    });
    }
  },
  error: error => {
  this.spinner.hide();
    var errorMessage = error.message;
    console.error('There was an error!', error);
    this.toaster.open({
      text: errorMessage,
      caption: 'Ocurrio un error'+error,
      type: 'danger',
     // duration: 994000
    });
  }
  });

}
changeInput(event: any){
  this.sendData();

}
FilIsBD=false;
editCampo=false;
  ngOnInit(): void {
      try{
        this.maximo=Number(this.filasData.reduce((max, obj) => obj.id > max ? obj.id : max, this.filasData[0].id));
      }catch(e){
      }
      if(this.EstadoSolicitud=="" || this.EstadoSolicitud==null || this.EstadoSolicitud==undefined){
        //Boton eliminad archivo de Blobstorage azure
        this.FilIsBD=true;
        this.editCampo=true;
        this.seletecFile=true;
      }else{

        var rolUser=localStorage.getItem('RolUser');
        switch (this.EstadoSolicitud) {
          case 'Registrado':
          this.seletecFile=true;
          this.addFiles=true;
          this.editCampo=true;
          //Boton eliminad archivo de Blobstorage azure
          this.FilIsBD=true;
            break;
          case 'Revision ADV':
            this.seletecFile=true;
            this.addFiles=true;
            this.editCampo=true;
            //Boton eliminad archivo de Blobstorage azure
            if (rolUser == 'ADV') {
              this.FilIsBD = true;
            }
          break;
          case 'Validacion ADV':
            this.seletecFile=false;
            this.addFiles=false;
            //Boton eliminad archivo de Blobstorage azure
            if (rolUser == 'ADV') {
              this.FilIsBD = true;
            }
          break;
          case 'Aprobaciones':
            this.seletecFile=false;
            this.addFiles=false;
          break;
          case 'Revision Cumplimiento':
            this.seletecFile=false;
            this.addFiles=false;
          break;
          case 'Revision Contabilidad':
            this.seletecFile=false;
            this.addFiles=false;
          break;
          case 'Enviado a tesoreria por ADV':
            //this.seletecFile=true;
            this.addFiles=true;
            //Boton eliminad archivo de Blobstorage azure
            if (rolUser == 'Tesorería') {
              this.FilIsBD = true;
            }
            this.seletecFile=false;
          break;
          default:
            this.seletecFile=false;
            this.addFiles=false;
            this.FilIsBD=false;
            break;
        }
      }


 //this.filasData= this.childData;
  /*[
  { texto: 'Carta de solicitud de devolución', archivo: null },
  { texto: 'PDF de la factura o boleta', archivo: null },
  { texto: 'Copia del DNI del cliente', archivo: null },
  { texto: 'Constancia de pago', archivo: null },
  { texto: 'UIF', archivo: null },
  { texto: 'Vigencia de poder (en caso de empresa)', archivo: null },
  { texto: 'Ficha RUC', archivo: null },
  ];*/
  }

}
