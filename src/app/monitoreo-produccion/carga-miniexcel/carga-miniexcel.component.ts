// excel.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom, Observable } from 'rxjs';
import { MonitoreoService } from 'src/app/services/monitoreo.service';
import { LuckysheetHelper } from './luckysheet.helper';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'; // 👈 IMPORTAR SWEETALERT2

import { Toaster } from 'ngx-toast-notifications';
import { SapService } from 'src/app/services/sap.service';
import { ProductoService } from 'src/app/services/productoservice';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// Declarar luckysheet para TypeScript
declare var luckysheet: any;
declare var $: any; // Declara la variable $ para usar jQuery

// Interfaz para cada paso del workflow
interface WorkflowStep {
  id: number;
  nombre: string;
  icono: string;
  completado: boolean;
  activo: boolean;
  codigo?: string;
  fecha?: Date;
  opcional?: boolean;
}



@Component({
  selector: 'app-carga-miniexcel',
  templateUrl: './carga-miniexcel.component.html',
  styleUrls: ['./carga-miniexcel.component.css'],
  encapsulation: ViewEncapsulation.Emulated // O None si quieres que afecte globalmente
  //encapsulation: ViewEncapsulation.None
})
export class CargaMiniexcelComponent implements OnInit, AfterViewInit, OnDestroy {

// Estado del workflow
pasos: WorkflowStep[] = [
  {
    id: 1,
    nombre: 'Guardar',
    icono: 'save',
    completado: false,
    activo: true
  },
  {
    id: 2,
    nombre: 'Enviar Salida',
    icono: 'output',
    completado: false,
    activo: false
  },
  {
    id: 3,
    nombre: 'Enviar Merma',
    icono: 'output',
    completado: false,
    activo: false,
    opcional: true
  },
  {
    id: 4,
    nombre: 'Enviar Entrada',
    icono: 'input',
    completado: false,
    activo: false
  }
];

pasoActual: number = 1;
aplicaMerma: boolean = true;
procesoCompletado: boolean = false;

// Avanzar al siguiente paso
private avanzarPaso(): void {
  const pasoIndex = this.pasos.findIndex(p => p.id === this.pasoActual);
  
  if (pasoIndex !== -1) {
    this.pasos[pasoIndex].activo = false;
    
    // Si es paso 2 y no aplica merma, saltar al paso 4
    if (this.pasoActual === 2 && !this.aplicaMerma) {
      this.pasoActual = 4;
      this.pasos[3].activo = true; // Activar paso 4
    } else {
      // Avanzar normalmente
      if (pasoIndex + 1 < this.pasos.length) {
        this.pasoActual = this.pasos[pasoIndex + 1].id;
        this.pasos[pasoIndex + 1].activo = true;
      }
    }
  }
}

// Marcar paso como completado
private completarPaso(pasoId: number, codigo?: string): void {
  const paso = this.pasos.find(p => p.id === pasoId);
  
  if (paso) {
    paso.completado = true;
    paso.codigo = codigo;
    paso.fecha =null;// new Date();
  }
  
  this.guardarEstadoWorkflow();
}

// Verificar si todos los pasos están completos
private verificarProcesoCompleto(): boolean {
  const pasosRequeridos = this.pasos.filter(p => 
    !p.opcional || (p.opcional && this.aplicaMerma)
  );
  
  return pasosRequeridos.every(p => p.completado);
}

// Resetear workflow (solo si no se ha enviado a SAP)
resetearWorkflow(): void {
  if (this.pasos[1].completado) {
    this.toaster.open({
      text: 'No se puede resetear después de enviar a SAP',
      type: 'warning'
    });
    return;
  }
  
  Swal.fire({
    title: '¿Resetear Proceso?',
    text: 'Se perderán los cambios no guardados',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, resetear',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      this.pasos.forEach(p => {
        p.completado = false;
        p.activo = false;
        p.codigo = undefined;
        p.fecha = undefined;
      });
      
      this.pasos[0].activo = true;
      this.pasoActual = 1;
      this.procesoCompletado = false;
      
      this.limpiarEstadoWorkflow();
    }
  });
}
 // 2. ENVIAR SALIDA SAP
async enviarSalidaSAP(): Promise<void> {
  if (!this.pasos[0].completado) {
    this.toaster.open({
      text: 'Debe guardar primero',
      type: 'warning'
    });
    return;
  }
  
  Swal.fire({
    title: '📤 Enviar Salida a SAP',
    text: '¿Confirma el envío de la salida?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, Enviar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#007bff'
  }).then(async (result) => {
    if (!result.isConfirmed) return;
     
    
    try {

       this.spinner.show();  
        this._service.EnviarSalidaSap(this.DatosGrupo.numeroCotizacion, this.DatosGrupo.cotizacionGrupo, this.idUsuario).subscribe({
          next: (response: any) => {
              this.spinner.hide();
            console.log("RESULLLT=>");
            console.log(response);
            if (response.status == 200) {  
                  console.log("RESPUESTA");
                  const respuesta = response.json.respuesta; 
                  const codigoSalida = response.json.codigo; 
                  console.log("RESPUESTA");
                  console.log(respuesta);
                 if(respuesta=="OPERACION REALIZADA CORRECTAMENTE"){  
                   
        // Completar paso 2
        this.completarPaso(2, codigoSalida);
        this.avanzarPaso();
        
        // Mostrar éxito y preguntar siguiente paso
        this.mostrarExitoSalida(codigoSalida);
 
                 }else{ 
      
                    
                  Swal.fire({
                    title: 'Ocurrió un error al enviar',
                    html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
                    icon: 'warning',
                    width: '600px', // Establece un tamaño fijo para la alerta
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false
                  });
                 } 
              }else{
                Swal.fire({
                  title: 'Ocurrió un error al enviar',
                  html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
                  icon: 'warning',
                  width: '600px', // Establece un tamaño fijo para la alerta
                  confirmButtonText: 'Aceptar',
                  allowOutsideClick: false
                });
                
              }
          },
          error: (error) => {
            
            this.spinner.hide();
            var errorMessage = error.message;
            console.error('There was an error!====================>');
            console.log(error);
            this.toaster.open({
              text: errorMessage,
              caption: 'Ocurrio un error',
              type: 'danger',
              // duration: 994000
            }); 
            Swal.fire({
              title: 'Ocurrió un error al enviar',
              html: error.error.json.respuesta +'<b> DETALLE: <b/><br>'+this.processResponse(error.error.json.detalle),  // Usamos 'html' en lugar de 'text'
              icon: 'warning',
              width: '600px', // Establece un tamaño fijo para la alerta
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false
            });
          }
        });

      // Llamar a tu API
      /*const response: any = await firstValueFrom(
        this._service.enviarSalidaSAP(this.obtenerDatosParaSAP())
      );
      
      this.spinner.hide();
      
      if (response.status === 200) {*/
      /*} else {
        this.mostrarErrorSAP('Salida', response.mensaje);
      }*/
    } catch (error: any) {
      this.spinner.hide();
      this.mostrarErrorSAP('Salida', error.message);
    }
  });
}

  // Función que valida si el contenido es JSON o no
  processResponse(detalle) {
  // Intentamos parsear el contenido como JSON
  try {
    // Si el contenido ya es un objeto, no lo necesitamos parsear, solo procesamos el objeto
    if (typeof detalle === 'object') {
      return this.generateHtmlFromJson(detalle); // Procesamos como JSON
    }

    // Si es un string, intentamos parsearlo
    let parsedJson = JSON.parse(detalle);
    return this.generateHtmlFromJson(parsedJson);
  } catch (e) {
    // Si ocurre un error, es probable que no sea JSON, por lo que mostramos el contenido como texto
    return detalle; // Mostramos el texto tal cual
  }
}

// Función para generar el HTML a partir de un objeto JSON
  generateHtmlFromJson(jsonObj) {
  let htmlContent = '<ul>'; // Comenzamos una lista no ordenada
  for (let key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      // Si la propiedad es un objeto (como 'errors'), lo procesamos recursivamente
      if (typeof jsonObj[key] === 'object') {
        htmlContent += `<li><strong>${key}:</strong>${this.generateHtmlFromJson(jsonObj[key])}</li>`;
      } else {
        htmlContent += `<li><strong>${key}:</strong> ${jsonObj[key]}</li>`;
      }
    }
  }
  htmlContent += '</ul>'; // Cerramos la lista
  return htmlContent;
}
// Confirmación post-salida
private mostrarExitoSalida(codigo: string): void {
  const htmlContent = this.aplicaMerma 
    ? `
      <p>Código de Salida: <strong>${codigo}</strong></p>
      <hr>
      <p style="color: #f39c12;">⚠️ Este proceso requiere envío de merma</p> 
    `
    : `
      <p>Código de Salida: <strong>${codigo}</strong></p>
      <hr> 
    `; 
  Swal.fire({
  title: '✅ Salida Enviada',
  html: htmlContent,
  icon: 'success',
  confirmButtonText: 'Aceptar',   // 🔹 solo botón "Aceptar"
  confirmButtonColor: '#28a745',  // 🔹 color verde
  showCancelButton: false,        // 🔹 sin botón de cancelar
  allowOutsideClick: false,       // 🔹 no se cierra haciendo clic fuera
});
}

// 3. ENVIAR MERMA SAP
@ViewChild('modalMerma') modalMerma!: TemplateRef<any>;
  
  // Propiedades
  mermaData: any[] = [];
  cargandoMerma: boolean = false;
  enviandoMerma: boolean = false;
  modalRef: NgbModalRef | null = null;
  baseUrl: string = 'tu-url-base-api'; // Ajusta según tu configuración
  grupoSeleccionado: string = ''; // Obtén esto de donde corresponda 

