import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-cola-tecnico",
  templateUrl: "./cola-tecnico.component.html",
  styleUrls: ["./cola-tecnico.component.css"]
})
export class ColaTecnicoComponent implements OnInit {
  dataOrden = {
    doc: "orden"
  };
  userFire: any;
  ordenFire: any;
  listUser: any;

  constructor(
    private firebaseService: FirebaseService,
    private authenticationService: AuthenticationService
  ) {
    this.getStatus().then(status => {
      let statusFire: any = status;
      this.getUsuarios().then(users => {
        this.userFire = users;
        for (let i = 0; i < this.userFire.length; i++) {
          if (this.userFire[i].uid == statusFire.uid) {
            this.listUser = [];
            this.listUser.push(this.userFire[i].nombre);
          }
        }
      });
      firebaseService
        .getOrdenesAbiertas()
        .valueChanges()
        .subscribe(orden => {
          this.ordenFire = orden;
          this.ordenFire.forEach(orden => {
            if (!this.listUser.includes(orden.tecnicoAsignado)) {
              this.listUser.sort();
            }
            // Filtrar las ordenes para notificaciones
            for (let i = 0; i < this.ordenFire.length; i++) {
              let keys: any = Object.keys(this.ordenFire[i].updates);
              let keysReverse = keys.reverse();
              let hace24h = Date.now() - 86400000;
              let hace3d = Date.now() - 259200000;
              let hace7d = Date.now() - 604800000;

              if (this.ordenFire[i].fechaSolicitud > hace24h) {
                this.ordenFire[i].bgNew = "Nuevo";
              } else {
                if (
                  keysReverse[0] > hace24h &&
                  this.ordenFire[i].bgNew != "Nuevo"
                ) {
                  this.ordenFire[i].bgUpd = "Actualizado";
                } else {
                  if (keysReverse[0] < hace7d) {
                    this.ordenFire[i].bgOld = "Antiguo";
                  } else {
                    if (keysReverse[0] < hace3d && keysReverse[0] > hace7d) {
                      this.ordenFire[i].bgDes = "Desactualizado";
                    }
                  }
                }
              }
              keys = [];
            }
          });
        });
    });
  }
  getStatus() {
    return new Promise((resolve, reject) => {
      this.authenticationService.getStatus().subscribe(status => {
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
  ngOnInit() {}
}
