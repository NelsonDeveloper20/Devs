import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';
import { NavigationEnd, Router } from '@angular/router';
import { ILoginIdRequest, IUsersResponse } from 'src/app/services/user.model';

import { FormGroup, FormControl, FormArray } from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { MatTableDataSource } from '@angular/material/table';
import { IApiResponse } from 'src/app/services/service.model';
import { DataService } from 'src/app/shared/data.service';
import { filter, map } from 'rxjs/operators';
import { Solicitud2, Usuario } from 'src/app/services/request.model';
import { MatStepper } from '@angular/material/stepper';
import { AzureAdDemoService } from 'src/app/azure-ad-demo.service';
import { ListasModel } from 'src/app/parametros/parametros.component';
import { Observable } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';
import { UserchangesService } from 'src/app/userchanges.service';

export type IPartePago = {
  id?: string;
  nrosap?: string;
  pjudialPnatural?: string;
  proveedor?: string;
  cliente?: string;
  proyecto?: string;
  numeroArticuloSap?: string;
  descripcionArticuloSap?: string;
  importe?: string;
  moneda?: string;
  numeroCuentaBancaria?: string;
  numeroCuentaInterbancaria?: string;
  estadoSolicitud?: string;
  entidadBancaria?: string;
  local?: string;
  area?: string;
  asesor?: string;
  solicitante?: string;
  tipoPago?: string;
  comentario?: string;
  tipo?: string;
  //otros
  tipoDocumento?: string;
  numeroFactura?: string;
  comentarioContabilidad?: string;
};

export type sapModel = {
  DocEntry?: string;
  CardCode?: string;
  CardName?: string;
  Project?: string;
  Codigo_cliente?: string;
  Nombre_cliente?: string;
  DocCur?: string;
  importe?: string;
  DocNum?: string;
  BaseEntry?: string;
  DocDueDate?: string;
  ItemCode?: string;
  ItemName?: string;
  tipo_persona?: string;
  tipo_documento?: string;
  encargado_compras?: string;
  propietario?: string;
}

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

@Component({
  selector: 'app-formulario-epdp',
  templateUrl: './formulario-epdp.component.html',
  styleUrls: ['./formulario-epdp.component.css']
})
export class FormularioEpdpComponent implements OnInit {

  selectedItem: string = ''; // Valor seleccionado inicialmente

  onCheckboxChange(selectedItem: string) {
    this.selectedItem = selectedItem; // Actualiza el valor seleccionado
    this.user.tipo = selectedItem;
    this.sendData();
  }
  tiposD: string[] = [];
  @Input() user: IPartePago;
  @Output() dataChanged = new EventEmitter<IPartePago>();
  sendData() {
    this.dataChanged.emit(this.user);
  }


  disableCampo: boolean = false;
  enabledCampos: boolean = false;

  //user!: IPartePago;// IProveedor;
  message: string = '';
  archivosForm: FormGroup;
  tituloFormulario = localStorage.getItem('Formactivo');
  cartaCruzada = false;
  //data que recibo del otro componente listado
  datos: any;
  visublecomentario = false;
  visibletipo = false;
  formDisabled = false;



  firstFormGroup = this._formBuilder.group({
    nroSap: ['', Validators.required],
    //
    pjudialPnatural: [{ value: '', disabled: this.disableCampo }],
    proveedor: [{ value: '', disabled: this.disableCampo }],
    cliente: [{ value: '', disabled: this.disableCampo }],
    proyecto: [{ value: '', disabled: this.disableCampo }],
    numeroArticuloSap: [{ value: '', disabled: this.disableCampo }],
    descripcionArticuloSap: [{ value: '', disabled: this.disableCampo }],
    importe: [{ value: '', disabled: this.disableCampo }],
    moneda: [{ value: '', disabled: this.disableCampo }],
    numeroCuentaBancaria: [{ value: '', disabled: this.disableCampo }],
    numeroCuentaInterbancaria: [{ value: '', disabled: this.disableCampo }],
    estadoSolicitud: [{ value: '', disabled: this.disableCampo }],
    entidadBancaria: [{ value: '', disabled: this.disableCampo }],
    local: [{ value: '', disabled: this.disableCampo }],
    area: [{ value: '', disabled: this.disableCampo }],
    asesor: [{ value: '', disabled: this.disableCampo }],
    solicitante: [{ value: '', disabled: this.disableCampo }],
    tipoPago: [{ value: '', disabled: this.disableCampo }],
    comentario: [{ value: '', disabled: this.disableCampo }],
    tipo: [{ value: '', disabled: this.disableCampo }],

  });





