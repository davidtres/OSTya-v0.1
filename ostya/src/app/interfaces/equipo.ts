import { TipoEquipo } from "./tEquipo";

export interface Equipo {
    id: number;
    tipo: TipoEquipo;
    ubicacion?: string;
    garantia?: Date;
    referencia: object;
    fechaCreacion?: Date;
    activo: boolean;
    proximoMantto?: Date;
    observaciones?: object;
}