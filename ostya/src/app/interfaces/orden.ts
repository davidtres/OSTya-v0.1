import { TipoOrden } from "./tOrden";

export interface Orden{
    numero: number;
    cliente: string;
    fechaSolicitud: Date;
    fechaFinal: Date;
    tecnicoAsignado: string;
    tipo: TipoOrden;
    equipo: string;
    solicitud: string;
    nota: string;
    estado: string
}