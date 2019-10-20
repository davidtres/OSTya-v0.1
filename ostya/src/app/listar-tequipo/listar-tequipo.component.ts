import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-listar-tequipo",
  templateUrl: "./listar-tequipo.component.html",
  styleUrls: ["./listar-tequipo.component.css"]
})
export class ListarTequipoComponent implements OnInit {
  tEquipoFire: unknown[];
  ngOnInit(): void {}

  data = {
    doc: "tEquipo"
  };
  tServfire: any;
  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getPorDoc(this.data)
      .valueChanges()
      .subscribe(tEquipo => {
        this.tEquipoFire = tEquipo;
        // console.log(estados);
      });
  }
}
