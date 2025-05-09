import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2pdf from 'html2pdf.js';
// Importa el método jsPDF para autotable
import 'jspdf-autotable';
import * as _ from 'lodash';
import { ComunicacionService } from '../shared/comunicacion.service';
import { OrdenproduccionGrupoService } from '../services/ordenproducciongrupo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ObjConfigsLayout } from '../configuration_layout';
import * as JsBarcode from 'jsbarcode';
interface ConfiguracionLayout {
  [key: string]: {};
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit {
  objConfiguracionAtributos: ConfiguracionLayout = ObjConfigsLayout;

  id: string | null = null;
  @ViewChild('content') content: ElementRef;
  @Input() recibirId: string | null = null;
  cotizacionGrupo = "";

  groups: any;
  arrayKeysGroups: string[];
  tipoGrupo="Producto"; //Producto y Componente
  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private ordenproduccionGrupoService: OrdenproduccionGrupoService
  ) {}
  ejecutarAccionConParametro(parametro: string,tipoProducto:string): void {
    console.log('Acción ejecutada con parámetro:', parametro);
    console.log('TIPO: '+tipoProducto);
    // Aquí puedes realizar la lógica adicional cuando se ejecuta la acción con el parámetro
    this.cotizacionGrupo = parametro;
    this.tipoGrupo=tipoProducto;
    if(this.tipoGrupo=="Producto"){
      this.ObtenerLayout(this.cotizacionGrupo);
    }else{      
      this.ObtenerLayoutComponente(this.cotizacionGrupo);
    }
    //this.generarPDF2();
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Received ID:', this.id);
    // Puedes realizar más acciones con el id aquí
    //this.generarPDF2();
  } 
  DatosJson2:any=[];
  ObtenerLayout(cotizacionGrupo: any) {
    this.spinner.show();
    this.ordenproduccionGrupoService.ObtenerLayout(cotizacionGrupo).subscribe(
      (data: any) => {
        if (data && data.status === 200) { 
          console.log(data.json);
          this.DatosJson2 = data.json;
          this.spinner.hide(); 
          //this.groupData();
          this.html='';         
        this.countercentral=0;
        this.counter=0;
        this.totalPaGina=0;
        this.paginas=0;
          this.htmlCabezal = '';
          if(this.tipoGrupo=="Producto"){
            this.GenerarLayout();
          }else{
          this.GenerarLayoutComponentes();
          }
        } else {
          this.spinner.hide();
          console.error('Error: No se pudo obtener datos válidos.');
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error al obtener el detalle del grupo:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    );
  }
   
  ObtenerLayoutComponente(cotizacionGrupo: any) {
    this.spinner.show();
    this.ordenproduccionGrupoService.ObtenerLayoutComponentes(cotizacionGrupo).subscribe(
      (data: any) => {
        if (data && data.status === 200) { 
          console.log(data.json);
          this.DatosJson2 = data.json;
          this.spinner.hide(); 
          //this.groupData();
          this.html='';         
        this.countercentral=0;
        this.counter=0;
        this.totalPaGina=0;
        this.paginas=0;
          this.htmlCabezal = ''; 
          this.GenerarLayoutComponentes(); 
        } else {
          this.spinner.hide();
          console.error('Error: No se pudo obtener datos válidos.');
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error al obtener el detalle del grupo:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    );
  }
  generarPDF2() {
    console.log("ejecute");
    const options = {
      filename: 'documento.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
    };

    const contenido = document.getElementById('layout');
    html2pdf()
      .from(contenido)
      .set(options)
      .toPdf() // Convertir a PDF
      .get('pdf') // Obtener el objeto PDF
      .then((pdf) => {
        // Crear un enlace temporal para abrir el PDF en una nueva pestaña
        const blob = new Blob([pdf.output('blob')], {
          type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        window.open(url);
      }); 
  } 
  generarCodigoBarras() {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, this.DatosJson2[0]?.cotizacionGrupo, {
      format: 'CODE128',
      displayValue: false,
    });
    const barcodeDataUrl = canvas.toDataURL('image/png');

    // Asignar directamente al elemento <img> existente
    const imgElement = document.getElementById('barcodeImage') as HTMLImageElement;
    if (imgElement) {
      imgElement.src = barcodeDataUrl;
    }
    const imgElement2 = document.getElementById('barcodeImageProductos') as HTMLImageElement;
    if (imgElement2) {
      imgElement2.src = barcodeDataUrl;
    }
  }
  generatePDF(contenido: HTMLElement, options: any) {
    html2pdf()
      .from(contenido)
      .set(options)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const blob = new Blob([pdf.output('blob')], {
          type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        window.open(url);
      });
  }
  
  //containerTable: any;
  cantElement: number = 7;
  cantSubArray: number; 
  inicio: number = 0;
  fin: number;
  fin_ultimo: number;
  html: string = '';
  linea1: any;
  counter: number = 0;
  countercentral: number = 0;
  comentcoun: number = 0;
  totalPaGina: number = 1;
  paginas: number = 0;
  countcabezal: number = 0;
  htmlCabezal: string = '';

  @ViewChild('layout') contenthtml: ElementRef;
  GenerarLayout() {  
    this.generarCodigoBarras();
    this.spinner.show();
// Obtén el primer elemento del array, si es necesario
const primerElemento = this.DatosJson2[0];
// Calcular la cantidad de subarrays necesarios
// Math.ceil se usa para redondear hacia arriba, asegurando que tengamos suficientes subarrays
this.cantSubArray = Math.ceil(this.DatosJson2.length / this.cantElement);// + 0.49);
// Calcular la longitud del último subarray
// Si el módulo (resto) de la longitud del array dividido por la cantidad de elementos por subarray es 0,
// entonces el último subarray tendrá la misma longitud que los otros. De lo contrario, tendrá la longitud del resto.
this.fin_ultimo = this.DatosJson2.length % this.cantElement || this.cantElement;//this.fin_ultimo = this.DatosJson2.length - this.cantElement * (this.cantSubArray - 1);
// Crear los subarrays
let arraySubArray = [];
for (let i = 0; i < this.cantSubArray; i++) {
    let subArrayTemp = [];
    let inicio = i * this.cantElement;
    // Si es el último subarray, ajusta la longitud para que incluya todos los elementos restantes
    if (i === this.cantSubArray - 1) {
        subArrayTemp = this.DatosJson2.slice(inicio, inicio + this.fin_ultimo);
    } else {
        // Para los demás subarrays, toma la cantidad especificada de elementos
        subArrayTemp = this.DatosJson2.slice(inicio, inicio + this.cantElement);
    }    
    // Añadir el subarray temporal al array de subarrays
    arraySubArray.push(subArrayTemp);
}
// arraySubArray ahora contiene todos los subarrays creados a partir de DatosJson2  


    console.log("GRUPOS==>");
    console.log(arraySubArray.length);
    console.log(arraySubArray);
    // Generar el HTML y renderizar los productos
    for (let i = 0; i < arraySubArray.length; i++) {
        let central_si = "";
        this.countercentral++;
        if (this.countercentral == 2) {
            central_si = "NOOO";
            this.countercentral = 0;
        }                 
        // Add header table for each page
        
        if(this.paginas > 0) {
          this.html += '<p style="height: 20.67px; background: red;visibility: hidden;">Página ' + (i + 1) + '</p>';
      }
        this.html += `
    <table class="table-layout laypdf" style="width: 100% !important; font-size: 11px; font-weight: 500;">
        <tbody>
            <tr>
                <td style="border: none !important;vertical-align: top;text-align: start;padding-bottom: 0px !important;">
                    <img id="barcodeImage_${i}" src="${this.getQRImageSource()}" style="width: 114px; height: 50px;">
                </td>
                <td colspan="2" style="border: none !important;text-align: center;vertical-align: top;text-align: center;padding-bottom: 0px !important;">
                    <h3 style="color: black;">Orden de Produccion N: ${primerElemento?.cotizacionGrupo}</h3>
                </td>
                <td style="border: none !important;width: 287px;vertical-align: top;text-align: start;padding-bottom: 0px !important;">
                    <div class="" style="color: black;">
                        <h4 style="font-weight: 700;margin-bottom: 0px;color: black;">Fecha de entrega: ${primerElemento?.fechaEntrega}</h4>
                        <h4 style="font-weight: 700;margin-bottom: 0px;color: black;">Fecha impresión: ${this.formatDate(primerElemento?.fechaImpresion)}</h4>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="border: none !important;text-align: start;padding-bottom: 0px !important;">
                    <span>Cliente:. ${primerElemento?.cliente}</span><br>
                    <span>Direccion: ${primerElemento?.direccion}</span>
                </td>
                <td colspan="2" style="border: none !important;text-align: center;padding-bottom: 0px !important;">
                    Telefono: ${primerElemento?.telefono} &nbsp;&nbsp;&nbsp; Documento: ${primerElemento?.numeroCotizacion}
                </td>
                <td style="width: 287px;border: none !important;text-align: start;padding-bottom: 0px !important;">
                    <span>TIPO: Distribucion ${primerElemento?.tipoCliente}</span><br>
                    <span>RESPONSABLE: ${primerElemento?.vendedor}</span><br>
                    <span style="font-weight: 500;">FECHA: ${this.formatDate(primerElemento?.fecha_Fabricacion)}</span>
                </td>
            </tr>
        </tbody>
    </table>`;

        if(this.paginas==0){
          this.html += this.renderProducts(primerElemento, arraySubArray[i], i, central_si, this.comentcoun);
        }else{
        //  this.html +='<p style=" height: 95.67px;visibility: hidden; ">Página </p>';///* visibility: hidden; */
        this.html += this.renderProducts(primerElemento, arraySubArray[i], i, central_si, this.comentcoun);
        this.html +='</div>';
        }

        
        this.counter++;
        this.totalPaGina++;
        this.paginas++; 
    }

    // Asignar el HTML generado al elemento del DOM 
    this.contenthtml.nativeElement.innerHTML = this.html;
    this.spinner.hide();
    this.generarPDF2();
}
// Helper method to format date
  formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES');
}

// Helper method to get QR image source
  getQRImageSource(): string {
  // Return the source of your QR code image
  return document.getElementById('barcodeImageProductos')?.getAttribute('src') || '';
}
  renderProducts(primerElemento:any,  prods: any,  num_table: number,   cent_si: any,    comentcoun: number  ): string {
    const groups = _.countBy(prods, function (val: any) {      return val.indiceAgrupacion;    });
    let aux = 1;
    let aux_max = -1; 
    let html = '';

    let html_renderFigura = '';
    let html_indice_agrupacion = '';
    let html_Destino = '';
    let html_TipoOperacion = '';
    let html_indexdetalle = '';
    let html_Ambiente = '';
    let html_riel = '';
    let html_altura_cadena = '';
    let html_nota = '';
    let html_ancho = '';
    let html_alto = '';
    let html_tipotubo = '';
    let html_tela = '';
    let html_color = '';
    let html_cenefa = '';
    let html_tubo = '';
    let html_soporte_central = '';
    let html_caida = '';
    let html_tipo_mecanismo = '';
    let html_tipo_cadena = '';
    let html_tipo_riel = '';
    let html_altura_medida = '';
    let html_area = '';
    let html_modelo = '';
    let html_escuadra = '';    
    //ENDS  
 
    console.log('---------CANTIDAD PRODUCTOS-------------- VUELTA: '+num_table);
    console.log(prods.length); 
    for (var i = 0; i < prods.length; i++) {
      var aux_group_class = "";
      if (groups[prods[i].indiceAgrupacion] > 1) {
        if (prods[i].indiceAgrupacion == '') {
        } else {
          aux_max = groups[prods[i].indiceAgrupacion];
        }
      }
      if (aux_max > -1) {
        if (aux === 1) {
          aux_group_class = "g_first";
          this.countcabezal = 0;
          aux++;
        } else if (aux > 1 && aux < aux_max) {
          aux_group_class = "g_midle";
          aux++;
        } else {
          aux_group_class = "g_last";
          aux = 1;
          aux_max = -1;
        }
      } else {
        aux_group_class = "";
      }

      var mando = "";
      if (prods[i].mando == "" || prods[i].mando == null) {
        mando = "";
      } else {
        mando = prods[i].mando;
      } 
      var codigo_prod = prods[i].codigoProducto; //.toUpperCase();
      var cod_producto_m = codigo_prod.substr(0, 5);
      console.log('ess: ' + cod_producto_m);
      var flecha_izquierda =      '<h1 style=" color: black; margin-top: -9px; font-size: 55px;">←</h1>';
      var flecha_ambos =        '<h1 style=" color: black; margin-top: -9px; font-size: 55px;">↔</h1>';
      var flecha_drecha =        '<h1 style=" color: black; margin-top: -9px; font-size: 55px;">→</h1>';
      var flecha_izquierdacolor =        '<h1 style=" color: red; margin-top: -9px; font-size: 55px;">←</h1>';
      var flecha_amboscolor =        '<h1 style=" color: red; margin-top: -9px; font-size: 55px;">↔</h1>';
      var flecha_drechacolor =        '<h1 style=" color: red; margin-top: -9px; font-size: 55px;">→</h1>';
      var tipoInstalacion = prods[i].tipo_Instal; //.toUpperCase();
      console.log("TIPO INSTALACION==============>"+tipoInstalacion);
      if (
        this.objConfiguracionAtributos[
          prods[i].familia + prods[i].subFamilia
        ] != undefined
      ) {
        if (cod_producto_m == 'PRTCV') {
          //PERSIANA VERTICAL
          //	tipoInstalacion=prods[i].tipo_Instal;
          tipoInstalacion = prods[i].tipo_Instal;
          htmlCabezal2 = "<p style='margin-top: -22px;  background: yellow;   width: 38%;   text-align: center;   margin-left: 30%;'><span><b>" +
            tipoInstalacion +     "</b></span></p>";
          //INIT
          if (mando.toLowerCase() == 'ambos') {
            //IINT
            var htmlmandos1 = '';
            if (prods[i].apertura == 'Derecha') {
              htmlmandos1 = flecha_drechacolor;
            } else if (prods[i].apertura == 'Izquierda') {
              htmlmandos1 = flecha_izquierdacolor;
            } else {
              htmlmandos1 = flecha_amboscolor;
            }
            html_renderFigura +=        "<td style='border: 0px dotted white !important;'  key='" +
              prods[i].id +  "' class='prod_td " +
              aux_group_class +         "'>" +
              htmlCabezal2 +            "<div class='product-block izquierda' style='color:#ffffff00;'>" +
              htmlmandos1 +             "<div class='ambos'></div></div></td>";
          } else {
            var htmlmandos1 = '';
            if (mando.toLowerCase() == 'no aplica') {
            } else {
              if (prods[i].apertura == 'Derecha') {
                htmlmandos1 = flecha_drechacolor;
              } else if (prods[i].apertura == 'Izquierda') {
                htmlmandos1 = flecha_izquierdacolor;
              } else {
                htmlmandos1 = flecha_amboscolor;
              }
            }
            html_renderFigura +=   "<td style='border: 0px dotted white !important;'  key='" +
              prods[i].id + "' class='prod_td " +
              aux_group_class +        "'>" +
              htmlCabezal2 +          "<div class='product-block " +
              mando.toLowerCase() +  "' style='color:#ffffff00;'>" +
              htmlmandos1 +          "</div></td>";
            //html_renderFigura += `<td key=${prods[i].id} class="prod_td ${aux_group_class}"><p style="margin-top: -22px;  background: yellow;   width: 38%;   text-align: center;   margin-left: 30%;"><span>${tipoInstalacion}</span></p><div class="product-block ${mando}" style="color:#ffffff00;">${htmlmandos}${prods[i].nombreProducto}</div></td>`;
          }
        } else if (cod_producto_m == 'PRTPJ') {
          //PANEL JAPONES

          // alert('aciona: '+val.accionamiento);
          if (prods[i].accionamiento == 'Manual') {
            if (mando.toLowerCase() == 'ambos') {
              var htmlmandos1 = '';
              if (prods[i].apertura == 'Derecha') {
                htmlmandos1 = flecha_drechacolor;
              } else if (prods[i].apertura == 'Izquierda') {
                htmlmandos1 = flecha_izquierdacolor;
              } else {
                htmlmandos1 = flecha_amboscolor;
              }
              html_renderFigura +=   "<td style='border: 0px dotted white !important;'  key='" +
                prods[i].id + "' class='prod_td " +
                aux_group_class +        "'><div class='product-block izquierda' style='color:#ffffff00;'>" +
                htmlmandos1 +             "<div class='ambos'></div></div></td>";
            } else {
              var htmlmandos1 = '';
              if (mando.toLowerCase() == 'no aplica') {
              } else {
                if (prods[i].apertura == 'Derecha') {
                  htmlmandos1 = flecha_drechacolor;
                } else if (prods[i].apertura == 'Izquierda') {
                  htmlmandos1 = flecha_izquierdacolor;
                } else {
                  htmlmandos1 = flecha_amboscolor;
                }
              }
              html_renderFigura +=   "<td style='border: 0px dotted white !important;'  key='" +   prods[i].id + "' class='prod_td " +   aux_group_class +  "'><div class='product-block " +
                mando.toLowerCase() +    "' style='color:#ffffff00;'>" +        htmlmandos1 +             "</div></td>";
              }
          } else {
            if (mando.toLowerCase() == 'ambos') {
              var htmlmandos1 = '';
              if (prods[i].apertura == 'Derecha') {
                htmlmandos1 = flecha_drechacolor;
              } else if (prods[i].apertura == 'Izquierda') {
                htmlmandos1 = flecha_izquierdacolor;
              } else {
                htmlmandos1 = flecha_amboscolor;
              }

              html_renderFigura += "<td style='border: 0px dotted white !important;'  key='" + prods[i].id +     "' class='prod_td " +
                aux_group_class +  "'><div class='product-block _cuadradoizquierda' style='color:#ffffff00;'>" +
                htmlmandos1 +      "<div class='_cuadradoderecha'></div></div></td>";

              //html_renderFigura += `<td key=${prods[i].id} class="prod_td ${aux_group_class}"><p style="margin-top: -22px;  background: yellow;   width: 38%;   text-align: center;   margin-left: 30%;"><span>${tipoInstalacion}</span></p><div class="product-block _cuadradoizquierda" style="color:#ffffff00;">${htmlmandos1}${prods[i].nombreProducto} <div class="_cuadradoderecha"></div></div></td>`;
            } else {
              var htmlmandos = '';
              if (mando.toLowerCase() == 'no aplica') {
              } else {
                if (prods[i].apertura == 'Derecha') {
                  htmlmandos = flecha_drechacolor;
                } else if ((prods[i].apertura = 'Izquierda')) {
                  htmlmandos = flecha_izquierdacolor;
                } else {
                  htmlmandos = flecha_amboscolor;
                }
              }
              html_renderFigura += "<td style='border: 0px dotted white !important;'  key='" +
                prods[i].id +    "' class='prod_td " +
                aux_group_class +        "'><div class='product-block _cuadrado" +
                mando.toLowerCase() +       "' style='color:#ffffff00;'>" +
                htmlmandos +        "</div></td>";
              //	html_renderFigura += `<td key=${prods[i].id} class="prod_td ${aux_group_class}"><p style="margin-top: -22px;  background: yellow;   width: 38%;   text-align: center;   margin-left: 30%;"><span>${tipoInstalacion}</span></p><div class="product-block _cuadrado${mando}" style="color:#ffffff00;">${htmlmandos}${prods[i].nombreProducto}</div></td>`;
            }
          }
          //END
        } else if (cod_producto_m == 'PRTTO') {
          //TOLDO
          var htmlCabezal2 = '';
          var tipotol = prods[i].tipoToldo;

          if (tipotol == 1) {
            htmlCabezal2 =   "<p style='margin-top: -22px;  background: yellow;   width: 38%;   text-align: center;   margin-left: 30%;'><span><b>" +
              tipoInstalacion +    "</b></span></p>";
          } else {
            htmlCabezal2 = '';
          }
          // alert('aciona: '+val.accionamiento);
          if (prods[i].accionamiento == 'Manual') {
            if (mando.toLowerCase() == 'ambos') {
              var htmlmandos1 = '';
              html_renderFigura +=  "<td style='border: 0px dotted white !important;'  key='" +
                prods[i].id +"' class='prod_td " +     aux_group_class +              "'>" +
                htmlCabezal2 +      "<div class='product-block izquierda' style='color:#ffffff00;'>" +
                htmlmandos1 +         "<div class='ambos'></div></div></td>";
            } else {
              var htmlmandos1 = '';
              html_renderFigura +=
                "<td style='border: 0px dotted white !important;'  key='" +
                prods[i].id +
                "' class='prod_td " +
                aux_group_class +
                "'>" +
                htmlCabezal2 +
                "<div class='product-block " +
                mando.toLowerCase() +
                "' style='color:#ffffff00;'>" +
                htmlmandos1 +
                "</div></td>";
            }
          } else if (prods[i].accionamiento == 'Manual + Motorizado') {
            if (mando.toLowerCase() == 'ambos') {
              var htmlmandos1 = '';

              html_renderFigura +=
                "<td style='border: 0px dotted white !important;'  key='" +
                prods[i].id +
                "' class='prod_td " +
                aux_group_class +
                "'>" +
                htmlCabezal2 +
                "<div class='product-block _cuadradoizquierda' style='color:#ffffff00;'>" +
                htmlmandos1 +
                "<div class='_cuadradoderecha'></div></div></td>";
            } else {
              var htmlmandos = '';
              var css_baston = '';
              var styles = '';
              if (mando.toLowerCase() == 'izquierda') {
                if (tipotol == 1) {
                  css_baston = 'motorizado_toldo_izquierdaM2';
                  styles =
                    'margin: 50px auto !important; height: 40px !important; width: 1px !important; left: 10px !important';
                } else {
                  css_baston = 'motorizado_toldo_izquierda';
                  styles =
                    'margin: 40px auto !important; height: 48px !important; width: 1px !important; left: -4px !important';
                }
              } else if (mando.toLowerCase() == 'derecha') {
                if (tipotol == 1) {
                  css_baston = 'motorizado_toldo_derechaM2';
                } else {
                  css_baston = 'motorizado_toldo_derecha_w';
                }
              }
              html_renderFigura +=
                "<td style='border: 0px dotted white !important;'  key='" +
                prods[i].id +
                "' class='prod_td " +
                aux_group_class +
                "'>" +
                htmlCabezal2 +
                "<div style='" +
                styles +
                "' class=" +
                css_baston +
                "></div><div class='product-block _cuadrado" +
                mando.toLowerCase() +
                "' style='color:#ffffff00;'>" +
                htmlmandos +
                "</div></td>";
            }
          } else {
            var htmlmandos = '';
            html_renderFigura +=
              "<td style='border: 0px dotted white !important;'  key='" +
              prods[i].id +
              "' class='prod_td " +
              aux_group_class +
              "'><div class='product-block _cuadrado" +
              mando.toLowerCase() +
              "' style='color:#ffffff00;'>" +
              htmlmandos +
              "</div></td>";
          }
          //END
        } else {
          //CUANDOE ES NINGUNO
          var htmlCabezal2 = '';

          if (cod_producto_m == 'PRTPH') {
            //PERSIANA HORIZONTAL

            var cabezal = prods[i].cabezales;
            var nombCabez = '';

            nombCabez = 'UN SOLO CABEZAL';

            tipoInstalacion = nombCabez;
            if (aux_group_class == "") {
            } else {
              if (this.countcabezal == 0) {
                this.countcabezal = 1;
                htmlCabezal2 =
                  "<p style='margin-top: -22px;  background: yellow;   width: 150%;   text-align: center;   margin-left: 30%;'><span><b>" +
                  tipoInstalacion +
                  "</b></span></p>";
              }
            }
          }

          if (
            cod_producto_m == 'PRTRH' ||
            cod_producto_m == 'PRTRF' ||
            cod_producto_m == 'PRTRM'
          ) {
            //RIEL HOTELERO
            tipoInstalacion = prods[i].tipo_Instal;
            htmlCabezal2 =
              "<p style='margin-top: -22px;  background: yellow;   width: 38%;   text-align: center;   margin-left: 30%;'><span><b>" +
              tipoInstalacion +
              "</b></span></p>";
          }
          var divcentral = "";
          if (prods[i].central_index == "SI") {
            if (cent_si == "SI") {
              divcentral = "<div class='centralcontinuos'></div>";
            }
          }
          if (prods[i].central == 'SI') {
            divcentral = "<div class='centrales'></div>";
          }

          if (prods[i].accionamiento == 'Manual') {
            if (mando.toLowerCase() == 'ambos') {
              html_renderFigura +=
                "<td style='border: 0px dotted white !important;' key='" +
                prods[i].id +
                "' class= 'prod_td " +
                aux_group_class +
                "'>" +
                htmlCabezal2 +
                "<div class='product-block izquierda' style='color:white;'><div class='ambos'></div></div></td>";
            } else {
              html_renderFigura +=
                "<td style='border: 0px dotted white !important;' key='" +
                prods[i].id +
                "' class= 'prod_td " +
                aux_group_class +
                "'>" +
                divcentral +
                htmlCabezal2 +
                "<div class='product-block " +
                mando.toLowerCase() +
                "' style='color:white;'></div></td>";
              //	html_renderFigura += "<td style='border: 0px dotted white !important;' key='"+prods[i].id+"' class= 'prod_td "+aux_group_class+"' ><div class='product-block "+mando.toLowerCase()+"' style='color:white;'></div></td>";
            }
          } else {
            if (mando.toLowerCase() == 'ambos') {
              html_renderFigura +=
                "<td style='border: 0px dotted white !important;' key='" +
                prods[i].id +
                "' class= 'prod_td " +
                aux_group_class +
                "'>" +
                htmlCabezal2 +
                "<div class='product-block _cuadradoizquierda' style='color:white;'><div class='_cuadradoderecha'></div></div></td>";
            } else {
              html_renderFigura +=
                "<td style='border: 0px dotted white !important;' key='" +
                prods[i].id +
                "' class= 'prod_td " +
                aux_group_class +
                "'>" +
                divcentral +
                htmlCabezal2 +
                "<div class='product-block _cuadrado" +
                mando.toLowerCase() +
                "' style='color:white;'></div></td>";
              //	html_renderFigura += "<td style='border: 0px dotted white !important;' key='"+prods[i].id+"' class= 'prod_td "+aux_group_class+"' ><div class='product-block "+mando.toLowerCase()+"' style='color:white;'></div></td>";
            }
          }
        }
      } else {
       var   htmlCabezal2 =
                  "<p style='margin-top: -22px;  background: yellow;   width: 38%;   text-align: center;   margin-left: 30%;'><span><b>" +
                  tipoInstalacion +
                  "</b></span></p>";

        html_renderFigura +=
          "<td style='border: 0px dotted white !important;' key='" +
          prods[i].id +
          "' class= 'prod_td " +
          aux_group_class +
          "'>" +
          htmlCabezal2 +
          "<div class='product-block' style='color:white;'></div></td>";
      }

      html_indice_agrupacion += "<td>" + prods[i].indiceAgrupacion + "</td>";
      html_indexdetalle += "<td>" + prods[i].index_detalle + "</td>";
      html_tipotubo += "<td >" + prods[i].nombreTubo + "</td>";
      html_area +=
        "<td>" + (prods[i].telaCalculo * prods[i].alturaCalculo).toFixed(3) + "</td>"; //"<td>"+prods[i].area+"</td>";

      html_Destino += "<td>" + prods[i].destino + "</td>";
      html_TipoOperacion += "<td>" + prods[i].tipo_OP + "</td>";

      if (prods[i].familia + prods[i].subFamilia == 'PRTRH') {
        //RIEL HOTELERO
        var rieltipo = prods[i].riel_dat;
        if (rieltipo == 'PALRH') {
          rieltipo = 'Perfil de Aluminio Riel Hotelero';
          //html_riel +="<td>"+rieltipo+"</td>";
        } else {
          rieltipo = 'RIEL DE CORTINA MANUAL';
          //html_riel +="<td>"+rieltipo+"</td>";
        }

        html_riel += "<td>AA" + rieltipo + "</td>";
      } else if (
        prods[i].familia + prods[i].subFamilia == 'PRTRF' ||
        prods[i].familia + prods[i].subFamilia == 'PRTRM'
      ) {
        //RIEL FLEXIBLE
        var rieltipo = prods[i].riel_dat;
        if (rieltipo == 'PALRF') {
          rieltipo = 'perfil de Aluminio Riel Flexible:';
          // html_riel +="<td>"+rieltipo+"</td>";
        } else {
          rieltipo = 'RIEL DE CORTINA FLEXIBLE';
          // html_riel +="<td>"+rieltipo+"</td>";
        }
        html_riel += "<td>EE" + rieltipo + "</td>";
      } else {
        html_riel += "<td></td>";
      }

      html_Ambiente += "<td>" + prods[i].ambiente + "</td>";
      var dataDisp = prods[i].altura_cadena;
      if (prods[i].familia + prods[i].subFamilia == 'PRTRM') {
        //RIEL MOTORIZADO
        dataDisp = prods[i].dispositivo;
      }
      if (
        prods[i].familia + prods[i].subFamilia == 'PRTRH' ||
        prods[i].familia + prods[i].subFamilia == 'PRTRF'
      ) {
        //RIEL MOTORIZADO
        dataDisp = prods[i].l_baston;
        if (dataDisp == '1') {
          dataDisp = 'SI';
        } else if (dataDisp == '2') {
          dataDisp = 'NO';
        }
      }
      html_altura_cadena += "<td class='amarillo'>" + dataDisp + "</td>";
      html_nota += "<td>" + prods[i].nota + "</td>";
      html_modelo +=
        "<td class='amarillo'>" + prods[i].nombreProducto + "</td>";
      html_escuadra +=
        "<td>" + 
        prods[i].escuadraDet +
        "</td>";

      if (
        this.objConfiguracionAtributos[
          prods[i].familia + prods[i].subFamilia
        ] != undefined
      ) {
        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['ancho'] == 1
        )
          html_ancho +=
            "<td  class=amarillo ancho_" +
            num_table +
            " >" +
            prods[i].ancho +
            "</td>";
        else
          html_ancho +=
            "<td class=amarillo ancho_" +
            num_table +
            " ><span style='color:red;'></span></td>";

        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['alto'] == 1
        )
          html_alto +=
            "<td class=amarillo alto_" +
            num_table +
            " >" +
            prods[i].alto +
            "</td>";
        else
          html_alto +=
            "<td class=amarillo alto_" +
            num_table +
            " ><span style='color:red;'></span></td>";

        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['tela'] == 1
        )
          html_tela +=
            "<td style='font-weight: 900;' class=tela_" +
            num_table +
            " >" +
            prods[i].telaCalculo +
            "</td>"; //Tela_medida
        else
          html_tela +=
            "<td style='font-weight: 900;' class=tela_" +
            num_table +
            " ><span style='color:red;'></span></td>";

        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['color'] == 1
        )
          html_color +=
            "<td class=color_" + num_table + " >" + prods[i].color + "</td>";
        else
          html_color +=
            "<td class=color_" +
            num_table +
            " ><span style='color:red;'></span></td>";

        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['cenefa'] == 1
        ) {
          html_cenefa +=
            "<td class=cenefa_" + num_table + " >" + prods[i].cenefa + "</td>";
        } else {
          html_cenefa +=
            "<td class=cenefa_" +
            num_table +
            " ><span style='color:red;'></span></td>";
        }
        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['tubo'] == 1
        )
          html_tubo +=
            "<td style='font-weight: 900;' class=tubo_" +
            num_table +
            " >" +
            prods[i].tuboCalculo +
            "</td>"; //Tubo_medida
        else
          html_tubo +=
            "<td style='font-weight: 900;' class=tubo_" +
            num_table +
            " ><span style='color:red;'></span></td>";

        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['caida'] == 1
        ) {
          if (
            prods[i].familia + prods[i].subFamilia == 'PRTPJ' ||
            prods[i].familia + prods[i].subFamilia == 'PRTCS'
          ) {
            //PANEL JAPONES //celular
            var num_via = '';
            if (prods[i].familia + prods[i].subFamilia == 'PRTCS') {
              //cellular
              num_via = prods[i].numeroVias;
              html_caida +=
                "<td class=caida_" + num_table + " >" + num_via + "</td>";
            } else {
              num_via = prods[i].numvias;
              if (num_via == '1') {
                num_via = prods[i].numvias + ' VIA';
              } else {
                num_via = prods[i].numvias + ' VIAS';
              }
              html_caida +=
                "<td class=caida_" + num_table + " >" + num_via + "</td>";
            }
          } else if (prods[i].familia + prods[i].subFamilia == 'PRTRM') {
            html_caida +=
              "<td class=caida_" +
              num_table +
              " >" +
              prods[i].Cruzeta +
              "</td>";
          } else if (
            prods[i].familia + prods[i].subFamilia == 'PRTRH' ||
            prods[i].familia + prods[i].subFamilia == 'PRTRF'
          ) {
            html_caida +=
              "<td class=caida_" +
              num_table +
              " >" +
              prods[i].Cruzeta +
              "</td>";
          } else {
            html_caida +=
              "<td class=caida_" +
              num_table +
              " >" +
              prods[i].tipo_Caida +
              "</td>";
          }
        } else {
          html_caida +=
            "<td class=caida_" +
            num_table +
            " ><span style='color:red;'></span></td>";
        }

        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['tipoMecanismo'] == 1 &&
          prods[i].id_accionamiento == 1
        )
          html_tipo_mecanismo +=
            "<td class=amarillo tipo-mecanismo_" +
            num_table +
            " >" +
            prods[i].accionamiento +
            "</td>";
        else
          html_tipo_mecanismo +=
            "<td class=amarillo tipo-mecanismo_" +
            num_table +
            " ><span style='color:red;'>" +
            prods[i].accionamiento +
            "</span></td>";

        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['tipoCadena'] == 1
        ) {
          if (
            prods[i].familia + prods[i].subFamilia == 'PRTPJ' ||
            prods[i].familia + prods[i].subFamilia == 'PRTRH' ||
            prods[i].familia + prods[i].subFamilia == 'PRTLU' ||
            prods[i].familia + prods[i].subFamilia == 'PRTRF' ||
            prods[i].familia + prods[i].subFamilia == 'PRTRM' ||
            prods[i].familia + prods[i].subFamilia == 'PRTTO'
          ) {
            //PANEL JAPONES | RIEL FLEXIBLE | RIEL MOTORIZADO
            html_tipo_cadena +=
              "<td class=tipo-cadena_" +
              num_table +
              " >" +
              prods[i].cantidad +
              "</td>";
          } else {
            html_tipo_cadena +=
              "<td class=tipo-cadena_" +
              num_table +
              " >" +
              prods[i].tipo_Cadena +
              "</td>";
          }
        } else {
          html_tipo_cadena +=
            "<td class=tipo-cadena_" +
            num_table +
            "><span style='color:red;'></span></td>";
        }
        //motorizado
        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['tipoRiel'] == 1
        )
          html_tipo_riel +=
            "<td class=amarillo tipo-riel_" +
            num_table +
            " >" +
            prods[i].riel +
            "</td>";
        else
          html_tipo_riel +=
            "<td class=amarillo tipo-riel_" +
            num_table +
            " ><span style='color:red;'></span></td>";

        if (
          this.objConfiguracionAtributos[
            prods[i].familia + prods[i].subFamilia
          ]['alto'] == 1
        )
          html_altura_medida +=
            "<td  style='font-weight: 900;' class=alto_" +
            num_table +
            " >" +
            prods[i].alturaCalculo +
            "</td>"; //Altura_medida
        else
          html_altura_medida +=
            "<td style='font-weight: 900;' class=alto_" +
            num_table +
            " ><span style='color:red;'></span></td>";
      } else {
        html_ancho +=
          "<td class=amarillo ancho_" +
          num_table +
          " ><span style='color:red;'>"+prods[i].ancho +"</span></td>";
        html_alto +=
          "<td class=amarillo alto_" +
          num_table +
          " ><span style='color:red;'>"+prods[i].alto +"</span></td>";
        html_tela +=
          "<td class=tela_" +
          num_table +
          " ><span style='color:red;'></span></td>";
        html_color +=
          "<td class=color_" +
          num_table +
          " ><span style='color:red;'></span></td>";
        html_cenefa +=
          "<td class=cenefa_" +
          num_table +
          " ><span style='color:red;'></span></td>";
        html_tubo +=
          "<td class=tubo_" +
          num_table +
          " ><span style='color:red;'></span></td>";
        html_caida +=
          "<td class=caida_" +
          num_table +
          " ><span style='color:red;'></span></td>";
        html_tipo_mecanismo +=
          "<td class=amarillo tipo-mecanismo_" +
          num_table +
          " ><span style='color:red;'>" +
          prods[i].accionamiento +
          "</span></td>";
        html_tipo_cadena +=
          "<td class=tipo-cadena_" +
          num_table +
          " ><span style='color:red;'></span></td>";
        html_tipo_riel +=
          "<td class=amarillo tipo-riel_" +
          num_table +
          " ><span style='color:red;'></span></td>";
      }
    }  
    
    let htmlfechas = '';
    let turno_l = '';
    try {
        //turno_l = this.arraySubArray[0][0].turno.toUpperCase();
        turno_l = primerElemento.turno.toUpperCase();
    } catch (err) {}
    //<div style='float:right'>
    htmlfechas += `
     Fecha Entrega: &nbsp;&nbsp;&nbsp;&nbsp;<b>${primerElemento.fechaEntrega}</b> &nbsp;&nbsp;Turno : &nbsp;&nbsp;&nbsp;<b>${turno_l}</b>
   `;// </div>
    let notaprod = '';
    try {
        notaprod = prods[num_table].nota;
    } catch (err) {}
    let htmlobs = '';
    htmlobs += `<label>  ${notaprod} </label></br>`;
    htmlobs += "<label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label></br></br>";
    html += "<div><table class='table-layout laypdf'><tbody>";
    html += "<tr><td style='border: 0px dotted white !important;'></td>" + html_renderFigura + "</tr>";

    html += "<tr><td style='border: 0px dotted white !important;height: 18px;'></td></tr>";

    html += "<tr class='bordertable'><td class='cabecera'>Mecanismo</td>" + html_tipo_mecanismo + "</tr>";
    html += "<tr class='bordertable'><td>Ambiente</td>" + html_Ambiente + "</tr>";
    if (cod_producto_m == 'PRTRH' || cod_producto_m == 'PRTRF' || cod_producto_m == 'PRTRM') {
        html += "<tr class='bordertable'><td>Riel</td>" + html_riel + "</tr>";
    }
    html += "<tr class='bordertable'><td>Modelo</td>" + html_modelo + "</tr>";
    html += `<tr><td class=color_${num_table} class='bordertable'>Ancho</td>${html_ancho}</tr>`;
    html += `<tr><td class=color_${num_table} class='bordertable'>Altura</td>${html_alto}</tr>`;
    html += `<tr><td class=color_${num_table} class='bordertable'>Tip. Tubo</td>${html_tipotubo}</tr>`;
    if (cod_producto_m == 'PRTPJ' || cod_producto_m == 'PRTRH' || cod_producto_m == 'PRTRF' || cod_producto_m == 'PRTRM' || cod_producto_m == 'PRTTO' || cod_producto_m == 'PRTLU') {
        html += `<tr><td class='bordertable tipo-cadena_${num_table}'>Cantidad</td>${html_tipo_cadena}</tr>`;
    } else {
        html += `<tr><td class='bordertable tipo-cadena_${num_table}'>Tip.Cadena</td>${html_tipo_cadena}</tr>`;
    }
    if (cod_producto_m == 'PRTCS') {
        html += `<tr><td class='bordertable'>Via Recogida</td>${html_caida}</tr>`;
    } else if (cod_producto_m == 'PRTPJ') {
        html += `<tr><td class='bordertable'>Numero Via</td>${html_caida}</tr>`;
    } else if (cod_producto_m == 'PRTRM' || cod_producto_m == 'PRTRF' || cod_producto_m == 'PRTRH') {
        html += `<tr><td class='bordertable'>Cruzeta</td>${html_caida}</tr>`;
    } else {
        html += `<tr><td class='bordertable'>Tipo Caida</td>${html_caida}</tr>`;
    }
    if (cod_producto_m == 'PRTRM') {
        html += `<tr><td>Dispositivo</td>${html_altura_cadena}</tr>`;
    } else if (cod_producto_m == 'PRTRF' || cod_producto_m == 'PRTRH') {
        html += `<tr><td>Lleva Baston</td>${html_altura_cadena}</tr>`;
    } else {
        html += `<tr><td>Alt.Cadena</td>${html_altura_cadena}</tr>`;
    }
    html += `<tr><td>Destino</td>${html_Destino}</tr>`;
    html += `<tr><td>Tipo Operación</td>${html_TipoOperacion}</tr>`;
    html += `<tr><td class=cenefa cenefa_${num_table}>Cenefa</td>${html_cenefa}</tr>`;
    html += `<tr><td>Ind.Agrupacion</td>${html_indice_agrupacion}</tr>`;
    html += `<tr><td>Index </td>${html_indexdetalle}</tr>`;
    html += `<tr><td class=cabecera tipo-riel_${num_table}>Tip.riel</td>${html_tipo_riel}</tr>`;
    html += `<tr><td class=tubo_${num_table}>Tubo</td>${html_tubo}</tr>`;
    html += `<tr><td class=tela_${num_table}>Tela</td>${html_tela}</tr>`;
    html += `<tr><td class=tela_${num_table}>Altura</td>${html_altura_medida}</tr>`;
    html += `<tr><td class=tela_${num_table}>Area</td>${html_area}</tr>`;
    html += `<tr class='bordertable'><td>Escuadra</td>${html_escuadra}</tr>`;
    html += `<tr><td class=tela_${num_table}><b>Comentario:</b></td><td colspan='7'></td></tr>`;
    html += `</tbody></table>
    <div class='row'>
    <div class='col-lg-10'  style='font-size: 11px;'>
    <b>OBSERVACIONES:</b> ${htmlobs}
    </div>
    <div class='col-lg-2' style='font-size: 11px;'>
    ${htmlfechas}
    </div>
    </div>
    
   `;// ${htmlfechas}<label>OBSERVACIONES: ${htmlobs}</label></div>
    return html;
     
  }
  //ENDS
  GenerarLayoutComponentes(){
    
    this.generarCodigoBarras();
    this.spinner.show();
    this.html=""; 
    this.html = "<table cellspacing='0' style='width: 100% !important; font-size: 13px; border-collapse: collapse;' class=''>";
    this.html += `<thead style='height: 37px !important;'>
    <tr>
    <th style='background: #B8122B !important; color: white !important; text-align: center !important; border: 0.1px solid #dbdbdb4f;'>Código Producto</th>
    <th style='background: #B8122B !important; color: white !important; text-align: center !important; border: 0.1px solid #dbdbdb4f;'>Nombre Producto</th>
    <th style='background: #B8122B !important; color: white !important; text-align: center !important; border: 0.1px solid #dbdbdb4f;'>Cantidad</th>
    <th style='background: #B8122B !important; color: white !important; text-align: center !important; border: 0.1px solid #dbdbdb4f;'>Unidad Medida</th>
    <th style='background: #B8122B !important; color: white !important; text-align: center !important; border: 0.1px solid #dbdbdb4f;'>Sub Familia</th>
    <th style='background: #B8122B !important; color: white !important; text-align: center !important; border: 0.1px solid #dbdbdb4f;'>Tipo OP</th>
    <th style='background: #B8122B !important; color: white !important; text-align: center !important; border: 0.1px solid #dbdbdb4f;'>Número Cotización</th>
    <th style='background: #B8122B !important; color: white !important; text-align: center !important; border: 0.1px solid #dbdbdb4f;'>Destino</th>
    <th style='background: #B8122B !important; color: white !important; text-align: center !important; border: 0.1px solid #dbdbdb4f;'>Vendedor</th>
    </tr>
    </thead>
    <tbody style='font-size: 13px !important; text-align: center;'>`;
    
    this.DatosJson2.forEach(element => {
        this.html += "<tr>";
        this.html += `<td style='border: 0.1px solid #dbdbdb4f;'>${element.codigoProducto}</td>`;
        this.html += `<td style='border: 0.1px solid #dbdbdb4f;'>${element.nombreProducto}</td>`;
        this.html += `<td style='border: 0.1px solid #dbdbdb4f;'>${element.cantidad}</td>`;
        this.html += `<td style='border: 0.1px solid #dbdbdb4f;'>${element.unidadMedida}</td>`;
        this.html += `<td style='border: 0.1px solid #dbdbdb4f;'>${element.subFamilia}</td>`;     
        this.html += `<td style='border: 0.1px solid #dbdbdb4f;'>${element.tipo_OP}</td>`;
        this.html += `<td style='border: 0.1px solid #dbdbdb4f;'>${element.numeroCotizacion}</td>`;
        this.html += `<td style='border: 0.1px solid #dbdbdb4f;'>${element.destino}</td>`;
        this.html += `<td style='border: 0.1px solid #dbdbdb4f;'>${element.vendedor}</td>`;
        this.html += "</tr>";
    });
    
    this.html += "</tbody></table>";
    
    this.contenthtml.nativeElement.innerHTML = this.html;
    this.spinner.hide();
    
    this.generarPDF2();
  }
}
 