import { Component, OnInit, Input } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-cola-tecnico",
  templateUrl: "./cola-tecnico.component.html",
  styleUrls: ["./cola-tecnico.component.css"]
})
export class ColaTecnicoComponent implements OnInit {
  @Input() userAuth;
  @Input() userFire;
  @Input() ordenFire;
  listUser: any;

  constructor() {}
  ngOnInit() {
    // Selecciona usuario fire de acuerdo al logueado
    for (let i = 0; i < this.userFire.length; i++) {
      if (this.userFire[i].uid == this.userAuth.uid) {
        this.listUser = [];
        this.listUser.push(this.userFire[i].nombre);
      }
    }
  }
}
