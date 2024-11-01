export interface Linea {
    DocEntry: number;
    LineNum: number;
    ItemCode: string;
    ItemName: string;
    Quantity: number;
    TaxCode: string;
    Price: number;
    UnitVat: number;
    PriceAfVAT: number;
    LineValorTotal: number;
    VatSum: number;
    LineTotal: number;
    unitMsr: string;
    WhsCode: string;
    Project: string;
    OcrCode: string;
    CodFamilia: string;
    Familia: string;
    CodSubfamilia?: string;
    Subfamilia?: string;
    Ancho: number;
    Alto: number;
  }
  
  export interface Document {
    Project: string;
    Lineas: Linea[];
    DocEntry: number;
    DocStatus: string;
    DocNum: string;
    CardCode: string;
    CardName: string;
    DocDate: string;
    DocDueDate: string;
    TaxDate: string;
    Comments: string;
    SlpCode: number;
    SlpName: string;
    DocCur: string;
    DocRate: number;
    SubTotal: number;
    VatSum: number;
    DocTotal: number;
    State: string;
    County: string;
    ZipCode: string;
    Street: string;
    Phone: string;
    GrpName: string;
    U_EXX_IT_MOD: string;
  }
  
  export interface ApiResponse {
    maxpage: number;
    nextLink?: string | null;
    value: Document[];
  }
  