async enviarSalidaMerma(): Promise<void> {
  if (!this.aplicaMerma) {
    console.warn('No aplica merma');
    return;
  }
  
  if (!this.pasos[1].completado) {
    this.toaster.open({
      text: 'Debe enviar la salida primero',
      type: 'warning'
    });
    return;
  } 
  try {
      this.cargandoMerma = true;
      
      // Abrir modal
      this.modalRef = this.modalService.open(this.modalMerma, { 
        size: 'xl', 
        backdrop: 'static',
        keyboard: false,
        centered: true
      });

      // Cargar datos
      await this.cargarDatosMerma();
      
    } catch (error: any) {
      console.error('Error al cargar merma:', error);
      
      this.toaster.open({
        text: error.message || 'Error al cargar datos de merma',
        type: 'danger'
      });
      
      // Cerrar modal si hay error
      if (this.modalRef) {
        this.modalRef.dismiss();
      }
    } finally {
      this.cargandoMerma = false;
    }
  /*
  Swal.fire({
    title: '🗑️ Enviar Merma a SAP',
    text: '¿Confirma el envío de la salida de merma?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, Enviar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#f39c12'
  }).then(async (result) => {
    if (!result.isConfirmed) return;
     
    
    try {*/
      /*const response: any = await firstValueFrom(
        this._service.enviarSalidaMermaSAP(this.obtenerDatosParaSAP())
      );
      
      this.spinner.hide();
      
      if (response.status === 200) {
        const codigoMerma = response.codigoMerma || response.codigo;
        */
        // Completar paso 3
        /*var codigoMerma="123";
        this.completarPaso(3, codigoMerma);
        this.avanzarPaso();
        
        // Preguntar por entrada
        this.mostrarExitoMerma(codigoMerma);*/
      /*} else {
        this.mostrarErrorSAP('Merma', response.mensaje);
      }*/
    /*} catch (error: any) {
      this.spinner.hide();
      this.mostrarErrorSAP('Merma', error.message);
    }
  });*/
}
 /**
   * Cargar datos de merma desde el API
   */
  async cargarDatosMerma(): Promise<void> {
    try {
      const response = await this._service.ListarMermaAModificar(this.DatosGrupo.cotizacionGrupo).toPromise();      
      this.mermaData = response || [];
      
      if (this.mermaData.length === 0) {
        throw new Error('No hay datos de merma para enviar');
      }

      console.log('Datos de merma cargados:', this.mermaData);
      
    } catch (error: any) {
      console.error('Error al cargar merma:', error);
      throw new Error(error.error?.mensaje || 'Error al cargar datos de merma');
    } 
  }

  /**
   * Confirmar y enviar merma al API
   */
  async confirmarEnvioMerma(modal: any): Promise<void> {
    // Validación final
    if (!this.validarTodosLosDatos()) {
      this.toaster.open({
        text: 'Complete todos los campos requeridos correctamente',
        type: 'warning'
      });
      return;
    }

  // Verificar que haya al menos un ítem para enviar
  if (!this.hayItemsParaEnviar()) {
    this.toaster.open({
      text: 'Debe haber al menos un ítem con merma mayor a 0 para enviar',
      type: 'warning'
    });
    return;
  }
// Contar ítems que se enviarán
  const itemsConMerma = this.mermaData.filter(item => {
    const mermaNum = parseFloat(item.merma);
    return !isNaN(mermaNum) && mermaNum > 0;
  });

  const itemsSinMerma = this.mermaData.length - itemsConMerma.length;
    // Mensaje de confirmación personalizado
  let textoConfirmacion = `Se enviarán ${itemsConMerma.length} ítem(s) con merma a SAP.`;
  if (itemsSinMerma > 0) {
    textoConfirmacion += `<br><small class="text-muted">${itemsSinMerma} ítem(s) con merma = 0 serán omitidos.</small>`;
  }

    // Confirmar con SweetAlert
    const confirmacion = await Swal.fire({
      title: '¿Confirmar envío?',
      html: textoConfirmacion, 
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f39c12',
      cancelButtonColor: '#6c757d'
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    // Preparar datos para enviar
    const datosEnviar = this.mermaData.map(item => ({
      id: item.id,
      itemCode: item.cod_Componente.trim(),
      itemDescription: item.descripcion.trim(),
      merma: item.merma,
      lote: item.lote ? item.lote.trim() : null
    }));

    console.log('Datos a enviar:', datosEnviar);

    // Enviar al API
    await this.guardarYEnviarMerma(datosEnviar, modal);
  }
/**
 * Validar si la merma es inválida
 */
esMermaInvalida(merma: any): boolean {
  // La merma es inválida si:
  // 1. Es null o undefined
  // 2. Es un string vacío
  // 3. Es menor a 0
  if (merma === null || merma === undefined || merma === '') {
    return true;
  }
  
  const mermaNum = parseFloat(merma);
  return isNaN(mermaNum) || mermaNum < 0;
} 

  

/**
 * Validar una fila individual
 * IMPORTANTE: Solo la merma es obligatoria, los demás campos pueden estar vacíos
 */
validarFila(item: any): boolean {
  // Solo validar que la merma sea válida
  return !this.esMermaInvalida(item.merma);
}

/**
 * Validar todos los datos antes de enviar
 */
validarTodosLosDatos(): boolean {
  if (this.mermaData.length === 0) {
    return false;
  }

  // Todos los ítems deben tener merma válida
  return this.mermaData.every(item => !this.esMermaInvalida(item.merma));
}

/**
 * Verificar si hay al menos un ítem con merma mayor a 0 para enviar
 */
hayItemsParaEnviar(): boolean {
  return this.mermaData.some(item => {
    const mermaNum = parseFloat(item.merma);
    return !isNaN(mermaNum) && mermaNum > 0;
  });
}

  /**
   * Enviar datos al API
   */
  async guardarYEnviarMerma(datos: any[], modal: any): Promise<void> {
    this.enviandoMerma = true;

    try {
      const idusuario = this.idUsuario; // O como obtengas el ID del usuario
      
      if (!idusuario) {
        throw new Error('No se pudo obtener el ID del usuario');
      }

      const response = await this._service.guardarYEnviarMerma(datos,idusuario).toPromise();

      console.log('Respuesta del servidor:', response);

      if (response.status === 200) {
        // Cerrar modal
        modal.close();
        // Mostrar éxito 
        // Limpiar datos
        this.mermaData = [];
         const codigoMerma = response.json.codigo;
        
        // Completar paso 3 
        this.completarPaso(3, codigoMerma);
        this.avanzarPaso();
        
        // Preguntar por entrada
        this.mostrarExitoMerma(codigoMerma);

      } else { 
                    Swal.fire({
                      title: 'Ocurrió un error al enviar',
                      html: this.processResponse(response.json.detalle),  // Usamos 'html' en lugar de 'text'
                      icon: 'warning',
                      width: '600px', // Establece un tamaño fijo para la alerta
                      confirmButtonText: 'Aceptar',
                      allowOutsideClick: false
                    }); 
      }

    } catch (error: any) {
      console.error('Error al guardar merma:', error);
     
           this.spinner.hide();
           var errorMessage = error.message;
           console.error('There was an error!====================>');
           console.log(error);
           this.toaster.open({
             text: errorMessage,
             caption: 'Ocurrio un error',
             type: 'danger',
             // duration: 994000
           }); 
           Swal.fire({
             title: 'Ocurrió un error al enviar',
             html: error.error.json.respuesta +'<b> DETALLE: <b/><br>'+this.processResponse(error.error.json.detalle),  // Usamos 'html' en lugar de 'text'
             icon: 'warning',
             width: '600px', // Establece un tamaño fijo para la alerta
             confirmButtonText: 'Aceptar',
             allowOutsideClick: false
           });

    } finally {
      this.enviandoMerma = false;
    }
  }
  /**
   * Método auxiliar para cerrar el modal programáticamente
   */
  /*cerrarModal(): void {
    if (this.modalRef) {
      this.modalRef.dismiss();
      this.modalRef = null;
    }
  }*/
// Confirmación post-merma
private mostrarExitoMerma(codigo: string): void {
 
  Swal.fire({
    title: '✅ Merma Enviada',
   html: `
      <p>Código de Merma: <strong>${codigo}</strong></p>
    `,
  icon: 'success',
  confirmButtonText: 'Aceptar',   // 🔹 solo botón "Aceptar"
  confirmButtonColor: '#28a745',  // 🔹 color verde
  showCancelButton: false,        // 🔹 sin botón de cancelar
  allowOutsideClick: false,       // 🔹 no se cierra haciendo clic fuera
});

}

// 4. ENVIAR ENTRADA SAP
 
async enviarEntradaSAP(): Promise<void> {
  const salidaCompletada = this.pasos[1].completado;
  const mermaCompletadaONoAplica = !this.aplicaMerma || this.pasos[2].completado;
  
  if (!salidaCompletada || !mermaCompletadaONoAplica) {
    this.toaster.open({
      text: 'Debe completar los pasos anteriores',
      type: 'warning'
    });
    return;
  }
  
  Swal.fire({
    title: '📥 Enviar Entrada a SAP',
    text: 'Último paso del proceso. ¿Confirma el envío?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, Enviar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#28a745'
  }).then(async (result) => {
    if (!result.isConfirmed) return;
     
    try {

       this.spinner.show();
  
  this._service.EnviarEntradaSap(this.DatosGrupo.numeroCotizacion, this.DatosGrupo.cotizacionGrupo,this.idUsuario)
    .subscribe({
      next: response => {
        this.spinner.hide();
        
        if (response.status == 200) {
          const respuesta = response.json.respuesta;
          const codigoEntrada = response.json.codigo; 
          if (respuesta == "OPERACION REALIZADA CORRECTAMENTE") {           
        // Completar paso 4
        this.completarPaso(4, codigoEntrada);
        this.procesoCompletado = true;        
        // Mostrar resumen final
        this.mostrarProcesoCompletado(); 
          } else { 
            this.mostrarError('Error al enviar a SAP', response.json.detalle); 
          }
        } else { 
            this.mostrarError('Error al enviar a SAP', response.json.detalle); 
        }
      },
      error: error => {
        this.spinner.hide();
        const errorDetail = error.error?.json?.detalle || error.message;
        const errorResponse = error.error?.json?.respuesta || '';
        
        this.mostrarError('Error al enviar a SAP', `${errorResponse} ${errorDetail}`);
      }
    });
    
    } catch (error: any) {
      this.spinner.hide();
      this.mostrarErrorSAP('Entrada', error.message);
    }
  });
}

// Método auxiliar para mostrar errores
mostrarError(titulo: string, detalle: string) {
  Swal.fire({
    title: titulo,
    html: this.processResponse(detalle),
    icon: 'error',
    width: '600px',
    confirmButtonText: 'Aceptar',
    allowOutsideClick: false
  });
}

// Resumen final
private mostrarProcesoCompletado(): void {
  const pasoSalida = this.pasos[1];
  const pasoMerma = this.pasos[2];
  const pasoEntrada = this.pasos[3];
  
  const htmlContent = `
    <div style="text-align: left; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 64px; color: #28a745;">✅</div>
        <h3 style="color: #28a745; margin: 10px 0;">Proceso Completado</h3>
      </div>
      
      <hr style="margin: 20px 0;">
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
        <p style="margin: 8px 0;">
          <strong>📤 Salida SAP:</strong> 
          <span style="color: #007bff;">${pasoSalida.codigo}</span>
        </p>
        
        ${this.aplicaMerma ? `
          <p style="margin: 8px 0;">
            <strong>🗑️ Merma SAP:</strong> 
            <span style="color: #f39c12;">${pasoMerma.codigo}</span>
          </p>
        ` : ''}
        
        <p style="margin: 8px 0;">
          <strong>📥 Entrada SAP:</strong> 
          <span style="color: #28a745;">${pasoEntrada.codigo}</span>
        </p>
      </div>
      
      <hr style="margin: 20px 0;">
      
      <p style="font-size: 12px; color: #666; text-align: center;">
       
      </p>
    </div>
  `;
  
  Swal.fire({
    title: '',
    html: htmlContent,
    icon: 'success',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#28a745',
    allowOutsideClick: false,
    allowEscapeKey: false,
    width: '600px'
  });
}

// Método auxiliar para errores
private mostrarErrorSAP(tipo: string, mensaje: string): void {
  Swal.fire({
    title: `❌ Error al Enviar ${tipo}`,
    html: `
      <p>${mensaje}</p>
      <hr>
      <p style="font-size: 13px; color: #666;">
        Puede intentar nuevamente o contactar a soporte
      </p>
    `,
    icon: 'error',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#d33'
  });
} 

/**
 * Obtiene el mensaje de ayuda según el paso activo
 */
obtenerMensajeAyuda(pasoId: number): string {
  const mensajes = {
    1: 'Presione el botón "Guardar" para almacenar la explosión en la base de datos',
    2: 'Presione "Enviar Salida" para registrar la salida de materiales en SAP',
    3: 'Presione "Enviar Merma" para registrar la salida de merma en SAP',
    4: 'Presione "Enviar Entrada" para completar el proceso de entrada en SAP'
  };
  
  return mensajes[pasoId] || '';
}

// Método auxiliar para obtener datos
private obtenerDatosParaSAP(): any {
  // Retornar los datos necesarios según tu estructura
  return {
    grupo: this.DatosGrupo.cotizacionGrupo,
    componentes: this.ListComponenteProducto,
    usuario: this.idUsuario
    // ... otros datos necesarios
  };
}
// Calcular progreso
calcularProgreso(): number {
  const pasosRequeridos = this.pasos.filter(p => 
    !p.opcional || (p.opcional && this.aplicaMerma)
  );
  
  const completados = pasosRequeridos.filter(p => p.completado).length;
  
  return Math.round((completados / pasosRequeridos.length) * 100);
}

// Verificar si puede enviar entrada
puedeEnviarEntrada(): boolean {
  const salidaOk = this.pasos[1].completado;
  const mermaOk = !this.aplicaMerma || this.pasos[2].completado;
  
  return salidaOk && mermaOk;
}

// Guardar estado
private guardarEstadoWorkflow(): void {
  const key = `workflow_${this.DatosGrupo.cotizacionGrupo}`;
  const estado = {
    pasos: this.pasos,
    pasoActual: this.pasoActual,
    aplicaMerma: this.aplicaMerma,
    procesoCompletado: this.procesoCompletado
  };
  
  localStorage.setItem(key, JSON.stringify(estado));
}

// Cargar estado
private cargarEstadoWorkflow(): void {
  const key = `workflow_${this.DatosGrupo.cotizacionGrupo}`;
  const saved = localStorage.getItem(key);
  
  if (saved) {
    const estado = JSON.parse(saved);
    this.pasos = estado.pasos;
    this.pasoActual = estado.pasoActual;
    this.aplicaMerma = estado.aplicaMerma;
    this.procesoCompletado = estado.procesoCompletado;
    
    // Convertir fechas
    this.pasos.forEach(p => {
      if (p.fecha) {
        p.fecha = new Date(p.fecha);
      }
    });
  }
}

// Limpiar estado
private limpiarEstadoWorkflow(): void {
  const key = `workflow_${this.DatosGrupo.cotizacionGrupo}`;
  localStorage.removeItem(key);
}

// Determinar si aplica merma
 
private determinarSiAplicaMerma(data: any[]): boolean {
  if (!data || !Array.isArray(data)) {
    return false;
  }
  
  return data.some(item => item.merma > 0);
}
// Agregar al componente
modoEdicion: boolean = false; // Para saber si está en modo edición
datosModificados: boolean = false; // Para detectar si hubo cambios
//#region  AQUIII OTROS

//#endregion
private readonly ORDEN_TIPOS = ['TUBO', 'TELA', 'RIEL'];
  // En tu clase del componente:
@ViewChild(MatSelect) matSelect: MatSelect;
  spinnerMessage: string = 'Cargando...';
  sheetWidth = 1000;
  sheetHeight = 700;
  savedData: any = null;
  
  // Variables para el modal
  isModalOpen: boolean = false;
  seleccionado: any = null;
  dataItemsOriginal: any[] = [];
  dataItems: any[] = [];
  currentValue: any;
  colSelected: any;
  rowSelected: any;
  
  ListComponenteProducto: any = [];
  
  // 👉 INSTANCIA DEL HELPER
  private luckysheetHelper: LuckysheetHelper; 
  
  constructor(
    private http: HttpClient,
    private _service: MonitoreoService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,private route: ActivatedRoute,private router: Router,
    private toaster: Toaster,
      private apiSap:SapService,
      private _productoService: ProductoService,
    private modalService: NgbModal,
  ) {
    this.luckysheetHelper = new LuckysheetHelper(); // 👈 INICIALIZAR HELPER
  }
// Propiedad para controlar el estado del toolbar
isToolbarCollapsed: boolean = true;
// Método para alternar el estado
toggleToolbar(): void {
  this.isToolbarCollapsed = !this.isToolbarCollapsed;
  
  // Opcional: guardar el estado en localStorageF
  localStorage.setItem('toolbarCollapsed', this.isToolbarCollapsed.toString());
}

idUsuario:any;
DatosGrupo:any;
mostrarOpciones:boolean=false;
  ngOnInit(): void {     
     if (this.DatosGrupo) {
    this.cargarEstadoWorkflow();
    
    // Determinar si aplica merma (según tu lógica)
    this.aplicaMerma =false;// this.determinarSiAplicaMerma(); 
    // 🎯 DETERMINAR SI APLICA MERMA
    //this.determinarAplicaMerma();
  }
  // Cargar estado del stepper
  /*const stepperState = localStorage.getItem('stepperCollapsed');
  if (stepperState !== null) {
    this.stepperCollapsed = stepperState === 'true';
  }*/
  // Obtener usuario
  const userDataString = localStorage.getItem('UserLog');
  if (userDataString) {
    const user = JSON.parse(userDataString);
    this.idUsuario = user.id.toString();
  }

  // Intentar recuperar el estado desde la navegación activa
  const navigation = this.router.getCurrentNavigation();
  const stateData =
    navigation?.extras.state?.['data'] ||
    history.state?.data ||
    null;

  if (stateData) {
    console.log('Datos recibidos:', stateData);
    this.DatosGrupo = stateData;
    this.listarComponenteProductoByGrupo(this.DatosGrupo.cotizacionGrupo);
/*
    this.adjustSheetSize();
    window.addEventListener('resize', () => this.adjustSheetSize());
    */

    document.removeEventListener('paste', this.handlePaste);
    document.removeEventListener('copy', this.handleCopy);
  } else {   
    Swal.fire({
    title: 'Sin datos disponibles',
    text: 'No se recibieron datos para cargar la explosión.',
    icon: 'warning',
    confirmButtonText: 'Volver al monitoreo',
    confirmButtonColor: '#3085d6',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then(() => {
    this.router.navigate(['/Monitoreo-Produccion']); 
  });
  }

  // Restaurar estado del toolbar
  /*
  const savedState = localStorage.getItem('toolbarCollapsed');
  if (savedState !== null) {
    this.isToolbarCollapsed = savedState === 'true';
  }
*/

  }

// Método para determinar si aplica merma
private determinarAplicaMerma(): void {
  // Opción 1: Basado en productos
  if (this.DatosGrupo.productos?.toUpperCase().includes('MERMA')) {
    this.aplicaMerma = true;
    return;
  }
  
  // Opción 2: Basado en tipo de accionamiento
  if (this.DatosGrupo.accionamiento?.toUpperCase().includes('MOTORIZADO')) {
    this.aplicaMerma = true;
    return;
  }
  
  // Opción 3: Basado en configuración del grupo
  if (this.DatosGrupo.configuracion?.aplicaMerma === true) {
    this.aplicaMerma = true;
    return;
  }
  
  // Opción 4: Preguntar al usuario al inicio
  this.preguntarSiAplicaMerma();
}

// Preguntar al usuario
private preguntarSiAplicaMerma(): void {
  Swal.fire({
    title: '⚙️ Configuración',
    text: '¿Este proceso requiere envío de merma a SAP?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, aplica merma',
    cancelButtonText: 'No aplica merma',
    confirmButtonColor: '#f39c12',
    cancelButtonColor: '#6c757d',
    allowOutsideClick: false
  }).then((result) => {
    this.aplicaMerma = result.isConfirmed;
    this.guardarEstadoWorkflow();
  });
}

  //#region MEOTODOS PARA OBTENER DATA DEL BD
/**
 * Lista componentes de productos por grupo
 */
async listarComponenteProductoByGrupo(grupo: string): Promise<void> {
  try {
    // Validar sesión
    if (!this.validarSesion()) {
      return;
    }

    // Cargar maestro de artículos si es necesario
    //await this.cargarMaestroArticulosSiEsNecesario();

    // Obtener y procesar productos
    const codigosProductos = this.extraerCodigosProductos();
    
    if (!codigosProductos || codigosProductos.length === 0) {
      console.warn('No hay productos para procesar');
      return;
    }

    // Limpiar lista de componentes antes de empezar
    this.ListComponenteProducto = [];

    // Procesar productos en lote
    await this.procesarProductosEnLote(grupo, codigosProductos); 

    console.log("DATA OBTENIDA");
    console.log(this.ListComponenteProducto);
    // Inicializar Luckysheet con los datos cargados
    await this.inicializarLuckysheetConDatos();

  } catch (error) {
    this.mostrarOpciones=true;
    console.error('❌ Error en listarComponenteProductoByGrupo:', error);
    this.spinner.hide();
    this.mostrarErrorexcel('Error al cargar componentes de productos');
  }
}

/**
 * Valida la sesión del usuario
 */
private validarSesion(): boolean {
  const userDataString = localStorage.getItem('UserLog');
  
  if (!userDataString) {
    this.toaster.open({
      text: 'Su sesión ha caducado',
      caption: 'Mensaje',
      type: 'danger'
    });
    this.router.navigate(['/Home-main']);
    return false;
  }

  try {
    const userData = JSON.parse(userDataString);
    if (!userData.id) {
      throw new Error('ID de usuario no encontrado');
    }
    return true;
  } catch (error) {
    console.error('Error al parsear datos de usuario:', error);
    this.router.navigate(['/Home-main']);
    return false;
  }
}

/**
 * Carga el maestro de artículos si es necesario
 */
private async cargarMaestroArticulosSiEsNecesario(): Promise<void> {
  if (this.ListMaestroArticulos.length === 0) {
    console.log('📦 Cargando maestro de artículos desde BD...');
    this.spinner.show();
    
    try {
      await this.ListarMaestroArticulos();
      console.log('✅ Maestro de artículos cargado');
    } catch (error) {
      console.error('❌ Error al cargar maestro de artículos:', error);
      throw error;
    } finally {
      this.spinner.hide();
    }
  } else {
    console.log('📦 Usando maestro de artículos en caché');
  }
}

/**
 * Extrae los códigos de productos desde DatosGrupo
 */
private extraerCodigosProductos(): string[] {
  if (!this.DatosGrupo?.productos) {
    console.error('DatosGrupo.productos no está definido');
    return [];
  }

  const productosString = this.DatosGrupo.productos;
  const productosArray = productosString
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  console.log('📋 Productos a procesar:', productosArray);
  return productosArray;
}

/**
 * Procesa múltiples productos en lote
 */
private async procesarProductosEnLote(grupo: string, codigosProductos: string[]): Promise<void> {
  console.log(`🔄 Procesando ${codigosProductos.length} productos...`);
  
  let procesados = 0;
  let errores = 0;
  //var codigosProductos=['PRTRSMan', 'PRTRSMot'];
  this.inicializarCombosPorHoja(codigosProductos);
  for (const codigoProducto of codigosProductos) {
    //if (this.debeProcerarProducto(codigoProducto)) {   
      try {
        this.spinnerMessage = `Cargando producto: ${codigoProducto} (${procesados + 1}/${codigosProductos.length})`;
        this.spinner.show('cargandoProductos');

        await this.procesarProducto(grupo, codigoProducto);
        procesados++;
        
        console.log(`✅ Producto procesado: ${codigoProducto}`);
      } catch (error) {
        errores++;
        console.error(`❌ Error procesando ${codigoProducto}:`, error);
      } finally {
        this.spinner.hide('cargandoProductos');
      }
    /*} else {
      console.log(`⏭️ Producto omitido: ${codigoProducto}`);
    }*/
  }

  this.spinner.hide();
  console.log(`✅ Procesamiento completado: ${procesados} exitosos, ${errores} errores`);
}
  // 🎯 CONFIGURACIÓN DE PRODUCTOS
private readonly PRODUCTOS_ESPECIALES = {
  ROLLERS_MANUAL: 'PRTRSMan',
  ROLLERS_MOTOR: 'PRTRSMot',
  ROLLER_Z: 'PRTRZ',
  MOTOR_16: 'PRTRM00000016',
  MOTOR_1: 'PRTRM00000001',
  HORIZONTAL_1: 'PRTRH00000001',
  RIEL_FLEXIBLE: 'PRTRF00000001',
  LUXAFLEX: ['PRTLU00000001', 'PRTLU00000002', 'PRTLU00000003']
};
/**
 * Determina si un producto debe ser procesado
 */
private debeProcerarProducto(codigoProducto: string): boolean {
  const codigo = codigoProducto.toUpperCase();
  const { PRODUCTOS_ESPECIALES } = this; 

  return (
    codigo === PRODUCTOS_ESPECIALES.ROLLERS_MANUAL.toUpperCase()  ||
    codigo === PRODUCTOS_ESPECIALES.ROLLERS_MOTOR.toUpperCase()  ||
    codigo === PRODUCTOS_ESPECIALES.ROLLER_Z.toUpperCase()  ||
    codigo === PRODUCTOS_ESPECIALES.MOTOR_16.toUpperCase()  ||
    codigo === PRODUCTOS_ESPECIALES.MOTOR_1.toUpperCase()  ||
    codigo === PRODUCTOS_ESPECIALES.HORIZONTAL_1.toUpperCase()  ||
    codigo === PRODUCTOS_ESPECIALES.RIEL_FLEXIBLE.toUpperCase()  ||
    PRODUCTOS_ESPECIALES.LUXAFLEX.map(l => l.toUpperCase()).includes(codigo) ||
    codigo.includes('PRTCV')
  );
}
/**
 * Obtiene el código del producto especial si coincide
 * Retorna el código (ej: 'PRTRSMan') o null si no es especial
 */
private obtenerCodigoProductoEspecial(codigoProducto: string): string | null {
  const codigo = codigoProducto.toUpperCase();
  const { PRODUCTOS_ESPECIALES } = this;
  
  if (codigo === PRODUCTOS_ESPECIALES.ROLLERS_MANUAL.toUpperCase()) return PRODUCTOS_ESPECIALES.ROLLERS_MANUAL;
  if (codigo === PRODUCTOS_ESPECIALES.ROLLERS_MOTOR.toUpperCase()) return PRODUCTOS_ESPECIALES.ROLLERS_MOTOR;
  if (codigo === PRODUCTOS_ESPECIALES.ROLLER_Z.toUpperCase()) return PRODUCTOS_ESPECIALES.ROLLER_Z;
  if (codigo === PRODUCTOS_ESPECIALES.MOTOR_16.toUpperCase()) return PRODUCTOS_ESPECIALES.MOTOR_16;
  if (codigo === PRODUCTOS_ESPECIALES.MOTOR_1.toUpperCase()) return PRODUCTOS_ESPECIALES.MOTOR_1;
  if (codigo === PRODUCTOS_ESPECIALES.HORIZONTAL_1.toUpperCase()) return PRODUCTOS_ESPECIALES.HORIZONTAL_1;
  if (codigo === PRODUCTOS_ESPECIALES.RIEL_FLEXIBLE.toUpperCase()) return PRODUCTOS_ESPECIALES.RIEL_FLEXIBLE;
  
  // Para Luxaflex, retorna el código específico que coincidió
  const luxaflexMatch = PRODUCTOS_ESPECIALES.LUXAFLEX.find(l => l.toUpperCase() === codigo);
  if (luxaflexMatch) return luxaflexMatch;
  
  // Para cortinas, retorna el código original si contiene PRTCV
  if (codigo.includes('PRTCV')) return codigoProducto;
  
  return null;
}
/**
 * Procesa un producto específico y lo agrega a la lista
 */
// 2️⃣ Registrar combo vacío (sin data aún)
registrarCombo(codigoProducto: string, tipoCombo: string) {
  if (this.combosPorHoja[codigoProducto]) {
    this.combosPorHoja[codigoProducto].combos[tipoCombo] = [];
  }
}
registrarCombos(codigoProducto: string, tiposCombos: string[]) {
  if (this.combosPorHoja[codigoProducto]) {
    tiposCombos.forEach(tipo => {
      this.combosPorHoja[codigoProducto].combos[tipo] = [];
    });
  }
}
async procesarProducto(grupo: string, codigoProducto: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const accionamiento = this.obtenerAccionamiento();

    this._service.ListarFormulacionRollerShade('-', grupo, codigoProducto, accionamiento)
      .subscribe({
        next: async (data: any) => {
          try {
            if (data?.status === 200 && data.json) {
              const productosFormateados = this.formatearProductos(data.json, codigoProducto); 
              // Filtrar y obtener tipos únicos (sin ACCESORIO)
            /*  const tiposUnicos = productosFormateados
                .filter(item => item.tipoDesc !== "ACCESORIO")
                .map(item => item.tipoDesc.toLowerCase())
                .filter((value, index, self) => self.indexOf(value) === index); // Eliminar duplicados

              // Registrar combos
              this.registrarCombos(codigoProducto, tiposUnicos);

              console.log(`Combos registrados para ${codigoProducto}:`, tiposUnicos);*/
              // Ejemplo: ['tela', 'tubo', 'riel', 'cadena']

              this.ListComponenteProducto.push({
                data: productosFormateados,
                hoja: codigoProducto
              });
              console.log(`✅ ${codigoProducto}: ${productosFormateados.length} items agregados`);
              resolve();
            } else {
              console.error(`Error en respuesta para ${codigoProducto}:`, data);
              reject(new Error('Respuesta inválida del servidor'));
            }
          } catch (error) {
            console.error(`Error procesando datos de ${codigoProducto}:`, error);
            reject(error);
          } finally {
            this.spinner.hide('cargandoProductos');
          }
        },
        error: (error: any) => {
          this.spinner.hide('cargandoProductos');
          console.error(`❌ Error en servicio para ${codigoProducto}:`, error);
          reject(error);
        }
      });
  });
}

combosPorHoja:any;// 1️⃣ Inicializar la estructura base
/*
"PRTRSMan": {
    combos: {
      tela: [
        { id: 1, nombre: 'Tela Screen' },
        { id: 2, nombre: 'Tela Blackout' }
      ],
      tubo: [
        { id: 1, nombre: 'Tubo 40mm' },
        { id: 2, nombre: 'Tubo 50mm' }
      ],
      riel: [
        { id: 1, nombre: 'Riel Simple' }
      ]
    }
  },
*/
inicializarCombosPorHoja(codigosProductos: string[]) {
  this.combosPorHoja = {};
  
  for (const codigo of codigosProductos) {
    this.combosPorHoja[codigo] = {
      combos: {}  // Objeto para agregar combos dinámicamente
    };
  }
  
  console.log('Estructura inicializada:', this.combosPorHoja);
}

// 2️⃣ Agregar combos dinámicamente
agregarCombo(codigoProducto: string, tipoCombo: string, datos: any[]) {
  if (this.combosPorHoja[codigoProducto]) {
    this.combosPorHoja[codigoProducto].combos[tipoCombo] = datos;
  }
}
/**
 * Obtiene el accionamiento del grupo actual
 */
private obtenerAccionamiento(): string {
  if (!this.DatosGrupo?.accionamiento) {
    return '';
  }

  const partes = this.DatosGrupo.accionamiento
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return partes.includes('Motorizado') ? 'Motorizado' : partes[0] || '';
}

/**
 * Formatea los productos según el tipo
 */
private formatearProductos(productos: any[], codigoProducto: string): any[] {
  // Agregar lote vacío a todos los productos
  let productosConLote = productos.map(p => ({
    ...p,
    lote: ''
  }));

  // Ordenar si es producto de tipo roller
  const { PRODUCTOS_ESPECIALES } = this;
  const esRollerEspecial = [
    PRODUCTOS_ESPECIALES.ROLLERS_MANUAL,
    PRODUCTOS_ESPECIALES.ROLLERS_MOTOR,
    PRODUCTOS_ESPECIALES.ROLLER_Z
  ].includes(codigoProducto);

  if (esRollerEspecial) {
    return this.ordenarPorTipo(productosConLote);
  }

  return productosConLote;
}

/**
 * Ordena productos según el orden personalizado de tipos
 */
private ordenarPorTipo(productos: any[]): any[] {
  return productos.sort((a, b) => {
    const indexA = this.ORDEN_TIPOS.indexOf(a.tipoDesc);
    const indexB = this.ORDEN_TIPOS.indexOf(b.tipoDesc);
    
    const posA = indexA === -1 ? 999 : indexA;
    const posB = indexB === -1 ? 999 : indexB;
    
    return posA - posB;
  });
}

/**
 * Inicializa Luckysheet con los datos cargados
 */
private async inicializarLuckysheetConDatos(): Promise<void> {
  try {
    console.log('🎨 Inicializando Luckysheet...');
    
    // Destruir instancia previa
    this.luckysheetHelper.destroy();

    // Esperar un momento para asegurar la limpieza
    await this.delay(500);
 
    
          try {
            this.luckysheetHelper.destroy();
            setTimeout(() => {
              this.initializeLuckysheet();
              this.setupClipboardHandling(); 
    this.toaster.open({
      text: `${this.ListComponenteProducto.length} hojas cargadas correctamente`,
      caption: 'Éxito',
      type: 'success',
      duration: 3000
    });
            }, 500);
          } catch (error) {
            console.error('Error al cargar datos de ejemplo:', error);
            alert('Error al cargar datos de ejemplo');
          }
          
  } catch (error) {
    console.error('❌ Error al inicializar Luckysheet:', error);
    this.mostrarErrorexcel('Error al inicializar la hoja de cálculo');
  }finally{
    this.mostrarOpciones=true;}
}

/**
 * Utilidad para crear delays
 */
private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Muestra un mensaje de error
 */
private mostrarErrorexcel(mensaje: string): void {
  this.toaster.open({
    text: mensaje,
    caption: 'Error',
    type: 'danger',
    duration: 5000
  });
}

  //#endregion





  ngAfterViewInit(): void {
    setTimeout(() => {
    // ⭐ Deshabilitar scroll del body
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
      this.initializeLuckysheet();
      this.setupClipboardHandling(); 
    // 🎯 AGREGAR SOLO ESTA LÍNEA
    this.setupMouseWheelScroll();
    }, 500);
  } 
// 🎯 Método 1: Configurar scroll con rueda del mouse
private setupMouseWheelScroll(): void {
  const luckysheetContainer = document.getElementById('luckysheet');
  
  if (!luckysheetContainer) {
    console.warn('Contenedor de Luckysheet no encontrado');
    return;
  }

  setTimeout(() => {
    const scrollContainer = luckysheetContainer.querySelector('.luckysheet-scrollbar-ltr') ||
                           luckysheetContainer.querySelector('.luckysheet-cell-flow') ||
                           luckysheetContainer.querySelector('#luckysheet-cell-main');
    
    if (!scrollContainer) {
      this.addWheelListener(luckysheetContainer);
      return;
    }

    this.addWheelListener(scrollContainer as HTMLElement);
  }, 1000);
}

// 🎯 Método 2: Agregar listener de rueda del mouse
private addWheelListener(element: HTMLElement): void {
  element.removeEventListener('wheel', this.handleWheel as any);
  element.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
  console.log('✅ Scroll con rueda del mouse configurado');
}

// 🎯 Método 3: Manejador del evento wheel
private handleWheel(e: WheelEvent): void {
  // CRÍTICO: NO BLOQUEAR SI EL EVENTO VIENE DEL MODAL
  const target = e.target as HTMLElement;
  
  const isFromModal = target.closest('.modal-overlay') || 
                      target.closest('.modal-container') ||
                      target.closest('.cdk-overlay-container') ||
                      target.closest('mat-select-panel') ||
                      target.closest('.mat-select-panel');
  
  if (isFromModal) {
    return; // Dejar que el scroll nativo funcione en el modal
  }
  
  const isFromLuckysheet = target.closest('#luckysheet') !== null;
  
  if (!isFromLuckysheet) {
    return;
  }
  
  e.preventDefault();
  e.stopPropagation();
  
  try {
    const cellMain = document.querySelector('#luckysheet-cell-main') as HTMLElement;
    
    if (!cellMain) return;

    const scrollSpeed = 3;
    const deltaY = e.deltaY * scrollSpeed;
    const deltaX = e.deltaX * scrollSpeed;

    const currentScrollTop = cellMain.scrollTop || 0;
    const currentScrollLeft = cellMain.scrollLeft || 0;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      cellMain.scrollTop = currentScrollTop + deltaY;
    } else {
      cellMain.scrollLeft = currentScrollLeft + deltaX;
    }

    if (typeof luckysheet !== 'undefined' && luckysheet.scroll) {
      const sheet = luckysheet.getSheet();
      if (sheet) {
        luckysheet.scroll({
          scrollTop: cellMain.scrollTop,
          scrollLeft: cellMain.scrollLeft
        });
      }
    }
    
  } catch (error) {
    console.error('Error en handleWheel:', error);
  }
}
  ngOnDestroy(): void { 

  document.body.style.overflow = 'auto';
  document.body.style.height = 'auto';
  
  this.luckysheetHelper.destroy();
  document.removeEventListener('paste', this.handlePaste);
  document.removeEventListener('copy', this.handleCopy);// 🎯 AGREGAR ESTA PARTE
  const luckysheetContainer = document.getElementById('luckysheet');
  if (luckysheetContainer) {
    luckysheetContainer.removeEventListener('wheel', this.handleWheel as any);
  }
  }

 

//#region  CARGAR COMBOS

    async listarComponentes(codigoProducto: string): Promise<any[]> {
      this.spinner.show();
      try {
        const response = await firstValueFrom(
          this._productoService.listarAccesorioXProducto(codigoProducto)
        );
        this.spinner.hide();
        return response || [];
      } catch (error) {
        console.log("error: ", error);
        this.spinner.hide();
        return [];
      }
    } 
    //CORREA,CRUCETA,FAJA,FRENO, etc
 private async listarComponestePorCodigoProdSoloAccesorios(codProducto: string, tipoDesc: string) {   
  let tipoProducto = codProducto;
  if (codProducto.toUpperCase().includes('PRTCV')) {
    tipoProducto = 'PRTRH00000001';
  }
  
  const response = await this.listarComponentes(tipoProducto);
  
  if (!response || response.length === 0) {
    console.warn(`No se encontraron componentes para ${tipoProducto}`);
    return;
  }
  
  const transformarItem = (item: any) => ({
    codigoTipo: item.codigo,
    descripcionTipo: item.descripcion,
    unidadMedida: item.unidad,
    color: item.color,
    serie: item.serie,
    lote: item.lote
  });
   
    // Accesorios normales
    const transformedData = response.map(transformarItem);
    
    // Agregar opción "Ninguno" al inicio
    transformedData.unshift({
      codigoTipo: "Ninguno",
      descripcionTipo: "Ninguno",
      unidadMedida: "",
      color: "",
      serie: "",
      lote: ""
    });
    
    // ✅ INICIALIZAR SI NO EXISTE
    if (!this.combosPorHoja[codProducto].combos[tipoDesc]) {
      this.combosPorHoja[codProducto].combos[tipoDesc] = [];
    }
    
    // ✅ AGREGAR ELEMENTOS CON SPREAD
    this.combosPorHoja[codProducto].combos[tipoDesc].push(...transformedData);
  //}
}

private async listarComponestePorCodigoProdsOFICIAL(codProducto,tipoDesc){   
       console.log(codProducto); // 'PRTRSMan' ✅

// Obtener el tipo de producto
let tipoProducto =codProducto;//PRTRS ,PRTRZ,PRTRM00000016, PRTRM00000001, PRTRH00000001, PRTRF00000001, PRTLU00000001_2_3 
if(codProducto.toUpperCase().includes('PRTCV')){
        tipoProducto='PRTRH00000001';
        codProducto='PRTRH00000001';
      }
 
         
// Obtener valores únicos con mayúscula/minúscula corregida y excluir "ACCESORIO"
  //PARA LISTAR RIEL,TELA, ETC pero  !== "ACCESORIO") 
//elimina duplicados de tela,tubo, etc 
 
  if(codProducto=='PRTRSMan' || codProducto=='PRTRSMot' || codProducto=='PRTRZ'){

     const componente=tipoDesc;
      console.log(this.ListMaestroArticulos);
        const maestro = this.ListMaestroArticulos.find(item => item.nombreGrupo.toUpperCase() === componente.toUpperCase());
        console.log("COMPONENTES BUSCADOS");
        console.log(componente); 
        console.log(maestro);
        if (maestro) {
            // Marca los componentes en estado de carga 
            try {
      this.spinnerMessage = `Cargando Componentes: ${componente}`;
      this.spinner.show('cargandoProductos');
                // Intentar obtener datos con reintentos
                const data = await this.obtenerDatosConReintentos(maestro, componente)as any[];   
              const transformedData = data.map((item: any) => ({
                codigoTipo: item.codigo,
                descripcionTipo: item.nombre,
                unidadMedida: item.unidadMedida,
                color: item.color,
                serie: item.serie,
                lote: item.lote,
              }));
     
              console.log("RESULTADO ===>",componente);
              console.log(transformedData);             
              
                // Agregar elemento "Ninguno" al inicio del array
                transformedData.unshift({
                  codigoTipo: "Ninguno", // o algún valor especial como 0 o -1
                  descripcionTipo: "Ninguno",
                  unidadMedida: "",
                  color: "",
                  serie: "",
                  lote: "",
                }); 
              
         const subGrupo =tipoDesc;
        if (!this.combosPorHoja[codProducto].combos[subGrupo]) {
        this.combosPorHoja[codProducto].combos[subGrupo] = [];
        }  
        // Agregar al array existente 
                this.combosPorHoja[codProducto].combos[subGrupo].push(...transformedData);
          console.log("ITEM FINALIZADO");
              this.spinner.hide('cargandoProductos');
            } catch (error) {
              this.spinner.hide('cargandoProductos');
                console.error(`Error al cargar datos para el componente ${componente}:`, error);
                this.spinner.hide();
                // Mostrar mensaje de error solo si es error de COM object
                if (error.error?.ErrorDescription?.includes('COM object')) {
                    this.toaster.open({
                        text: `Error de conexión SAP para el componente ${componente}. Reintentando...`,
                        caption: 'Error',
                        type: 'warning',
                    });
                }
            } 
        } 
  
  }
  
}

capitalizeFirstLetter(value: string): string { 
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

// Método auxiliar para reintentos
private async obtenerDatosConReintentos(maestro, componente, maxIntentos = 3) {
  for (let intento = 1; intento <= maxIntentos; intento++) {
      try {
          return await new Promise((resolve, reject) => {
              const subscription = this.apiSap
                  .ListarArticulosPorFamiliaGrupo(maestro.codigoGrupo, maestro.identificador)
                  .subscribe({
                      next: (data) => {
                          resolve(data);
                          subscription.unsubscribe();
                      },
                      error: (error) => {
                          reject(error);
                          subscription.unsubscribe();
                      }
                  });
          });
      } catch (error) {
        this.spinner.hide();
          if (intento === maxIntentos || !error.error?.ErrorDescription?.includes('COM object')) {
              throw error;
          }
          // Esperar antes de reintentar
          await new Promise(resolve => setTimeout(resolve, 1000 * intento));
      }
  }
}

//#endregion

  //#region TODO EXCEL LOOKSHETS

  private adjustSheetSize(): void { 

     const container = document.querySelector('.toolbarbut');
    this.sheetHeight = window.innerHeight-container.clientHeight;
  } 

nombreHojaActiva: string = '';
  private initializeLuckysheet(): void {
    // 👉 USAR EL HELPER PARA INICIALIZAR
    this.luckysheetHelper.initializeLuckysheet(this.DatosGrupo,
      this.ListComponenteProducto,
      {
        onCellMousedown: this.handleCellMousedown.bind(this),
        onCellEditBefore: this.handleCellEditBefore.bind(this),
        onCellUpdated: this.handleCellUpdated.bind(this),
        onRangeSelect: this.handleRangeSelect.bind(this),
        onSheetActivate: this.handleSheetActivate.bind(this),
      onWorkbookCreateAfter: this.handleWorkbookCreateAfter.bind(this)
      }
    );
  }

HabilitarCombos:boolean=false;  
onCheckCombos(event: any) {
  console.log('Checkbox cambiado:', event.checked);
  // Aquí puedes ejecutar tu lógica
  if (event.checked) {
    // Lógica cuando se marca
    console.log('Checkbox marcado');
     this.HabilitarCombos=true;
  } else {
    this.HabilitarCombos=false;
  } 
}
volver(){
 
   this.router.navigate(['/Monitoreo-Produccion']);
}
  // CALLBACKS
  private handleCellMousedown(cell: any, position: any, sheetFile: any, ctx: any): boolean {
    const row = position?.row?.[0] ?? position?.r;
    const col = position?.column?.[0] ?? position?.c;
    
    console.log(`Click detectado - Row: ${row}, Col: ${col}`);
    
    if (col === 8 && row > 0 && row !== undefined && col !== undefined && sheetFile.name === "Empleados") {
      console.log(`Click en celda Departamento: [${row}, ${col}]`);
      return false;
    }
    
    if (col === 1 && row > 0 && row !== undefined && col !== undefined && sheetFile.name.toLowerCase().includes("producto-") && this.HabilitarCombos==true) {
       const filaSelected = this.getRowDataAsObject(row, sheetFile);
       this.filaSelectedExcel=filaSelected;
     console.log('Fila como objeto:', filaSelected);
  // Ejemplo: { 'Nombre': 'Juan', 'Edad': 25, 'Departamento': 'IT', ... } 
      console.log(`Click en celda Código Tipo: [${row}, ${col}]`);
      setTimeout(() => {
        this.mostrarPopupConSelect2(row, col,filaSelected,sheetFile.name);
      }, 100);
      return false;
    }
    
    return true;
  }
  filaSelectedExcel:any;
private getRowDataAsObject(rowIndex: number, sheetFile: any): { [key: string]: any } {
  try {
    const data = sheetFile?.data || (window as any).luckysheet?.getSheet()?.data;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {};
    }
    
    // Obtener headers (fila 0)
    const headers = data[0]?.map((cell: any) => cell?.v ?? `Col_${data[0].indexOf(cell)}`) || [];
    
    // Obtener datos de la fila
    const rowData = data[rowIndex] || [];
    
    // Crear objeto con headers como keys
    const rowObject: { [key: string]: any } = {};
    headers.forEach((header: string, index: number) => {
      var name=header.replace('ó','o');
      rowObject[name] = rowData[index]?.v ?? null;
    });
    
    return rowObject;
  } catch (error) {
    console.error('Error al obtener datos de la fila como objeto:', error);
    return {};
  }
}
  private handleCellEditBefore(range: any): boolean {
    const row = range?.[0]?.row?.[0] ?? range?.[0]?.r;
    const col = range?.[0]?.column?.[0] ?? range?.[0]?.c;
    
    if (col === 8 && row > 0) {
      console.log('Edición bloqueada - usar popup');
      return false;
    }
    
    return true;
  }
/*
  private handleCellUpdated(r: number, c: number, oldValue: any, newValue: any, isRefresh: boolean): void {
    if (!isRefresh) {
      console.log(`Celda actualizada: [${r}, ${c}] "${oldValue?.m || oldValue}" -> "${newValue?.m || newValue}"`);
    }
  }*/
 private handleCellUpdated(r: number, c: number, oldValue: any, newValue: any, isRefresh: boolean): void {
  console.log("muestra: handleCellUpdated");
    if (isRefresh) return;
    
    console.log(`Celda actualizada: [${r}, ${c}] "${oldValue?.m || oldValue}" -> "${newValue?.m || newValue}"`);
    
    // 🎯 DETECTAR SI ES COLUMNA "Código Tipo" (columna 1)
    if (c === 1 && r > 0) { // r > 0 para excluir header
      const nuevoCodigo = newValue?.v || newValue?.m || newValue;
      
       
    }
  }
 
  private handleRangeSelect(range: any): void {
    console.log('Rango seleccionado:', range);
  }

  private handleSheetActivate(index: number, isPivotInitial: boolean, isNewSheet: boolean): void {
    console.log('Hoja activada:', index);
    const sheetData = luckysheet.getSheet({ index: index });
  if (sheetData) {
    var hoja = sheetData.name; 
    this.nombreHojaActiva =hoja;// sheetData.name;
    console.log('✅ Hoja activa:', hoja);
  }
  }
  
handleWorkbookCreateAfter(): void {
   
   // Intentar obtener la hoja activa
  let activeSheet = luckysheet.getSheet();
  
  if (!activeSheet) {
    // Si no funciona, obtener todas las hojas y usar la primera
    const allSheets = luckysheet.getAllSheets();
    if (allSheets && allSheets.length > 0) {
      activeSheet = allSheets[0];
    }
  }
  
  if (activeSheet) { 

    var hoja = activeSheet.name; 
    this.nombreHojaActiva =hoja;// sheetData.name;
    console.log('✅ Hoja inicial:', hoja);

  } else {
    console.warn('⚠️ No se pudo obtener la hoja activa al inicializar');
  }

}
checkboxValue: boolean = false;

onCheckboxChange(event: any) {
  console.log('Checkbox cambiado:', event.checked);
  // Aquí puedes ejecutar tu lógica
  if (event.checked) {
    // Lógica cuando se marca
    console.log('Checkbox marcado');
     
        var  options = [];
          var data = this.combosPorHoja[this.productoHojaSelected]?.combos;          
          // Iterar sobre cada tipo de combo (ACCESORIO, etc.)
          for(var tipos in data){
            if(data.hasOwnProperty(tipos)){
              // Iterar sobre cada item del array
              data[tipos].forEach(item => {
                options.push(item);
              });
            }
          }
          
   
          const existeNinguno = options.some(item => item?.codigoTipo === "Ninguno");

          // Si no existe, agregar "Ninguno" al inicio
          if (!existeNinguno) {
            options.unshift({
              codigoTipo: "Ninguno",
              descripcionTipo: "Ninguno",
              unidadMedida: "",
              color: "",
              serie: "",
              lote: "",
            }); 
          }
        this.dataItems = null;
        this.dataItemsOriginal = null; // Copia para mantener original
        this.dataItems = options;
        this.dataItemsOriginal = [...options]; // Copia para mantener original 

  } else {
    // Lógica cuando se desmarca
    console.log('Checkbox desmarcado');
        this.dataItems = null;
        this.dataItemsOriginal = null; // Copia para mantener original
        this.dataItems = this.itemsRecientes;
        this.dataItemsOriginal = [...this.itemsRecientes]; // Copia para mantener original 
  } 
}
  itemsRecientes:any;
  productoHojaSelected:any;
  // MÉTODOS DEL MODAL
  async mostrarPopupConSelect2(row: number, col: number,filaSelected:any,hoja:any) {
    this.rowSelected = row;
    this.colSelected = col;
    this.currentValue = this.luckysheetHelper.getCellValue(row, col); 
    var codProducto=hoja.replace('Producto-','');//nombre  otbiene por ejemplo PRTRSMOT
    
    //OBTENER ACCESORIOS
          // Determinar el tipo de componente
        const tipo = (filaSelected?.Tipo?.toUpperCase() === "ACCESORIO" || !filaSelected?.Tipo || filaSelected?.Tipo === "") 
          ? 'ACCESORIO' 
          : filaSelected.Tipo;
          console.log(this.combosPorHoja);
        const codProductoNormalizado = this.obtenerCodigoProductoEspecial(codProducto);  //PRTRSMAN' ==> 'PRTRSMan'
        this.productoHojaSelected=codProductoNormalizado;
          // Verificar si ya existen los datos del combo
        if(!this.combosPorHoja[codProductoNormalizado]?.combos[tipo] || 
            this.combosPorHoja[codProductoNormalizado].combos[tipo].length === 0){        
          // Cargar datos según el tipo
          if (tipo === 'ACCESORIO') {
            console.log("cargando accesorios");
            await this.listarComponestePorCodigoProdSoloAccesorios(codProductoNormalizado, 'ACCESORIO');
          } else {
            console.log("cargando "+tipo); 
            await this.listarComponestePorCodigoProdsOFICIAL(codProductoNormalizado, tipo);  
          }

        }

        console.log("FINALMENTE AGREGADO");
        console.log(this.combosPorHoja);
        // Asignar los datos cargados (o existentes) al dataItems 
        var descript=filaSelected?.Descripcion;
        console.log("--->"+descript);
        if(!descript){
          descript="vacio"
        }
        let options = [];

          // Caso 1: Si NO es ACCESORIO, obtener opciones normales
          if (tipo !== 'ACCESORIO') {          
            options = this.combosPorHoja[codProductoNormalizado]?.combos[tipo] || []; 
          }

          console.log("--->" + descript);

          // Caso 2: Si ES ACCESORIO y la descripción no está vacía, filtrar por palabras
          if (filaSelected?.Tipo === "ACCESORIO" && descript !== "vacio") { 
            const palabrasBuscadas = filaSelected.Descripcion.toUpperCase().split(/\s+/);
            
            options = this.combosPorHoja[codProductoNormalizado]?.combos[tipo]?.filter(item => {
              const descripcion = item.descripcionTipo.toUpperCase();            
              return palabrasBuscadas.some(palabra => descripcion.includes(palabra));
            }) || [];
          }

          console.log("data es: " + tipo);
          console.log(options);

          // Caso 3: Si no hay opciones, obtener TODOS los combos
          if (!options || options.length === 0) {
            options = [];
            const data = this.combosPorHoja[codProductoNormalizado]?.combos;
            
            if (data) {
              // Iterar sobre cada tipo de combo y concatenar todos los items
              Object.keys(data).forEach(tipoCombo => {
                if (data[tipoCombo] && Array.isArray(data[tipoCombo])) {
                  options = options.concat(data[tipoCombo]);
                }
              });
            }
            
            console.log("TODOS");
            console.log(options);
          }

          // Verificar si ya existe la opción "Ninguno"
          const existeNinguno = options.some(item => item?.codigoTipo === "Ninguno");

          // Si no existe, agregar "Ninguno" al inicio
          if (!existeNinguno) {
            options.unshift({
              codigoTipo: "Ninguno",
              descripcionTipo: "Ninguno",
              unidadMedida: "",
              color: "",
              serie: "",
              lote: "",
            }); 
          }
        this.dataItems = null;
        this.dataItemsOriginal = null; // Copia para mantener original
        this.dataItems = options;
        this.dataItemsOriginal = [...options]; // Copia para mantener original
        this.itemsRecientes=options;
  this.checkboxValue=false;
    this.abrirModal();
  }
 
  onCotizacionSelected(event: MatSelectChange) {
    const selectedItem = event.value;
    this.seleccionado = selectedItem;
    
    if (selectedItem) {
      console.log('Item seleccionado:', selectedItem);
    }
  }

  limpiarSeleccion() {
    this.seleccionado = null;
    this.dataItems = [...this.dataItemsOriginal];
  }

  applyFilter(event: any) {
    const valor = event.target.value.trim();
    
    if (!valor) {
      this.dataItems = [...this.dataItemsOriginal];
      return;
    }
    
    const patron = this.luckysheetHelper.convertirPatronARegex(valor);
    
    this.dataItems = this.dataItemsOriginal.filter(option => {
      const codigo = option.codigoTipo || '';
      const descripcion = option.descripcionTipo || '';
      return patron.test(codigo) || patron.test(descripcion);
    });
  }

  abrirModal() {
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  confirmar() {
    if (this.seleccionado) {
      this.procesarSeleccion();
      this.cerrarModal();
    } else {
      alert('Debe seleccionar una opción');
    }
  }

  procesarSeleccion() {
    
      const allSheets = luckysheet.getAllSheets();
      const sheet = allSheets.find(s => s.name === this.nombreHojaActiva);

      if (!sheet || !sheet.data || sheet.data.length < 2) {
        console.warn('No hay datos en la hoja');
        return;
      }

      // Obtener la primera fila de datos (índice 1)
      const PrimeraFila = this.getRowDataAsObject(1, sheet);
      console.log('Primera fila:', PrimeraFila);

    this.luckysheetHelper.setCellValue(this.rowSelected, this.colSelected, this.seleccionado.codigoTipo,this.seleccionado,PrimeraFila,this.filaSelectedExcel);
    console.log('Procesando...');
    this.seleccionado=null;
  }

  // MÉTODOS PÚBLICOS SIMPLIFICADOS

  async loadSampleData(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    //this.listarShade();
  } 
/*
  exportToExcel(): void {
    if (this.luckysheetHelper.exportToExcel()) {
      alert('Archivo CSV exportado exitosamente');
    } else {
      alert('Error al exportar CSV');
    }
  
  }*/
 
// ===================================================================
// ACTUALIZAR EN EL COMPONENTE (excel.component.ts)
// ===================================================================

exportToExcel(): void {
  if (this.luckysheetHelper.exportToExcel()) {
    this.toaster.open({
      text: 'Archivo Excel exportado exitosamente',
      caption: 'Éxito',
      type: 'success',
      duration: 3000
    });
  } else {
    this.toaster.open({
      text: 'Error al exportar Excel',
      caption: 'Error',
      type: 'danger'
    });
  }
} 
// Método adicional para exportar solo productos
exportarProductos(): void {
  if (this.luckysheetHelper.exportarSoloProductos()) {
    this.toaster.open({
      text: 'Hojas de productos exportadas exitosamente',
      caption: 'Éxito',
      type: 'success',
      duration: 3000
    });
  } else {
    this.toaster.open({
      text: 'Error al exportar productos',
      caption: 'Error',
      type: 'danger'
    });
  }
}
/*
  private setupClipboardHandling(): void {
    document.addEventListener('paste', this.handlePaste.bind(this));
    
    const container = document.getElementById('luckysheet');
    if (container) {
      container.setAttribute('tabindex', '0');
      container.focus();
    }
  }

  private handlePaste(e: ClipboardEvent): void {
    if (!e.clipboardData) return;
    
    const pastedData = e.clipboardData.getData('text/plain');
    if (pastedData && typeof luckysheet !== 'undefined') {
      const rows = pastedData.split('\n').filter(row => row.trim() !== '');
      const processedData = rows.map(row => row.split('\t'));
      console.log('Datos pegados desde clipboard:', processedData);
    }
  }*/

  loadAutoSave(): void {
    const saved = this.luckysheetHelper.loadAutoSave();
    if (saved) {
      console.log('Datos de auto-guardado encontrados:', saved.timestamp);
      if (confirm('¿Deseas cargar los datos guardados automáticamente?')) {
        alert('Función de carga automática no implementada en este ejemplo');
      }
    }
  }
  
  

  //#endregion


  ListMaestroArticulos:any=[]; 
  ListarMaestroArticulos() {
    return new Promise<void>((resolve, reject) => {
      this._service.ListarMaestroArticulos().subscribe({
        next: (data: any) => {
          console.log("RESULTADOS===========>");
          console.log(data);
          this.ListMaestroArticulos = data;
          resolve();
        },
        error: (error: any) => {
          console.error('Error al obtener datos:', error);
          reject(error);
        }
      });
    });
  }

  //#region  GUARDADO DE DATA
 private async modificarDatos(): Promise<void> {
   
    // Validar que pueda modificar
    if (this.pasos[1].completado) {
      this.toaster.open({
        text: 'No se puede modificar después de enviar a SAP',
        caption: 'Advertencia',
        type: 'warning',
        duration: 4000
      });
      return;
    } 
 
    this.GuardarModificar("Modificacion");
}
/**
 * Obtiene el texto del botón según el estado
 */
obtenerTextoBotonGuardar(): string {
  if (this.pasos[1].completado) {
    return 'Ya Enviado a SAP ✓';
  }
  
  if (this.pasos[0].completado && !this.pasos[1].completado) {
    return 'Modificar';
  }
  
  return 'Guardar';
}

/**
 * Obtiene el icono del botón según el estado
 */
obtenerIconoBotonGuardar(): string {
  if (this.pasos[1].completado) {
    return 'check_circle';
  }
  
  if (this.pasos[0].completado && !this.pasos[1].completado) {
    return 'edit';
  }
  
  return 'save';
}

/**
 * Obtiene el título (tooltip) del botón
 */
obtenerTituloBotonGuardar(): string {
  if (this.pasos[1].completado) {
    return 'No se puede modificar después de enviar a SAP';
  }
  
  if (this.pasos[0].completado && !this.pasos[1].completado) {
    return 'Modificar datos guardados (solo antes de enviar a SAP)';
  }
  
  return 'Guardar explosión en la base de datos';
}
/**
 * Guarda los datos de todas las hojas Producto-* en formato JSON
 */
  async saveData(event?: Event): Promise<void> {
  


  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
 
  // Si ya guardó pero no envió a SAP, está en modo modificación
  if (this.pasos[0].completado && !this.pasos[1].completado) {
    await this.modificarDatos();
    return;
  }
    this.GuardarModificar("Guardado");

}
GuardarModificar(tipo:any){
  try {
    // Obtener todas las hojas de Luckysheet
    const allSheets = luckysheet.getAllSheets();    
    if (!allSheets || allSheets.length === 0) {
      this.toaster.open({
        text: 'No hay datos para guardar',
        caption: 'Advertencia',
        type: 'warning'
      });
      return;
    }

    // Filtrar solo las hojas que empiezan con "Producto-"
    const productSheets = allSheets.filter(sheet => 
      sheet.name && sheet.name.startsWith('Producto-')
    );

    if (productSheets.length === 0) {
      this.toaster.open({
        text: 'No hay hojas de productos para guardar',
        caption: 'Advertencia',
        type: 'warning'
      });
      return;
    }

    // Array para almacenar todos los componentes
    let todosLosComponentes = [];
    let hayErrores = false;

  this.spinner.show();
    // Procesar cada hoja de producto
    for (const sheet of productSheets) {
      const codigoProducto = sheet.name.replace('Producto-', ''); //nombre  otbiene por ejemplo PRTRSMOT
    const codProductoNormalizado = this.obtenerCodigoProductoEspecial(codigoProducto);  //PRTRSMAN' ==> 'PRTRSMan'
      const nombreTabla = this.obtenerNombreTabla(codProductoNormalizado);      
      // Extraer datos de la hoja
      const componentesHoja = this.extraerDatosDeHoja(sheet);        
      if (!componentesHoja || componentesHoja.length === 0) {
        continue; // Si no hay datos, pasar a la siguiente hoja
      }

      // Validar componentes de esta hoja 
      const errorValidacion = this.validarComponentesHoja(componentesHoja, nombreTabla, sheet.name);  
      if (errorValidacion) {
        this.toaster.open({
          text: errorValidacion,
          caption: 'Error de validación',
          type: 'warning',
          duration: 0
        }); 
        hayErrores = true;
        break;
      }
      // Transformar componentes al formato requerido
      const componentesTransformados = componentesHoja.map(item => {
        return {
          producto: item.producto,
          numeroCotizacion: item.numeroCotizacion,
          cotizacionGrupo: item.cotizacionGrupo,
          codigoTipo: item.codigoTipo,
          descripcionTipo: item.descripcionTipo,
          tipoDesc: item.tipoDesc,
          alto: Number(item.alto) || 0,
          ancho: Number(item.ancho) || 0,
          calculoFinal: Number(item.calculoFinal) || 0,
          valorAplicado: Number(item.valorAplicado) || 0,
          codigoTuboRelacionado: item.codigoTuboRelacionado || "",
          familia: item.familia,
          codFamilia: item.codFamilia,
          subFamilia: item.subFamilia,
          columnaCalculo: item.columnaCalculo || "",
          merma: Number(item.merma) || 0,
          lote: item.lote || "",
          cantidad: Number(item.calculoFinal) || 0,
          grupo: item.cotizacionGrupo,
          descrip_Componente: item.tipoDesc,
          codigo_Componente: item.codigoTipo,
          componente: item.descripcionTipo,
          cantidadUtilizada: Number(item.calculoFinal) || 0,
          usuario: this.idUsuario,
          tipoProducto: nombreTabla,
          hoja:codigoProducto
        };
      });

      // Agregar componentes transformados al array general
      todosLosComponentes = [...todosLosComponentes, ...componentesTransformados];
    }

  this.spinner.hide();
    // Si hay errores, detener el proceso
    if (hayErrores) {
      return;
    }

    // Verificar que hay componentes para guardar
    if (todosLosComponentes.length === 0) {
      this.toaster.open({
        text: 'No hay componentes válidos para guardar',
        caption: 'Advertencia',
        type: 'warning'
      });
      return;
    }

    this.aplicaMerma = this.determinarSiAplicaMerma(todosLosComponentes); 
    // Mostrar confirmación antes de guardar
    this.confirmarGuardado(todosLosComponentes,tipo);  

  } catch (error) {
  this.spinner.hide();
    console.error('Error al guardar datos:', error);
    this.toaster.open({
      text: 'Error al procesar los datos',
      caption: 'Error',
      type: 'danger'
    });
  }finally{
    this.spinner.hide();
  }
}

/**
 * Extrae los datos de una hoja de Luckysheet
 */
private extraerDatosDeHoja(sheet: any): any[] {
  const componentes = [];
  
  try {
    const data = sheet.data;    
    if (!data || data.length <= 1) {
      return []; // No hay datos (solo headers o vacío)
    }
    // Obtener headers (fila 0)
    const headers = data[0]?.map((cell: any) => cell?.v ?? '') || [];    
    // Crear mapa de índices de columnas
    const colIndex = {
      tipo: headers.indexOf('Tipo'),
      codigoTipo: headers.indexOf('Código Tipo'),
      descripcion: headers.indexOf('Descripción'),
      ancho: headers.indexOf('Ancho'),
      alto: headers.indexOf('Alto'),
      cantRoller: headers.indexOf('Cant. Roller'),
      calculoFinal: headers.indexOf('Cálculo Final'),
      merma: headers.indexOf('Merma'),
      lote: headers.indexOf('Lote'),
      producto: headers.indexOf('Producto'),
      numCotizacion: headers.indexOf('Nº Cotización'),
      grupoCotiz: headers.indexOf('Grupo Cotiz.'),
      familia: headers.indexOf('Familia'),
      codFamilia: headers.indexOf('Cód. Familia'),
      subFamilia: headers.indexOf('Sub Familia')
    };

    // Procesar cada fila de datos (desde fila 1 en adelante)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      if (!row || row.length === 0) {
        continue; // Saltar filas vacías
      }

      // Extraer valores de la fila
      const codigoTipo = row[colIndex.codigoTipo]?.v ?? '';
      
      // Saltar filas donde codigoTipo es "Ninguno" o vacío
      if (//!codigoTipo ||
         codigoTipo === 'Ninguno') {
        continue;
      }  
          // Verificar si la fila tiene al menos una celda con datos
      if (row && row.length > 0) {
        const tieneDatos = row.some((cell: any) => cell && (cell.v !== null && cell.v !== undefined && cell.v !== ""));
        if (!tieneDatos) {
          continue;//Si todas las columnas están vacías → omite la fila (continue)
        }
      }

      
      const componente = {
        tipoDesc: row[colIndex.tipo]?.v ?? '',
        codigoTipo: codigoTipo,
        descripcionTipo: row[colIndex.descripcion]?.v ?? '',
        ancho: row[colIndex.ancho]?.v ?? 0,
        alto: row[colIndex.alto]?.v ?? 0,
        cantidadRoller: row[colIndex.cantRoller]?.v ?? 0,
        calculoFinal: row[colIndex.calculoFinal]?.v ?? 0,
        merma: row[colIndex.merma]?.v ?? 0,
        lote: row[colIndex.lote]?.v ?? '',
        producto: row[colIndex.producto]?.v ?? '',
        numeroCotizacion: row[colIndex.numCotizacion]?.v ?? '',
        cotizacionGrupo: row[colIndex.grupoCotiz]?.v ?? '',
        familia: row[colIndex.familia]?.v ?? '',
        codFamilia: row[colIndex.codFamilia]?.v ?? '',
        subFamilia: row[colIndex.subFamilia]?.v ?? '',
        valorAplicado: 0,
        codigoTuboRelacionado: '',
        columnaCalculo: this.determinarColumnaCalculo(row[colIndex.tipo]?.v ?? '')
      };

      componentes.push(componente);
    }

  } catch (error) {
    console.error('Error al extraer datos de la hoja:', error);
  }

  return componentes;
}

