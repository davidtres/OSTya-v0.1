import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-listar-cliente",
  templateUrl: "./listar-cliente.component.html",
  styleUrls: ["./listar-cliente.component.css"]
})
export class ListarClienteComponent implements OnInit {
  clientesfire: any;

  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getCliente()
      .valueChanges()
      .subscribe(clientes => {
        this.clientesfire = clientes;
        //console.log(clientes);
      });
  }

  ngOnInit() {}
}
