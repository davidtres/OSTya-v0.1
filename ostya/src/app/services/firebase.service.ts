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
   this.afBD.database.ref('clientes/' + cliente.id).set(cliente, function(error) {
    if (error) {
      console.log(error);
    } else {
      console.log(cliente);
    }
  });
  }
  public getCliente(){
    return this.afBD.list('clientes/');
  }
  public guardarEquipo(equipo) {
    this.afBD.database.ref('equipos/' + equipo.cliente + '/' + equipo.tipo + '/' + equipo.id).set(equipo, function(error) {
      if (error) {
        console.log(error);
      } else {
        console.log(equipo);
      }
    });
    }
    public setNext(consecutivo) {
      this.afBD.database.ref('next/' + consecutivo.doc).set(consecutivo, function(error) {
        if (error) {
          console.log(error);
        } else {
        }
      });
      }
    public getNext() {
      return this.afBD.list('next/');
    }

  constructor(private afBD: AngularFireDatabase) { }
}
