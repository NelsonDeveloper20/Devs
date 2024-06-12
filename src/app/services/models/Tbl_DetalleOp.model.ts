export interface TblDetalleOp {
    id: string;
    idTblOrdenProduccion: string;
    numeroCotizacion?: string;
    cotizacionGrupo?: string;
    codigoSisgeco?: string;
    fechaProduccion: string;
    turno?: string;
    idUsuarioCrea: string;
    idUsuarioModifica: string;
    fechaCreacion: string;
    fechaModifica?: Date | null;
    idEstado: string;
}
