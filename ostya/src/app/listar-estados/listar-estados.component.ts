import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-listar-estados",
  templateUrl: "./listar-estados.component.html",
  styleUrls: ["./listar-estados.component.css"]
})
export class ListarEstadosComponent implements OnInit {
  data = {
    doc: "estados"
  };
  estadosfire: any;
  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getPorDoc(this.data)
      .valueChanges()
      .subscribe(estados => {
        this.estadosfire = estados;
        // console.log(estados);
      });
  }

  ngOnInit() {}
}
