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
  public userFireAuth: any;
  public userFire: any;
  public ordenFireOpen: any[];
  next: any;
  tipoUser: any;
  orden: any;
  constructor(
    private authenticationServices: AuthenticationService,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  buscarOrden() {
    // if (this.orden > this.next[1] || this.orden < 0) {
    //   alert("Orden no existe");
    //   this.orden = "";
    // } else {
    // }
    this.router.navigate(["updates/" + this.orden]);
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
    // Obtener el estado de la sesion del usuario
    this.authenticationServices.getStatus().subscribe(status => {
      this.userFireAuth = status;
      if (!status) {
        this.router.navigate(["login"]);
      }
    });
    // Obtener ultimo consecutivo de ordenes para validacion
    this.firebaseService
      .getNext("orden")
      .valueChanges()
      .subscribe(next => {
        this.next = next;
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
    this.firebaseService
      .getOrdenesAbiertas()
      .valueChanges()
      .subscribe(orden => {
        this.ordenFireOpen = orden;
        // -------------------------
        for (let i = 0; i < this.ordenFireOpen.length; i++) {
          let keys: any = Object.keys(this.ordenFireOpen[i].updates);
          let keysReverse = keys.reverse();
          let hace24h = Date.now() - 86400000;
          let hace3d = Date.now() - 259200000;
          let hace7d = Date.now() - 604800000;

          if (this.ordenFireOpen[i].fechaSolicitud > hace24h) {
            this.ordenFireOpen[i].bgNew = "Nuevo";
          } else {
            if (
              keysReverse[0] > hace24h &&
              this.ordenFireOpen[i].bgNew != "Nuevo"
            ) {
              this.ordenFireOpen[i].bgUpd = "Actualizado";
            } else {
              if (keysReverse[0] < hace7d) {
                this.ordenFireOpen[i].bgOld = "Antiguo";
              } else {
                if (keysReverse[0] < hace3d && keysReverse[0] > hace7d) {
                  this.ordenFireOpen[i].bgDes = "Desactualizado";
                }
              }
            }
          }
          keys = [];
        }
      });
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      buscar: new FormControl(this.orden, [Validators.required])
    });
  }
}
