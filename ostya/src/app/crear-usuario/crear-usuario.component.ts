import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Empleado } from "../interfaces/empleado";

@Component({
  selector: "app-crear-usuario",
  templateUrl: "./crear-usuario.component.html",
  styleUrls: ["./crear-usuario.component.css"]
})
export class CrearUsuarioComponent implements OnInit {
  public formGroup: FormGroup;

  // varible para interactuar con campos del HTML (Interfaces)
  empleado: Empleado = {
    id: null,
    nombre: "",
    correo: "",
    password: "",
    direcciones: [],
    telefono: null,
    celular: 0,
    fechaCreacion: new Date(Date.now()),
    coordenadas: [0, 0],
    activo: true,
    permisos: [],
    roll: "",
    foto: ""
  };
  constructor() {}

  ngOnInit() {
    this.buildForm();
  }
  // constructor del formulario
  private buildForm() {
    this.formGroup = new FormGroup({
      Id: new FormControl(this.empleado.id, [Validators.required]),
      Nombre: new FormControl(this.empleado.nombre, [
        Validators.required,
        Validators.minLength(3)
      ]),
      Correo: new FormControl(this.empleado.correo, [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
      ]),
      Dir: new FormControl(this.empleado.direcciones, [Validators.required]),
      Cel: new FormControl(this.empleado.celular, [
        Validators.required,
        Validators.minLength(10)
      ]),
      Tel: new FormControl(this.empleado.celular, [Validators.minLength(7)]),
      Lat: new FormControl(this.empleado.coordenadas[0], []),
      Long: new FormControl(this.empleado.coordenadas[1], []),
      Activo: new FormControl(this.empleado.activo, []),
      fecha: new FormControl(this.empleado.fechaCreacion, [Validators.required])
    });
  }
}
