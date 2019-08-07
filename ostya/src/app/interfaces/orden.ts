import { TipoOrden } from "./tOrden";

export interface Orden {
  id: number;
  cliente: string;
  fechaSolicitud: Date;
  fechaFinal?: Date;
  tecnicoAsignado: string;
  tipo: string;
  equipo?: string;
  solicitud: string;
  nota?: string;
  estado: string;
  triage: number;
  doc: string;
  modificador: string;
}
