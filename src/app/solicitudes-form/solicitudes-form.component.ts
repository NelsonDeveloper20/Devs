import {
  ChangeDetectorRef,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertResult,
} from 'sweetalert2';

import { MatDialog } from '@angular/material/dialog';

import { FormBuilder, Validators } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';
import { NavigationEnd, Router } from '@angular/router';
import { ILoginIdRequest } from 'src/app/services/user.model';

import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { MatTableDataSource } from '@angular/material/table';
import { IApiResponse } from 'src/app/services/service.model';
import { DataService } from 'src/app/shared/data.service';
import { filter } from 'rxjs/operators';
import { Solicitud2 } from 'src/app/services/request.model';
import { MatStepper } from '@angular/material/stepper';
import { ModalFormsComponent } from '../op-con-nota-credito/modal-forms/modal-forms.component';
import { AzureAdDemoService } from '../azure-ad-demo.service';

export type IComprobante = {
  id?: string;
  nrosap?: string;
  clienterazonsocial?: string;
  dniclienteruc?: string;
  fechsolicitud?: string;
  importe?: string;
  moneda?: string;
  unidadnegocio?: string;
  tienda?: string;
  centrocosto?: string;
  comentario?: string;
  tipo?: string;
  estadoSolicitud?: string;
  tipodocumento?: string;
  //Carta Cruzada
  tipoCarta?: string;
  vinculo?: string;
  banco?: string;

  dniclienterecibe?: string;
  clienteRecibe?: string;
  solicitante?: string;
  formaPago?: string;
  numOperacion?: string;

  //UEN
  numerodecuentadetraccion?: string;
  padronAlquepertenece?: string;
  correoeletronicoigv?: string;
  anioDecreacion?: string;
  //met pago
  condicionpago?: string;
  montocreditobesco?: string;
  montocreditomiranda?: string;
  fecharegistro?: string;
  fechamodificacion?: string;
  estado?: number;
  contactosusuario?: [];
  cuentabancaria?: [];

  //ADICIONAL NOTAS DE CREDITO
  comprobanteOrigen?: string;

  comentarioContabilidad?: string;
};
export type sapModel = {
  COD_CLIENTE?: String;
  NOMBRE_CLIENTE?: String;
  //TIPO_DOCUMENTO?: String;
  Tipodocumento?: string;
  NRO_DOCUMENTO?: String;
  FECHA_DOC?: String;
  MONEDA?: String;
  UNIDAD_NEGOCIO?: String;
  TIENDA?: String;
  CENTRO_COSTO?: String;
  MONTO_TOTAL?: String;
  IMPUESTO?: String;
  NumAtCard?: string;
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
  selector: 'app-solicitudes-form',
  templateUrl: './solicitudes-form.component.html',
  styleUrls: ['./solicitudes-form.component.css'],
})
export class SolicitudesFormComponent implements OnInit {
  selectedItem: string = ''; // Valor seleccionado inicialmente

  onCheckboxChange(selectedItem: string) {

    console.log(selectedItem);
    this.selectedItem = selectedItem; // Actualiza el valor seleccionado
    this.user.tipo = selectedItem;
    this.sendData();
  }
  tiposD: string[] = [];

  @Input() user: IComprobante;

  disableCampo: boolean = true;
  enabledCampos: boolean = true;

  @Output() dataChanged = new EventEmitter<IComprobante>();

  sendData() {
    if(this.user.comentario == "undefined" || this.user.comentario == undefined){
      this.user.comentario = "";
    }
    this.dataChanged.emit(this.user);
  }
  //user!: IComprobante;// IProveedor;
  message: string = '';
  archivosForm: FormGroup;
  //data que recibo del otro componente listado
  datos: any;
  visublecomentario = false;
  visibletipo = false;
  disabletipo = false;


  visiblecomprobanteOrigen = false;

