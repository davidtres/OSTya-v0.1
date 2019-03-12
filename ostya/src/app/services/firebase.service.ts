import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public guardarCliente(cliente){
    console.log(cliente);
   // this.afBD.database.ref('clientes/'+ cliente.identificacion).set(cliente);
  }
  constructor(private afBD:AngularFireDatabase) { }
}