/**
 * Determina el tipo de cálculo según el tipo de componente
 */
private determinarColumnaCalculo(tipoDesc: string): string {
  switch (tipoDesc?.toUpperCase()) {
    case 'TUBO':
    case 'RIEL':
      return 'ANCHO-TUBO';
    case 'TELA':
      return 'TELA';
    default:
      return '';
  }
}

/**
 * Obtiene el nombre de tabla normalizado
 */
private obtenerNombreTabla(codigoProducto: string): string {
  return codigoProducto
    .replace('PRTRSMan', 'PRTRS')
    .replace('PRTRSMot', 'PRTRS')
    .replace('PRTLU00000001_2_3', 'PRTLU');
}
 
private validarComponentesHoja(componentes: any[], nombreTabla: string, nombreHoja: any): string | null {
  
  for (let index = 0; index < componentes.length; index++) {
    const item = componentes[index];
    const fila = index + 2; // +2 por índice base 0 y fila de encabezado
    
    // ========================================
    // 1. VALIDAR CAMPOS OBLIGATORIOS (producto, cotización, familia, etc.)
    // ========================================
    const camposVacios: string[] = [];
    if (!item.producto || item.producto.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      camposVacios.push('Producto');
    }
    if (!item.numeroCotizacion || item.numeroCotizacion.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      camposVacios.push('Num. Cotización');
    }
    if (!item.familia || item.familia.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      camposVacios.push('Familia');
    }
    if (!item.codFamilia || item.codFamilia.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      camposVacios.push('Cód. Familia');
    }
    if (!item.subFamilia || item.subFamilia.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      camposVacios.push('Sub Familia');
    }
    
    if (camposVacios.length > 0) {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
             `Los siguientes campos son obligatorios:\n• ${camposVacios.join('\n• ')}`;
    }
    
    // ========================================
    // 2. VALIDAR CÓDIGO DE TIPO
    // ========================================
    if (!item.codigoTipo || item.codigoTipo.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
             `Debe seleccionar el código de tipo para "${item.descripcionTipo || 'este componente'}"`;
    }
    
    // ========================================
    // 3. VALIDAR CANTIDAD DE ROLLER
    // ========================================
    if (!item.cantidadRoller || item.cantidadRoller.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
             `Debe ingresar la cantidad de "${item.descripcionTipo || 'este componente'}"`;
    }
    
    // ========================================
    // 4. VALIDACIONES ESPECÍFICAS PARA TUBO, RIEL Y TELA
    // ========================================
    
    // 4.4 Validar cálculo final
    if (!item.calculoFinal || item.calculoFinal.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
             `Debe ingresar el cálculo final para "${item.descripcionTipo}"`;
    }
    // 4.1 Validar números negativos
    const cantidadNum = Number(item.cantidadRoller);
    const calculoFinalNum = Number(item.calculoFinal);
    
    if (cantidadNum < 0) {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
             `La cantidad de "${item.descripcionTipo}" no puede ser negativa.\n` +
             `Valor ingresado: ${item.cantidadRoller}`;
    }
    
    if (calculoFinalNum < 0) {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
             `El cálculo final de "${item.descripcionTipo}" no puede ser negativo.\n` +
             `Valor ingresado: ${item.calculoFinal}`;
    }
    
    const tipoUpper = item.tipoDesc?.toUpperCase();
    const isTuboTelaRiel = ['TUBO', 'RIEL', 'TELA'].includes(tipoUpper);
    
    if (!isTuboTelaRiel) {
      continue; // No hacer más validaciones para otros tipos
    }
    // 4.2 Validaciones para TUBO y RIEL
    if (tipoUpper === 'TUBO' || tipoUpper === 'RIEL') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      if (!item.ancho || item.ancho.toString().trim() === '') {
        return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
               `Debe ingresar el ancho para "${item.descripcionTipo}"`;
      }
      
      const anchoNum = Number(item.ancho);
      if (isNaN(anchoNum) || anchoNum <= 0) {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
        return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
               `El ancho de "${item.descripcionTipo}" debe ser un número mayor a 0.\n` +
               `Valor ingresado: ${item.ancho}`;
      }
    }
    
    // 4.3 Validaciones específicas para TELA
    if (tipoUpper === 'TELA') {
      // Validar ancho
      if (!item.ancho || item.ancho.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
        return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
               `Debe ingresar el ancho para "${item.descripcionTipo}"`;
      }
      
      const anchoNum = Number(item.ancho);
      if (isNaN(anchoNum) || anchoNum <= 0) {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
        return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
               `El ancho de "${item.descripcionTipo}" debe ser un número mayor a 0.\n` +
               `Valor ingresado: ${item.ancho}`;
      }
      
      // Validar alto
      if (!item.alto || item.alto.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
        return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
               `Debe ingresar el alto para "${item.descripcionTipo}"`;
      }
      
      const altoNum = Number(item.alto);
      if (isNaN(altoNum) || altoNum <= 0) {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
        return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
               `El alto de "${item.descripcionTipo}" debe ser un número mayor a 0.\n` +
               `Valor ingresado: ${item.alto}`;
      }
    }
    
    // 4.4 Validar cálculo final
    if (!item.calculoFinal || item.calculoFinal.toString().trim() === '') {
    console.log("VALIDANDO::::::::::::::::::::::::::::::::-->"+fila);
    console.log(item);
      return `❌ Error en fila ${fila} de la hoja "${nombreHoja}":\n\n` +
             `Debe ingresar el cálculo final para "${item.descripcionTipo}"`;
    }
  }
  
  return null; // Sin errores
}
/**
 * Muestra confirmación y guarda los datos
 */
