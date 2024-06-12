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
import { SolicitudGeneralService } from 'src/app/solicitud-general.service';
import { HistorialSolicitud } from 'src/app/historial-solicitud/historialsolicitud.model';
import { MatDialog } from '@angular/material/dialog';

import { IUsersResponse } from 'src/app/services/user.model';
import { RequestService } from 'src/app/services/request.service';
//import { ModalUnidadComponent } from '../modal-unidad/modal-unidad.component';
import { ModalUnidadComponent } from 'src/app/op-con-nota-credito/modal-unidad/modal-unidad.component';
import { IComprobante } from 'src/app/op-con-nota-credito/vh-anulacion-nuevocomprobante/comprobante.model';
import { Usuario } from 'src/app/usuarios/users.model';
export type sapModel = {
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
  id: string;
  texto: string;
  archivo: File;
  nombrearchivo: string;
  tipo: string;
}
const ELEMENT_DATA: TablaModelo[] = [];
@Component({
  selector: 'app-carta-sn-cruzada',
  templateUrl: './carta-sn-cruzada.component.html',
  styleUrls: ['./carta-sn-cruzada.component.css']
})
export class CartaSnCruzadaComponent  implements OnInit {
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
//import { IComprobante } from '../vh-anulacion-nuevocomprobante/comprobante.model';
  EstadoSolicitud = '';
  filasData = ELEMENT_DATA;
  filasDatasaved = ELEMENT_DATA;
  disableCampo: boolean = true;
  enabledCampos: boolean = true;

  isEditable = false;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  parentData = 'Datos desde el componente padre';
  displayedColumns: string[] = ['texto', 'archivo', 'acciones'];
  user!: IComprobante; // IProveedor;
  message: string = '';

  //data que recibo del otro componente listado
  datos: any;

  nroNotaCredito: string;
  archivoNotaCredito: File;
  nombrearchivoNotaCredito: string;
  fechaAplicacion = new Date();
  numSap: string;
  archivoTesoreria: File;
  tituloFormulario = localStorage.getItem('Formactivo');

  onArchivoSeleccionado(event: any) {
    this.archivoNotaCredito = event.target.files[0];
    const file: File = event.target.files[0];
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
  }
  paso = '';
  listsapModel: sapModel = {};
  EditFormula = true;
  isLinear = true;
  activeStepIndex = 0;
  private urlBase: string;
  solicitudHistorial: Array<HistorialSolicitud> = [];
  EditAtribFinales = true;
  constructor(
    private _location: Location,
    private toaster: Toaster,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private _SGeneralService: SolicitudGeneralService,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private requestService: RequestService
  ) {
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
        clienterazonsocial: this.itemsolicitud.clienteRazonSocial,
        dniclienteruc: this.itemsolicitud.dniClienteRuc,
        fechsolicitud: this.itemsolicitud.fechSolicitud,
        importe: this.itemsolicitud.importe,
        moneda: this.itemsolicitud.moneda,
        unidadnegocio: this.itemsolicitud.unidadNegocio,
        tienda: this.itemsolicitud.tienda,
        centrocosto: this.itemsolicitud.centroCosto,
        comentario: this.itemsolicitud.comentario,
        tipo: this.itemsolicitud.tipo,
        estadoSolicitud: this.itemsolicitud.estadoSolicitud,
        subEstadoSolicitud: this.itemsolicitud.subEstadoSolicitud,
        motivo: this.itemsolicitud.motivo,

        tipoCarta: this.itemsolicitud.tipoCarta,
        dniclienteRealiza: this.itemsolicitud.dniClienteRuc,
        clienteRaliza: this.itemsolicitud.clienteRealiza,
        vinculo: this.itemsolicitud.vinculo,
        banco: this.itemsolicitud.banco,
        formaPago: this.itemsolicitud.formaPago,
        numOperacion: this.itemsolicitud.numOperacion,
        solicitante: this.itemsolicitud.solicitante,
        comentarioContabilidad : this.itemsolicitud.comentarioContabilidad,
        mRechazoMDevolucion:this.itemsolicitud.mRechazoMDevolucion,
      };
      this.user = JSON.parse(JSON.stringify(itemssolis));

