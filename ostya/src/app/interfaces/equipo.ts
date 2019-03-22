import { TipoEquipo } from './tEquipo';

export interface Equipo {
    id: number;
    cliente: string;
    tipo: TipoEquipo;
    garantia?: any;
    datos: {};
    fechaCreacion: any;
    activo: boolean;
    proximoMantto?: any;
    observaciones?: string;
    doc: string;
}
