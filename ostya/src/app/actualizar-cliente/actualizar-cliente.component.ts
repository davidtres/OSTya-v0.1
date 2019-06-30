import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-actualizar-cliente",
  templateUrl: "./actualizar-cliente.component.html",
  styleUrls: ["./actualizar-cliente.component.css"]
})
export class ActualizarClienteComponent implements OnInit {
  clientesfire: any;
  id = null;
  clienteActual: any = {};
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {
    firebaseService
      .getCliente()
      .valueChanges()
      .subscribe(clientes => {
        this.clientesfire = clientes;
        //console.log(this.buscarCliente());
        this.clienteActual = this.buscarCliente();
      });
    console.log(this.route.snapshot.params["id"]);
    this.id = this.route.snapshot.params["id"];
  }

  buscarCliente() {
    return (
      this.clientesfire.filter(clienteAct => {
        return clienteAct.id == this.id;
      })[0] || null
    );
  }

  imprimirCliente() {
    console.log(this.clienteActual);
  }

  ngOnInit() {}
}
