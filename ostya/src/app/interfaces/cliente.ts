import { Usuarios } from "./users";

export interface Cliente extends Usuarios{
    contacto?: string;
    coordenadas?: number[];
    tipo: string;
    lastBuy?: Date;
    activo: boolean;
    acceder: boolean;
}
