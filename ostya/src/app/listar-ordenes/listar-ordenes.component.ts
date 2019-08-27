import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-listar-ordenes",
  templateUrl: "./listar-ordenes.component.html",
  styleUrls: ["./listar-ordenes.component.css"]
})
export class ListarOrdenesComponent implements OnInit {
  dataOrden = {
    doc: "orden"
  };
  userFire: any;
  ordenFire: any;
  listUser: any;
  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getOrdenesAbiertas()
      .valueChanges()
      .subscribe(orden => {
        this.ordenFire = orden;
        setTimeout(() => {
          this.listUser = [];
          this.ordenFire.forEach(orden => {
            if (!this.listUser.includes(orden.tecnicoAsignado)) {
              this.listUser.push(orden.tecnicoAsignado);
              this.listUser.sort();
            }
            // Filtrar las ordenes para notificaciones
            for (let i = 0; i < this.ordenFire.length; i++) {
              let keys: any = Object.keys(this.ordenFire[i].updates);
              let keysReverse = keys.reverse();
              let hace24h = Date.now() - 86400000;
              let hace3d = Date.now() - 259200000;
              let hace7d = Date.now() - 604800000;
              console.log(keysReverse);
              if (keysReverse[0] > hace24h) {
                this.ordenFire[i].bgUpd = "Actualizado";
              } else {
                if (keysReverse[0] < hace7d) {
                  this.ordenFire[i].bgOld = "Antiguo";
                } else {
                }
                if (keysReverse[0] < hace3d && keysReverse[0] > hace7d) {
                  this.ordenFire[i].bgDes = "Desactualizado";
                }
              }

              if (this.ordenFire[i].fechaSolicitud > hace24h) {
                this.ordenFire[i].bgNew = "Nuevo";
              }
              keys = [];
            }
          });
        }, 1000);

        console.log(this.ordenFire);
      });
  }

  ngOnInit() {}
}