private confirmarGuardado(componentes: any[],tipo:any): void {
  Swal.fire({
    allowOutsideClick: false,
    title: '¿Desea Guardar?',
    html: `Se guardarán ${componentes.length} componentes. Al guardar, finalizará todo el proceso y quedará pendiente enviarlo a SAP`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Sí, Guardar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.guardarEnServidor(componentes,tipo);
    }
  });
}

/**
 * Envía los datos al servidor
 */
private guardarEnServidor(componentes: any[],tipo:any): void {
  const jsonData = JSON.stringify(componentes);
  
  console.log('Datos a guardar:', jsonData);
 
  this.spinner.show();
  
  this._service.GuardarFormulacionRollerShade(jsonData,tipo)
    .subscribe({
      next: response => {
        this.spinner.hide();
        
        if (response.status == 200) {
          if(tipo=="Guardado"){
            
          // Completar paso 1
          this.completarPaso(1, "");
          this.avanzarPaso();
          }else{ //Modificacion

            // Actualizar fecha del paso 1
            const paso = this.pasos.find(p => p.id === 1);
            if (paso) {
              paso.fecha = new Date();
            }
            this.datosModificados = false;
            this.guardarEstadoWorkflow();
          }
          /*// Completar paso 1
          this.completarPaso(1, response.json.id);
          this.avanzarPaso();*/
          const respuesta = response.json.respuesta;
          const id = response.json.id;
          
          if (respuesta === "OK") { 
                 Swal.fire({
                  title: 'Mensaje',
                  text: 'Explosión realizada',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  allowOutsideClick: false,
                  allowEscapeKey: false  // También previene cerrar con tecla ESC
          }).then((result) => {
            if (result.isConfirmed) {
             // this.router.navigate(['/Monitoreo-Produccion']);
            }
          });
          } else { 
            this.toaster.open({
              text: 'Error al guardar: ' + respuesta,
              caption: 'Error',
              type: 'danger',
          duration: 0
            });
          }
        } else {
          this.toaster.open({
            text: 'Ocurrió un error al enviar: ' + response,
            caption: 'Error',
            type: 'danger',
          duration: 0
          });
        }
      },
      error: error => {
        this.spinner.hide();
        console.error('Error al guardar:', error);
        this.toaster.open({
          text: error.message || 'Error al guardar componentes',
          caption: 'Error',
          type: 'danger',
          duration: 0
        });
      }
    });
}
  //#endregion


  //#region  COPIADDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOS Y PEGADOOOOOOOOOOOOOOOOOOOOOOOOOOOOS
 /**
 * Configurar manejadores mejorados de portapapeles
 */
