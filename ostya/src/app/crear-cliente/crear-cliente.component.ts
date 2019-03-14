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
    nombre: 'prueba',
    correo: '',
    password: '',
    direcciones: [],
    telefono: null,
    celular: 0,
    fechaCreacion: new Date(),
    contacto: '',
    coordenadas: [],
    tipo: '',
    lastBuy: null,
    activo: true,
    acceder: false,
  };
  // funcion del boton "Crear cliente"
  guardarCliente() {
    this.firebaseService.guardarCliente(this.cliente); // llamado al metodo "guardarCliente del servicio para comunicacion con firebase"
  }
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
    // ejemplo  Bootstrap
    this.formGroup = new FormGroup({
      Id: new FormControl(656, [
        Validators.required,
        //Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]),
      Nombre: new FormControl(this.cliente.nombre, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)
      ])
    });
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
