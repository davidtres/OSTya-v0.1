import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-listar-usuarios",
  templateUrl: "./listar-usuarios.component.html",
  styleUrls: ["./listar-usuarios.component.css"]
})
export class ListarUsuariosComponent implements OnInit {
  usuariosfire: any;

  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getUsuarios()
      .valueChanges()
      .subscribe(usuarios => {
        this.usuariosfire = usuarios;
        // console.log(usuarios);
      });
  }

  ngOnInit() {}
}
