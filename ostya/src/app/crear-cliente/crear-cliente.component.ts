import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Cliente } from '../interfaces/cliente';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {
  // Variable contiene formulario HTML
  public formGroup: FormGroup;

  // varible para interactuar con campos del HTML (Interfaces)
  cliente: Cliente = {
    id: null,
    nombre: '',
    correo: '',
    password: '',
    direcciones: [],
    telefono: null,
    celular: 0,
    fechaCreacion: new Date(),
    contacto: '',
    coordenadas: [0, 0],
    tipo: '',
    lastBuy: null,
    activo: true,
    acceder: false,
  };

  clientesfire: any;

  constructor( private firebaseService: FirebaseService) {
    firebaseService.getCliente()
      .valueChanges().subscribe(clientes => {
        console.log(clientes);
        this.clientesfire = clientes;
      });
  }

  ngOnInit() {
    this.buildForm();
  }
  // constructor del formulario
  private buildForm() {
    this.formGroup = new FormGroup({
      Id: new FormControl(this.cliente.id, [
        Validators.required,
      ]),
      Nombre: new FormControl(this.cliente.nombre, [
        Validators.required,
        Validators.minLength(3)
      ]),
      Correo: new FormControl(this.cliente.correo, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]),
      Dir: new FormControl(this.cliente.direcciones[0], [
        Validators.required,
      ]),
      Cel: new FormControl(this.cliente.celular, [
        Validators.required,
        Validators.minLength(10)
      ]),
      Tel: new FormControl(this.cliente.celular, [
        Validators.minLength(7)
      ]),
      Contact: new FormControl(this.cliente.contacto, [
      ]),
      Tipo: new FormControl(this.cliente.tipo, [
        Validators.required
      ]),
      Lat: new FormControl(this.cliente.coordenadas[0], [
      ]),
      Long: new FormControl(this.cliente.coordenadas[1], [
      ]),
      Acceso: new FormControl(this.cliente.acceder, [
      ])
    });
  }

  // funcion del boton "Crear cliente"
  guardarCliente() {
    // llamado al metodo "guardarCliente del servicio para comunicacion con firebase"
    this.firebaseService.guardarCliente(this.cliente);
    this.onReset();
  }

  // Borrar el formulario
  onReset() {
    this.formGroup.reset();
  }

  // Manejador de errores
  public getError(controlName: string): string {
    let error = '';
    const control = this.formGroup.get(controlName);
    if (control.touched && control.errors != null) {
      error = JSON.stringify(control.errors);
      console.log(control.errors.required);
    }
    return error;
  }

}