      var adjuntosBd = [];
      this.itemsolicitud.adjuntos.forEach((elem) => {
        adjuntosBd.push({
          id: elem.idadjunto,
          texto: elem.nombre,
          archivo: null,
          nombrearchivo: elem.nombrearchivo,
          tipo: 'BD',
        });
      });
      this.filasDatasaved = adjuntosBd;
      this.filasData = adjuntosBd;
      var estadoSolicitud = this.itemsolicitud.estadoSolicitud;
      var subestado=this.itemsolicitud.subEstadoSolicitud;
      this.EstadoSolicitud = estadoSolicitud;

      this.nroNotaCredito = this.itemsolicitud.numNotaCredito;
      this.nombrearchivoNotaCredito = this.itemsolicitud.archivoNotaCredito;
            this.fechaAplicacion = (this.itemsolicitud.fechaAplicacion != null && this.itemsolicitud.fechaAplicacion != undefined && this.itemsolicitud.fechaAplicacion != '') ? new Date(this.itemsolicitud.fechaAplicacion) : new Date();

      this.numSap = this.itemsolicitud.nroSapTesoreria;
      //this.archivoTesoreria=this.itemsolicitud.estadoSolicitud;
      this.mostrarADV();
    /*  if (this.itemsolicitud.historial.length > 0) {
        this._mostrarADV = true;
      }*/
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
          if (this._mostrarADV == false) {
            this.activeStepIndex = 1;
          } else {
            this.activeStepIndex = 2;
          }
          break;
          case 'Rechazado Jefatura':
            if (this._mostrarADV == false) {
              this.activeStepIndex = 1;
            } else {
              this.activeStepIndex = 2;
            }
            break;
        case 'Revision Cumplimiento':
          if (this._mostrarADV == false) {
            this.activeStepIndex = 2;
          } else {
            this.activeStepIndex = 3;
          }
          break;
        case 'Revision Contabilidad':
          if (this._mostrarADV == false) {
            this.activeStepIndex = 3;
          } else {
            this.activeStepIndex = 4;
          }
          break;
        case 'Revision Tesoreria':
          this.EditAtribFinales = false;
          this.activeStepIndex = 3;
          break;
        //ESTADOS DE FINALIZACION
        case 'Rechazado Jefatura':
          this.activeStepIndex = 2;
          break;
        case 'Rechazado Cumplimiento':
          this.activeStepIndex = 3;
          break;
        case 'Rechazado Contabilidad':
          this.activeStepIndex = 4;
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
        if (estadoSolicitud.toUpperCase() == 'APLICADO TESORERIA') {
          this.AccionVisible = false;
        } else if (estadoSolicitud.toUpperCase() == 'OBSERVADO TESORERIA') {
          this.AccionVisible = false;
        } else {
          this.validateRol(this.itemsolicitud.estadoSolicitud);
        }
      }
      this._SGeneralService
        .getHistorialSolicitud(this.itemsolicitud.id)
        .subscribe(
          (response) => {
            this.solicitudHistorial = response;
          },
          (error) => {}
        );
      if (
        this.user.importe !== undefined &&
        this.user.importe !== '' &&
        this.user.moneda !== ''
      ) {
        this.cambiarMostrarGerencia();
      }
    } else {
      this.user = {};
      this.filasData = this._SGeneralService.documentosPorUnidad();
      this.validateRol('IniciarSolicitud');
    }
  }
  RegistrarSolicitud(): void {
    if (
      this.user.nrosap == '' ||
      this.user.nrosap == undefined ||
      this.user.nrosap == undefined ||
      this.user.nrosap == null ||
      this.user.clienterazonsocial == '' ||
      this.user.clienterazonsocial == undefined ||
      this.user.clienterazonsocial == undefined ||
      this.user.clienterazonsocial == null ||
      this.user.moneda == '' ||
      this.user.moneda == undefined ||
      this.user.moneda == undefined ||
      this.user.moneda == null ||
      this.user.importe == '' ||
      this.user.importe == undefined ||
      this.user.importe == undefined ||
      this.user.importe == null
    ) {
      this.toaster.open({
        text: 'De completar los datos de SAP',
        caption: 'Mensaje',
        type: 'warning',
        position: 'bottom-right',
        //duration: 4000
      });
      return;
    }

    var sinarchivos = 0;
    this.filasData.forEach((elem) => {
      if (
        elem.nombrearchivo == '' ||
        elem.nombrearchivo == null ||
        elem.nombrearchivo == undefined
      ) {
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
        cancelButtonText: 'Cancelar',
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
    const updatedData = rowsn.map((item) => ({ ...item, selected: false }));

    const dialogRef = this.dialog.open(ModalUnidadComponent, {
      data: { rows: updatedData, selectedRow: null },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.unidadSeleccionada = result;
        this.ProcederRegistro();
      }
    });
  }
  ProcederRegistro() {
    
    if(!this.AsesorSelected){

      this.toaster.open({
        text: "Sebe seleccionar Asesor",
        caption: 'Mensaje',
        type: 'warning',
        position: 'bottom-right',
        //duration: 4000
      });
      return;
    }
    this.spinner.show();
    const formData = new FormData();
    formData.append('id', this.user.id);
    formData.append('nrosap', this.user.nrosap);
    formData.append('tipocarta', this.user.tipoCarta);
    formData.append('dniclienterealiza', this.user.dniclienteRealiza);
    formData.append('clienterazonsocialrealiza', this.user.clienteRaliza);
    formData.append('vinculo', this.user.vinculo);
    formData.append('banco', this.user.banco);
    formData.append('formapago', this.user.formaPago);
    formData.append('numoperacion', this.user.numOperacion);
    formData.append('solicitante', this.user.solicitante);
    //1508
    formData.append('clienterazonsocial', this.user.clienterazonsocial);
    formData.append('dniclienteruc', this.user.dniclienteruc);

    const value = this.user.fechsolicitud;
    var fechFormat = this.datePipe.transform(value, 'dd/MM/yyyy');
    formData.append('fechsolicitud', fechFormat); //this.user.fechsolicitud );
    formData.append('importe', this.user.importe);
    formData.append('moneda', this.user.moneda);
    formData.append('unidadnegocio', this.user.unidadnegocio);
    formData.append('tienda', this.user.tienda);
    formData.append('centrocosto', this.user.centrocosto);
    formData.append('comentario', this.user.comentario);
    formData.append('tipo', this.user.tipo);
    formData.append('tiposolicitud', '12'); //nuevo carta cruzada
    formData.append('estadosolicitud', this.EstadoSolicitud);
    formData.append('comprobanteOrigen', this.user.comprobanteOrigen);
    formData.append("asesorselecionado",this.AsesorSelected?.id.toString());
    var idUsuario = localStorage.getItem('ByUser');
    formData.append(
      'UnidadNegocioselect',
      JSON.stringify(this.unidadSeleccionada)
    );
    formData.append('ussercreacion', idUsuario);
    for (let i = 0; i < this.filasData.length; i++) {
    /* formData.append(`texto[${i}]`, this.filasData[i].texto);
    formData.append(`archivo[${i}]`, this.filasData[i].archivo);
    */

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
    this.http
      .post<IApiResponse>(this.urlBase + 'SolicitudCartaCruzada', formData)
      .subscribe({
        next: (data) => {
          if (data.status == 200) {
            let artcl: IApiResponse = JSON.parse(JSON.stringify(data));

            this.user.id = artcl.json;
            this.toaster.open({
              text: 'Datos guadados correctamente',
              caption: 'Mensaje',
              type: 'success',
              position: 'top-right',
            });

            this.paso1Enviar = true;
            this.paso1registrar = false;
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toaster.open({
              text: 'Ocurrio un error, ingrese los datos correctamente',
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
              //duration: 4000
            });
          }
        },
        error: (error) => {
          this.spinner.hide();
          var errorMessage = error.message;
          console.error('There was an error!', error);
          this.toaster.open({
            text: errorMessage,
            caption: 'Ocurrio un error',
            type: 'danger',
            // duration: 994000
          });
        },
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
      jsonObject.forEach((element) => {
        unidades.push({
          unidadId: element.unidad.id,
          unidadNombre: element.unidad.descripcion,
          sedeId: element.sede.id,
          sedeNombre: element.sede.descripcion,
        });
        countunidad += 1;
      });
      if (countunidad == 0) {
        this.toaster.open({
          text: 'No tienes asignado ninguna U.N comuniquese con su administrador',
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
      case 'paso1':        
        //this.EnviarBD("Registrado", "Aprobaciones", "Enviado a aprobacion por ADV", 'none');
        
        this.EnviarBD(
          'Registrado',//'Revision ADV',
          'Aprobaciones',
          'Enviado a aprobacion por ADV',
          'none'
        );
        //this.EnviarBD('Registrado', 'Revision ADV', 'Enviado a ADV', 'none');
        break;
      case 'paso2':
        this.EnviarBD(
          'Revision ADV',
          'Aprobaciones',
          'Enviado a aprobacion por ADV',
          'none'
        );
        break;
      case 'paso3':
        this.EnviarBD(
          'Aprobaciones',
          'Revision Cumplimiento',
          'Enviado a cumplimiento por Jefatura',
          'none'
        );
        break;

      case 'paso4':
        Swal.fire({
          allowOutsideClick: false,
          title: '¿Desea Aprobar?',
          html: `<br>
      Ingrese comentario: <br>
      <textarea id="comentarioaprobacion" class="swal2-textarea"></textarea>
    `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Si, Aprobar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const motivoDevolucionInput = document.getElementById(
              'comentarioaprobacion'
            ) as HTMLTextAreaElement;
            const motivoDevolucion = motivoDevolucionInput.value;
            if (!motivoDevolucion) {
              Swal.showValidationMessage(`Ingrese comentario`);
            }
            return motivoDevolucion;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const motivoDevolucion = result.value;

            if (!motivoDevolucion) {
              Swal.showValidationMessage(`Ingrese comentario`);
            } else {
              this.EnviarBD(
                'Cumplimiento',
                'Revision Contabilidad',
                'Aprobado por cumplimiento',

                motivoDevolucion
              );
            }
          }
        });

        break;

      case 'paso5':
        Swal.fire({
          allowOutsideClick: false,
          title: '¿Desea Aprobar?',
          html: `<br>
      Ingrese comentario: <br>
      <textarea id="comentarioaprobacion" class="swal2-textarea"></textarea>
    `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Si, Aprobar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const motivoDevolucionInput = document.getElementById(
              'comentarioaprobacion'
            ) as HTMLTextAreaElement;
            const motivoDevolucion = motivoDevolucionInput.value;
            if (!motivoDevolucion) {
              Swal.showValidationMessage(`Ingrese comentario`);
            }
            return motivoDevolucion;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const motivoDevolucion = result.value;

            if (!motivoDevolucion) {
              Swal.showValidationMessage(`Ingrese comentario`);
            } else {
              this.EnviarBD(
                'Revision Contabilidad',
                'Validacion ADV',
                'Aprobado por contabilidad',
                motivoDevolucion
              );
            }
          }
        });

        break;
      default:
        console.log('no action');
        break;
    }
  }
  Devolver(paso: any) {
    var titulo;
    titulo = '¿Desea devolver?';
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
        const motivoDevolucionInput = document.getElementById(
          'motivodevolucionps1'
        ) as HTMLTextAreaElement;
        const motivoDevolucion = motivoDevolucionInput.value;
        if (!motivoDevolucion) {
          Swal.showValidationMessage(`Ingrese el motivo`);
        }
        return motivoDevolucion;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const motivoDevolucion = result.value;

        if (!motivoDevolucion) {
          Swal.showValidationMessage(`Ingrese el motivo`);
        } else {
          switch (paso) {
            case 'paso2':
              this.EnviarBD(
                'Revision ADV',
                'Registrado',
                'Devuelto al asesor por ADV',
                motivoDevolucion
              );
              break;
            case 'paso3':
              this.EnviarBD(
                'Revision ADV',
                'Registrado',
                'Devuelto al asesor por jefatura',
                motivoDevolucion
              );/*
              this.EnviarBD(
                'Aprobaciones',
                'Revision ADV',
                'Devuelto a ADV por jefatura',
                motivoDevolucion
              );*/
              break;
            case 'paso4':
              
            this.EnviarBD(
              'Revision ADV',
              'Registrado',
              'Devuelto al asesor por cumplimiento',
              motivoDevolucion
            );
              /*
              this.EnviarBD(
                'Cumplimiento',
                'Revision ADV',
                'Devuelto a ADV por cumplimiento',
                motivoDevolucion
              );*/
              break;
            case 'paso5':
              this.EnviarBD(
                'Revision Contabilidad',
                'Revision ADV',
                'Devuelto a ADV por contabilidad',
                motivoDevolucion
              );
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
    titulo = '¿Desea Rechazar?';

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
        const motivoDevolucionInput = document.getElementById(
          'motivodevolucionps1'
        ) as HTMLTextAreaElement;
        const motivoDevolucion = motivoDevolucionInput.value;
        if (!motivoDevolucion) {
          Swal.showValidationMessage(`Ingrese el motivo`);
        }
        return motivoDevolucion;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const motivoDevolucion = result.value;

        if (!motivoDevolucion) {
          Swal.showValidationMessage(`Ingrese el motivo`);
        } else {
          switch (paso) {
            case 'paso3':
              this.EnviarBD(
                'Aprobaciones',
                'Rechazado Jefatura',
                'Rechazado por jefatura',
                motivoDevolucion
              );
              break;
            case 'paso4':
              this.EnviarBD(
                'Cumplimiento',
                'Rechazado Cumplimiento',
                'Rechazado por cumplimiento',
                motivoDevolucion
              );
              break;
            case 'paso5':
              this.EnviarBD(
                'Revision Contabilidad',
                'Rechazado Contabilidad',
                'Rechazado por Contabilidad',
                motivoDevolucion
              );
              break;
            default:
              console.log('no action');
              break;
          }
        }
      }
    });
  }

  confirmacionOK() {
    Swal.fire({
      title: 'Mensaje',
      text: 'Operacion realizada correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.volver();
      }
    });
  }
  EnviarBD(paso, estado, subestado, motivo) {
    this.spinner.show();
    var idUsuario = localStorage.getItem('ByUser');
    var parametros =
      '&paso=' +
      paso +
      '&estado=' +
      estado +
      '&subestado=' +
      subestado +
      '&motivo=' +
      motivo;
    this.http
      .put<IApiResponse>(
        this.urlBase +
          'SolicitudCartaCruzada?usuario=' +
          idUsuario +
          '&id=' +
          this.user.id +
          parametros,
        {}
      )
      .subscribe({
        next: (data) => {
          if (data.status == 200) {
            /*
      this.toaster.open({
        text: "Operacion realizada correctamente ",
        caption: 'Mensaje',
        type: 'success',
        position:'top-right'
      }); */

            this.confirmacionOK();
            this.spinner.hide();
            this.paso1Enviar = false;
          } else {
            this.spinner.hide();
            this.toaster.open({
              text: 'Ocurrio un error',
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
              //duration: 4000
            });
          }
        },
        error: (error) => {
          this.spinner.hide();
          var errorMessage = error.message;
          console.error('There was an error!', error);
          this.toaster.open({
            text: errorMessage,
            caption: 'Ocurrio un error' + error,
            type: 'danger',
            // duration: 994000
          });
        },
      });
  }
  cambiarMostrarGerencia() {
    if (this._mostrarGerencia == true) {
      this._SGeneralService
        .validaParametro(this.user.importe, this.user.moneda)
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
    this._mostrarADV = false;
   /* if (this.activeStepIndex < 4) {
      const historialFiltrado = this.solicitudHistorial.filter(
        (item) => item.estadoSolicitud === 'Validacion ADV'
      );
      if (historialFiltrado.length > 0) {
        this._mostrarADV = true;
        return true;
      } else {
        if (this.EstadoSolicitud == 'Asesor') {
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
    }*/
  }
  volver() {
    this._location.back();
  }
  itemsolicitud!: Solicitud2;
  ngOnInit(): void {
    this.getuser();
    this.setState(this.valid1, true);
    setTimeout(() => {
      if (this.itemsolicitud) {
        const dateString = this.itemsolicitud.fechSolicitud;
        const parts = dateString.split('/'); // Dividir la cadena en partes
        const formattedDate = `${parts[1]}/${parts[0]}/${parts[2]}`; // Reordenar los componentes de la fecha

        const date = new Date(formattedDate);
        var fechFormat = date;
        var itemssolis = {
          id: this.itemsolicitud.id,
          comprobanteOrigen: this.itemsolicitud.comprobanteOrigen,
          nrosap: this.itemsolicitud.nroSap,
          clienterazonsocial: this.itemsolicitud.clienteRazonSocial,
          dniclienteruc: this.itemsolicitud.dniClienteRuc,
          fechsolicitud: fechFormat, //fechaFosrmateada,//this.itemsolicitud.fechSolicitud,
          importe: this.itemsolicitud.importe,
          moneda: this.itemsolicitud.moneda,
          unidadnegocio: this.itemsolicitud.unidadNegocio,
          tienda: this.itemsolicitud.tienda,
          centrocosto: this.itemsolicitud.centroCosto,
          comentario: this.itemsolicitud.comentario,
          tipo: this.itemsolicitud.tipo,

          //carta cruzada
          tipoCarta: this.itemsolicitud.tipoCarta,
          dniclienteRealiza: this.itemsolicitud.dniclienteRealiza,
          clienteRaliza: this.itemsolicitud.clienteRealiza,
          vinculo: this.itemsolicitud.vinculo,
          banco: this.itemsolicitud.banco,
          formaPago: this.itemsolicitud.formaPago,
          numOperacion: this.itemsolicitud.numOperacion,
          solicitante: this.itemsolicitud.solicitante,
          comentarioContabilidad : this.itemsolicitud.comentarioContabilidad,
          mRechazoMDevolucion:this.itemsolicitud.mRechazoMDevolucion,
        };
        this.user = JSON.parse(JSON.stringify(itemssolis));
        this.mRechazoMDevolucion=this.itemsolicitud.mRechazoMDevolucion;

        
        var _usuario: Usuario[] = [];
        if(this.itemsolicitud.asesorAsignado!=null){
          this.requestService.getusuarios().subscribe(
            (response: IUsersResponse) => {
              this.spinner.hide();
              _usuario = response;      
                  const usuarioEncontrado = _usuario.find(usuario => usuario.id.toString() === this.itemsolicitud.asesorAsignado.toString());
                  if (usuarioEncontrado) {
                  this.AsesorSelected=usuarioEncontrado;    
                  this.AsesorSelectedId = usuarioEncontrado.id;
                  } 
            },
            () => {
              this.spinner.hide();
            }
          );
        } 
      }
    }, 5);
  }
  AsesorSelectedId: number | null = null;
  onChangeAsesor(event: any) {
    const usuarioEncontrado = this.usuario.find(usuario => usuario.id.toString() === this.AsesorSelectedId.toString());  
    if (usuarioEncontrado) {
      this.AsesorSelected=usuarioEncontrado;         
        this.AsesorSelectedId = usuarioEncontrado.id;
    } 
  }
  EnvioTesoreria() {
    const formData: FormData = new FormData();
    formData.append('id', this.itemsolicitud.id.toString());
    formData.append('numero',  this.nroNotaCredito);
    formData.append('estado', 'Revision Tesoreria-Cumplimiento');
    formData.append('archivo', null);// this.archivoNotaCredito);
    formData.append('archivoporaplicar', null);
    formData.append('finalizaadv', "");
    var idUsuario = localStorage.getItem('ByUser');
    formData.append('ussercreacion', idUsuario); 
    this.spinner.show();
    this.http
      .put<IApiResponse>(this.urlBase + 'SolicitudArchivo', formData)
      .subscribe({
        next: (data) => {
          if (data.status == 200) {
            /*
        this.toaster.open({
          text: "Nota de credido guardado correctamente ",
          caption: 'Mensaje',
          type: 'success',
          position:'top-right'
        }); */
            this.confirmacionOK();
            this.spinner.hide();
            this.paso1Enviar = false;
          } else {
            this.spinner.hide();
            this.toaster.open({
              text: 'Ocurrio un error',
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
              //duration: 4000
            });
          }
        },
        error: (error) => {
          this.spinner.hide();
          var errorMessage = error.message;
          console.error('There was an error!', error);
          this.toaster.open({
            text: errorMessage,
            caption: 'Ocurrio un error' + error,
            type: 'danger',
            // duration: 994000
          });
        },
      });
  }
  ObservarTesoreria() {
    Swal.fire({
      allowOutsideClick: false,
      title: '¿Desea Observar?',
      html: `<br>
      Ingrese motivo de la observacion: <br>
      <textarea id="motivodevolucionps1" class="swal2-textarea"></textarea>
    `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, Observar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const motivoDevolucionInput = document.getElementById(
          'motivodevolucionps1'
        ) as HTMLTextAreaElement;
        const motivoDevolucion = motivoDevolucionInput.value;
        if (!motivoDevolucion) {
          Swal.showValidationMessage(`Ingrese el motivo`);
        }
        return motivoDevolucion;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const motivoDevolucion = result.value;

        if (!motivoDevolucion) {
          Swal.showValidationMessage(`Ingrese el motivo`);
        } else {
          var idUsuario = localStorage.getItem('ByUser');
          this.http
            .put<IApiResponse>(
              this.urlBase +
                'SolicitudTesoreria?id=' +
                this.itemsolicitud.id +
                '&motivo=' +
                motivoDevolucion +
                '&usuario=' +
                idUsuario,
              {}
            )
            .subscribe({
              next: (data) => {
                if (data.status == 200) {
                  /*
            this.toaster.open({
              text: "La solicitud fue enviado como observado",
              caption: 'Mensaje',
              type: 'success',
              position:'top-right'
            }); */
                  this.confirmacionOK();
                  this.spinner.hide();
                } else {
                  this.spinner.hide();
                  this.toaster.open({
                    text: 'Ocurrio un error',
                    caption: 'Mensaje',
                    type: 'warning',
                    position: 'bottom-right',
                    //duration: 4000
                  });
                }
              },
              error: (error) => {
                this.spinner.hide();
                var errorMessage = error.message;
                console.error('There was an error!', error);
                this.toaster.open({
                  text: errorMessage,
                  caption: 'Ocurrio un error' + error,
                  type: 'danger',
                  // duration: 994000
                });
              },
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

    formData.append('fecha', fechFormat);
    formData.append('nrosap', this.numSap);
    formData.append('estado', 'Aplicado Tesoreria');
    formData.append('archivo', this.archivoTesoreria);
    var idUsuario = localStorage.getItem('ByUser');
    formData.append('ussercreacion', idUsuario);

    this.spinner.show();
    this.http
      .post<IApiResponse>(this.urlBase + 'SolicitudTesoreria', formData)
      .subscribe({
        next: (data) => {
          if (data.status == 200) {
            /*
        this.toaster.open({
          text: "Solicitud aplicada correctamente",
          caption: 'Mensaje',
          type: 'success',
          position:'top-right'
        }); */
            this.confirmacionOK();
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toaster.open({
              text: 'Ocurrio un error',
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
              //duration: 4000
            });
          }
        },
        error: (error) => {
          this.spinner.hide();
          var errorMessage = error.message;
          console.error('There was an error!', error);
          this.toaster.open({
            text: errorMessage,
            caption: 'Ocurrio un error' + error,
            type: 'danger',
            // duration: 994000
          });
        },
      });
  }

  //VISIBLE BUTTONS
  getHistorialByStatus(estado: string) {
    return this._SGeneralService.verHistorialPorEstado(
      estado,
      this.solicitudHistorial,
      this.itemsolicitud
    );
  }
  async getNotaCredito() {
    try {
      var valornotacredito = await this._SGeneralService.buscarapinotaCredito(
        this.itemsolicitud
      );
      this.nroNotaCredito = valornotacredito;
    } catch (error) {
      console.error('Error al obtener la nota de crédito:', error);
    }
  }

  descargararchivo(nombre: string) {
    this._SGeneralService.descargararchivo(nombre);
  }

  convertBlobToPdf(blob: Blob): Blob {
    return new Blob([blob], { type: 'application/pdf' });
  }
  verarchivo(nombrearchivo: string) {
    this.spinner.show();
    const formData = new FormData();
    formData.append('nombre', nombrearchivo);
    this.http
      .post(this.urlBase + 'SolicitudArchivo', formData, {
        responseType: 'blob',
      })
      .subscribe((blob: Blob) => {
        this.spinner.hide();
        const texto = nombrearchivo;
        const ultimosCuatro = texto.slice(-4);
        if (ultimosCuatro.toUpperCase() == '.PDF') {
          const pdfData = this.convertBlobToPdf(blob);
          const pdfUrl = URL.createObjectURL(pdfData);
          window.open(pdfUrl, '_blank');
        } else {
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
  valid1 = new FormControl('');
  setState(control: FormControl, state: boolean) {
    if (state) {
      control.setErrors({ required: true });
    } else {
      control.reset();
    }
  }
  //VISIBLE BUTTONS
  AccionVisible = false;
  validateRol(estadoSolic: string) {
    var rolUser = localStorage.getItem('RolUser');
    var idUser = localStorage.getItem('ByUser');

    var btnvisible = this._SGeneralService.validationRol(
      estadoSolic,
      this.itemsolicitud,
      rolUser,
      idUser
    );
    this.AccionVisible = btnvisible;
  }
   
  AsesorSelected: Usuario; //string="Todos";
  searchControl = new FormControl('');
  get filteredUsuarios() {
    const searchTerm = this.searchControl.value.toLowerCase();
    return this.usuario.filter((item) =>
      item.nombre.toLowerCase().includes(searchTerm)
    );
  }
    
  usuario: Usuario[] = [];
  getuser() {
    this.spinner.show();
    this.requestService.getusuarios().subscribe(
      (response: IUsersResponse) => {
        this.spinner.hide();
        this.usuario = response;
     
      },
      () => {
        this.spinner.hide();
      }
    );
  }
}