  disabledSearchApi = false;
  private urlBase: string;
  constructor(private requestService: RequestService,
    private azureAdDemoService: AzureAdDemoService,
    private toaster: Toaster,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,private userService: UserchangesService) {
    this.urlBase = `${environment.baseUrl}/api/`;
    if (this.tituloFormulario == "OP. CON NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)") {
      this.cartaCruzada = true;
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
  ngOnInit(): void {
    this.getuser();
    this.listar();

    var tipoUnidad = localStorage.getItem('UndNgcio');
    var formActivo = localStorage.getItem('Formactivo');

    if (tipoUnidad == "Vehículos") {
      if (formActivo == 'OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago' || formActivo == 'OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago') {
        this.tiposD = ['Devolucion de dinero'];
      } else if (formActivo == 'OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)') {
        this.tiposD = ['Aplicacion de documento', 'Devolucion de dinero'];
      } else {
        this.tiposD = ['Aplicacion de documento'];
      }
    }else if (tipoUnidad == "Motos") { //NUEVA UNIDAD
      if (formActivo == 'OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago' || formActivo == 'OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago') {
        this.tiposD = ['Devolucion de dinero'];
      } else if (formActivo == 'OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)') {
        this.tiposD = ['Aplicacion de documento', 'Devolucion de dinero'];
      } else {
        this.tiposD = ['Aplicacion de documento'];
      }
    }else if (formActivo == 'OP. CON NOTA DE CREDITO - Anulación por anticipo para aplicar a nuevo comprobante') {
      this.tiposD = ['Aplicacion de documento'];
    } else if (formActivo == 'OP. CON NOTA DE CREDITO - Anulación por anticipo para devolución al cliente / error de pago') {
      this.tiposD = ['Devolucion de dinero'];
    } else if (formActivo == 'OP. CON NOTA DE CREDITO - Anulación por factura o boleta para devolución al cliente / error de pago') {
      this.tiposD = ['Devolucion de dinero'];
    } else if (formActivo == 'OP. CON NOTA DE CREDITO - Cambio de datos (boleta por factura, nombre, dirección etc.)') {
      this.tiposD = ['Aplicacion de documento'];
    } else if (formActivo == 'OP. CON NOTA DE CREDITO - Carta cruzada (para aplicar a nuevo comprobante)') {
      this.tiposD = ['Aplicacion de documento'];
    } else if (formActivo == 'OP. CON NOTA DE CREDITO - Desistimiento de compra (con entrega) (vehículos)') {
      this.tiposD = ['Devolucion de dinero'];
    } else if (formActivo == 'OP. CON NOTA DE CREDITO - Desistimiento de compra (sin entrega) (vehículos) tipo de NC') {
      this.tiposD = ['Devolucion de dinero'];
    } else if (formActivo == 'OP. CON NOTA DE CREDITO - Devolución por ítem (para aplicar a nuevo comprobante)') {
      this.tiposD = ['Aplicacion de documento'];
    } else if (formActivo == 'OP. CON NOTA DE CREDITO - Solicitud Por descuento') {
      this.tiposD = ['Aplicacion de documento'];
    } else if (formActivo == 'OP. SIN NOTA DE CREDITO - Pago en exceso (Devoluciones de caja)') {
      this.tiposD = ['Aplicacion de documento', 'Devolucion de dinero'];
    }

    if (this.user) {
      var estadosoli = this.user.estadoSolicitud;
      this.firstFormGroup.get('nroSap').disable();
      switch (estadosoli) {
        case 'Registrado':
          this.firstFormGroup.get('nroSap').enable();
          this.visublecomentario = false;
          this.visibletipo = false;
          this.formDisabled = false;
          break;
        case 'Revision ADV':
          this.visublecomentario = true;
          this.visibletipo = true;
          this.visublecomentario = true;
          this.visibletipo = true;
          this.formDisabled = false;

          break;
        case 'Aprobaciones':
          this.visublecomentario = true;
          this.visibletipo = true;
          this.formDisabled = false;

          this.DisableEnable();
          break;
        case 'Revision Contabilidad':
          this.visublecomentario = true;
          this.visibletipo = true;
          this.formDisabled = false;

          this.DisableEnable();
          break;
        case 'Revision Tesoreria':
          this.visublecomentario = true;
          this.visibletipo = true;
          this.formDisabled = false;

          this.DisableEnable();
          break;
        case 'Revisado Conforme SAP':
          this.visublecomentario = true;
          this.visibletipo = true;
          this.formDisabled = false;

          this.DisableEnable();
          break;
        case undefined:
          this.visublecomentario = false;
          this.visibletipo = false; //aqui ingresa primer paso
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
          // solicitante
          // this.firstFormGroup.get('moneda').disable();
          break;
      }

      if (estadosoli == undefined) {
        this.firstFormGroup.get('nroSap').enable();
        this.firstFormGroup.get('importe').enable();
        this.firstFormGroup.get('moneda').enable();
        this.disabledSearchApi = true;
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
  DisableEnable() {
    this.firstFormGroup.get('nroSap').disable();
    //
    this.firstFormGroup.get('pjudialPnatural').disable();
    this.firstFormGroup.get('proveedor').disable();
    this.firstFormGroup.get('cliente').disable();
    this.firstFormGroup.get('proyecto').disable();
    this.firstFormGroup.get('numeroArticuloSap').disable();
    this.firstFormGroup.get('descripcionArticuloSap').disable();
    this.firstFormGroup.get('importe').disable();
    this.firstFormGroup.get('moneda').disable();
    this.firstFormGroup.get('numeroCuentaBancaria').disable();
    this.firstFormGroup.get('numeroCuentaInterbancaria').disable();
    this.firstFormGroup.get('estadoSolicitud').disable();
    this.firstFormGroup.get('entidadBancaria').disable();
    this.firstFormGroup.get('local').disable();
    this.firstFormGroup.get('area').disable();
    this.firstFormGroup.get('asesor').disable();
    this.firstFormGroup.get('solicitante').disable();
    this.firstFormGroup.get('tipoPago').disable();
    this.firstFormGroup.get('comentario').disable();
    this.firstFormGroup.get('tipo').disable();
  }
  listsapModel: sapModel = {};
  buscarApi() {
    try {
      this.spinner.show();
      
    } catch (ex) {
      console.log(ex);
    }
  }
  getProfile() {
    this.azureAdDemoService.getUserProfile()
      .subscribe(profileInfo => {
        //this.profile=profileInfo;
        this.user.solicitante = profileInfo.displayName;
      })
  }
  changeInput(event: any) {

    debugger;

    this.sendData();

  }
  changeInputchek(event: any) {
    const value = event.target.checked ? event.target.value : null;
    this.user.tipo = value;
    this.sendData();
  }

  usuario: Usuario[] = [];
  _usuario: Usuario[] = [];
  getuser() {
    this.spinner.show();
    this.requestService.getusuarios().subscribe(
      data => {
        this.spinner.hide();
        this._usuario = data;

        const asesores = this._usuario.filter(items =>
          items.roles.some(rol => rol.rol.nombre === "Asesor")
        );


        asesores.forEach(elem => {
          this.usuario.push({
            id: elem.id,
            nombre: elem.nombre,
            correo: elem.correo,
            estado: "",
            usuarioCreacion: "",
            fechaCreacion: "",
            usuarioModificacion: "",
            fechaModificacion: "",
            idUnidadNegocio: 0,
            roles: []
          })
        });;
      },
      () => {
        this.spinner.hide();
      }
    );

  }
  limpiar() {
    this.user.nrosap = "";
    this.user.pjudialPnatural = "";
    this.user.proveedor = "";
    this.user.cliente = "";
    this.user.proyecto = "";
    this.user.numeroArticuloSap = "";
    this.user.descripcionArticuloSap = "";
    this.user.importe = "";
    this.user.moneda = "";
    this.user.numeroCuentaBancaria = "";
    this.user.numeroCuentaInterbancaria = "";
    this.user.estadoSolicitud = "";
    this.user.entidadBancaria = "";
    this.user.local = "";
    this.user.area = "";
    this.user.asesor = "";
    this.user.solicitante = "";
    this.user.tipoPago = "";
    this.user.comentario = "";
    this.user.tipo = "";
    //otros

    this.user.tipoDocumento = "";
    this.user.numeroFactura = "";
  }
}
