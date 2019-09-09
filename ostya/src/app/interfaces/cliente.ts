import { Usuarios } from "./users";
import { Direccion } from "./direccion";

export interface Cliente extends Usuarios {
  direcciones: Direccion[];
  contacto?: string;
  tipo: string;
  lastBuy?: Date;
  activo: boolean;
  acceder: boolean;
}