private setupClipboardHandling(): void {
  // Esperar a que Luckysheet esté completamente inicializado
  setTimeout(() => {
    const container = document.getElementById('luckysheet');
    if (container) {
      // Agregar listeners solo al contenedor, no al documento
      container.addEventListener('paste', this.handlePaste.bind(this), true);
      container.setAttribute('tabindex', '0');
      container.focus();
    }
  }, 1000);
} 
/**
 * Manejador de evento COPY - Mejora el formato copiado
 */
private handleCopy(e: ClipboardEvent): void {
  // Solo interceptar si estamos en el contenedor de Luckysheet
  const target = e.target as HTMLElement;
  if (!target || !target.closest('#luckysheet')) {
    return;
  }

  try {
    const selection = luckysheet.getRange();
    if (!selection || selection.length === 0) {
      return;
    }

    const range = selection[0];
    const sheet = luckysheet.getSheet();
    
    if (!sheet || !sheet.data) {
      return;
    }

    // Extraer datos de la selección
    const startRow = range.row[0];
    const endRow = range.row[1];
    const startCol = range.column[0];
    const endCol = range.column[1];

    let textData = '';
    let htmlData = '<table border="1" cellspacing="0" cellpadding="2">';

    // Construir tanto texto plano como HTML
    for (let r = startRow; r <= endRow; r++) {
      let rowText = [];
      htmlData += '<tr>';
      
      for (let c = startCol; c <= endCol; c++) {
        const cell = sheet.data[r]?.[c];
        const value = cell?.v ?? cell?.m ?? '';
        
        rowText.push(value);
        htmlData += `<td>${value}</td>`;
      }
      
      textData += rowText.join('\t') + '\n';
      htmlData += '</tr>';
    }

    htmlData += '</table>';

    // Establecer ambos formatos en el portapapeles
    if (e.clipboardData) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', textData);
      e.clipboardData.setData('text/html', htmlData);
      
      console.log('Datos copiados:', {
        filas: endRow - startRow + 1,
        columnas: endCol - startCol + 1
      });
    }
  } catch (error) {
    console.error('Error al copiar:', error);
  }
}

