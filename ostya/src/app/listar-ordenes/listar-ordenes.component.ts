import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-listar-ordenes",
  templateUrl: "./listar-ordenes.component.html",
  styleUrls: ["./listar-ordenes.component.css"]
})
export class ListarOrdenesComponent implements OnInit {
  data = {
    doc: "orden"
  };
  userFire;
  ordenFire: any;
  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getPorId(this.data)
      .valueChanges()
      .subscribe(orden => {
        this.ordenFire = orden;
        console.log(this.ordenFire);
      });
    firebaseService
      .getUsuarios()
      .valueChanges()
      .subscribe(user => {
        this.userFire = user;
        console.log(this.userFire);
      });
  }

  ngOnInit() {}
}
