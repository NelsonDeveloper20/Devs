export interface TblUsuario {
    id: string;
    idTipoUsuario: string;
    nombre: string;
    apellido: string;
    dni: string;
    correo: string;
    usuario: string;
    clave: string;
    codigoUsuario: string;
    fechaCreacion: Date;
    fechaModificacion?: string;
    idUsuarioCreacion: string;
    idUsuarioModifica: string;
    estado: string;
}