/**
 * Manejador de evento PASTE - Procesa datos de Excel correctamente
 */
private handlePaste(e: ClipboardEvent): void {
  // Solo interceptar si estamos en el contenedor de Luckysheet
  console.log("pegando");
  const target = e.target as HTMLElement;
  if (!target || !target.closest('#luckysheet')) {
    return;
  }

  if (!e.clipboardData) return;

  try {
    // Intentar obtener datos en diferentes formatos
    const htmlData = e.clipboardData.getData('text/html');
    const textData = e.clipboardData.getData('text/plain');
    this.spinner.show();
    console.log('Pegando datos...', {
      tieneHTML: !!htmlData,
      tieneTexto: !!textData
    });

    let processedData: any[][] | null = null;

    // PRIORIDAD 1: Procesar HTML si viene de Excel/Luckysheet
    if (htmlData && htmlData.includes('<table')) {
      console.log("pegado Excel/Luckysheet");
      processedData = this.parseHTMLTable(htmlData);
    }
    
    // PRIORIDAD 2: Procesar texto plano (TSV)
    if (!processedData && textData) {
      console.log("pegado texto plano (TSV)");
      processedData = this.parseTextData(textData);
    }

    if (processedData && processedData.length > 0) {
      e.preventDefault();
      console.log("pegado ultimo");
      this.pasteDataToLuckysheet(processedData);
    }
    
  } catch (error) {
    this.spinner.hide();
    console.error('Error al pegar:', error);
  }
}

