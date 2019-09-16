import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-listar-cliente",
  templateUrl: "./listar-cliente.component.html",
  styleUrls: ["./listar-cliente.component.css"]
})
export class ListarClienteComponent implements OnInit {
  clientesfire: any[];
  registros: any;
  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getCliente()
      .valueChanges()
      .subscribe(clientes => {
        this.clientesfire = clientes;
        let clientesSort = firebaseService.ordenanzaNombre(this.clientesfire);
        console.log(clientesSort);
        this.registros = this.clientesfire.length;
      });
  }

  ngOnInit() {}
}
