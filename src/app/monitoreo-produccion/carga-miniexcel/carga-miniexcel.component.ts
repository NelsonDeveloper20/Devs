// excel.component.ts
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

declare var luckysheet: any;


@Component({
  selector: 'app-carga-miniexcel',
  templateUrl: './carga-miniexcel.component.html',
  styleUrls: ['./carga-miniexcel.component.css']
})
export class CargaMiniexcelComponent   implements OnInit, OnDestroy {
  @ViewChild('luckyheetContainer') containerRef!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  private luckyheetInstance: any;

  ngOnInit() {
    this.initializeLuckysheet();
  }

  ngOnDestroy() {
    if (this.luckyheetInstance) {
      luckysheet.destroy();
    }
  }

  private initializeLuckysheet() {
    // Configuración completa de Luckysheet
    const options = {
      container: 'luckysheet',
      lang: 'es', // Idioma español
      allowCopy: true,
      allowEdit: true,
      allowUpdate: true,
      
      // Habilitar todas las funcionalidades de Excel
      showtoolbar: true,
      showinfobar: true,
      showsheetbar: true,
      showstatisticBar: true,
      
      // Configurar el menú contextual
      cellRightClickConfig: {
        copy: true,
        copyAs: true,
        paste: true,
        insertRow: true,
        insertColumn: true,
        deleteRow: true,
        deleteColumn: true,
        deleteCell: true,
        hideRow: true,
        hideColumn: true,
        rowHeight: true,
        columnWidth: true,
        clear: true,
        matrix: true,
        sort: true,
        filter: true,
        chart: true,
        image: true,
        link: true,
        data: true,
        cellFormat: true
      },
      
      // Configurar el menú de la barra de herramientas
      toolbarConfig: {
        undoRedo: true,
        paintFormat: true,
        currencyFormat: true,
        percentageFormat: true,
        numberDecrease: true,
        numberIncrease: true,
        moreFormats: true,
        font: true,
        fontSize: true,
        bold: true,
        italic: true,
        strikethrough: true,
        underline: true,
        textColor: true,
        fillColor: true,
        border: true,
        mergeCell: true,
        horizontalAlignMode: true,
        verticalAlignMode: true,
        textWrapMode: true,
        textRotateMode: true,
        image: true,
        chart: true,
        postil: true,
        pivotTable: true,
        function: true,
        frozenMode: true,
        sortAndFilter: true,
        conditionalFormat: true,
        dataVerification: true,
        splitColumn: true,
        screenshot: true,
        findAndReplace: true,
        protection: true,
        print: true
      },
      
      // Datos iniciales (hoja en blanco)
      data: [{
        name: "Hoja1",
        color: "",
        index: 0,
        status: 1,
        order: 0,
        hide: 0,
        row: 50,
        column: 26,
        defaultRowHeight: 19,
        defaultColWidth: 73,
        celldata: [],
        config: {
          merge: {},
          rowlen: {},
          colhidden: {},
          rowhidden: {},
          borderInfo: {},
          authority: {}
        },
        scrollLeft: 0,
        scrollTop: 0,
        luckysheet_select_save: [],
        calcChain: [],
        isPivotTable: false,
        pivotTable: {},
        filter_select: {},
        filter: null,
        luckysheet_alternateformat_save: [],
        luckysheet_alternateformat_save_modelCustom: [],
        luckysheet_conditionformat_save: {},
        freezen: {},
        chart: [],
        zoomRatio: 1,
        image: [],
        showGridLines: 1,
        dataVerification: {}
      }],
      
      // Configuración de funciones
      functionButton: '<i class="fa fa-function" aria-hidden="true"></i>',
      showConfigWindowResize: true,
      
      // Hooks para eventos
      hook: {
        // Evento después de copiar
        cellCopyAfter: (copyRange: any, data: any) => {
          console.log('Datos copiados:', data);
        },
        
        // Evento después de pegar
        cellPasteAfter: (pasteRange: any, data: any) => {
          console.log('Datos pegados:', data);
          this.onDataChange();
        },
        
        // Evento al cambiar datos de celda
        cellEditAfter: (range: any, data: any) => {
          this.onDataChange();
        },
        
        // Evento al cambiar tamaño
        resizeAfter: (size: any) => {
          console.log('Redimensionado:', size);
        }
      }
    };

    // Inicializar Luckysheet
    setTimeout(() => {
      luckysheet.create(options);
      this.luckyheetInstance = luckysheet;
      this.setupCustomPasteHandler();
    }, 100);
  }