/**
 * Parsea una tabla HTML del portapapeles
 */
private parseHTMLTable(html: string): any[][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table = doc.querySelector('table');
  
  if (!table) {
    return [];
  }

  const rows: any[][] = [];
  const trs = table.querySelectorAll('tr');
  
  trs.forEach(tr => {
    const row: any[] = [];
    const cells = tr.querySelectorAll('td, th');
    
    cells.forEach(cell => {
      let value = cell.textContent?.trim() || '';
      
      // Intentar convertir a número si es posible
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && value !== '') {
        value = numValue.toString();
      }
      
      row.push(value);
    });
    
    if (row.length > 0) {
      rows.push(row);
    }
  });

  return rows;
}

/**
 * Parsea datos de texto plano (TSV/CSV)
 */
private parseTextData(text: string): any[][] {
  const rows = text.split('\n').filter(row => row.trim() !== '');
  
  return rows.map(row => {
    // Intentar detectar el separador (tabulador o coma)
    const separator = row.includes('\t') ? '\t' : ',';
    
    return row.split(separator).map(cell => {
      const trimmed = cell.trim();
      
      // Intentar convertir a número
      const numValue = parseFloat(trimmed);
      if (!isNaN(numValue) && trimmed !== '') {
        return numValue;
      }
      
      return trimmed;
    });
  });
}

