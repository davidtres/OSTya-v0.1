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
          });
        }, 1000);
      });
  }

  ngOnInit() {}
}
