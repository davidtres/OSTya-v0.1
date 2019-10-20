import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";
import { FirebaseService } from "../services/firebase.service";
import { ComunicationService } from "../services/comunication.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"]
})
export class MenuComponent implements OnInit {
  userFireAuth: any;
  userLogged: {} = {};
  public userFire: any;
  usuarios: any;
  clientesFire: any;
  estadosFire: any;
  agendasFire: any;
  clientes: any;
  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private comunicationService: ComunicationService
  ) {}

  logout() {
    this.authenticationService
      .logOut()
      .then(() => {
        this.router.navigate(["login"]);
      })
      .catch(err => {
        console.log(err);
      });
  }
  getUserStatus() {
    return new Promise((resolve, reject) => {
      this.authenticationService.getStatus().subscribe(user => {
        this.userFireAuth = user;
        resolve(user);
      });
    });
  }
  obtenerUbicacion() {
    let coords;
    let startPos;
    let geoOptions = {
      enableHighAccuracy: true
    };
    let geoSuccess = position => {
      startPos = position;
      let startLat = parseFloat(startPos.coords.latitude);
      let startLon = parseFloat(startPos.coords.longitude);
      coords = {
        lat: startLat,
        lng: startLon
      };
    };
    let geoError = function(error) {
      // console.log("Error occurred. Error code: " + error.code);
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    setTimeout(() => {
      let coordsNow = coords;
      this.comunicationService.coordsChange(coordsNow);
      console.log(coordsNow);
    }, 1000);
  }
  ngOnInit() {
    // --------obtener usuario logueado-----------
    this.getUserStatus().then(user => {
      if (user) {
        // console.log(user);
        this.firebaseService
          .getUserUid(this.userFireAuth.uid)
          .valueChanges()
          .subscribe(usuario => {
            this.userFire = usuario;
            this.userLogged = {
              uid: this.userFireAuth.uid,
              id: this.userFire[0].id,
              nombre: this.userFire[0].nombre,
              email: this.userFire[0].correo,
              rol: this.userFire[0].rol
            };
            this.comunicationService.userLogeedChange(this.userLogged);
          });
      } else {
        alert("Usuario no logueado");
      }
    });
    // ------obtener todos los usuarios -----------
    this.firebaseService
      .getUsuarios()
      .valueChanges()
      .subscribe(users => {
        this.usuarios = users;
        this.comunicationService.allUserChange(this.usuarios);
      });
    // -------obtener todos los clientes---------
    this.firebaseService
      .getCliente()
      .valueChanges()
      .subscribe(clientes => {
        this.clientesFire = clientes;
        this.comunicationService.allClientsChange(this.clientesFire);
        this.firebaseService.ordenanzaNombre(this.clientesFire);
        this.clientes = this.clientesFire.map(cliente => {
          return cliente.nombre;
        });
        this.comunicationService.allClientsNamesChange(this.clientes);
      });
    // --------obtener todos los estados--------
    let estados = {
      doc: "estados"
    };
    this.firebaseService
      .getPorDoc(estados)
      .valueChanges()
      .subscribe(estados => {
        this.estadosFire = estados;
        this.comunicationService.allStatesChange(this.estadosFire);
      });
    // -----------obtener todas las agendas-----------
    this.firebaseService
      .getAllAgendas()
      .valueChanges()
      .subscribe(agendas => {
        this.agendasFire = agendas;
        this.comunicationService.allAgendasChange(this.agendasFire);
      });
    this.obtenerUbicacion();
  }
}