  firstFormGroup = this._formBuilder.group({
    nroSap: ['', Validators.required],
    clienteRazonSocial: [{ value: '', disabled: this.disableCampo }],
    dniClienteRuc: [{ value: '', disabled: this.disableCampo }],
    fechaSolicitud: [{ value: '', disabled: this.disableCampo }],
    importe: [{ value: '', disabled: this.disableCampo }],
    moneda: [{ value: '', disabled: this.disableCampo }],
    unidadNegocio: [{ value: '', disabled: this.disableCampo }],
    tienda: [{ value: '', disabled: this.disableCampo }],
    centroCosto: [{ value: '', disabled: this.disableCampo }],
    comentario: [''],
    tipo: '',
    //Carta Cruzada
    tipoCarta: [''],
    vinculo: [''],
    banco: [''],
    dniclienterecibe: [''],
    clienteRecibe: [''],
    solicitante: [''],
    formaPago: [''],
    numOperacion: [''],
    //adicional para notas de credito
    comprobanteOrigen: [{ value: '', disabled: this.disableCampo }],
  });
  disabledSearchApi = false;
  private urlBase: string;
  constructor(
    private azureAdDemoService: AzureAdDemoService,
    private toaster: Toaster,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.urlBase = `${environment.baseUrl}/api/`;
  }
  ngOnInit(): void {
    //this.user= {};

    var tipoUnidad = localStorage.getItem('UndNgcio');
    var formActivo = localStorage.getItem('Formactivo');

    const textoconNotaCredito = formActivo.split(' - ')[0];
    if (textoconNotaCredito.trim() == 'OP. CON NOTA DE CREDITO') {
      this.visiblecomprobanteOrigen = true;
    } else {
      this.visiblecomprobanteOrigen = false;
    }

    if (tipoUnidad == 'Vehículos') {
      if (
        formActivo ==
        'OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago'
        ||
        formActivo ==
        'OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'

      ) {
        this.tiposD = ['Devolucion de dinero'];
      } else if (
        formActivo ==
        'OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)'
      ) {
        this.tiposD = ['Aplicacion de documento', 'Devolucion de dinero'];
      } else {
        this.tiposD = ['Aplicacion de documento'];
      }
    }else if (tipoUnidad == 'Motos') {
      if (
        formActivo ==
        'OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago' 
        ||
        formActivo ==
        'OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'

      ) {
        this.tiposD = ['Devolucion de dinero'];
      } else if (
        formActivo ==
        'OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)'
      ) {
        this.tiposD = ['Aplicacion de documento', 'Devolucion de dinero'];
      } else {
        this.tiposD = ['Aplicacion de documento'];
      }
    }  else if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante'
    ) {
      this.tiposD = ['Aplicacion de documento'];
    } else if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago'
    ) {
      this.tiposD = ['Devolucion de dinero'];
    } else if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'
    ) {
      this.tiposD = ['Devolucion de dinero'];
    }  else if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Cambio de datos (boleta por factura, nombre, dirección etc.)'
    ) {
      this.tiposD = ['Aplicacion de documento'];
    } else if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)'
    ) {
      this.tiposD = ['Aplicacion de documento'];
    } else if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Desistimiento de compra (con entrega) (vehículos)'
    ) {
      this.tiposD = ['Devolucion de dinero'];
    } else if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Desistimiento de compra (sin entrega) (vehículos) tipo de NC'
    ) {
      this.tiposD = ['Devolucion de dinero'];
    } else if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Devolución por ítem (para aplicar a nuevo comprobante)'
    ) {
      this.tiposD = ['Aplicacion de documento'];
    } else if (
      formActivo == 'OP. CON NOTA DE CREDITO - Solicitud Por descuento'
    ) {
      this.tiposD = ['Aplicacion de documento'];
    } else if (
      formActivo ==
      'OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)'
    ) {
      this.tiposD = ['Aplicacion de documento', 'Devolucion de dinero'];
    }
    if(this.user.comentario == "undefined" || this.user.comentario == undefined){
      this.user.comentario = "";
    }

    this.dataChanged.emit(this.user);



    if (this.user) {
      var estadosoli = this.user.estadoSolicitud;
      this.firstFormGroup.get('nroSap').disable();
      // this.firstFormGroup.get('comentario').disable();
      // this.firstFormGroup.get('tipo').disable();
      switch (estadosoli) {
        case 'Registrado':
          this.visublecomentario = false;
          this.visibletipo = false;
          this.firstFormGroup.get('nroSap').enable();
          this.firstFormGroup.get('moneda').enable();
          this.firstFormGroup.get('importe').enable();
          this.firstFormGroup.get('nroSap').disable();
          this.firstFormGroup.get('comentario').enable();
          this.firstFormGroup.get('tipo').enable();
          break;
        case 'Revision ADV':
          this.visublecomentario = true;
          this.visibletipo = true;
          this.firstFormGroup.get('moneda').enable();
          this.firstFormGroup.get('importe').enable();
          this.firstFormGroup.get('nroSap').disable();
          this.firstFormGroup.get('comentario').enable();
          this.firstFormGroup.get('tipo').enable();

          this.visublecomentario = true;
          this.visibletipo = true;
          this.disabletipo = false;

          break;
        case 'Validacion ADV':
          //APROBADO POR CONTABILIDAD
          this.visublecomentario = true;
          this.visibletipo = true;
          this.disabletipo = true;

          break;
        case 'Aprobaciones':
          this.visublecomentario = true;
          this.visibletipo = true;
          this.disabletipo = true;
          this.firstFormGroup.get('comentario').disable();

          break;

        case 'Revision Cumplimiento':
          this.visublecomentario = true;
          this.visibletipo = true;
          this.disabletipo = true;
          this.firstFormGroup.get('comentario').disable();

          break;

        case 'Revision Contabilidad':
          this.visublecomentario = true;
          this.visibletipo = true;
          this.disabletipo = true;
          this.firstFormGroup.get('comentario').disable();


          break;
        // case undefined:
        //   this.visublecomentario = false;
        //   this.visibletipo = false;
        //   this.disabletipo = true;

        //   break;
        // case null:
        //   this.visublecomentario = false;
        //   this.visibletipo = false;
        //   this.disabletipo = true;

        //   break;
        // case '':
        //   this.visublecomentario = false;
        //   this.visibletipo = false;
        //   this.disabletipo = true;

        //   break;
        default:
          this.visublecomentario = true;
          this.visibletipo = true;
          this.disabletipo = false;
          this.firstFormGroup.get('moneda').disable();

          break;
      }

      if (estadosoli == undefined) {
        this.firstFormGroup.get('nroSap').enable();
        this.disabledSearchApi = true;
        if (this.visiblecomprobanteOrigen == true) {
          this.firstFormGroup.get('importe').enable();
          this.firstFormGroup.get('moneda').enable();
        }
      } else {
        this.firstFormGroup.get('nroSap').disable();
        this.disabledSearchApi = false;
      }
      this.selectedItem = this.user.tipo;
    } else {
      this.selectedItem = '';
      this.disabledSearchApi = true;
      this.firstFormGroup.get('nroSap').enable();
    }
  }
  listsapModel: sapModel = {};

  openDialog(rowsn: any) {
    const updatedData = rowsn.map((item) => ({ ...item, selected: false }));

    const dialogRef = this.dialog.open(ModalFormsComponent, {
      data: { rows: updatedData, selectedRow: null },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listsapModel = JSON.parse(JSON.stringify(result));
        this.user.dniclienteruc = this.listsapModel.COD_CLIENTE.toString();
        this.user.clienterazonsocial =
          this.listsapModel.NOMBRE_CLIENTE.toString();
        this.user.tipodocumento = this.listsapModel.Tipodocumento.toString();
        this.user.fechsolicitud = this.listsapModel.FECHA_DOC.toString();
        //this.user.importe= Number(this.listsapModel.MONTO_TOTAL.toString()).toFixed(2);
        const montoTotal = Number(this.listsapModel.MONTO_TOTAL);
        const formattedMontoTotal = montoTotal
          .toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          .replace(',', '-')
          .replace('.', ',')
          .replace('-', '.');
        this.user.importe = formattedMontoTotal;
        this.user.moneda = this.listsapModel.MONEDA.toString();
        this.user.centrocosto = this.listsapModel.CENTRO_COSTO.toString();
        this.user.tienda = this.listsapModel.TIENDA.toString();
        this.user.unidadnegocio = this.listsapModel.UNIDAD_NEGOCIO.toString();
        var formActivo = localStorage.getItem('Formactivo');
        const textoconNotaCredito = formActivo.split(' - ')[0];
        if (textoconNotaCredito.trim() == 'OP. CON NOTA DE CREDITO') {
          this.user.comprobanteOrigen = this.listsapModel.NumAtCard.toString();
        } else {
          this.user.comprobanteOrigen = '';
        }
        this.sendData();
      }
    });
  }



  buscarApi() {
    var tipos = '';

    var formActivo = localStorage.getItem('Formactivo');
    if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante'
    ) {
      tipos = 'ANTICIPO';
    } else if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago'
    ) {
      tipos = 'ANTICIPO';
    } else if (
      formActivo ==
      'OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago'
    ) {
      tipos = 'APIVENTA';//ANTICIPO
    } else {
      tipos = 'APIVENTA';
    }

    if (tipos == 'APIVENTA') {
      this.spinner.show(); 
    } else {
      this.spinner.show(); 
    }

    this.sendData();
  }

  getProfile() {
    this.azureAdDemoService.getUserProfile().subscribe((profileInfo) => {
      //this.profile=profileInfo;
      this.user.solicitante = profileInfo.displayName;
    });
  }
  changeInput(event: any) {
    this.sendData();
  }
  changeInputchek(event: any) {
    const value = event.target.checked ? event.target.value : null;
    this.user.tipo = value;
    this.sendData();
  }
}
