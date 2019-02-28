import { Orden } from "./orden";
import { Usuarios } from "./users";

export interface Actualizaciones extends Orden {
    fecha: Date;
    comentario: string;
    usuario: string;
    newEstado: string;
}