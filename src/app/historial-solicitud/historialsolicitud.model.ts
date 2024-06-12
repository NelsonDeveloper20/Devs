import { Solicitud2 } from "../solicitudes-adv/solicitud.model";
import { User } from "../usuarios/users.model";

export interface HistorialSolicitud {
    id: number;
    idSolicitud?: number;
    estadoSolicitud?: string;
    subEstado?: string;
    motivo?: string;
    comentario?: string;
    paso?:string;
    usuarioCreacion?: number;
    fechaCreacion?: Date; 
    solicitud: Array<Solicitud2>;
    usuario: Array<User>;
  } 
  
export interface HistorialSolicitudlist {
  id: number;
  idSolicitud?: number;
  estadoSolicitud?: string;
  subEstado?: string;
  motivo?: string;
  comentario?: string;
  paso?:string;
  usuarioCreacion?: number;
  fechaCreacion?: Date; 
  solicitud?: string;
  usuario?: string;
} 
  