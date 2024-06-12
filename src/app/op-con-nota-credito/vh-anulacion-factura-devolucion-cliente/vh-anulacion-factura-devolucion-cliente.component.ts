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

import { Location } from '@angular/common';
import { IComprobante } from '../vh-anulacion-nuevocomprobante/comprobante.model';
import { SolicitudGeneralService } from 'src/app/solicitud-general.service';
import { HistorialSolicitud } from 'src/app/historial-solicitud/historialsolicitud.model';
import { ModalUnidadComponent } from '../modal-unidad/modal-unidad.component';
import { MatDialog } from '@angular/material/dialog';
import { ListasModel } from 'src/app/parametros/parametros.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from 'src/app/usuarios/users.model';
import { IUsersResponse } from 'src/app/services/user.model';
import { RequestService } from 'src/app/services/request.service';
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
  selector: 'app-vh-anulacion-factura-devolucion-cliente',
  templateUrl: './vh-anulacion-factura-devolucion-cliente.component.html',
  styleUrls: ['./vh-anulacion-factura-devolucion-cliente.component.css']
})
export class VhAnulacioFacturanDevolucionClienteComponent implements OnInit {

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


  isEditable = false;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  parentData = 'Datos desde el componente padre';
  displayedColumns: string[] = ['texto', 'archivo', 'acciones'];
  user!: IComprobante;// IProveedor;
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
    if (this.user.importe !== undefined && this.user.importe !== "" && this.user.moneda !== "") {
      this.cambiarMostrarGerencia();
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
    private _SGeneralService: SolicitudGeneralService //solicutd general
    , private dialog: MatDialog, private _formBuilder: FormBuilder,
    private requestService: RequestService
    ) {
    this.urlBase = `${environment.baseUrl}/api/`;
    this.mostrarGerencia();
    this.mostrarCumplimiento();//agregado
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
        comentarioContabilidad : this.itemsolicitud.comentarioContabilidad,
        mRechazoMDevolucion:this.itemsolicitud.mRechazoMDevolucion,
      };
      this.user = JSON.parse(JSON.stringify(itemssolis));

      var adjuntosBd = [];
      this.itemsolicitud.adjuntos.forEach(elem => {
        adjuntosBd.push({ id: elem.idadjunto, texto: elem.nombre, archivo: null, nombrearchivo: elem.nombrearchivo, tipo: 'BD' })
      });
      this.filasDatasaved = adjuntosBd;
      this.filasData = adjuntosBd;
      var estadoSolicitud = this.itemsolicitud.estadoSolicitud; 
      this.mRechazoMDevolucion=this.itemsolicitud.mRechazoMDevolucion;
      var subestado=this.itemsolicitud.subEstadoSolicitud; 
      if(subestado=="Devuelto a ADV por contabilidad"){
      this.TituloContabilidad="Devuelto por contabilidad";
      }else if(subestado=="Rechazado por Contabilidad"){
        this.TituloContabilidad="Rechazado por contabilidad";
      }else{        
        this.TituloContabilidad="Aprobado por Contabilidad";
      }
      this.EstadoSolicitud = estadoSolicitud;

      this.nroNotaCredito = this.itemsolicitud.numNotaCredito;
      this.nombrearchivoNotaCredito = this.itemsolicitud.archivoNotaCredito;
      // this.fechaAplicacion= new Date(this.itemsolicitud.fechaAplicacion);

