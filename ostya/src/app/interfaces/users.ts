export interface Usuarios {
    id: number;
    nombre: string;
    correo: string;
    password?: string;
    direcciones: string[];
    telefono: number;
    celular: number;
    fechaCreacion: Date;
}