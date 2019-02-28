import { Component, OnInit } from '@angular/core';
import { Equipo } from '../interfaces/equipo';
import { UsuarioPlat } from '../interfaces/user-platzinger';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  friends: UsuarioPlat [];
  constructor() {

    let usuario1: UsuarioPlat = {
      nick: 'Eduardo',
      age: 24,
      email: 'ed@aoe.aoe',
      friend: true,
      uid: 1
    };
    let usuario2: UsuarioPlat = {
      nick: 'Freddy',
      age: 28,
      email: 'fred@aoe.aoe',
      friend: true,
      uid: 1
    };
    let usuario3: UsuarioPlat = {
      nick: 'Yuliana',
      age: 18,
      email: 'yuli@aoe.aoe',
      friend: true,
      uid: 1
    };
    let usuario4: UsuarioPlat = {
      nick: 'Ricardo',
      age: 17,
      email: 'rick@aoe.aoe',
      friend: false,
      uid: 1
    };
    let usuario5: UsuarioPlat = {
      nick: 'Marcos',
      age: 30,
      email:'marcos@aoe.aoe',
      friend: false,
      uid: 1
    };
    this.friends =[usuario1, usuario2, usuario3, usuario4, usuario5]
  }
    
    
    
  ngOnInit() {
  }

}
