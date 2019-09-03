import { Component, OnInit } from "@angular/core";
import { Equipo } from "../interfaces/equipo";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";
import { FirebaseService } from "../services/firebase.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  userFireAuth: any;
  next: any;
  userFire: any;
  tipoUser: any;
  constructor(
    private authenticationServices: AuthenticationService,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    // Obtener el estado de la sesion del usuario
    authenticationServices.getStatus().subscribe(status => {
      this.userFireAuth = status;
      if (!status) {
        this.router.navigate(["login"]);
      } else {
        console.log(status);
      }
    });
    // Obtener ultimo consecutivo de ordenes para validacion
    firebaseService
      .getNext("orden")
      .valueChanges()
      .subscribe(next => {
        this.next = next;
        console.log(next);
      });
    //Definir si usuario actual es admin o tecnico para mostrar cola.
    this.getStatus().then(status => {
      let statusFire: any = status;
      this.getUsuarios().then(users => {
        this.userFire = users;
        for (let i = 0; i < this.userFire.length; i++) {
          if (this.userFire[i].uid == statusFire.uid) {
            this.tipoUser = this.userFire[i].rol;
          }
        }
      });
    });
  }
  orden: any;
  buscarOrden() {
    if (this.orden > this.next[1] || this.orden < 0) {
      alert("Orden no existe");
      this.orden = "";
    } else {
      this.router.navigate(["updates/" + this.orden]);
    }
  }
  getStatus() {
    return new Promise((resolve, reject) => {
      this.authenticationServices.getStatus().subscribe(status => {
        resolve(status);
      });
    });
  }
  getUsuarios() {
    return new Promise((resolve, reject) => {
      this.firebaseService
        .getUusariosActivos()
        .valueChanges()
        .subscribe(users => {
          resolve(users);
        });
    });
  }

  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      buscar: new FormControl(this.orden, [Validators.required])
    });
  }
}
