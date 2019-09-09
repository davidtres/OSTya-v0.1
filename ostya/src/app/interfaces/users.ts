import { Direccion } from "./direccion";

export interface Usuarios {
  id: number;
  nombre: string;
  correo: string;
  password?: string;
  telefono: number;
  celular: number;
  fechaCreacion: any;
  direccion?: string;
}
