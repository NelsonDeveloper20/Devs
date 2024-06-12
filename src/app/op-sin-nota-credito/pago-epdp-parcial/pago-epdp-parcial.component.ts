import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { IApiResponse } from 'src/app/services/service.model';
import { Solicitud2 } from 'src/app/services/request.model';
import Swal from 'sweetalert2';

import { DatePipe, Location, formatDate } from '@angular/common';
import * as moment from 'moment';

import { IPartePago } from 'src/app/parte-pago-epdp/formulario-epdp/formulario-epdp.component';
import { SolicitudGeneralService } from 'src/app/solicitud-general.service';
import { HistorialSolicitud } from 'src/app/historial-solicitud/historialsolicitud.model';
import { ModalUnidadComponent } from 'src/app/op-con-nota-credito/modal-unidad/modal-unidad.component';
import { MatDialog } from '@angular/material/dialog';
import { UserchangesService } from 'src/app/userchanges.service';

export type sapModel =
  {

    COD_CLIENTE?: String;
    NOMBRE_CLIENTE?: String;
    TIPO_DOCUMENTO?: String;
    NRO_DOCUMENTO?: String;
    FECHA_DOC?: String;
    MONEDA?: String;
    UNIDAD_NEGOCIO?: String;
    TIENDA?: String;
    CENTRO_COSTO?: String;
    MONTO_TOTAL?: String;
    IMPUESTO?: String;

  };
export interface FilaConArchivo {
  texto: string;
  archivo: File;
}

export interface TablaModelo {
  id: string,
  texto: string;
  archivo: File;
  nombrearchivo: string;
  tipo: string;
}
const ELEMENT_DATA: TablaModelo[] = [];

@Component({
  selector: 'app-pago-epdp-parcial',
  templateUrl: './pago-epdp-parcial.component.html',
  styleUrls: ['./pago-epdp-parcial.component.css']
})
export class PagoEpdpParcialComponent implements OnInit {
  datePipe: DatePipe;
  /*
"Aprobaciones"
"Revision Contabilidad"
"Validacion ADV"
"Registrado"
"Revision ADV"
"Rechazado Jefatura"
"Rechazado Contabilidad"
  */
  EstadoSolicitud = "";
  filasData = ELEMENT_DATA;
  filasDatasaved = ELEMENT_DATA;
  disableCampo: boolean = true;
  enabledCampos: boolean = true;
  nombrearchivoNotaCredito: string;


  isEditable = false;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  parentData = 'Datos desde el componente padre';
  displayedColumns: string[] = ['texto', 'archivo', 'acciones'];
  user!: IPartePago;// IProveedor;
  message: string = '';


  //data que recibo del otro componente listado
  datos: any;

  nroNotaCredito: string;
  archivoFactura: File;
  nombrearchivoFactura: string;
  fechaAplicacion = new Date();
  numSap: string;
  archivoTesoreria: File;
  tituloFormulario = localStorage.getItem('Formactivo');


  onArchivoSeleccionado(event: any) {
    this.archivoFactura = event.target.files[0];
    const file: File = event.target.files[0];
    this.nombrearchivoFactura = file.name;
    this.nombrearchivoNotaCredito = file.name;
  }
  onArchivoSeleccionadoTesoreria(event: any) {
    this.archivoTesoreria = event.target.files[0];
  }
  
  TituloContabilidad="Aprobado por Contabilidad";
  mRechazoMDevolucion:string;
  onDataChanged(data: any) {
    this.filasData = data;
  }
  onDataChangeduser(data: any) {

    this.user = data; 
     if(!this.itemsolicitud){
      this.filasData= this._SGeneralService.documentosPorUnidad(this.user?.tipoDocumento);
     }
  }
  paso = "";
  listsapModel: sapModel = {};
  EditFormula = true;
  isLinear = true;
  activeStepIndex = 0;
  private urlBase: string;
  solicitudHistorial: Array<HistorialSolicitud> = [];
  EditAtribFinales = true;
  inputsTesoreria = true;

