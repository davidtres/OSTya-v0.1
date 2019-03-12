import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Cliente } from '../interfaces/cliente';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {
  //varible para interactuar con campos del HTML
  cliente : Cliente ={
    id: 0,    
    nombre: '',
    correo: '',
    password:'',
    direcciones: [],
    telefono: 0,
    celular: 0,
    fechaCreacion: new Date(),
    contacto: '',
    coordenadas: [],
    tipo: '',
    lastBuy: null,
    activo: true,
    acceder: false,    
  } 
  
  guardarCliente(){ //funcion del boton "Crear cliente"
    this.firebaseService.guardarCliente(this.cliente); //llamado al metodo "guardarCliente del servicio para comunicacion con firebase"
  }

  constructor( private firebaseService: FirebaseService) { } //injectar servicio en el modulo de servicio  firebase para poder usarlo.
    
  ngOnInit() {
  }

}
