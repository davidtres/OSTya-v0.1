export interface Equipo {
    id: number;
    cliente: string;
    tipo: string;
    garantia?: any;
    datos: {};
    fechaCreacion: any;
    activo: boolean;
    proximoMantto?: any;
    observaciones?: string;
}
