import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase } from 'angularfire2/database';
import { CrearClienteComponent } from '../crear-cliente/crear-cliente.component';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public guardarCliente(cliente){
    console.log(cliente);
   this.afBD.database.ref('clientes/' + cliente.id).set(cliente, function(error) {
    if (error) {
      console.log(error);
    } else {
      alert('Cliente creado con exito');
    }
  });
  }
  public getCliente(){
    return this.afBD.list('clientes/');
  }
  constructor(private afBD: AngularFireDatabase) { }
}