  private setupCustomPasteHandler() {
    // Mejorar el manejo del portapapeles
    document.addEventListener('paste', (e) => {
      // Solo procesar si el foco está en Luckysheet
      if (document.activeElement?.closest('#luckysheet')) {
        const clipboardData = e.clipboardData || (window as any).clipboardData;
        
        if (clipboardData) {
          // Obtener datos de texto del portapapeles
          const text = clipboardData.getData('text/plain');
          const html = clipboardData.getData('text/html');
          
          if (text || html) {
            console.log('Pegando desde portapapeles externo');
            // Luckysheet maneja automáticamente el pegado
          }
        }
      }
    });

    // Mejorar el manejo del copiado
    document.addEventListener('copy', (e) => {
      if (document.activeElement?.closest('#luckysheet')) {
        console.log('Copiando al portapapeles externo');
        // Luckysheet maneja automáticamente el copiado
      }
    });
  }

  // Guardar datos en localStorage
  saveData() {
    try {
      const data = luckysheet.getAllSheets();
      localStorage.setItem('excelData', JSON.stringify(data));
      alert('Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los datos');
    }
  }

  // Cargar datos desde localStorage
  loadData() {
    try {
      const savedData = localStorage.getItem('excelData');
      if (savedData) {
        const data = JSON.parse(savedData);
        luckysheet.loadUrl(null, data);
        alert('Datos cargados correctamente');
      } else {
        alert('No hay datos guardados');
      }
    } catch (error) {
      console.error('Error al cargar:', error);
      alert('Error al cargar los datos');
    }
  }

  // Exportar a Excel
  exportExcel() {
    try {
      // Usar la funcionalidad nativa de Luckysheet para exportar
      luckysheet.exportXlsx('MiExcel.xlsx');
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar a Excel');
    }
  }

  // Importar archivo Excel
  importExcel(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Usar la funcionalidad nativa de Luckysheet para importar
      luckysheet.importXlsx(file, (sheets: any) => {
        console.log('Archivo importado:', sheets);
        alert('Archivo Excel importado correctamente');
      }, (error: any) => {
        console.error('Error al importar:', error);
        alert('Error al importar el archivo Excel');
      });
    } catch (error) {
      console.error('Error al procesar archivo:', error);
      alert('Error al procesar el archivo');
    }

    // Limpiar el input
    this.fileInput.nativeElement.value = '';
  }

  // Método para obtener datos actuales
  getCurrentData() {
    return luckysheet.getAllSheets();
  }

  // Método para establecer datos
  setData(data: any) {
    luckysheet.loadUrl(null, data);
  }

  // Método para obtener la celda seleccionada
  getSelectedCell() {
    return luckysheet.getRange();
  }

  // Método para establecer valor en una celda específica
  setCellValue(row: number, col: number, value: any) {
    luckysheet.setCellValue(row, col, value);
  }

  // Método para obtener valor de una celda específica
  getCellValue(row: number, col: number) {
    return luckysheet.getCellValue(row, col);
  }

  // Agregar nueva hoja
  addSheet(name?: string) {
    const sheetName = name || `Hoja${Date.now()}`;
    luckysheet.addSheet(sheetName);
  }

  // Eliminar hoja
  deleteSheet(index: number) {
    luckysheet.deleteSheet(index);
  }

  // Evento cuando cambian los datos
  private onDataChange() {
    // Aquí puedes agregar lógica adicional cuando cambien los datos
    console.log('Los datos han cambiado');
    
    // Ejemplo: auto-guardar cada cierto tiempo
    // this.autoSave();
  }

  // Auto-guardar (opcional)
  private autoSave() {
    try {
      const data = luckysheet.getAllSheets();
      localStorage.setItem('excelDataAutoSave', JSON.stringify(data));
      console.log('Auto-guardado realizado');
    } catch (error) {
      console.error('Error en auto-guardado:', error);
    }
  }

  // Métodos adicionales para funcionalidades avanzadas
  
  // Aplicar formato a celdas seleccionadas
  applyFormat(format: any) {
    const range = luckysheet.getRange();
    if (range) {
      luckysheet.setRangeFormat(range, format);
    }
  }

  // Insertar fórmula
  insertFormula(formula: string) {
    const range = luckysheet.getRange();
    if (range && range.length > 0) {
      const row = range[0].row[0];
      const col = range[0].column[0];
      luckysheet.setCellValue(row, col, formula);
    }
  }

  // Buscar y reemplazar
  findAndReplace(findText: string, replaceText: string) {
    // Implementar lógica de búsqueda y reemplazo
    const allSheets = luckysheet.getAllSheets();
    // Lógica personalizada para buscar y reemplazar
  }

  // Congelar paneles
  freezePanes(row?: number, col?: number) {
    const currentSelection = luckysheet.getRange();
    if (currentSelection && currentSelection.length > 0) {
      const freezeRow = row || currentSelection[0].row[0];
      const freezeCol = col || currentSelection[0].column[0];
      luckysheet.setFreezen(freezeRow, freezeCol);
    }
  }
}