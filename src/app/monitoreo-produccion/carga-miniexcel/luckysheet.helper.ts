// luckysheet.helper.ts
declare var luckysheet: any;

import * as XLSX from 'xlsx';
export class LuckysheetHelper {
   
  // Datos de ejemplo actualizados con la nueva columna País
  private sampleData = [
    {
      "name": "Empleados",
      "color": "#4CAF50",
      "index": 0,
      "status": 1,
      "order": 0,
      "hide": 0,
      "row": 25,
      "column": 18,
      "defaultRowHeight": 19,
      "defaultColWidth": 100,
      "celldata": [
        // Headers con estilos - AGREGAMOS PAÍS Y MOVEMOS COLUMNAS
        {"r": 0, "c": 0, "v": {"v": "ID", "ct": {"fa": "General", "t": "g"}, "m": "ID", "bg": "#1976D2", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        {"r": 0, "c": 1, "v": {"v": "Nombre", "ct": {"fa": "General", "t": "g"}, "m": "Nombre", "bg": "#1976D2", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        {"r": 0, "c": 2, "v": {"v": "Apellido", "ct": {"fa": "General", "t": "g"}, "m": "Apellido", "bg": "#1976D2", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        {"r": 0, "c": 3, "v": {"v": "Email", "ct": {"fa": "General", "t": "g"}, "m": "Email", "bg": "#1976D2", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        {"r": 0, "c": 4, "v": {"v": "Edad", "ct": {"fa": "General", "t": "g"}, "m": "Edad", "bg": "#1976D2", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        {"r": 0, "c": 5, "v": {"v": "Salario", "ct": {"fa": "General", "t": "g"}, "m": "Salario", "bg": "#1976D2", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        {"r": 0, "c": 6, "v": {"v": "País", "ct": {"fa": "General", "t": "g"}, "m": "País", "bg": "#FF5722", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        {"r": 0, "c": 7, "v": {"v": "Ciudad", "ct": {"fa": "General", "t": "g"}, "m": "Ciudad", "bg": "#FF9800", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        {"r": 0, "c": 8, "v": {"v": "Departamento", "ct": {"fa": "General", "t": "g"}, "m": "Departamento", "bg": "#795548", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        {"r": 0, "c": 9, "v": {"v": "Fecha Ingreso", "ct": {"fa": "General", "t": "g"}, "m": "Fecha Ingreso", "bg": "#1976D2", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        {"r": 0, "c": 10, "v": {"v": "Activo", "ct": {"fa": "General", "t": "g"}, "m": "Activo", "bg": "#1976D2", "fc": "#FFFFFF", "bl": 1, "fs": 12}},
        
        // Datos de empleados - ACTUALIZADOS CON PAÍS Y CIUDAD
        {"r": 1, "c": 0, "v": {"v": 1, "ct": {"fa": "General", "t": "n"}, "m": "1"}},
        {"r": 1, "c": 1, "v": {"v": "Juan", "ct": {"fa": "General", "t": "g"}, "m": "Juan"}},
        {"r": 1, "c": 2, "v": {"v": "Pérez", "ct": {"fa": "General", "t": "g"}, "m": "Pérez"}},
        {"r": 1, "c": 3, "v": {"v": "juan.perez@empresa.com", "ct": {"fa": "General", "t": "g"}, "m": "juan.perez@empresa.com"}},
        {"r": 1, "c": 4, "v": {"v": 28, "ct": {"fa": "General", "t": "n"}, "m": "28"}},
        {"r": 1, "c": 5, "v": {"v": 3500.50, "ct": {"fa": "General", "t": "n"}, "m": "3500.5"}},
        {"r": 1, "c": 6, "v": {"v": "Perú", "ct": {"fa": "General", "t": "g"}, "m": "Perú", "bg": "#FFF3E0"}},
        {"r": 1, "c": 7, "v": {"v": "Lima", "ct": {"fa": "General", "t": "g"}, "m": "Lima", "bg": "#FFF8E1"}},
        {"r": 1, "c": 8, "v": {"v": "Ventas", "ct": {"fa": "General", "t": "g"}, "m": "Ventas", "bg": "#F3E5F5"}},
        {"r": 1, "c": 9, "v": {"v": "2022-01-15", "ct": {"fa": "yyyy-mm-dd", "t": "d"}, "m": "2022-01-15"}},
        {"r": 1, "c": 10, "v": {"v": "Sí", "ct": {"fa": "General", "t": "g"}, "m": "Sí", "bg": "#C8E6C9"}},
        
        {"r": 2, "c": 0, "v": {"v": 2, "ct": {"fa": "General", "t": "n"}, "m": "2"}},
        {"r": 2, "c": 1, "v": {"v": "María", "ct": {"fa": "General", "t": "g"}, "m": "María"}},
        {"r": 2, "c": 2, "v": {"v": "González", "ct": {"fa": "General", "t": "g"}, "m": "González"}},
        {"r": 2, "c": 3, "v": {"v": "maria.gonzalez@empresa.com", "ct": {"fa": "General", "t": "g"}, "m": "maria.gonzalez@empresa.com"}},
        {"r": 2, "c": 4, "v": {"v": 32, "ct": {"fa": "General", "t": "n"}, "m": "32"}},
        {"r": 2, "c": 5, "v": {"v": 4200.75, "ct": {"fa": "General", "t": "n"}, "m": "4200.75"}},
        {"r": 2, "c": 6, "v": {"v": "Colombia", "ct": {"fa": "General", "t": "g"}, "m": "Colombia", "bg": "#FFF3E0"}},
        {"r": 2, "c": 7, "v": {"v": "Bogotá", "ct": {"fa": "General", "t": "g"}, "m": "Bogotá", "bg": "#FFF8E1"}},
        {"r": 2, "c": 8, "v": {"v": "Tecnología", "ct": {"fa": "General", "t": "g"}, "m": "Tecnología", "bg": "#F3E5F5"}},
        {"r": 2, "c": 9, "v": {"v": "2021-03-10", "ct": {"fa": "yyyy-mm-dd", "t": "d"}, "m": "2021-03-10"}},
        {"r": 2, "c": 10, "v": {"v": "Sí", "ct": {"fa": "General", "t": "g"}, "m": "Sí", "bg": "#C8E6C9"}},
        
        {"r": 3, "c": 0, "v": {"v": 3, "ct": {"fa": "General", "t": "n"}, "m": "3"}},
        {"r": 3, "c": 1, "v": {"v": "Carlos", "ct": {"fa": "General", "t": "g"}, "m": "Carlos"}},
        {"r": 3, "c": 2, "v": {"v": "Rodríguez", "ct": {"fa": "General", "t": "g"}, "m": "Rodríguez"}},
        {"r": 3, "c": 3, "v": {"v": "carlos.rodriguez@empresa.com", "ct": {"fa": "General", "t": "g"}, "m": "carlos.rodriguez@empresa.com"}},
        {"r": 3, "c": 4, "v": {"v": 35, "ct": {"fa": "General", "t": "n"}, "m": "35"}},
        {"r": 3, "c": 5, "v": {"v": 5500.00, "ct": {"fa": "General", "t": "n"}, "m": "5500"}},
        {"r": 3, "c": 6, "v": {"v": "México", "ct": {"fa": "General", "t": "g"}, "m": "México", "bg": "#FFF3E0"}},
        {"r": 3, "c": 7, "v": {"v": "Guadalajara", "ct": {"fa": "General", "t": "g"}, "m": "Guadalajara", "bg": "#FFF8E1"}},
        {"r": 3, "c": 8, "v": {"v": "Tecnología", "ct": {"fa": "General", "t": "g"}, "m": "Tecnología", "bg": "#F3E5F5"}},
        {"r": 3, "c": 9, "v": {"v": "2020-06-01", "ct": {"fa": "yyyy-mm-dd", "t": "d"}, "m": "2020-06-01"}},
        {"r": 3, "c": 10, "v": {"v": "Sí", "ct": {"fa": "General", "t": "g"}, "m": "Sí", "bg": "#C8E6C9"}},
        
        {"r": 4, "c": 0, "v": {"v": 4, "ct": {"fa": "General", "t": "n"}, "m": "4"}},
        {"r": 4, "c": 1, "v": {"v": "Ana", "ct": {"fa": "General", "t": "g"}, "m": "Ana"}},
        {"r": 4, "c": 2, "v": {"v": "López", "ct": {"fa": "General", "t": "g"}, "m": "López"}},
        {"r": 4, "c": 3, "v": {"v": "ana.lopez@empresa.com", "ct": {"fa": "General", "t": "g"}, "m": "ana.lopez@empresa.com"}},
        {"r": 4, "c": 4, "v": {"v": 29, "ct": {"fa": "General", "t": "n"}, "m": "29"}},
        {"r": 4, "c": 5, "v": {"v": 3800.25, "ct": {"fa": "General", "t": "n"}, "m": "3800.25"}},
        {"r": 4, "c": 6, "v": {"v": "Chile", "ct": {"fa": "General", "t": "g"}, "m": "Chile", "bg": "#FFF3E0"}},
        {"r": 4, "c": 7, "v": {"v": "Santiago", "ct": {"fa": "General", "t": "g"}, "m": "Santiago", "bg": "#FFF8E1"}},
        {"r": 4, "c": 8, "v": {"v": "Finanzas", "ct": {"fa": "General", "t": "g"}, "m": "Finanzas", "bg": "#F3E5F5"}},
        {"r": 4, "c": 9, "v": {"v": "2021-09-15", "ct": {"fa": "yyyy-mm-dd", "t": "d"}, "m": "2021-09-15"}},
        {"r": 4, "c": 10, "v": {"v": "Sí", "ct": {"fa": "General", "t": "g"}, "m": "Sí", "bg": "#C8E6C9"}},
        
        {"r": 5, "c": 0, "v": {"v": 5, "ct": {"fa": "General", "t": "n"}, "m": "5"}},
        {"r": 5, "c": 1, "v": {"v": "Luis", "ct": {"fa": "General", "t": "g"}, "m": "Luis"}},
        {"r": 5, "c": 2, "v": {"v": "Martínez", "ct": {"fa": "General", "t": "g"}, "m": "Martínez"}},
        {"r": 5, "c": 3, "v": {"v": "luis.martinez@empresa.com", "ct": {"fa": "General", "t": "g"}, "m": "luis.martinez@empresa.com"}},
        {"r": 5, "c": 4, "v": {"v": 26, "ct": {"fa": "General", "t": "n"}, "m": "26"}},
        {"r": 5, "c": 5, "v": {"v": 3200.00, "ct": {"fa": "General", "t": "n"}, "m": "3200"}},
        {"r": 5, "c": 6, "v": {"v": "Argentina", "ct": {"fa": "General", "t": "g"}, "m": "Argentina", "bg": "#FFF3E0"}},
        {"r": 5, "c": 7, "v": {"v": "Buenos Aires", "ct": {"fa": "General", "t": "g"}, "m": "Buenos Aires", "bg": "#FFF8E1"}},
        {"r": 5, "c": 8, "v": {"v": "Finanzas", "ct": {"fa": "General", "t": "g"}, "m": "Finanzas", "bg": "#F3E5F5"}},
        {"r": 5, "c": 9, "v": {"v": "2023-02-01", "ct": {"fa": "yyyy-mm-dd", "t": "d"}, "m": "2023-02-01"}},
        {"r": 5, "c": 10, "v": {"v": "Sí", "ct": {"fa": "General", "t": "g"}, "m": "Sí", "bg": "#C8E6C9"}},
        
        // Fila de totales y estadísticas
        {"r": 7, "c": 3, "v": {"v": "ESTADÍSTICAS:", "ct": {"fa": "General", "t": "g"}, "m": "ESTADÍSTICAS:", "bg": "#FF9800", "fc": "#FFFFFF", "bl": 1, "fs": 11}},
        {"r": 7, "c": 4, "v": {"v": "Edad Promedio:", "ct": {"fa": "General", "t": "g"}, "m": "Edad Promedio:", "bg": "#FF9800", "fc": "#FFFFFF", "bl": 1}},
        {"r": 7, "c": 5, "v": {"v": "=AVERAGE(E2:E6)", "ct": {"fa": "General", "t": "n"}, "m": "30", "f": "=AVERAGE(E2:E6)", "bg": "#FF9800", "fc": "#FFFFFF", "bl": 1}},
        
        {"r": 8, "c": 4, "v": {"v": "Salario Total:", "ct": {"fa": "General", "t": "g"}, "m": "Salario Total:", "bg": "#4CAF50", "fc": "#FFFFFF", "bl": 1}},
        {"r": 8, "c": 5, "v": {"v": "=SUM(F2:F6)", "ct": {"fa": "General", "t": "n"}, "m": "20200.5", "f": "=SUM(F2:F6)", "bg": "#4CAF50", "fc": "#FFFFFF", "bl": 1}},
        
        {"r": 9, "c": 4, "v": {"v": "Salario Promedio:", "ct": {"fa": "General", "t": "g"}, "m": "Salario Promedio:", "bg": "#2196F3", "fc": "#FFFFFF", "bl": 1}},
        {"r": 9, "c": 5, "v": {"v": "=AVERAGE(F2:F6)", "ct": {"fa": "General", "t": "n"}, "m": "4040.1", "f": "=AVERAGE(F2:F6)", "bg": "#2196F3", "fc": "#FFFFFF", "bl": 1}},
        
        {"r": 10, "c": 4, "v": {"v": "Total Empleados:", "ct": {"fa": "General", "t": "g"}, "m": "Total Empleados:", "bg": "#9C27B0", "fc": "#FFFFFF", "bl": 1}},
        {"r": 10, "c": 5, "v": {"v": "=COUNT(A2:A6)", "ct": {"fa": "General", "t": "n"}, "m": "5", "f": "=COUNT(A2:A6)", "bg": "#9C27B0", "fc": "#FFFFFF", "bl": 1}},
      ]
    },
    {
      "name": "Ventas",
      "color": "#E91E63",
      "index": 1,
      "status": 0,
      "order": 1,
      "hide": 0,
      "row": 15,
      "column": 8,
      "defaultRowHeight": 19,
      "defaultColWidth": 100,
      "celldata": [
        {"r": 0, "c": 0, "v": {"v": "Mes", "ct": {"fa": "General", "t": "g"}, "m": "Mes", "bg": "#E91E63", "fc": "#FFFFFF", "bl": 1}},
        {"r": 0, "c": 1, "v": {"v": "Producto", "ct": {"fa": "General", "t": "g"}, "m": "Producto", "bg": "#E91E63", "fc": "#FFFFFF", "bl": 1}},
        {"r": 0, "c": 2, "v": {"v": "Cantidad", "ct": {"fa": "General", "t": "g"}, "m": "Cantidad", "bg": "#E91E63", "fc": "#FFFFFF", "bl": 1}},
        {"r": 0, "c": 3, "v": {"v": "Precio Unitario", "ct": {"fa": "General", "t": "g"}, "m": "Precio Unitario", "bg": "#E91E63", "fc": "#FFFFFF", "bl": 1}},
        {"r": 0, "c": 4, "v": {"v": "Total", "ct": {"fa": "General", "t": "g"}, "m": "Total", "bg": "#E91E63", "fc": "#FFFFFF", "bl": 1}},
        
        {"r": 1, "c": 0, "v": {"v": "Enero", "ct": {"fa": "General", "t": "g"}, "m": "Enero"}},
        {"r": 1, "c": 1, "v": {"v": "Laptop", "ct": {"fa": "General", "t": "g"}, "m": "Laptop"}},
        {"r": 1, "c": 2, "v": {"v": 10, "ct": {"fa": "General", "t": "n"}, "m": "10"}},
        {"r": 1, "c": 3, "v": {"v": 800, "ct": {"fa": "General", "t": "n"}, "m": "800"}},
        {"r": 1, "c": 4, "v": {"v": "=C2*D2", "ct": {"fa": "General", "t": "n"}, "m": "8000", "f": "=C2*D2"}},
        
        {"r": 2, "c": 0, "v": {"v": "Febrero", "ct": {"fa": "General", "t": "g"}, "m": "Febrero"}},
        {"r": 2, "c": 1, "v": {"v": "Mouse", "ct": {"fa": "General", "t": "g"}, "m": "Mouse"}},
        {"r": 2, "c": 2, "v": {"v": 50, "ct": {"fa": "General", "t": "n"}, "m": "50"}},
        {"r": 2, "c": 3, "v": {"v": 25, "ct": {"fa": "General", "t": "n"}, "m": "25"}},
        {"r": 2, "c": 4, "v": {"v": "=C3*D3", "ct": {"fa": "General", "t": "n"}, "m": "1250", "f": "=C3*D3"}},
      ]
    }
  ];

  // Método para convertir ListComponenteProducto a formato Luckysheet
  // Método para convertir ListComponenteProducto a formato Luckysheet
private convertirProductosALuckysheet(productos: any[],hoja:any): any {
  const celldata: any[] = [];
  // Función helper para determinar el formato según el valor
const obtenerFormato = (valor: number): string => {
  // Si el valor es entero o no tiene decimales significativos
  /*if (valor === Math.floor(valor)) {
    return "0";  // Sin decimales: 3 → "3"
  }*/
  
  // Contar cuántos decimales tiene el valor
  //const decimales = (valor.toString().split('.')[1] || '').length;
  
  // Generar formato dinámico: "0.000" según decimales necesarios
  return "general";//decimales > 0 ? `0.${'0'.repeat(decimales)}` : "0";
};

  // 🎨 HEADERS con estilos
  const headers = [
    { col: 0, label: "Tipo" },
    { col: 1, label: "Código Tipo" },
    { col: 2, label: "Descripción" },
    { col: 3, label: "Ancho" },
    { col: 4, label: "Alto" },
    { col: 5, label: "Cant. Roller" },
    { col: 6, label: "Cálculo Final" },
    { col: 7, label: "Merma" },
    { col: 8, label: "Lote" },
    { col: 9, label: "Producto" },
    { col: 10, label: "Nº Cotización" },
    { col: 11, label: "Grupo Cotiz." },
    //{ col: 12, label: "Código" },
    //{ col: 13, label: "Código Tubo" },
    { col: 12, label: "Familia" },
    { col: 13, label: "Cód. Familia" },
    { col: 14, label: "Sub Familia" },
    //{ col: 17, label: "Col. Cálculo" }
  ];

  // Agregar headers
  headers.forEach(h => {
    celldata.push({
      r: 0,
      c: h.col,
      v: {
        v: h.label,
        ct: { fa: "General", t: "g" },
        m: h.label,
        bg: "#2D7FF9", // Color morado
        fc: "#FFFFFF",
        bl: 1,
        fs: 12
      }
    });
  });

  // 📊 DATOS de productos
  productos.forEach((producto, index) => {
    const row = index + 1; // +1 porque el row 0 es el header
    
    // Tipo
    celldata.push({
      r: row, c: 0,
      v: { v: producto.tipoDesc || "", ct: { fa: "General", t: "g" }, m: producto.tipoDesc || "" }
    });
    
    // Código Tipo
    celldata.push({
      r: row, c: 1,
      v: { v: producto.codigoTipo || "", ct: { fa: "General", t: "g" }, m: producto.codigoTipo || "" }
    });
    
    // Descripción
    celldata.push({
      r: row, c: 2,
      v: { v: producto.descripcionTipo || "", ct: { fa: "General", t: "g" }, m: producto.descripcionTipo || "" }
    });
    
    let ancho=0;
    if(producto.tipoDesc=='TUBO' || producto.tipoDesc === 'RIEL' || producto.tipoDesc === 'TELA'){
      ancho=producto.ancho;
    }
    if(!(producto.tipoDesc === 'TUBO' || producto.tipoDesc === 'RIEL' || producto.tipoDesc === 'TELA')){
      ancho=0;
    }
    // Ancho
    celldata.push({
      r: row, c: 3,
      v: { v: ancho, ct: { fa: obtenerFormato(ancho), t: "n" }, m: ancho?.toFixed(3) || "0" ,
      ht: "0" }, 
    });
     let alto=0;
     if(producto.tipoDesc === 'TELA'){
      alto=producto.alto;
     }
    // Alto
    celldata.push({
      r: row, c: 4,
      v: { v: alto, ct: { fa: obtenerFormato(alto), t: "n" }, m: alto?.toFixed(3) || "0",
      ht: "0"  } 
    });
     
    // Cantidad Roller
    celldata.push({
      r: row, c: 5,
      v: { v: producto.cantidadRoller, ct: { fa: "General", t: "n" }, m: String(producto.cantidadRoller || 0),
      ht: "0"  }
    });
    
    // Cálculo Final 
    celldata.push({
      r: row,      // r = row (fila)
      c: 6,        // c = column (columna)
      v: {         // v = value (objeto de valor de la celda)
        v: producto.calculoFinal,           // v = valor numérico real (4.736)
        ct: {                               // ct = cell type (tipo de celda)
          fa: obtenerFormato(producto.calculoFinal),                      // fa = format (formato de número: 3 decimales fijos)
          t: "n"                            // t = type (tipo: "n" = number/número)
        },
        m: producto.calculoFinal?.toFixed(3) || "0" , // m = display text (texto mostrado en la celda)
        ht: "0" 
      }
    });
/*
fa: Es el formato de número (format string)
"0": Sin decimales → redondea a entero
"0.000": Con 3 decimales fijos
"#,##0.000": Con separador de miles y 3 decimales
*/
    // Merma
    celldata.push({
      r: row, c: 7,
      v: { v: producto.merma, ct: { fa: "General", t: "n" }, m: String(producto.merma || 0) ,
      ht: "0" } 
    });
    
    // Lote
    celldata.push({
      r: row, c: 8,
      v: { v: producto.lote || "", ct: { fa: "General", t: "g" }, m: producto.lote || "" }
    });
    
    // Producto
    celldata.push({
      r: row, c: 9,
      v: { v: producto.producto || "", ct: { fa: "General", t: "g" }, m: producto.producto || "", bg: "#E1F5FE" }
    });
    
    // Nº Cotización
    celldata.push({
      r: row, c: 10,
      v: { v: producto.numeroCotizacion || "", ct: { fa: "General", t: "g" }, m: producto.numeroCotizacion || "" ,
      ht: "0" } 
    });
    
    // Grupo Cotización
    celldata.push({
      r: row, c: 11,
      v: { v: producto.cotizacionGrupo || "", ct: { fa: "General", t: "g" }, m: producto.cotizacionGrupo || "",
      ht: "0"  } 
    });
    /*
    // Código
    celldata.push({
      r: row, c: 12,
      v: { v: producto.codigo || "", ct: { fa: "General", t: "g" }, m: producto.codigo || "" }
    });
    
    // Código Tubo Relacionado
    celldata.push({
      r: row, c: 13,
      v: { v: producto.codigoTuboRelacionado || "", ct: { fa: "General", t: "g" }, m: producto.codigoTuboRelacionado || "" }
    });
    */
    // Familia
    celldata.push({
      r: row, c: 12,
      v: { v: producto.familia || "", ct: { fa: "General", t: "g" }, m: producto.familia || "", bg: "#FFF9C4" }
    });
    
    // Código Familia
    celldata.push({
      r: row, c: 13,
      v: { v: producto.codFamilia || "", ct: { fa: "General", t: "g" }, m: producto.codFamilia || "" ,
      ht: "0" }  
    });
    
    // Sub Familia
    celldata.push({
      r: row, c: 14,
      v: { v: producto.subFamilia || "", ct: { fa: "General", t: "g" }, m: producto.subFamilia || "" ,
      ht: "0" } 
    });
    /*
    // Columna Cálculo
    celldata.push({
      r: row, c: 17,
      v: { v: producto.columnaCalculo || "", ct: { fa: "General", t: "g" }, m: producto.columnaCalculo || "" }
    });*/
  });

  // 📈 ESTADÍSTICAS (opcional)
  const statsRow = productos.length + 2;
  
  /*
  celldata.push({
    r: statsRow, c: 2,
    v: { v: "TOTALES:", ct: { fa: "General", t: "g" }, m: "TOTALES:", bg: "#673AB7", fc: "#FFFFFF", bl: 1 }
  });
  // Total Ancho
  celldata.push({
    r: statsRow, c: 3,
    v: { 
      v: `=SUM(D2:D${productos.length + 1})`, 
      ct: { fa: "0.000", t: "n" }, 
      m: "0.000", 
      f: `=SUM(D2:D${productos.length + 1})`,
      bg: "#B39DDB", 
      fc: "#000000", 
      bl: 1 
    }
  });
  
  // Total Alto
  celldata.push({
    r: statsRow, c: 4,
    v: { 
      v: `=SUM(E2:E${productos.length + 1})`, 
      ct: { fa: "0.000", t: "n" }, 
      m: "0.000", 
      f: `=SUM(E2:E${productos.length + 1})`,
      bg: "#B39DDB", 
      fc: "#000000", 
      bl: 1 
    }
  });*/

  return {
    name: "Producto-"+hoja.toUpperCase(),
    color: "#673AB7",
    index: 2, // Índice de la nueva hoja
    status: 0,
    order: 2,
    hide: 0,
    row: productos.length + 10, // Filas extras por seguridad
    column: 15, // 18 columnas
    defaultRowHeight: 19,
    defaultColWidth: 110,
    celldata: celldata,
    config: {
    sheetNameEdit: false  // 🔒 Bloquea la edición del nombre
  }
  };
}

  getSampleData(): any[] {
    return this.sampleData;
  }
  
  // Inicializar Luckysheet con opciones
  initializeLuckysheet(grupo:any,
    productos: any, 
    callbacks: {
      onCellMousedown?: (cell: any, position: any, sheetFile: any, ctx: any) => boolean,
      onCellEditBefore?: (range: any) => boolean,
      onCellUpdated?: (r: number, c: number, oldValue: any, newValue: any, isRefresh: boolean) => void,
      onRangeSelect?: (range: any) => void,
      onSheetActivate?: (index: number, isPivotInitial: boolean, isNewSheet: boolean) => void,
      onWorkbookCreateAfter?: () => void
    }
  ): void {
    if (typeof luckysheet === 'undefined') {
      console.error('Luckysheet no está disponible. Verifica la instalación.');
      return;
    }
    // Inicializar con datos base
  const dataCompleta =[];// [...this.sampleData];
  
  // Validar que productos sea un array o tenga la estructura esperada
  if (!productos) {
    console.warn('No hay productos para procesar'); 
    return;
  }

  // Manejar diferentes estructuras de productos
  let productosArray: any[] = [];
  
  // Si productos es un array directo
  if (Array.isArray(productos)) {
    productosArray = productos;
  } 
  // Si productos tiene la estructura {data, hoja}
  else if (productos.data && Array.isArray(productos.data)) {
    productosArray = [productos];
  }
  // Si productos es un objeto con múltiples hojas
  else if (typeof productos === 'object') {
    productosArray = Object.keys(productos).map(key => ({
      data: productos[key].data || productos[key],
      hoja: productos[key].hoja || key
    }));
  }
// Procesar cada conjunto de productos
  productosArray.forEach((item, index) => {
    try {
      const data = item.data || item;
      const nombreHoja = item.hoja || `Productos ${index + 1}`;
      
      if (Array.isArray(data) && data.length > 0) {
        const hojaProductos = this.convertirProductosALuckysheet(data, nombreHoja);
        
        // Actualizar el índice de la hoja secuencialmente
        hojaProductos.index = dataCompleta.length;
        hojaProductos.order = dataCompleta.length;
        
        dataCompleta.push(hojaProductos);
        console.log(`✅ Hoja "${nombreHoja}" agregada con ${data.length} productos`);
      } else {
        console.warn(`⚠️ Datos inválidos para la hoja: ${nombreHoja}`);
      }
    } catch (error) {
      console.error(`❌ Error procesando productos en índice ${index}:`, error);
    }
  });
   
    const options = {
      container: 'luckysheet',
      title: "Exploción Grupo - "+grupo?.cotizacionGrupo, //'Sistema de Gestión - Excel',
      lang: 'es',
      data: dataCompleta,
      
      showtoolbar: true,
      showinfobar: true,
      showsheetbar: true,
      showstatisticBar: true,
      showConfigWindowResize: true,
      
      allowCopy: true,
      allowEdit: true,
      allowAdd: true,
      allowDelete: true,
      allowInsertRow: true,
      allowInsertColumn: true,
      allowDeleteRow: true,
      allowDeleteColumn: true,
      
      enableAddRow: true,
      enableAddCol: true,
      rowHeaderWidth: 46,
      columnHeaderHeight: 50,
      sheetFormulaBar: true,
      defaultFontSize: 10,
      
      clipboard: {
        copy: true,
        paste: true
      },
      
      frozen: {
        row_focus: 1
      },
      
      allowUpdate: true,
      updateUrl: false,
      updateImagePositionUrl: false,
      
      containers: 'luckysheet',
      forceCalculation: false,
      
      functionButton: '<div class="luckysheet-wa-calculate-active" id="luckysheet-wa-calculate">Σ</div>',
      showFormulaBar: true,
      
      cellRightClick: (cell: any, position: any, sheetFile: any, ctx: any) => {
        return false;
      },
      
      scrollRefresh: () => {
        return false;
      },
      
      hook: {
        cellMousedown: callbacks.onCellMousedown || (() => true),
        cellEditBefore: callbacks.onCellEditBefore || (() => true),
        cellUpdated: callbacks.onCellUpdated || (() => {}),
        rangeSelect: callbacks.onRangeSelect || (() => {}),
        sheetActivate: callbacks.onSheetActivate || (() => {}),
        workbookCreateAfter: callbacks.onWorkbookCreateAfter || (() => {  // 👈 Agregar aquí
          console.log('Workbook creado, configurando validaciones...');
        }
      ),
        
      // Hook para mejorar el pegado
      cellPasteBefore: (data: any[][], range: any) => {
        console.log('Pegando datos mejorados:', {
          filas: data.length,
          columnas: data[0]?.length || 0
        });
        
        // Procesar y limpiar datos antes de pegar
        const cleanedData = data.map(row => 
          row.map(cell => {
            if (typeof cell === 'string') {
              // Limpiar espacios y caracteres especiales
              const cleaned = cell.trim();
              const num = parseFloat(cleaned);
              return !isNaN(num) && cleaned !== '' ? num : cleaned;
            }
            return cell;
          })
        );
        
        return true; // Permitir pegado
      },
      },
       
    };

    try {
      luckysheet.create(options);
      console.log('Luckysheet inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Luckysheet:', error);
    }
  }

  // Guardar datos del spreadsheet
  saveData(): any {
    if (typeof luckysheet === 'undefined') {
      return null;
    }

    try {
      const allData = luckysheet.getAllSheets();
      return {
        timestamp: new Date().toISOString(),
        sheets: allData.length,
        data: allData
      };
    } catch (error) {
      console.error('Error al guardar:', error);
      return null;
    }
  }
 

  // Exportar como Excel (CSV)
  exportToExcelcsv(): boolean {
    if (typeof luckysheet === 'undefined') {
      return false;
    }

    try {
      const allData = luckysheet.getAllSheets();
      let csvContent = '';
      
      allData.forEach((sheet: any) => {
        csvContent += `HOJA: ${sheet.name}\n`;
        csvContent += '='.repeat(50) + '\n';
        
        const maxRow = Math.max(...sheet.celldata.map((cell: any) => cell.r)) + 1;
        const maxCol = Math.max(...sheet.celldata.map((cell: any) => cell.c)) + 1;
        
        const matrix: string[][] = Array(maxRow).fill(null).map(() => Array(maxCol).fill(''));
        
        sheet.celldata.forEach((cell: any) => {
          matrix[cell.r][cell.c] = cell.v?.m || cell.v?.v || '';
        });
        
        matrix.forEach((row: string[]) => {
          csvContent += row.join('\t') + '\n';
        });
        
        csvContent += '\n\n';
      });
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `excel-export-${new Date().getTime()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      return false;
    }
  }

//#endregion
/**
 * Exporta todas las hojas a un archivo Excel real (.xlsx)
 */
exportToExcel(): boolean {
  if (typeof luckysheet === 'undefined') {
    console.error('Luckysheet no disponible');
    return false;
  }

  try {
    const allSheets = luckysheet.getAllSheets();
    
    if (!allSheets || allSheets.length === 0) {
      console.warn('No hay hojas para exportar');
      return false;
    }

    // Crear un nuevo workbook
    const workbook = XLSX.utils.book_new();

    // Procesar cada hoja
    allSheets.forEach((sheet: any) => {
      try {
        // Convertir celldata de Luckysheet a matriz
        const sheetData = this.convertirCelldataAMatriz(sheet);        
        // Crear worksheet desde la matriz
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);        
        // Aplicar estilos básicos (ancho de columnas)
        if (sheet.config?.columnlen) {
          const colWidths = Object.keys(sheet.config.columnlen).map(col => ({
            wch: sheet.config.columnlen[col] / 10 // Convertir píxeles a caracteres aproximados
          }));
          worksheet['!cols'] = colWidths;
        }        
        // Agregar hoja al workbook (limpiar nombre de caracteres no válidos)
        const sheetName = this.limpiarNombreHoja(sheet.name || `Hoja${allSheets.indexOf(sheet) + 1}`);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);        
      } catch (error) {
        console.error(`Error procesando hoja ${sheet.name}:`, error);
      }
    });

    // Generar archivo Excel
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      cellStyles: true 
    });
    
    // Crear blob y descargar
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `excel-export-${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Excel exportado exitosamente');
    return true;
    
  } catch (error) {
    console.error('❌ Error al exportar Excel:', error);
    return false;
  }
}

/**
 * Convierte celldata de Luckysheet a una matriz (array de arrays)
 */
private convertirCelldataAMatriz(sheet: any): any[][] {
  if (!sheet.celldata || sheet.celldata.length === 0) {
    return [[]];
  }

  // Determinar dimensiones
  const maxRow = Math.max(...sheet.celldata.map((cell: any) => cell.r)) + 1;
  const maxCol = Math.max(...sheet.celldata.map((cell: any) => cell.c)) + 1;
  
  // Crear matriz vacía
  const matriz: any[][] = Array(maxRow).fill(null).map(() => Array(maxCol).fill(''));
  
  // Llenar matriz con valores
  sheet.celldata.forEach((cell: any) => {
    if (cell.v) {
      // Usar el valor mostrado (m) si existe, sino el valor real (v)
      matriz[cell.r][cell.c] = cell.v.m !== undefined ? cell.v.m : cell.v.v;
    }
  });
  
  return matriz;
}

/**
 * Limpia el nombre de la hoja para Excel (máximo 31 caracteres, sin caracteres especiales)
 */
private limpiarNombreHoja(nombre: string): string {
  // Eliminar caracteres no permitidos: \ / * ? [ ] :
  let nombreLimpio = nombre.replace(/[\\\/*?[\]:]/g, '');
  
  // Limitar a 31 caracteres (límite de Excel)
  if (nombreLimpio.length > 31) {
    nombreLimpio = nombreLimpio.substring(0, 31);
  }
  
  return nombreLimpio || 'Hoja1';
}
 

// ===================================================================
// SOLUCIÓN 3: Exportar solo hojas de productos
// ===================================================================

/**
 * Exporta solo las hojas que empiezan con "Producto-"
 */
exportarSoloProductos(): boolean {
  if (typeof luckysheet === 'undefined') {
    console.error('Luckysheet no disponible');
    return false;
  }

  try {
    const allSheets = luckysheet.getAllSheets();
    
    // Filtrar solo hojas de productos
    const productSheets = allSheets.filter((sheet: any) => 
      sheet.name && sheet.name.startsWith('Producto-')
    );

    if (productSheets.length === 0) {
      console.warn('No hay hojas de productos para exportar');
      return false;
    }

    // Crear workbook
    const workbook = XLSX.utils.book_new();

    // Procesar solo hojas de productos
    productSheets.forEach((sheet: any) => {
      const sheetData = this.convertirCelldataAMatriz(sheet);
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      
      const sheetName = this.limpiarNombreHoja(sheet.name);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    // Exportar
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `productos-${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Exportadas ${productSheets.length} hojas de productos`);
    return true;
    
  } catch (error) {
    console.error('❌ Error al exportar productos:', error);
    return false;
  }
}

//#region 



  // Agregar nueva fila con combos dependientes
  addNewRows(fila:any): boolean {
    if (typeof luckysheet === 'undefined') {
      return false;
    }

    try {
      const currentSheet = luckysheet.getSheet();
      if (!currentSheet) {
        return false;
      }

      const celldata = currentSheet.celldata || [];
      const maxRow = celldata.length > 0 ? Math.max(...celldata.map((cell: any) => cell.r)) : 0;
      const newRowIndex = maxRow + 1;
      
      const ids = celldata
        .filter((cell: any) => cell.c === 0 && cell.r > 0 && typeof cell.v?.v === 'number')
        .map((cell: any) => cell.v.v);
      const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
      /*
      const defaultRowData = [
        { c: 0, v: { v: nextId, m: nextId.toString() } },
        { c: 1, v: { v: 'Nuevo Empleado', m: 'Nuevo Empleado' } },
        { c: 2, v: { v: 'Apellido', m: 'Apellido' } },
        { c: 3, v: { v: 'email@empresa.com', m: 'email@empresa.com' } },
        { c: 4, v: { v: 25, m: '25' } },
        { c: 5, v: { v: 3000.00, m: '3000' } },
        { c: 6, v: { v: '', m: '' } },
        { c: 7, v: { v: '', m: '' } },
        { c: 8, v: { v: '', m: '' } },
        { c: 9, v: { v: new Date().toISOString().split('T')[0], m: new Date().toISOString().split('T')[0] } },
        { c: 10, v: { v: 'Sí', m: 'Sí', bg: '#C8E6C9' } }
      ];
      
      defaultRowData.forEach(cellData => {
        luckysheet.setCellValue(newRowIndex, cellData.c, cellData.v);
      });*/
      var row=newRowIndex;
        luckysheet.setCellValue(row, 0, fila.Tipo);//Tipo
        luckysheet.setCellValue(row, 1, fila["Codigo Tipo"]);//Código Tipo
        luckysheet.setCellValue(row, 2, fila.Descripcion);;//Descripción
        luckysheet.setCellValue(row, 3, fila.Ancho);//Ancho
        luckysheet.setCellValue(row, 4, fila.Alto);//Alto
        luckysheet.setCellValue(row, 5, fila["Cant. Roller"]);//Cant. Roller
        luckysheet.setCellValue(row, 6,fila["Cálculo Final"]);//Cálculo Final
        luckysheet.setCellValue(row, 7, fila.Merma);//Merma
        luckysheet.setCellValue(row, 8, fila.Lote);//Lote
        luckysheet.setCellValue(row, 9, fila.Producto);//Producto
        luckysheet.setCellValue(row,10, fila["Nº Cotizacion"]);//Nº Cotizacion
        luckysheet.setCellValue(row, 11, fila["Grupo Cotiz."]);//Grupo Cotiz. 
        luckysheet.setCellValue(row, 12, fila.Familia);//Familia
        luckysheet.setCellValue(row, 13, fila["Cod. Familia"]);//Cod. Familia
        luckysheet.setCellValue(row, 14, fila["Sub Familia"]);//Sub Familia
 /*
 Tipo: ultimoItem.Tipo,
  "Codigo Tipo": ultimoItem["Codigo Tipo"],
  Descripcion: ultimoItem.Descripcion,
  Ancho: ultimoItem.Ancho,
  Alto: ultimoItem.Alto,
  "Cant. Roller": ultimoItem["Cant. Roller"],
  "Cálculo Final": ultimoItem["Cálculo Final"],
  Merma: ultimoItem.Merma,
  Lote: ultimoItem.Lote,
  Producto: ultimoItem.Producto,
  "Nº Cotizacion": ultimoItem["Nº Cotizacion"],
  "Grupo Cotiz.": ultimoItem["Grupo Cotiz."],
  Col_12: ultimoItem.Col_12,
  Familia: ultimoItem.Familia,
  "Cod. Familia": ultimoItem["Cod. Familia"],
  "Sub Familia": ultimoItem["Sub Familia"]*/

      /*
      setTimeout(() => {
        luckysheet.dataVerificationCtrl.add({
          row: [newRowIndex, newRowIndex],
          column: [6, 6],
          type: "dropdown",
          value1: "Perú,Colombia,México,Chile,Argentina",
          prohibitInput: true,
          hintText: "Selecciona un país"
        });
        
        luckysheet.dataVerificationCtrl.add({
          row: [newRowIndex, newRowIndex],
          column: [7, 7],
          type: "dropdown",
          value1: "Selecciona primero un país",
          prohibitInput: true,
          hintText: "Primero selecciona un país"
        });
        
        luckysheet.dataVerificationCtrl.add({
          row: [newRowIndex, newRowIndex],
          column: [8, 8],
          type: "dropdown",
          value1: "Selecciona primero una ciudad",
          prohibitInput: true,
          hintText: "Primero selecciona una ciudad"
        });
        
        luckysheet.setSelection({ 
          row: [newRowIndex, newRowIndex], 
          column: [6, 6] 
        });
      }, 200);*/
      
      return true;
    } catch (error) {
      console.error('Error al agregar fila:', error);
      return false;
    }
  }
addNewRow(fila: any): boolean {
  if (typeof luckysheet === 'undefined') {
    return false;
  }

  try {
    const currentSheet = luckysheet.getSheet();
    if (!currentSheet) {
      return false;
    }

    // Obtener los datos actuales de la hoja
    const flowdata = luckysheet.getSheetData();
    
    // Encontrar la última fila con datos (buscar desde el final)
    let newRowIndex = 1; // Empezar después del header (row 0)
    
    for (let i = flowdata.length - 1; i >= 0; i--) {
      if (flowdata[i] && flowdata[i].length > 0) {
        // Verificar si la fila tiene al menos una celda con datos
        const tienedatos = flowdata[i].some((cell: any) => cell && (cell.v !== null && cell.v !== undefined && cell.v !== ""));
        if (tienedatos) {
          newRowIndex = i + 1;
          break;
        }
      }
    }

    // Si no hay filas con datos (solo header), empezar en row 1
    if (newRowIndex === 1 && flowdata.length <= 1) {
      newRowIndex = 1;
    }

    console.log("Agregando fila en índice:", newRowIndex);

    const row = newRowIndex;

    // Usar el método que funciona con formato 
    this.actualizarCeldaConFormato(row, 0, fila.Tipo, "g","1",null,false);
    this.actualizarCeldaConFormato(row, 1, fila["Codigo Tipo"], "g","1",null,false);
    this.actualizarCeldaConFormato(row, 2, fila.Descripcion, "g","1",null,false);
    this.actualizarCeldaConFormato(row, 3, fila.Ancho, "n", "0");
    this.actualizarCeldaConFormato(row, 4, fila.Alto, "n", "0");
    this.actualizarCeldaConFormato(row, 5, fila["Cant. Roller"], "n", "0");
    this.actualizarCeldaConFormato(row, 6, fila["Cálculo Final"], "n", "0");
    this.actualizarCeldaConFormato(row, 7, fila.Merma, "n", "0");
    this.actualizarCeldaConFormato(row, 8, fila.Lote, "g");
    this.actualizarCeldaConFormato(row, 9, fila.Producto, "g", "1", "#E1F5FE");
    this.actualizarCeldaConFormato(row, 10, fila["Nº Cotizacion"], "g", "0");
    this.actualizarCeldaConFormato(row, 11, fila["Grupo Cotiz."], "g", "0");
    this.actualizarCeldaConFormato(row, 12, fila.Familia, "g", "0", "#FFF9C4");
    this.actualizarCeldaConFormato(row, 13, fila["Cod. Familia"], "g", "0");
    this.actualizarCeldaConFormato(row, 14, fila["Sub Familia"], "g", "0"); 
    return true;
  } catch (error) {
    console.error('Error al agregar fila:', error);
    return false;
  }
}
  // Auto-guardado
  autoSave(): void {
    if (typeof luckysheet !== 'undefined') {
      try {
        const allData = luckysheet.getAllSheets();
        localStorage.setItem('luckysheet_autosave', JSON.stringify({
          timestamp: new Date().toISOString(),
          data: allData
        }));
        console.log('Auto-guardado realizado');
      } catch (error) {
        console.error('Error en auto-guardado:', error);
      }
    }
  }

  // Cargar auto-guardado
  loadAutoSave(): any {
    try {
      const saved = localStorage.getItem('luckysheet_autosave');
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error('Error al cargar auto-guardado:', error);
      return null;
    }
  }

  // Destruir instancia
  destroy(): void {
    if (typeof luckysheet !== 'undefined') {
      luckysheet.destroy();
    }
  }

  // Obtener valor de celda
  getCellValue(row: number, col: number): any {
    if (typeof luckysheet !== 'undefined') {
      return luckysheet.getCellValue(row, col);
    }
    return null;
  }

  

  // Convertir patrón a RegEx para filtros
  convertirPatronARegex(patron: string): RegExp {
    const escapado = patron
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    return new RegExp(escapado, 'i');
  }

  setCellValue(row: number, col: number, value: any, itemCombo, PrimeraFila: any,filaSelectedExcel:any): void {
  console.log("SELECCIONADO ::>");
  console.log(value);
  
  if (typeof luckysheet !== 'undefined') {
    //luckysheet.setCellValue(row, col, value);
    
      this.actualizarCeldaConFormato(row, col, value, "g","1",null,false);
    if (value == "Ninguno") {
      // Usar el mismo método que funciona en convertirProductosALuckysheet
      this.actualizarCeldaConFormato(row, 2, itemCombo?.descripcionTipo, "g","1");
      this.actualizarCeldaConFormato(row, 3, 0, "n", "0",null,true);
      this.actualizarCeldaConFormato(row, 4, 0, "n", "0",null,true);
      this.actualizarCeldaConFormato(row, 5, 0, "n", "0",null,true);
      this.actualizarCeldaConFormato(row, 6, 0, "n", "0",null,true);
      this.actualizarCeldaConFormato(row, 7, 0, "n", "0");
      this.actualizarCeldaConFormato(row, 8, "", "g");
    } else {
      this.actualizarCeldaConFormato(row, 2, itemCombo?.descripcionTipo, "g","1");
    if(!filaSelectedExcel?.Ancho){
      this.actualizarCeldaConFormato(row, 3, 0, "n", "0",null,true);
    }
    if(!filaSelectedExcel?.Alto){
      this.actualizarCeldaConFormato(row, 4, 0, "n", "0",null,true);
    }
    if(!filaSelectedExcel?.["Cant. Roller"]){
      this.actualizarCeldaConFormato(row, 5, 0, "n", "0",null,true);
    }
    if(!filaSelectedExcel?.["Cálculo Final"]){
      this.actualizarCeldaConFormato(row, 6, 0, "n", "0",null,true);
    }
    if(!filaSelectedExcel?.Merma){
      this.actualizarCeldaConFormato(row, 7, 0, "n", "0",null,true);
    }
    }
  
    // Aplicar con color de fondo
    this.actualizarCeldaConFormato(row, 9, PrimeraFila?.Producto, "g", "0", "#E1F5FE");
    this.actualizarCeldaConFormato(row, 10, PrimeraFila?.["Nº Cotizacion"], "g", "0",null,true);
    this.actualizarCeldaConFormato(row, 11, PrimeraFila?.["Grupo Cotiz."], "g", "0",null,true);
    this.actualizarCeldaConFormato(row, 12, PrimeraFila?.Familia, "g", "0", "#FFF9C4");
    this.actualizarCeldaConFormato(row, 13, PrimeraFila?.["Cod. Familia"], "g", "0",null,true);
    this.actualizarCeldaConFormato(row, 14, PrimeraFila?.["Sub Familia"], "g", "0",null,true);
  }
}
actualizarCeldaConFormato(
  row: number, 
  col: number, 
  valor: any, 
  tipo: string = "g", 
  alineacion: string = "0", 
  colorFondo?: string,
  centrar: boolean = false 
): void {
  const currentSheet = luckysheet.getSheet();
  const flowdata = currentSheet.data || luckysheet.getSheetData();
  
  // Asegurarse de que la fila existe
  if (!flowdata[row]) {
    flowdata[row] = [];
  }
  
  // Crear el objeto con EXACTAMENTE la misma estructura de convertirProductosALuckysheet
  flowdata[row][col] = {
    v: valor,
    ct: { fa: "General", t: tipo },
    m: String(valor),
    ht: alineacion,
    vt: centrar ? "0" : "1"  // ✅ "0" = centro, "1" = izquierda
    
  };
  if (colorFondo) {
    flowdata[row][col].bg = colorFondo;
  }
  
  // Usar jfrefreshgrid para forzar renderizado
  if (typeof (window as any).luckysheetrefreshgrid !== 'undefined') {
    (window as any).jfrefreshgrid(flowdata, [{ row: [row, row], column: [col, col] }]);
  } else {
    luckysheet.refresh();
  }
  
}
}