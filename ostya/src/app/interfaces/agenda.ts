export interface Agenda {
  title: string;
  fecha: Date;
  start: Date;
  end: Date;
  duracion: string;
  orden: number;
  color: string;
  estado: string;
  url: string;
  llegada: Date;
  salida: Date;
  dif: number;
  tecnico: string;
  editable: boolean;
  startOk: Date;
  endOk: Date;
  userId: number;
}
