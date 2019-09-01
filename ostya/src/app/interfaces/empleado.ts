import { Usuarios } from "./users";

export interface Empleado extends Usuarios {
  rol: string;
  foto: string;
  coordenadas?: number[];
  activo: boolean;
  permisos: string[];
  color: string;
  iniciales: string;
  uid: string;
  clave: string;
}