/**
 * Pega los datos procesados en Luckysheet
 */
private pasteDataToLuckysheet(data: any[][]): void {
  try {
    const selection = luckysheet.getRange();
    if (!selection || selection.length === 0) {
      console.warn('No hay celda seleccionada para pegar');
      return;
    }

    const range = selection[0];
    const startRow = range.row[0];
    const startCol = range.column[0];

    console.log(`Pegando ${data.length} filas desde [${startRow}, ${startCol}]`);
 // 🎯 DETECTAR SI SE PEGA EN COLUMNA "Código Tipo"
      const pegandoEnCodigoTipo = (startCol === 1);
      const codigosPegados: Array<{row: number, col: number, codigo: string}> = [];

    // Pegar cada celda
    data.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const targetRow = startRow + rowIndex;
        const targetCol = startCol + colIndex;
        
        luckysheet.setCellValue(targetRow, targetCol, value);
        // 🎯 SI SE PEGÓ EN COLUMNA CÓDIGO TIPO, GUARDAR PARA VALIDAR
          if (pegandoEnCodigoTipo && targetCol === 1 && value) {
            codigosPegados.push({
              row: targetRow,
              col: targetCol,
              codigo: value.toString().trim()
            });
          }
      });
    });

    // Refrescar la vista
    luckysheet.refresh();

    console.log('Datos pegados exitosamente');
    this.spinner.hide();
  } catch (error) {
    this.spinner.hide();
    console.error('Error al pegar en Luckysheet:', error);
  }
}
/**
 * Valida todos los códigos de la hoja activa en una sola llamada
 */
async validarTodasLasFilas(): Promise<void> {
  console.log('═══════════════════════════════════════');
  console.log('🔍 VALIDACIÓN OPTIMIZADA EN LOTE');
  console.log('═══════════════════════════════════════');

  try {
    const sheet = luckysheet.getSheet();
    
    if (!sheet || !sheet.data) {
      this.toaster.open({
        text: 'No hay datos en la hoja activa',
        caption: 'Advertencia',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    const data = sheet.data;
    const codigosParaValidar: Array<{row: number, col: number, codigo: string}> = [];

    // Recolectar todos los códigos
    for (let r = 1; r < data.length; r++) {
      if (!data[r]) continue;

      const celdaCodigoTipo = data[r][1];
      
      if (!celdaCodigoTipo) continue;

      const codigo = celdaCodigoTipo.v || celdaCodigoTipo.m;

      if (codigo && 
          codigo.toString().trim() !== '' && 
          codigo.toString().trim().toUpperCase() !== 'NINGUNO') {
        
        const codigoLimpio = codigo.toString().trim();
        
        codigosParaValidar.push({
          row: r,
          col: 1,
          codigo: codigoLimpio
        });
      }
    }

    if (codigosParaValidar.length === 0) {
      this.toaster.open({
        text: 'No se encontraron códigos para validar',
        caption: 'Información',
        type: 'info',
        duration: 3000
      });
      return;
    }

    // Confirmar
    const confirmacion = await Swal.fire({
      title: 'Validar códigos',
      html: `
        <div style="text-align: left;">
          <p>Se encontraron <strong>${codigosParaValidar.length}</strong> código(s)</p>
          <p>¿Desea validarlos todos en una sola consulta?</p>
          <hr> 
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, validar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    // Validar en lote
    await this.validarCodigosEnLoteOptimizado(codigosParaValidar);

  } catch (error) {
    console.error('❌ Error al validar filas:', error);
    
    this.toaster.open({
      text: 'Error al validar las filas',
      caption: 'Error',
      type: 'danger',
      duration: 4000
    });
  }
}
/**
 * Valida todos los códigos en una sola petición HTTP
 */
private async validarCodigosEnLoteOptimizado(
  codigos: Array<{row: number, col: number, codigo: string}>
): Promise<void> {
  
  console.log(`🚀 Validando ${codigos.length} códigos en una sola petición...`);

  // Mostrar progreso
  Swal.fire({
    title: 'Validando códigos',
    html: `
      <div style="text-align: center;">
        <p>Consultando <strong>${codigos.length}</strong> códigos a SAP...</p>
        <div class="spinner-border text-primary" role="status" style="margin: 20px 0;">
          <span class="sr-only">Cargando...</span>
        </div>
      </div>
    `,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    // Extraer solo los códigos únicos
    const codigosUnicos = [...new Set(codigos.map(c => c.codigo))];
    
    console.log(`📤 Enviando ${codigosUnicos.length} códigos únicos al servidor`);

    // Llamar al API con todos los códigos
    const response: any = await firstValueFrom(
      this._service.validarCodigosTipoEnLote(codigosUnicos)
    );

    console.log('📥 Respuesta del servidor:', response);

    // Crear mapa para búsqueda rápida
    const mapaDescripciones = new Map<string, string>();
    
    if (Array.isArray(response)) {
      response.forEach((item: any) => {
        const codigo = item.itemCode || item.ItemCode;
        const descripcion = item.itemName || item.ItemName || '(Sin descripción)';
        mapaDescripciones.set(codigo, descripcion);
      });
    }

    console.log(`✅ Se encontraron ${mapaDescripciones.size} descripciones`);

    // Actualizar celdas
    let validados = 0;
    let noEncontrados = 0;

    for (const item of codigos) {
      const descripcion = mapaDescripciones.get(item.codigo);

      if (descripcion) {
        // ✅ Código válido - actualizar descripción
        this.luckysheetHelper.actualizarCeldaConFormato(
          item.row,
          2,
          descripcion,
          'g',
          '1'
        );

        // Limpiar formato de error
        this.limpiarColorError(item.row, item.col);
        validados++;
      } else {
        // ❌ Código no encontrado
        this.marcarCodigoInvalido(item.row, item.col, item.codigo, 'no_encontrado');
        noEncontrados++;
      }
    }

    Swal.close();

    // Mostrar resumen
    this.mostrarResumenValidacionOptimizado(validados, noEncontrados, codigos.length);

  } catch (error) {
    Swal.close();
    console.error('❌ Error al validar códigos:', error);
    
    this.toaster.open({
      text: 'Error al validar códigos en lote',
      caption: 'Error',
      type: 'danger',
      duration: 4000
    });
  }
}

/**
 * Muestra el resumen de la validación optimizada
 */
private mostrarResumenValidacionOptimizado(
  validados: number,
  noEncontrados: number,
  total: number
): void {
  
  if (noEncontrados === 0) {
    Swal.fire({
      title: '¡Validación exitosa!',
      html: `
        <div style="text-align: center;"> 
          <p style="font-size: 18px;">
            <strong>${validados}</strong> código${validados > 1 ? 's' : ''} 
            validado${validados > 1 ? 's' : ''} correctamente
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 10px;">
            ⚡ Validación completada en una sola consulta
          </p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#4caf50'
    });
  } else {
    Swal.fire({
      title: 'Validación completada',
      html: `
        <div style="text-align: center;">
          <div style="display: flex; justify-content: space-around; margin: 20px 0;">
            <div>
              <div style="font-size: 32px;">✅</div>
              <div style="font-size: 20px; font-weight: bold;">${validados}</div>
              <div style="font-size: 12px; color: #666;">Válidos</div>
            </div>
            <div>
              <div style="font-size: 32px;">❌</div>
              <div style="font-size: 20px; font-weight: bold;">${noEncontrados}</div>
              <div style="font-size: 12px; color: #666;">No encontrados</div>
            </div>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 15px;">
            ⚡ Total procesado: ${total} códigos
          </p>
        </div>
      `,
      icon: noEncontrados > validados ? 'warning' : 'success',
      confirmButtonText: 'Aceptar',
      width: '500px'
    });
  }
} 
  

  /**
   * Marca una celda como código inválido
   */
/**
 * Marca una celda como código inválido (SOLO pinta el código, no toca descripción)
 */
private marcarCodigoInvalido(row: number, col: number, codigo: string, tipoError: 'no_encontrado' | 'error_conexion' = 'error_conexion'): void {
  try {
    const currentSheet = luckysheet.getSheet();
    const flowdata = currentSheet.data || luckysheet.getSheetData();
    
    if (!flowdata[row]) {
      flowdata[row] = [];
    }
    
    // Definir colores según el tipo de error
    const colores = {
      no_encontrado: {
        bg: '#ffcccc',  // Rojo claro
        fc: '#cc0000'   // Texto rojo oscuro
      },
      error_conexion: {
        bg: '#fff3cd',  // Amarillo claro
        fc: '#856404'   // Texto amarillo oscuro
      }
    };
    
    const color = colores[tipoError];
    
    // ⚠️ SOLO PINTAR LA CELDA DE CÓDIGO TIPO (columna 1)
    flowdata[row][col] = {
      ...flowdata[row][col],
      v: codigo,
      ct: { fa: "General", t: "g" },
      m: codigo,
      bg: color.bg,
      fc: color.fc,
      bl: 1 // Negrita
    };

    // ✅ NO TOCAR LA DESCRIPCIÓN - Dejarla como está
    // Si quieres limpiarla, descomenta esto:
    /*
    if (flowdata[row][2]) {
      flowdata[row][2] = {
        ...flowdata[row][2],
        v: '',
        m: '',
        bg: null,
        fc: null
      };
    }
    */

    luckysheet.refresh();

    console.warn(`❌ Código inválido: "${codigo}" en fila ${row + 1} (tipo: ${tipoError})`);
    
  } catch (error) {
    console.error('Error al marcar código inválido:', error);
  }
}

  /**
   * Limpia el color de error de una celda
   */
 /**
 * Limpia el color de error de una celda de código
 */
private limpiarColorError(row: number, col: number): void {
  try {
    const currentSheet = luckysheet.getSheet();
    const flowdata = currentSheet.data || luckysheet.getSheetData();
    
    if (flowdata[row] && flowdata[row][col]) {
      // Remover colores de error del código
      const celdaCodigo = flowdata[row][col];
      
      flowdata[row][col] = {
        ...celdaCodigo,
        bg: null,// '#8cf55d',    // Sin fondo
        fc: null,    // Color de texto normal
        bl: 0        // Sin negrita
      };
        
      luckysheet.refresh();
      
      console.log(`🧹 Color de error limpiado en [${row + 1}, ${col + 1}]`);
    }
  } catch (error) {
    console.error('Error al limpiar color:', error);
  }
}
// ===================================================================
// SOLUCIÓN ADICIONAL: Botón para limpiar formato
// ===================================================================

/**
 * Limpia formato de celdas seleccionadas (solo deja valores)
 * Útil cuando el formato causa problemas al copiar/pegar
 */
limpiarFormatoCeldas(): void {
  try {
    const selection = luckysheet.getRange();
    if (!selection || selection.length === 0) {
      this.toaster.open({
        text: 'Seleccione celdas para limpiar formato',
        caption: 'Información',
        type: 'info'
      });
      return;
    }

    const range = selection[0];
    const startRow = range.row[0];
    const endRow = range.row[1];
    const startCol = range.column[0];
    const endCol = range.column[1];

    // Limpiar formato pero mantener valores
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const value = luckysheet.getCellValue(r, c);
        
        // Establecer solo el valor, sin formato
        luckysheet.setCellValue(r, c, value, {
          bg: null,
          fc: null,
          bl: 0,
          it: 0,
          ff: null,
          fs: null
        });
      }
    }

    luckysheet.refresh();

    this.toaster.open({
      text: 'Formato limpiado correctamente',
      caption: 'Éxito',
      type: 'success'
    });
  } catch (error) {
    console.error('Error al limpiar formato:', error);
  }
}
  //#endregion
}