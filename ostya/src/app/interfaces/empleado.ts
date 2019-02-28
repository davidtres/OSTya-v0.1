import { Usuarios } from "./users";

export interface Empleado extends Usuarios{
    roll: string;
    foto: string;
}