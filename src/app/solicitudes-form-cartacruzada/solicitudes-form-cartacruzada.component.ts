import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

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
import { filter, map } from 'rxjs/operators';
import { Solicitud2 } from 'src/app/services/request.model';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormsComponent } from '../op-con-nota-credito/modal-forms/modal-forms.component';
import { AzureAdDemoService } from '../azure-ad-demo.service';
import { Observable } from 'rxjs';
import { ListasModel } from '../parametros/parametros.component';

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

  //Carta Cruzada
  tipoCarta?: string;
  vinculo?: string;
  banco?: string;

  dniclienteRealiza?: string;
  clienteRaliza?: string;
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
};
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
@Component({
  selector: 'app-solicitudes-form-cartacruzada',
  templateUrl: './solicitudes-form-cartacruzada.component.html',
  styleUrls: ['./solicitudes-form-cartacruzada.component.css'],
})
export class SolicitudesFormCartacruzadaComponent implements OnInit {
  selectedItem: string = ''; // Valor seleccionado inicialmente

  onCheckboxChange(selectedItem: string) {
    this.selectedItem = selectedItem; // Actualiza el valor seleccionado
    this.user.tipo = selectedItem;
    this.sendData();
  }

  disableAplication: boolean = false;
  tiposD: string[] = [];
  @Input() user: IComprobante;

  fechsolicitud: Date = new Date(); // Propiedad para almacenar la fecha actual

  disableCampo: boolean = true;
  enabledCampos: boolean = false;

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
  tituloFormulario = localStorage.getItem('Formactivo');
  cartaCruzada = false;
  //data que recibo del otro componente listado
  datos: any;
  visublecomentario = false;
  visibletipo = false;

  visiblecomprobanteOrigen = false;

