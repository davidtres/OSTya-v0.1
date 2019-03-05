import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {
  
  cliente:any ={} //varible para interactuar con campos del HTML
  guardarCliente(){ //funcion del boton "Crear cliente"
    this.firebaseService.guardarCliente(this.cliente); //llamado al metodo "guardarCliente del servicio para comunicacion con firebase"
    
  }
  constructor( private firebaseService: FirebaseService) { } //injectar servicio en el modulo de servicio  firebase para poder usarlo.

  ngOnInit() {
  }

}
