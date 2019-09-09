import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Cliente } from "../interfaces/cliente";

@Component({
  selector: "app-editar-cliente",
  templateUrl: "./editar-cliente.component.html",
  styleUrls: ["./editar-cliente.component.css"]
})
export class EditarClienteComponent implements OnInit {
  public formGroup: FormGroup;
  constructor() {}

  ngOnInit() {
    this.buildForm();
  }

  // constructor del formulario
  private buildForm() {
    this.formGroup = new FormGroup({
      Id: new FormControl(this.cliente.id, [Validators.required]),
      Nombre: new FormControl(this.cliente.nombre, [
        Validators.required,
        Validators.minLength(3)
      ]),
      Correo: new FormControl(this.cliente.correo, [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
      ]),
      Dir: new FormControl(this.cliente.direcciones[0], [Validators.required]),
      Cel: new FormControl(this.cliente.celular, [
        Validators.required,
        Validators.minLength(10)
      ]),
      Tel: new FormControl(this.cliente.celular, [Validators.minLength(7)]),
      Contact: new FormControl(this.cliente.contacto, []),
      Tipo: new FormControl(this.cliente.tipo, [Validators.required]),
      Lat: new FormControl(this.cliente.direccion, []),
      Long: new FormControl(this.cliente.direccion, []),
      Acceso: new FormControl(this.cliente.acceder, []),
      fecha: new FormControl(this.cliente.fechaCreacion, [Validators.required])
    });
  }
  // varible para interactuar con campos del HTML (Interfaces)
  cliente: Cliente = {
    id: null,
    nombre: "DAVID PROBANDO",
    correo: "",
    password: "",
    direcciones: [],
    telefono: null,
    celular: 0,
    fechaCreacion: new Date(Date.now()),
    contacto: "",
    direccion: "",
    tipo: "",
    lastBuy: null,
    activo: true,
    acceder: false
  };

  tPersona: any = [
    { tipo: "P. Natural" },
    { tipo: "P. Juridica" },
    { tipo: "Cualquier otra" }
  ];
  validarCliente() {}
}
