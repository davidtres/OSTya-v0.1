import { Equipo } from './equipo';
import { Licencias } from './licencias';
import { eComunicacion } from './eComunicacion';

// tslint:disable-next-line: class-name
export interface PCS extends Equipo {
  caractersiticas?: {
    procesador: string,
    memoria: string,
    disco: string,
    pantalla: string,
    garantia?: string;
    otros?:string;
  };
  software?: Licencias [];
  comunicaciones?: eComunicacion;
}
