import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase } from 'angularfire2/database';
import { CrearClienteComponent } from '../crear-cliente/crear-cliente.component';
import { createNodeAtIndex } from '@angular/core/src/render3/instructions';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public guardarCliente(cliente){
    console.log(cliente);
   this.afBD.database.ref('clientes/' + cliente.id).set(cliente, function(error) {
    if (error) {
      console.log(error);
    }
  });
  }
  public getCliente(){
    return this.afBD.list('clientes/');
  }
  constructor(private afBD: AngularFireDatabase) { }
}