  constructor(private _location: Location,
    private toaster: Toaster,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private _SGeneralService: SolicitudGeneralService, private dialog: MatDialog, private _formBuilder: FormBuilder,
    private userService: UserchangesService) {
      
      this.userService.user$.subscribe((user) => {
        this.user = user;
        // Realiza acciones adicionales según sea necesario
        this.onDataChangeduser(user);
      });
    this.urlBase = `${environment.baseUrl}/api/`;

    this.datePipe = new DatePipe('en-US');
    //this.agregarFilas();
    if (this.router.getCurrentNavigation()?.extras.state) {
      let user = this.router.getCurrentNavigation()?.extras.state?.soliditud;
      this.itemsolicitud = user;
      console.log("this.itemsolicitud ====>", this.itemsolicitud);
      var itemssolis = {
        comprobanteOrigen: this.itemsolicitud.comprobanteOrigen,
        id: this.itemsolicitud.id,
        nrosap: this.itemsolicitud.nroSap,
        pjudialPnatural: this.itemsolicitud.pjudicialPnatural,
        proveedor: this.itemsolicitud.proveedor,
        cliente: this.itemsolicitud.clienteRazonSocial,
        proyecto: this.itemsolicitud.proyecto,
        numeroArticuloSap: this.itemsolicitud.numeroArticuloSap,
        descripcionArticuloSap: this.itemsolicitud.descripcionArticuloSap,
        importe: this.itemsolicitud.importe,
        moneda: this.itemsolicitud.moneda,
        numeroCuentaBancaria: this.itemsolicitud.numeroCuentaBancaria,
        cciCuentaBancaria:this.itemsolicitud.cciCuentaBancaria,
        numeroCuentaInterbancaria: this.itemsolicitud.numeroCuentaInterbancaria,
        estadoSolicitud: this.itemsolicitud.estadoSolicitud,
        entidadBancaria: this.itemsolicitud.entidadBancaria,
        local: this.itemsolicitud.local,
        area: this.itemsolicitud.area,
        asesor: this.itemsolicitud.asesor,
        solicitante: this.itemsolicitud.solicitante,
        tipoPago: this.itemsolicitud.tipoPago,
        comentario: this.itemsolicitud.comentario,
        tipo: this.itemsolicitud.tipo,
        //otros
        tipoDocumento: this.itemsolicitud.tipoSolicitud,//juridico o natural
        numeroFactura: this.itemsolicitud.nroFacturaSunat == "undefined" ? "" : this.itemsolicitud.nroFacturaSunat,
        comentarioContabilidad : this.itemsolicitud.comentarioContabilidad,
        mRechazoMDevolucion:this.itemsolicitud.mRechazoMDevolucion,
        
      };

      this.user = JSON.parse(JSON.stringify(itemssolis));
      this.mRechazoMDevolucion=this.itemsolicitud.mRechazoMDevolucion;
      var subestado=this.itemsolicitud.subEstadoSolicitud; 
      if(subestado=="Devuelto a ADV por contabilidad"){
      this.TituloContabilidad="Devuelto por contabilidad";
      }else if(subestado=="Rechazado por Contabilidad"){
        this.TituloContabilidad="Rechazado por contabilidad";
      }else{        
        this.TituloContabilidad="Aprobado por Contabilidad";
      }

      var adjuntosBd = [];
      this.itemsolicitud.adjuntos.forEach(elem => {
        adjuntosBd.push({ id: elem.idadjunto, texto: elem.nombre, archivo: null, nombrearchivo: elem.nombrearchivo, tipo: 'BD' })
      });
      this.filasDatasaved = adjuntosBd;
      this.filasData = adjuntosBd;
      var estadoSolicitud = this.itemsolicitud.estadoSolicitud;
      var subestado=this.itemsolicitud.subEstadoSolicitud;
      this.EstadoSolicitud = estadoSolicitud;

      this.nroNotaCredito = this.itemsolicitud.numNotaCredito;
      this.nombrearchivoFactura = this.itemsolicitud.archivoFactura;
      this.fechaAplicacion = (this.itemsolicitud.fechaAplicacion != null && this.itemsolicitud.fechaAplicacion != undefined && this.itemsolicitud.fechaAplicacion != '') ? new Date(this.itemsolicitud.fechaAplicacion) : new Date();

      this.numSap = this.itemsolicitud.nroSapTesoreria;
      //this.archivoTesoreria=this.itemsolicitud.estadoSolicitud;

      if (user.numeroFactur) {

      }
      // alert(estadoSolicitud);
      switch (estadoSolicitud) {
        case 'Registrado':
          this.EditFormula = false;
          this.paso1Enviar = false;
          this.paso1registrar = false;
          this.paso1Enviar = true;
          this.paso1registrar = false;
          this.activeStepIndex = 0;
          break;
        case 'Revision ADV':
          this.EditFormula = false;
          this.paso1Enviar = false;
          this.paso1registrar = false;
          this.activeStepIndex = 1;
          break;
        case 'Validacion ADV':
          this.EditAtribFinales = false;
          this.EditFormula = false;
          this.paso1Enviar = false;
          this.paso1registrar = false;
          this.activeStepIndex = 1;
          break;
        case 'Aprobaciones':

          this.activeStepIndex = 1;
          break;
        case 'Revision Cumplimiento':

          this.activeStepIndex = 3;
          break;
        case 'Revision Contabilidad EPDP':
          this.activeStepIndex = 2;
          this.registroSapVisible = true;
          break;
        // case 'Revision Contabilidad':
        //   this.activeStepIndex = 2;
        //   this.registroSapVisible = true;
        case 'Revision Tesoreria':
          this.EditAtribFinales = false;
          this.inputsTesoreria = false;
          this.activeStepIndex = 3;
          break;

        case 'Revisado Conforme SAP':
          // if(this.itemsolicitud.tipoDocumento == "RUC"){
          //   this.activeStepIndex = 2;
          // }else{
          this.inputsTesoreria = false;
          this.activeStepIndex = 3;
          this.EditAtribFinales = false;
          break;

        //ESTADOS DE FINALIZACION
        case 'Rechazado Jefatura':
          this.activeStepIndex = 1;
          break;
        case 'Rechazado Cumplimiento':
          this.activeStepIndex = 3;
          break;
        case 'Rechazado Contabilidad':
          this.activeStepIndex = 2;
          break;

        case 'Aplicado Tesoreria':
          this.activeStepIndex = 3;
          break;
        case 'Observado Tesoreria':
          this.activeStepIndex = 3;
          break;
        default:
          console.log('no action');
          break;
      }

      if (estadoSolicitud.toUpperCase().includes('RECHAZ')) {
        this.AccionVisible = false;
      } else {
        if (estadoSolicitud.toUpperCase() == "APLICADO TESORERIA") {
          this.AccionVisible = false;
        } else if (estadoSolicitud.toUpperCase() == "OBSERVADO TESORERIA") {
          this.AccionVisible = false;
        } else {
          this.validateRol(this.itemsolicitud.estadoSolicitud);
        }
      }
      this._SGeneralService.getHistorialSolicitud(this.itemsolicitud.id).subscribe(
        response => {
          this.solicitudHistorial = response;

        },
        error => {
        }
      );
    } else {

      this.user = {};
      this.filasData = this._SGeneralService.documentosPorUnidad();
      this.validateRol("IniciarSolicitud");
    }

  }
  RegistrarSolicitud(): void {
    if (this.user.nrosap == "" || this.user.nrosap == undefined || this.user.nrosap == undefined || this.user.nrosap == null ||
      this.user.cliente == "" || this.user.cliente == undefined || this.user.cliente == undefined || this.user.cliente == null ||
      this.user.moneda == "" || this.user.moneda == undefined || this.user.moneda == undefined || this.user.moneda == null ||
      this.user.importe == "" || this.user.importe == undefined || this.user.importe == undefined || this.user.importe == null
    ) {
      this.toaster.open({
        text: "De completar los datos de SAP",
        caption: 'Mensaje',
        type: 'warning',
        position: 'bottom-right',
        //duration: 4000
      });
      return;
    }

    var sinarchivos = 0;
    this.filasData.forEach(elem => {
      if (elem.nombrearchivo == "" || elem.nombrearchivo == null || elem.nombrearchivo == undefined) {
        sinarchivos++;
      }
    });
    if (sinarchivos > 0) {

      Swal.fire({
        title: '¿Está adjuntando menos documentos de los que se indica?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Guardar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // La confirmación fue aceptada
          // Aquí puedes realizar la acción deseada
          this.RegistrarSolicitudBD();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // La confirmación fue cancelada

        }
      });
    } else {

      this.RegistrarSolicitudBD();

    }

  }
  paso1Enviar = false;
  paso1registrar = true;
  openSelecUnidad(rowsn: any) {

    const updatedData = rowsn.map(item => ({ ...item, selected: false }));

    const dialogRef = this.dialog.open(ModalUnidadComponent, {
      data: { rows: updatedData, selectedRow: null },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.unidadSeleccionada = result;
        this.ProcederRegistro();
      }
    });
  }

  ProcederRegistro() {
    this.spinner.show();

    const formData = new FormData();
    formData.append("id", this.user.id);
    formData.append("nrosap", this.user.nrosap);
    formData.append("PjudicialPnatural", this.user.pjudialPnatural);
    formData.append("Proveedor", this.user.proveedor);
    formData.append("Cliente", this.user.cliente);
    formData.append("Proyecto", this.user.proyecto);
    formData.append("NumeroArticuloSap", this.user.numeroArticuloSap);
    formData.append("DescripcionArticuloSap", this.user.descripcionArticuloSap);
    formData.append("importe", this.user.importe);
    formData.append("moneda", this.user.moneda);
    formData.append("NumeroCuentaBancaria", this.user.numeroCuentaBancaria);
    formData.append("NumeroCuentaInterbancaria", this.user.numeroCuentaInterbancaria);
    formData.append("EntidadBancaria", this.user.entidadBancaria);
    formData.append("Local", this.user.local);
    formData.append("Area", this.user.area);
    formData.append("Asesor", this.user.asesor);
    formData.append("Solicitante", this.user.solicitante);
    formData.append("TipoPago", this.user.tipoPago);
    formData.append("NroFacturaSunat", this.user.numeroFactura);
    //end
    formData.append("comentario", this.user.comentario);
    formData.append("tipo", this.user.tipo);
    formData.append("estadosolicitud", this.user.estadoSolicitud);
    formData.append("tiposolicitud", "11");//Pago EPDP
    var idUsuario = localStorage.getItem('ByUser');
    formData.append("ussercreacion", idUsuario);
    formData.append("tipoDocumento", this.user.tipoDocumento);
    formData.append('archivofactura', this.archivoFactura);

    formData.append('UnidadNegocioselect', JSON.stringify(this.unidadSeleccionada));
    for (let i = 0; i < this.filasData.length; i++) {
      if (this.filasData[i].archivo) {
        formData.append(`texto[${i}]`, this.filasData[i].texto);
        formData.append(`archivo[${i}]`, this.filasData[i].archivo);
      } else {
        formData.append(`texto[${i}]`, this.filasData[i].texto);
        // Adjuntar un valor ficticio para indicar que no hay archivo adjunto
        formData.append(`archivo[${i}]`, null);
      }
    }

    this.spinner.show();
    this.http.post<IApiResponse>(this.urlBase + 'SolicitudEPDP', formData)
      .subscribe({
        next: data => {
          if (data.status == 200) {
            let artcl: IApiResponse = JSON.parse(JSON.stringify(data));
            this.user.id = artcl.json;
            this.toaster.open({
              text: "Datos guadados correctamente",
              caption: 'Mensaje',
              type: 'success',
              position: 'top-right'
            });

            this.paso1Enviar = true;
            this.paso1registrar = false;
            this.spinner.hide();
          } else {

            this.spinner.hide();
            this.toaster.open({
              text: "Ocurrio un error, ingrese los datos correctamente",
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
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
            caption: 'Ocurrio un error',
            type: 'danger',
            // duration: 994000
          });
        }
      });
  }

  unidadSeleccionada = {};
  RegistrarSolicitudBD() {
    this.unidadSeleccionada = {};
    if (this.user.id == undefined) {
      const jsonString = localStorage.getItem('RolsUser');
      const jsonObject = this._SGeneralService.filterItemsByRolName('Asesor');
      var unidades = [];
      var countunidad = 0;
      jsonObject.forEach(element => {
        unidades.push(
          {
            unidadId: element.unidad.id,
            unidadNombre: element.unidad.descripcion,
            sedeId: element.sede.id,
            sedeNombre: element.sede.descripcion
          }
        );;
        countunidad += 1;
      });
      if (countunidad == 0) {
        this.toaster.open({
          text: "No tienes asignado ninguna U.N comuniquese con su administrador",
          caption: 'Mensaje',
          type: 'warning',
          position: 'bottom-right',
          //duration: 4000
        });

      } else if (countunidad > 1) {
        this.openSelecUnidad(unidades);
      } else {
        this.unidadSeleccionada = unidades[0];
        this.ProcederRegistro();
      }
    } else {
      this.ProcederRegistro();
    }

  }

  Envio(paso: any) {
    switch (paso) {
      /* case 'paso1':
         this.EnviarBD(paso,"Revision ADV","Enviado a ADV",'none');
         break;*/
      case 'paso1': //paso 2
        // this.EnviarBD("Registrado", "Aprobaciones", "Enviado a aprobacion por ADV", 'none');
        this.EnviarBD("Registrado", "Aprobaciones", "Enviado a Gerencia por ADV", 'none');

        break;
      case 'paso2':
        if (
          this.user.tipoDocumento == 'DNI'
        ) {
          // this.EnviarBD("Revision Gerencia", "Revisado Conforme SAP", "Revisado conforme SAP por Gerencia", 'none');
          this.EnviarBD("Revision Gerencia", "Revision Tesoreria", "Enviado a tesoreria por Gerencia", 'none');
        } else {
          //Persona Juridica
          this.EnviarBD("Revision Gerencia", "Revision Contabilidad EPDP", "Enviado a contabilidad por Gerencia", 'none');
        }
        break;
      case 'paso3':
        //this.EnviarBD(paso,"Revisado Conforme SAP","Revisado conforme SAP por Gerencia",'none');
        this.EnviarBD("Revision Contabilidad", "Revision Tesoreria", "Enviado a tesoreia por Contabilidad", 'none');

        // Swal.fire({
        //   allowOutsideClick: false,
        //   title: "¿Desea Aprobar?",
        //   html: `<br> Ingrese comentario: <br> <textarea id="comentarioaprobacion" class="swal2-textarea"></textarea>`,
        //   icon: 'info',
        //   showCancelButton: true,
        //   confirmButtonText: 'Si, Aprobar',
        //   cancelButtonText: 'Cancelar',
        //   preConfirm: () => {
        //     const motivoDevolucionInput = document.getElementById('comentarioaprobacion') as HTMLTextAreaElement;
        //     const motivoDevolucion = motivoDevolucionInput.value;
        //     if (!motivoDevolucion) {
        //       Swal.showValidationMessage(`Ingrese comentario`);
        //     }
        //     return motivoDevolucion;
        //   }
        // })
        //   .then((result) => {
        //     if (result.isConfirmed) {
        //       const motivoDevolucion = result.value;
        //       if (!motivoDevolucion) {
        //         Swal.showValidationMessage(`Ingrese comentario`);
        //       } else {
        //         this.EnviarBD("Revision Contabilidad", "Revision Tesoreria", "Enviado a tesoreria por Contabilidad", motivoDevolucion);
        //       }
        //     }
        //   });

        break;
      default:
        console.log('no action');
        break;
    }
  }
  Devolver(paso: any) {
    var titulo;
    titulo = "¿Desea devolver?";

    Swal.fire({
      allowOutsideClick: false,
      title: titulo,
      html: `<br>
      Ingrese motivo: <br>
      <textarea id="motivodevolucionps1" class="swal2-textarea"></textarea>
    `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, Devolver',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const motivoDevolucionInput = document.getElementById('motivodevolucionps1') as HTMLTextAreaElement;
        const motivoDevolucion = motivoDevolucionInput.value;
        if (!motivoDevolucion) {
          Swal.showValidationMessage(`Ingrese el motivo`);
        }
        return motivoDevolucion;
      }
    })
      .then((result) => {
        if (result.isConfirmed) {
          const motivoDevolucion = result.value;

          if (!motivoDevolucion) {
            Swal.showValidationMessage(`Ingrese el motivo`);
          } else {
            switch (paso) {
              case 'paso2':
                this.EnviarBD("Revision ADV", "Registrado", "Devuelto al asesor por ADV", motivoDevolucion);
                break;
              case 'paso3':
                this.EnviarBD("Revision Contabilidad", "Revision ADV", "Devuelto a ADV por contabilidad", motivoDevolucion,motivoDevolucion);
                break;
              default:
                console.log('no action');
                break;
            }
          }
        }
      });
  }
  Rechazar(paso: any) {
    var titulo;
    titulo = "¿Desea Rechazar?";

    Swal.fire({
      allowOutsideClick: false,
      title: titulo,
      html: `<br>
      Ingrese motivo: <br>
      <textarea id="motivodevolucionps1" class="swal2-textarea"></textarea>
    `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, Rechazar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const motivoDevolucionInput = document.getElementById('motivodevolucionps1') as HTMLTextAreaElement;
        const motivoDevolucion = motivoDevolucionInput.value;
        if (!motivoDevolucion) {
          Swal.showValidationMessage(`Ingrese el motivo`);
        }
        return motivoDevolucion;
      }
    })
      .then((result) => {
        if (result.isConfirmed) {
          const motivoDevolucion = result.value;

          if (!motivoDevolucion) {
            Swal.showValidationMessage(`Ingrese el motivo`);
          } else {
            switch (paso) {
              case 'paso2':
                this.EnviarBD("Revision Gerencia", "Rechazado Gerencia", "Rechazado por Gerencia", motivoDevolucion);
                break;
              case 'paso3':
                this.EnviarBD("Revision Contabilidad", "Rechazado Contabilidad", "Rechazado por Contabilidad", motivoDevolucion,motivoDevolucion);
                break;
              default:
                console.log('no action');
                break;
            }
          }
        }
      });
  }

  EnviarBD(paso, estado, subestado, motivo,mRechazoMDevolucion?:string) {
    this.spinner.show();
    var idUsuario = localStorage.getItem('ByUser');
    var parametros = "&paso=" + paso + "&estado=" + estado + "&subestado=" + subestado + "&motivo=" + motivo+"&mRechazoMDevolucion="+mRechazoMDevolucion;
    this.http.put<IApiResponse>(this.urlBase + 'SolicitudEPDP?usuario=' + idUsuario + '&id=' + this.user.id + parametros, {})
      .subscribe({
        next: data => {
          if (data.status == 200) {

            this.toaster.open({
              text: "Operacion realizada correctamente ",
              caption: 'Mensaje',
              type: 'success',
              position: 'top-right'
            });
            this.spinner.hide();
            this.paso1Enviar = false;


            this.router.navigate(['SolicitudAdv']);

          } else {

            this.spinner.hide();
            this.toaster.open({
              text: "Ocurrio un error",
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
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
            caption: 'Ocurrio un error' + error,
            type: 'danger',
            // duration: 994000
          });
        }
      });
  }
  cambiarMostrarGerencia() {
    if (this._mostrarGerencia == true) {
      this._SGeneralService.validaParametro(this.user.importe, this.user.moneda)
        .then((results: boolean) => {
          this._mostrarGerencia = results;
        })
        .catch((error) => {
          // Maneja el error si es necesario
        });
    }
  }
  _mostrarGerencia = false;
  _Gerencia = false;
  mostrarGerencia() {
    var result = this._SGeneralService.visibleGerencia();
    this._mostrarGerencia = result;
    this._Gerencia = result;
    return this._mostrarGerencia;
  }
  _mostrarADV = false;
  mostrarADV() {
    if (this.activeStepIndex < 4) {
      const historialFiltrado = this.solicitudHistorial.filter(item => item.estadoSolicitud === "Validacion ADV");
      if (historialFiltrado.length > 0) {
        this._mostrarADV = true;
        return true;
      } else {
        if (this.EstadoSolicitud == "Asesor") {
          this._mostrarADV = true;
          return true;
        } else {
          var result = this._SGeneralService.visibleADV();
          this._mostrarADV = result;
          return result;
        }
      }
    } else {
      return this._mostrarADV;
    }
  }
  volver() {

    this._location.back();
  }
  itemsolicitud!: Solicitud2;
  ngOnInit(): void {

    this.setState(this.valid1, true)
    setTimeout(() => {

      if (this.itemsolicitud) {

        /*
       const datePipe = new DatePipe('en-US');
       const datesolicitud = datePipe.transform(this.itemsolicitud.fechSolicitud.toString(), 'dd/MM/yyyy');
       */
        const fecha = '19/05/2023';
        var itemssolis = {
          id: this.itemsolicitud.id,
          comprobanteOrigen: this.itemsolicitud.comprobanteOrigen,
          nrosap: this.itemsolicitud.nroSap,
          pjudialPnatural: this.itemsolicitud.pjudicialPnatural,
          proveedor: this.itemsolicitud.proveedor,
          cliente: this.itemsolicitud.clienteRazonSocial,
          proyecto: this.itemsolicitud.proyecto,
          numeroArticuloSap: this.itemsolicitud.numeroArticuloSap,
          descripcionArticuloSap: this.itemsolicitud.descripcionArticuloSap,
          importe: this.itemsolicitud.importe,
          moneda: this.itemsolicitud.moneda,
          numeroCuentaBancaria: this.itemsolicitud.numeroCuentaBancaria,
          cciCuentaBancaria:this.itemsolicitud.cciCuentaBancaria,
          numeroCuentaInterbancaria: this.itemsolicitud.numeroCuentaInterbancaria,
          estadoSolicitud: this.itemsolicitud.estadoSolicitud,
          entidadBancaria: this.itemsolicitud.entidadBancaria,
          local: this.itemsolicitud.local,
          area: this.itemsolicitud.area,
          asesor: this.itemsolicitud.asesor,
          solicitante: this.itemsolicitud.solicitante,
          tipoPago: this.itemsolicitud.tipoPago,
          comentario: this.itemsolicitud.comentario,
          tipo: this.itemsolicitud.tipo,
          //otros
          tipoDocumento: this.itemsolicitud.tipoDocumento,//juridico o natural
          numeroFactura: this.itemsolicitud.nroFacturaSunat == "undefined" ? "" : this.itemsolicitud.nroFacturaSunat,
          comentarioContabilidad : this.itemsolicitud.comentarioContabilidad,
          mRechazoMDevolucion:this.itemsolicitud.mRechazoMDevolucion,

        };
        this.user = JSON.parse(JSON.stringify(itemssolis));
        this.nombrearchivoFactura = this.itemsolicitud.archivoFactura;
      }
    },
      5);

  }

  EnvioTesoreria() {
    const formData: FormData = new FormData();
    formData.append('id', this.itemsolicitud.id.toString());
    formData.append('numero', this.nroNotaCredito);
    formData.append('estado', "Revision Tesoreria");
    formData.append('archivo', this.archivoFactura);
    formData.append('archivoporaplicar', null);
    formData.append('finalizaadv', "");

    const idUsuario = localStorage.getItem('ByUser');
    formData.append('ussercreacion', idUsuario);
    this.spinner.show();
    this.http.put<IApiResponse>(this.urlBase + 'SolicitudArchivo', formData)
      .subscribe({
        next: data => {
          if (data.status == 200) {

            this.toaster.open({
              text: "Nota de credido guardado correctamente ",
              caption: 'Mensaje',
              type: 'success',
              position: 'top-right'
            });
            this.spinner.hide();
            this.paso1Enviar = false;

          } else {

            this.spinner.hide();
            this.toaster.open({
              text: "Ocurrio un error",
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
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
            caption: 'Ocurrio un error' + error,
            type: 'danger',
            // duration: 994000
          });
        }
      });
  }
  ObservarTesoreria() {

    Swal.fire({
      allowOutsideClick: false,
      title: "¿Desea Observar?",
      html: `<br>
      Ingrese motivo de la observacion: <br>
      <textarea id="motivodevolucionps1" class="swal2-textarea"></textarea>
    `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, Observar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const motivoDevolucionInput = document.getElementById('motivodevolucionps1') as HTMLTextAreaElement;
        const motivoDevolucion = motivoDevolucionInput.value;
        if (!motivoDevolucion) {
          Swal.showValidationMessage(`Ingrese el motivo`);
        }
        return motivoDevolucion;
      }
    })
      .then((result) => {
        if (result.isConfirmed) {
          const motivoDevolucion = result.value;

          if (!motivoDevolucion) {
            Swal.showValidationMessage(`Ingrese el motivo`);
          } else {

            const idUsuario = localStorage.getItem('ByUser');
            this.http.put<IApiResponse>(this.urlBase + 'SolicitudTesoreria?usuario=' + idUsuario + '&id=' + this.itemsolicitud.id + "&motivo=" + motivoDevolucion, {})
              .subscribe({
                next: data => {
                  if (data.status == 200) {

                    this.toaster.open({
                      text: "La solicitud fue enviado como observado",
                      caption: 'Mensaje',
                      type: 'success',
                      position: 'top-right'
                    });
                    this.spinner.hide();

                  } else {

                    this.spinner.hide();
                    this.toaster.open({
                      text: "Ocurrio un error",
                      caption: 'Mensaje',
                      type: 'warning',
                      position: 'bottom-right',
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
                    caption: 'Ocurrio un error' + error,
                    type: 'danger',
                    // duration: 994000
                  });
                }
              });
          }
        }
      });
  }
  AplicarTesoreria() {
    
    /*if(!this.archivoTesoreria){
      this.toaster.open({ text: "Debe cargar el archivo primero",
                          caption: 'Mensaje',
                          type: 'warning',
                          position:'bottom-right',
                        //duration: 4000
                        });
                        return;
    }*/
    const formData: FormData = new FormData();
    formData.append('id', this.itemsolicitud.id.toString());

    const value = this.fechaAplicacion;
    var fechFormat = this.datePipe.transform(value, 'dd/MM/yyyy');

    formData.append('fecha', fechFormat);//this.fechaAplicacion.toString());
    formData.append('nrosap', this.numSap);
    formData.append('estado', "Aplicado Tesoreria");
    const idUsuario = localStorage.getItem('ByUser');
    formData.append('archivo', this.archivoTesoreria);

    formData.append('ussercreacion', idUsuario);

    console.log(idUsuario);
    this.spinner.show();
    this.http.post<IApiResponse>(this.urlBase + 'SolicitudTesoreria', formData)
      .subscribe({
        next: data => {

          this.router.navigate(['SolicitudAdv']);



          if (data.status == 200) {

            this.toaster.open({
              text: "Solicitud aplicada correctamente",
              caption: 'Mensaje',
              type: 'success',
              position: 'top-right'
            });
            this.spinner.hide();
          } else {

            this.spinner.hide();
            this.toaster.open({
              text: "Ocurrio un error",
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
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
            caption: 'Ocurrio un error' + error,
            type: 'danger',
            // duration: 994000
          });
        }
      });
  }

  descargararchivo() {
    const formData = new FormData();
    formData.append("nombre", this.nombrearchivoFactura);
    // Realiza la solicitud POST al backend
    this.http.post(this.urlBase + 'SolicitudArchivo', formData, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        let filename = this.nombrearchivoFactura; // Nombre por defecto
        // Crea un enlace temporal para iniciar la descarga
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = filename; // Nombre del archivo a descargar
        downloadLink.click();
        // Libera el objeto URL creado para la descarga
        window.URL.revokeObjectURL(url);
      });
  }

  descargararchivoTesoreria() {
    const formData = new FormData();
    formData.append("nombre", this.itemsolicitud?.archivoTesoreria);
    // Realiza la solicitud POST al backend
    this.http.post(this.urlBase + 'SolicitudArchivo', formData, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        let filename = this.itemsolicitud?.archivoTesoreria; // Nombre por defecto
        // Crea un enlace temporal para iniciar la descarga
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = filename; // Nombre del archivo a descargar
        downloadLink.click();
        // Libera el objeto URL creado para la descarga
        window.URL.revokeObjectURL(url);
      });
  }

  getHistorialByStatus(estado: string) {
    return this._SGeneralService.verHistorialPorEstado(estado, this.solicitudHistorial, this.itemsolicitud);
  }

  async getNotaCredito() {
    try {
      var valornotacredito = await this._SGeneralService.buscarapinotaCredito(this.itemsolicitud);
      this.nroNotaCredito = valornotacredito;
    } catch (error) {
      console.error("Error al obtener la nota de crédito:", error);
    }
  }

  valid1 = new FormControl('')
  setState(control: FormControl, state: boolean) {
    if (state) {
      control.setErrors({ "required": true })
    } else {
      control.reset()
    }
  }

  //VISIBLE BUTTONS
  AccionVisible = false;
  registroSapVisible = false;
  validateRol(estadoSolic: string) {
    var rolUser = localStorage.getItem('RolUser');
    var idUser = localStorage.getItem('ByUser');

    var btnvisible = this._SGeneralService.validationRol(estadoSolic, this.itemsolicitud, rolUser, idUser);
    this.AccionVisible = btnvisible;
  }
}

