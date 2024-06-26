export type ITblDetalleOrdenProduccion = {
    id?: string;
    idTblDetalleOp?: string;
    numeroCotizacion?: string;
    cotizacionGrupo?: string;
    codigoSisgeco?: string;
    codigoProducto?: string;
    nombreProducto?: string;
    familia?: string;
    subFamilia?: string;
    unidadMedida?: string;
    cantidad?: string;
    alto?: string;
    ancho?: string;
    linea?: string;
    precio?: string;
    precioInc?: string;
    lote?: string;
    fechaProduccion?: string;
    fechaEntrega?: string;
    nota?: string;
    color?: string;
    indiceAgrupacion?: string;
    idTblAmbiente?: string;
    ambiente?: string;
    turno?: string;
    soporteCentral?: string;
    tipoSoporteCentral?: string;
    caida?: string;
    accionamiento?: string;
    nombreTubo?: string;
    mando?: string;
    tipoMecanismo?: string;
    modeloMecanismo?: string;
    tipoCadena?: string;
    codigoCadena?: string;
    cadena?: string;
    tipoRiel?: string;
    tipoInstalacion?: string;
    codigoRiel?: string;
    riel?: string;
    tipoCassete?: string;
    lamina?: string;
    apertura?: string;
    viaRecogida?: string;
    tipoSuperior?: string;
    codigoBaston?: string;
    baston?: string;
    numeroVias?: string;
    tipoCadenaInferior?: string;
    mandoCordon?: string;
    mandoBaston?: string;
    codigoBastonVarrilla?: string;
    bastonVarrilla?: string;
    cabezal?: string;
    codigoCordon?: string;
    cordon?: string;
    codigoCordonTipo2?: string;
    cordonTipo2?: string;
    cruzeta?: string;
    dispositivo?: string;
    codigoControl?: string;
    control?: string;
    codigoSwitch?: string;
    switch?: string;
    llevaBaston?: string;
    mandoAdaptador?: string;
    codigoMotor?: string;
    motor?: string;
    codigoTela?: string;
    tela?: string;
    cenefa?: string;
    numeroMotores?: string;
    serie?: string;
    alturaCadena?: string;
    alturaCordon?: string;
    marcaMotor?: string;
    idUsuarioCrea?: string;
    idUsuarioModifica?: string;
    fechaCreacion?: string;
    fechaModifica?: Date | null;
    idEstado?: string;
}

export interface TblDetalleOrdenProduccion {
    id: string;
    idTblDetalleOp: string;
    numeroCotizacion?: string;
    cotizacionGrupo?: string;
    codigoSisgeco?: string;
    codigoProducto?: string;
    nombreProducto?: string;
    familia?: string;
    subFamilia?: string;
    unidadMedida?: string;
    cantidad: string;
    alto: string;
    ancho: string;
    linea?: string;
    precio: string;
    precioInc: string;
    lote?: string;
    fechaProduccion: string;
    fechaEntrega: string;
    nota?: string;
    color?: string;
    indiceAgrupacion?: string;
    idTblAmbiente?: string;
    ambiente?: string;
    turno?: string;
    soporteCentral?: string;
    tipoSoporteCentral?: string;
    caida?: string;
    accionamiento?: string;
    nombreTubo?: string;
    mando?: string;
    tipoMecanismo?: string;
    modeloMecanismo?: string;
    tipoCadena?: string;
    codigoCadena?: string;
    cadena?: string;
    tipoRiel?: string;
    tipoInstalacion?: string;
    codigoRiel?: string;
    riel?: string;
    tipoCassete?: string;
    lamina?: string;
    apertura?: string;
    viaRecogida?: string;
    tipoSuperior?: string;
    codigoBaston?: string;
    baston?: string;
    numeroVias?: string;
    tipoCadenaInferior?: string;
    mandoCordon?: string;
    mandoBaston?: string;
    codigoBastonVarrilla?: string;
    bastonVarrilla?: string;
    cabezal?: string;
    codigoCordon?: string;
    cordon?: string;
    codigoCordonTipo2?: string;
    cordonTipo2?: string;
    cruzeta?: string;
    dispositivo?: string;
    codigoControl?: string;
    control?: string;
    codigoSwitch?: string;
    switch?: string;
    llevaBaston?: string;
    mandoAdaptador?: string;
    codigoMotor?: string;
    motor?: string;
    codigoTela?: string;
    tela?: string;
    cenefa?: string;
    numeroMotores: string;
    serie?: string;
    alturaCadena: string;
    alturaCordon: string;
    marcaMotor?: string;
    idUsuarioCrea: string;
    idUsuarioModifica: string;
    fechaCreacion: string;
    fechaModifica?: Date | null;
    idEstado: string;
}