  firstFormGroup = this._formBuilder.group({
    nroSap: ['', Validators.required],
    fechsolicitud: [{ value: '', disabled: this.enabledCampos }],
    importe: [{ value: '', disabled: this.disableCampo }],
    moneda: [{ value: '', disabled: this.disableCampo }],
    unidadNegocio: [{ value: '', disabled: this.disableCampo }],
    tienda: [{ value: '', disabled: this.disableCampo }],
    centroCosto: [{ value: '', disabled: this.disableCampo }],
    comentario: [{ value: '', disabled: this.disableCampo }],
    tipo: [{ value: '', disabled: this.disableCampo }],
    //Carta Cruzada
    tipoCarta: [{ value: '', disabled: this.enabledCampos }],
    vinculo: [{ value: '', disabled: this.enabledCampos }],
    banco: [{ value: '', disabled: this.enabledCampos }],
    // dniclienteRealiza: [{ value: '', disabled: this.enabledCampos }],
    // clienteRaliza: [{ value: '', disabled: this.enabledCampos }],
    // clienteRazonSocial: [{ value: '', disabled: this.disableCampo }],
    // dniClienteRuc: [{ value: '', disabled: this.disableCampo }],

    dniclienteRealiza: [{ value: '', disabled: this.disableCampo }],
    clienteRaliza: [{ value: '', disabled: this.disableCampo }],
    clienteRazonSocial: [{ value: '', disabled: this.enabledCampos }],
    dniClienteRuc: [{ value: '', disabled: this.enabledCampos }],

    solicitante: [{ value: '', disabled: this.enabledCampos }],
    formaPago: [{ value: '', disabled: this.enabledCampos }],
    numOperacion: [{ value: '', disabled: this.enabledCampos }],
    //adicional para notas de credito
    comprobanteOrigen: [''],
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
    if (
      this.tituloFormulario ==
      'OP. CON NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)'
    ) {
      this.cartaCruzada = true;
    }
  }

  getList(tabla: string): Observable<ListasModel[]> {
    return this.http
      .get(this.urlBase + 'listas?table=' + tabla)
      .pipe<ListasModel[]>(map((data: any) => data));
  }
  listsVinculo: ListasModel[];
  listsBanco: ListasModel[];
  listsFormaPago: ListasModel[];
  listar() {
    this.spinner.show();
    this.getList('Banco').subscribe((res: any) => {
      this.listsBanco = res;
    });

    this.getList('FormaPagoCarta').subscribe((res: any) => {
      this.listsFormaPago = res;
    });
    
    this.getList('Vinculo').subscribe((res: any) => {
      this.listsVinculo = res;
    });
    this.spinner.hide();
  }
  ngOnInit(): void {
    this.listar();
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
    }else   if (tipoUnidad == 'Motos') {
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
    } else if (
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
    } else if (
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

    if (this.user) {
      this.firstFormGroup.get('nroSap').disable();
      var estadosoli = this.user.estadoSolicitud;
      switch (estadosoli) {
        case 'Registrado':
          console.log('-');
          this.visublecomentario = false;
          this.visibletipo = false;
          this.firstFormGroup.get('nroSap').enable();
          break;
        case 'Revision ADV':
          this.visublecomentario = true;
          this.visibletipo = true;

          this.firstFormGroup.get('clienteRazonSocial').disable();
          this.firstFormGroup.get('dniClienteRuc').disable();
          this.firstFormGroup.get('fechsolicitud').disable();

          this.firstFormGroup.get('importe').enable();
          this.firstFormGroup.get('moneda').enable();
          this.firstFormGroup.get('comentario').enable();
          this.firstFormGroup.get('tipo').enable();

          this.firstFormGroup.get('unidadNegocio').disable();
          this.firstFormGroup.get('tienda').disable();
          this.firstFormGroup.get('centroCosto').disable();
          //Carta Cruzada
          this.firstFormGroup.get('tipoCarta').disable();
          this.firstFormGroup.get('vinculo').disable();
          this.firstFormGroup.get('banco').disable();
          this.firstFormGroup.get('dniclienteRealiza').disable();
          this.firstFormGroup.get('clienteRaliza').disable();
          this.firstFormGroup.get('solicitante').disable();
          this.firstFormGroup.get('formaPago').disable();
          this.firstFormGroup.get('numOperacion').disable();
          this.visublecomentario = true;
          this.visibletipo = true;
          break;
        case 'Validacion ADV':
          //APROBADO POR CONTABILIDAD
          this.disableForm();
          this.visublecomentario = true;
          this.visibletipo = true;
          break;
        case 'Aprobaciones':
          //  APROBADO POR JEFATURA
          this.disableForm()

          this.visublecomentario = true;
          this.visibletipo = true;
          break;
        case 'Revision Cumplimiento':
          this.disableForm()

          this.visublecomentario = true;
          this.visibletipo = true;
          this.firstFormGroup.get('comprobanteOrigen').disable();
          break;

        case 'Revision Contabilidad':
          this.disableForm()

          this.visublecomentario = true;
          this.visibletipo = true;
          break;
        case 'Revision Tesoreria':
          this.disableForm()
          this.visublecomentario = true;
          this.visibletipo = true;
          break;
        case 'Aplicado Tesoreria':
          this.disableForm()
          this.visublecomentario = true;
          this.visibletipo = true;
          break;
        case undefined:
          this.visublecomentario = false;
          this.visibletipo = false;
          //aqui ingresa primer paso
          this.firstFormGroup.get('fechsolicitud').enable();
          break;
        case null:
          this.visublecomentario = false;
          this.visibletipo = false;
          break;
        case '':
          this.visublecomentario = false;
          this.visibletipo = false;
          break;
        default:
          this.visublecomentario = true;
          this.visibletipo = true;

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
      this.disabledSearchApi = true;
      this.firstFormGroup.get('nroSap').enable();
    }
  }

  disableForm() {
    this.firstFormGroup.get('nroSap').disable();
    this.firstFormGroup.get('clienteRazonSocial').disable();
    this.firstFormGroup.get('dniClienteRuc').disable();
    this.firstFormGroup.get('fechsolicitud').disable();
    this.firstFormGroup.get('importe').disable();
    this.firstFormGroup.get('moneda').disable();
    this.firstFormGroup.get('unidadNegocio').disable();
    this.firstFormGroup.get('tienda').disable();
    this.firstFormGroup.get('centroCosto').disable();
    this.firstFormGroup.get('comentario').disable();
    this.firstFormGroup.get('tipo').disable();
    this.firstFormGroup.get('tipoCarta').disable();
    this.firstFormGroup.get('vinculo').disable();
    this.firstFormGroup.get('banco').disable();
    this.firstFormGroup.get('dniclienteRealiza').disable();
    this.firstFormGroup.get('clienteRaliza').disable();
    this.firstFormGroup.get('solicitante').disable();
    this.firstFormGroup.get('formaPago').disable();
    this.firstFormGroup.get('numOperacion').disable();
    this.firstFormGroup.get('comprobanteOrigen').disable();
    this.disableAplication = true;

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
        // this.user.dniclienteruc = this.listsapModel.COD_CLIENTE.toString();
        // this.user.clienterazonsocial = this.listsapModel.NOMBRE_CLIENTE.toString();

        this.user.dniclienteRealiza = this.listsapModel.COD_CLIENTE.toString();
        this.user.clienteRaliza = this.listsapModel.NOMBRE_CLIENTE.toString();

        //this.user.centrocosto=this.listsapModel.TIPO_DOCUMENTO;
        //this.user.fechsolicitud=this.listsapModel.FECHA_DOC.toString();

        const today = new Date();

        today.setDate(today.getDate() + 1);
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2); // El mes se indexa desde 0, por eso se suma 1
        const day = ('0' + today.getDate()).slice(-2);
        const formattedDate = year + '-' + month + '-' + day;
        this.user.fechsolicitud = formattedDate;
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
      tipos = 'ANTICIPO';
    } else {
      tipos = 'APIVENTA';
    }

    if (tipos == 'APIVENTA') {
      this.spinner.show(); 
    } else {
      this.spinner.show(); 
    }

    var userSolictante= localStorage.getItem('UserLog');

    this.user.solicitante = userSolictante;
    //this.getProfile();
    this.sendData();
  }

  getProfile() {
    this.azureAdDemoService.getUserProfile().subscribe((profileInfo) => {
      //this.profile=profileInfo;
      this.user.solicitante = profileInfo.displayName;
    });
  }

  changeInput(event: any) {
    console.log("change tipo de carta =====>",event);
    if("C.A por error en depósito" == event ||  "C.A por depósito en efectivo" == event){
       this.user.dniclienteruc  = this.user.dniclienteRealiza;
       this.user.clienterazonsocial  = this.user.clienteRaliza;

      }else{
        this.user.dniclienteruc  = "";
        this.user.clienterazonsocial  = "";
    }
    this.sendData();
  }

  changeInputchek(event: any) {
    const value = event.target.checked ? event.target.value : null;
    this.user.tipo = value;
    this.sendData();
  }
}
