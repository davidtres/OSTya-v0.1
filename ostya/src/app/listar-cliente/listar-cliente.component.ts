import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { resolve, reject } from "q";

@Component({
  selector: "app-listar-cliente",
  templateUrl: "./listar-cliente.component.html",
  styleUrls: ["./listar-cliente.component.css"]
})
export class ListarClienteComponent implements OnInit {
  clientesfire: any[];
  registros: any;
  busqueda: string;
  clientes: any;
  clienteSearch: any;
  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getCliente()
      .valueChanges()
      .subscribe(clientes => {
        this.clientesfire = clientes;
        firebaseService.ordenanzaNombre(this.clientesfire);
        this.clienteSearch = this.clientesfire;
        this.registros = this.clientesfire.length;
        this.clientes = this.clientesfire.map(cliente => {
          return cliente.nombre;
        });
      });
  }
  page = 1;
  pageSize = 10;
  // Filtro busqueda de cliente
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 3
          ? []
          : this.clientes
              .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );
  allClients() {
    this.clienteSearch = this.clientesfire;
    this.busqueda = null;
  }
  filterClient($event) {
    return new Promise((resolve, reject) => {
      this.clienteSearch = this.clientesfire.filter(cliente => {
        return cliente.nombre == $event.target.value;
      });
      resolve(this.clienteSearch);
    });
  }
  searchClient($event) {
    this.filterClient($event).then(cliente => {
      this.page = 1;
      let clienteFiltrado: any = cliente;
      if (clienteFiltrado.length == 0) {
        this.allClients();
      }
    });
  }
  ngOnInit() {}
}