      this.fechaAplicacion = (this.itemsolicitud.fechaAplicacion != null && this.itemsolicitud.fechaAplicacion != undefined && this.itemsolicitud.fechaAplicacion != '') ? new Date(this.itemsolicitud.fechaAplicacion) : new Date();
      this.numSap = this.itemsolicitud.nroSapTesoreria;
      //this.archivoTesoreria=this.itemsolicitud.estadoSolicitud;
      this.mostrarADV();
      if (this.itemsolicitud.historial.length > 0) {
        this._mostrarADV = true;
      }
      switch (estadoSolicitud) {
        case 'Registrado':
          this.EditFormula = false;
          this.paso1Enviar = false;
          this.paso1registrar = false;
          this.paso1Enviar = true;
          this.paso1registrar = false;
          this.activeStepIndex = 0;
          this.AccionVisible = true;
          break;
        case 'Revision ADV':
          this.EditFormula = false;
          this.paso1Enviar = false;
          this.paso1registrar = false;
          this.activeStepIndex = 1;
          break;
        case 'Validacion ADV':
          this.EditAtribFinales = false;
          // this.EditFormula = false;
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
        case 'Revision Cumplimiento':
          if (this._mostrarADV == false) {
            this.activeStepIndex = 2;
          } else {
            this.activeStepIndex = 3;
          }
          break;
        case 'Revision Gerencia':
          if (this._mostrarADV == false) {
            this.activeStepIndex = 3;
          } else {
            this.activeStepIndex = 4;
          }
          break;
        case 'Revision Contabilidad':
          //this.activeStepIndex = 3;
          if (this._mostrarADV == false) {
            this.activeStepIndex = 4;
          } else {
            this.activeStepIndex = 5;
          }
          break;
        case 'Revision Tesoreria':
          this.EditAtribFinales = true;
          this.inputsTesoreria = false;
          this.activeStepIndex = 6;
          break;
        //ESTADOS DE FINALIZACION
        case 'Rechazado Jefatura':
          //this.activeStepIndex = 2;
          if (this._mostrarADV == false) {
            this.activeStepIndex = 1;
          } else {
            this.activeStepIndex = 2;
          }
          break;
        case 'Rechazado Cumplimiento':
          if (this._mostrarADV == false) {
            this.activeStepIndex = 2;
          } else {
            this.activeStepIndex = 3;
          }
          break;
        case 'Rechazado Gerencia':
          if (this._mostrarADV == false) {
            this.activeStepIndex = 3;
          } else {
            this.activeStepIndex = 4;
          }
          break;
        case 'Rechazado Contabilidad':
          if (this._mostrarADV == false) {
            this.activeStepIndex = 4;
          } else {
            this.activeStepIndex = 5;
          }
          break;
        case 'Aplicado Tesoreria':
          this.EditAtribFinales = true;
          this.activeStepIndex = 6;
          break;
        case 'Observado Tesoreria':
          this.EditAtribFinales = true;
          this.activeStepIndex = 6;
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
      if (this.user.importe !== undefined && this.user.importe !== "" && this.user.moneda !== "") {
        this.cambiarMostrarGerencia();
      }
    } else {
      this.EditFormula = false;
      this.user = {};
      this.filasData = this._SGeneralService.documentosPorUnidad();
      this.validateRol("IniciarSolicitud");

    }



  }

  getList(tabla: string): Observable<ListasModel[]> {
    return this.http
      .get(this.urlBase + 'listas?table=' + tabla)
      .pipe<ListasModel[]>(map((data: any) => data));
  }

  listsBanco: ListasModel[];
  listsFormaPago: ListasModel[];

  listar() {
    this.spinner.show();
    this.getList('Banco').subscribe((res: any) => {
      this.listsBanco = res;
    });

    this.getList('FormaPago').subscribe((res: any) => {
      this.listsFormaPago = res;
    });
    this.spinner.hide();
  }

  cambiarMostrarGerencia() {
    if (this._mostrarGerencia == true) {
      this._SGeneralService.validaParametro(this.user.importe, this.user.moneda)
        .then((results: boolean) => {
          this._Gerencia = results;
          //this._mostrarGerencia = results;
        })
        .catch((error) => {
          // Maneja el error si es necesario
        });
    }
  }

  _mostrarCumplimiento = false;
  _mostrarGerencia = false;
  _Gerencia = false;

  mostrarGerencia() {
    var result = this._SGeneralService.visibleGerencia();
    this._mostrarGerencia = result;
    this._Gerencia = result;
    return this._mostrarGerencia;
  }
  mostrarCumplimiento(){
    var result=this._SGeneralService.visibleCumplimiento();
    this._mostrarCumplimiento = result; 
    return this._mostrarCumplimiento;
  }

  _mostrarADV = false;
  _mostrarADVasesor=false;
  mostrarAsesor(){ 
    var result = this._SGeneralService.visibleADVComboAsesor();
    this._mostrarADVasesor = result; 
  }
  mostrarADV() {
     
    if (this.activeStepIndex < 5) {
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
    this.listar();
    this.getuser();
    this.setState(this.valid1, true)
    setTimeout(() => {

      if (this.itemsolicitud) {

        // Establece el segundo paso como activo

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
          formaPago: this.itemsolicitud.formaPago,
          entidadBancaria: this.itemsolicitud.entidadBancaria,
          numeroCuentaBancaria: this.itemsolicitud.numeroCuentaBancaria,
          cciCuentaBancaria:this.itemsolicitud.cciCuentaBancaria,
          comentarioContabilidad : this.itemsolicitud.comentarioContabilidad,
          mRechazoMDevolucion:this.itemsolicitud.mRechazoMDevolucion,
        };
        this.user = JSON.parse(JSON.stringify(itemssolis));
        this.mRechazoMDevolucion=this.itemsolicitud.mRechazoMDevolucion; 

        var estadoSolicitud = this.itemsolicitud.estadoSolicitud;
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
        //asesor
        
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
      } else {
        this.validateRol("IniciarSolicitud");
      }
    },
      5);

      this.mostrarAsesor();
  }
  //#region

  RegistrarSolicitud(): void {
    if (this.user.nrosap == "" || this.user.nrosap == undefined || this.user.nrosap == undefined || this.user.nrosap == null ||
      this.user.clienterazonsocial == "" || this.user.clienterazonsocial == undefined || this.user.clienterazonsocial == undefined || this.user.clienterazonsocial == null ||
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

  AsesorSelectedId: number | null = null;
  onChangeAsesor(event: any) {
    const usuarioEncontrado = this.usuario.find(usuario => usuario.id.toString() === this.AsesorSelectedId.toString());  
    if (usuarioEncontrado) {
      this.AsesorSelected=usuarioEncontrado;         
        this.AsesorSelectedId = usuarioEncontrado.id;
    } 
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
  ProcederRegistro() {

    if(!this._mostrarADV){
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
    }
    this.spinner.show();
    this._SGeneralService.RegistrarSolicitudBDGeneral(
      this.unidadSeleccionada, 
      this.user, 
      this.EstadoSolicitud, 
      this.filasData, "13"
    ,this.AsesorSelected?.id.toString())
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
      case 'paso1':
        if (this._mostrarADV == false) {
          this.EnviarBD("Registrado", "Aprobaciones", "Enviado a aprobacion por ADV", 'none');
        } else {
          this.EnviarBD("Revision ADV", "Revision ADV", "Enviado a ADV", 'none');
        }
        break;
      case 'paso2':
        this.EnviarBD("Revision ADV", "Aprobaciones", "Enviado a aprobacion por ADV", 'none');
        break;
      case 'paso3':

      if(this._mostrarCumplimiento==false){ //pasar por cumplimiento

        this.EnviarBD("Aprobaciones", "Revision Cumplimiento", "Enviado a cumplimiento por Jefatura", 'none');
        
      }else{
            if (this._mostrarGerencia == true) {
              if (this._Gerencia == true) {
                this.EnviarBD("Aprobaciones", "Revision Gerencia", "Enviado a cumplimiento por Jefatura", 'none');
              } else {
                this.EnviarBD("Aprobaciones", "Revision Contabilidad", "Enviado a contabilidad por Jefatura", 'none');
              }
            } else {
              this.EnviarBD("Aprobaciones", "Revision Contabilidad", "Enviado a contabilidad por Jefatura", 'none');
            //ANTES  this.EnviarBD("Aprobaciones", "Revision Cumplimiento", "Enviado a cumplimiento por Jefatura", 'none');
            }
      }

        //this.EnviarBD(paso,"Revision Contabilidad","Enviado a contabilidad por Jefatura",'none');
        break;
      case 'paso4':
        //this.EnviarBD(paso,"Revision Contabilidad","Enviado a contabilidad por Jefatura",'none');

        Swal.fire({
          allowOutsideClick: false,
          title: "¿Desea Aprobar?",
          html: `<br>
      Ingrese comentario: <br>
      <textarea id="comentarioaprobacion" class="swal2-textarea"></textarea>
    `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Si, Aprobar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const motivoDevolucionInput = document.getElementById('comentarioaprobacion') as HTMLTextAreaElement;
            const motivoDevolucion = motivoDevolucionInput.value;
            if (!motivoDevolucion) {
              Swal.showValidationMessage(`Ingrese comentario`);
            }
            return motivoDevolucion;
          }
        })
          .then((result) => {
            if (result.isConfirmed) {
              const motivoDevolucion = result.value;

              if (!motivoDevolucion) {
                Swal.showValidationMessage(`Ingrese comentario`);
              } else {
                if(this._mostrarGerencia == true){
                  if (this._Gerencia == true) {
                    this.EnviarBD("Cumplimiento", "Revision Gerencia", "Enviado a cumplimiento por Jefatura", 'none');
                  } else {                    
                  //this.EnviarBD("Cumplimiento", "Revision Gerencia", "Aprobado por cumplimiento", motivoDevolucion);                  
                  this.EnviarBD("Cumplimiento", "Revision Contabilidad", "Aprobado por cumplimiento", motivoDevolucion);
                  }

                } else {
                  this.EnviarBD("Cumplimiento", "Revision Contabilidad", "Aprobado por cumplimiento", motivoDevolucion);
                }
              }
            }
          });


        break;
      case 'paso5':
        Swal.fire({
          allowOutsideClick: false,
          title: "¿Desea Aprobar?",
          html: `<br>
      Ingrese comentario: <br>
      <textarea id="comentarioaprobacion" class="swal2-textarea"></textarea>
    `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Si, Aprobar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const motivoDevolucionInput = document.getElementById('comentarioaprobacion') as HTMLTextAreaElement;
            const motivoDevolucion = motivoDevolucionInput.value;
            if (!motivoDevolucion) {
              Swal.showValidationMessage(`Ingrese comentario`);
            }
            return motivoDevolucion;
          }
        })
          .then((result) => {
            if (result.isConfirmed) {
              const motivoDevolucion = result.value;
              if (!motivoDevolucion) {
                Swal.showValidationMessage(`Ingrese comentario`);
              } else {
                this.EnviarBD("Revision Gerencia", "Revision Contabilidad", "Aprobado por gerencia", motivoDevolucion);
              }
            }
          });

        break;
      case 'paso6':
        Swal.fire({
          allowOutsideClick: false,
          title: "¿Desea Aprobar?",
          html: `<br>
      Ingrese comentario: <br>
      <textarea id="comentarioaprobacion" class="swal2-textarea"></textarea>
    `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Si, Aprobar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const motivoDevolucionInput = document.getElementById('comentarioaprobacion') as HTMLTextAreaElement;
            const motivoDevolucion = motivoDevolucionInput.value;
            if (!motivoDevolucion) {
              Swal.showValidationMessage(`Ingrese comentario`);
            }
            return motivoDevolucion;
          }
        })
          .then((result) => {
            if (result.isConfirmed) {
              const motivoDevolucion = result.value;
              if (!motivoDevolucion) {
                Swal.showValidationMessage(`Ingrese comentario`);
              } else {
                this.EnviarBD("Revision Contabilidad", "Validacion ADV", "Aprobado por contabilidad", motivoDevolucion);
              }
            }
          });

        break;
      default:
        console.log('no action');
        break;
    }
  }

  Devolver(paso: any){
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
                if (this._mostrarADV == false) {
                  this.EnviarBD("Aprobaciones", "Registrado", "Devuelto a ADV por jefatura", motivoDevolucion);
                } else {
                  this.EnviarBD("Aprobaciones", "Revision ADV", "Devuelto a ADV por jefatura", motivoDevolucion);
                }
                break;
              case 'paso4':
                if (this._mostrarADV == false) {
                  this.EnviarBD("Cumplimiento", "Registrado", "Devuelto a ADV por cumplimiento", motivoDevolucion);
                } else {
                  this.EnviarBD("Cumplimiento", "Revision ADV", "Devuelto a ADV por cumplimiento", motivoDevolucion);
                }
                break;
              case 'paso5':
                if (this._mostrarADV == false) {
                  this.EnviarBD("Revision Gerencia", "Registrado", "Devuelto a ADV por gerencia", motivoDevolucion);
                } else {
                  this.EnviarBD("Revision Gerencia", "Revision ADV", "Devuelto a ADV por gerencia", motivoDevolucion);
                }
                break;
              case 'paso6':
                if (this._mostrarADV == false) {
                  this.EnviarBD("Revision Contabilidad", "Registrado", "Devuelto a ADV por contabilidad", motivoDevolucion,motivoDevolucion);
                } else {
                  this.EnviarBD("Revision Contabilidad", "Revision ADV", "Devuelto a ADV por contabilidad", motivoDevolucion,motivoDevolucion);
                }
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
              case 'paso3':
                this.EnviarBD("Aprobaciones", "Rechazado Jefatura", "Rechazado por jefatura", motivoDevolucion);
                break;
              case 'paso4':
                this.EnviarBD("Cumplimiento", "Rechazado Cumplimiento", "Rechazado por cumplimiento", motivoDevolucion);
                break;
              case 'paso5':
                this.EnviarBD("Revision Gerencia", "Rechazado Gerencia", "Rechazado por Gerencia", motivoDevolucion);
                break;
              case 'paso6':
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
  confirmacionOK() {
    Swal.fire({
      title: 'Mensaje',
      text: 'Operacion realizada correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.volver();
      }
    });
  }

  EnviarBD(paso, estado, subestado, motivo,motivorechazodevolucion?:string){
    this.spinner.show();
    this._SGeneralService.EnviarBDGeneral(this.user, paso, estado, subestado, motivo,motivorechazodevolucion)
      .subscribe({
        next: data => {
          if (data.status == 200) {
            this.confirmacionOK();
            this.paso1Enviar = false;
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toaster.open({
              text: "Ocurrio un error",
              caption: 'Mensaje',
              type: 'warning',
              position: 'bottom-right',
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
          });
        }
      });
  }

  EnvioTesoreria() {


    this.spinner.show();
    this._SGeneralService.EnvioTesoreriaGeneral(this.itemsolicitud, this.nroNotaCredito, this.archivoNotaCredito)
      .subscribe({
        next: data => {
          if (data.status == 200) {
            /*let artcl: IApiResponse = JSON.parse(JSON.stringify(data));
            this.user.id=artcl.json;
            this.toaster.open({  text: "Nota de credido guardado correctamente",
                                caption: 'Mensaje',
                                type: 'success',
                                position:'top-right'
                                });  */
            this.confirmacionOK();
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
            caption: 'Ocurrio un error',
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



            this.spinner.show();
            this._SGeneralService.ObservarTesoreriaGeneral(this.itemsolicitud, motivoDevolucion)
              .subscribe({
                next: data => {
                  if (data.status == 200) {
                    let artcl: IApiResponse = JSON.parse(JSON.stringify(data));
                    this.user.id = artcl.json;
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
                    caption: 'Ocurrio un error',
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
    this.spinner.show();
    this._SGeneralService.AplicarTesoreriaGeneral(
      this.itemsolicitud, this.fechaAplicacion.toString(), this.numSap, this.archivoTesoreria)
      .subscribe({
        next: data => {
          this.spinner.hide();
          if (data.status == 200) {
            /*
            let artcl: IApiResponse = JSON.parse(JSON.stringify(data));
            this.user.id=artcl.json;
            this.toaster.open({  text: "Datos guadados correctamente",
                                caption: 'Mensaje',
                                type: 'success',
                                position:'top-right'
                                });
                                */
            this.confirmacionOK();
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

  //#endregion
  //VISIBLE BUTTONS
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

  descargararchivo(nombre: string) {
    this._SGeneralService.descargararchivo(nombre);
  }

  convertBlobToPdf(blob: Blob): Blob {
    return new Blob([blob], { type: 'application/pdf' });
  }

  verarchivo(nombrearchivo: string) {
    this.spinner.show();
    const formData = new FormData();
    formData.append("nombre", nombrearchivo);
    this.http.post(this.urlBase + 'SolicitudArchivo', formData, { responseType: 'blob' })
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
  validateRol(estadoSolic: string) {
    var rolUser = localStorage.getItem('RolUser');
    var idUser = localStorage.getItem('ByUser');

    var btnvisible = this._SGeneralService.validationRol(estadoSolic, this.itemsolicitud, rolUser, idUser);
    this.AccionVisible = btnvisible;
  }

}

