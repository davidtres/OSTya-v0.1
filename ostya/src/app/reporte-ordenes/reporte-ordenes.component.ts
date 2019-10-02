import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { resolve, reject } from "q";
import { ComunicationService } from "../services/comunication.service";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "app-reporte-ordenes",
  templateUrl: "./reporte-ordenes.component.html",
  styleUrls: ["./reporte-ordenes.component.css"]
})
export class ReporteOrdenesComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  busqueda = {
    desde: "",
    hasta: "",
    desdeM: 0,
    hastaM: 0,
    cliente: "",
    tecnico: "",
    estado: "",
    cerrada: ""
  };
  openClose = ["TODOS", "Abiertas", "Cerradas"];
  desde: any = null;
  hasta: any = null;
  usuariosFire: any;
  clientesFire: any[];
  estadosFire: any[];
  ordenFire: any[];
  ordenFilter: any[];
  listUser: any[];
  listCliente: any = [];
  listEstado: any[] = [];
  listClose: any[];
  registros: number;
  allUsers: any;
  allClientes: any;
  allEstados: any;
  clientSeleted: any;
  spinner: boolean = false;
  constructor(
    private firebaseService: FirebaseService,
    private comunicationService: ComunicationService
  ) {}
  buscarOrden() {
    if (
      this.hasta != this.busqueda.hasta ||
      this.desde !== this.busqueda.desde
    ) {
      this.spinner = true;
      this.ordenesEnFire().then(() => {
        this.clienteFiltro().then(clientes => {
          this.listClientsSeleted();
          this.estadoFiltro().then(() => {
            this.listClientsSeleted();
            this.cerradaFiltro().then(() => {
              this.listClientsSeleted();
              this.usuarioFiltro().then(() => {
                this.listClientsSeleted();
                this.registros = this.ordenFilter.length;
                this.ordenFilter.sort(function(a, b) {
                  return b.id - a.id;
                });
                console.log(this.ordenFilter);

                this.desde = this.busqueda.desde;
                this.hasta = this.busqueda.hasta;
                this.spinner = false;
              });
            });
          });
        });
      });
    } else {
      this.rebuscarOrden();
    }
  }
  listClientsSeleted() {
    this.clientSeleted = [];
    this.ordenFilter.forEach(orden => {
      if (!this.clientSeleted.includes(orden.cliente)) {
        this.clientSeleted.push(orden.cliente);
      }
    });
  }
  rebuscarOrden() {
    this.spinner = true;
    this.clienteFiltro().then(() => {
      this.listClientsSeleted();
      this.estadoFiltro().then(() => {
        this.listClientsSeleted();
        this.cerradaFiltro().then(() => {
          this.listClientsSeleted();
          this.usuarioFiltro().then(() => {
            this.listClientsSeleted();
            this.registros = this.ordenFilter.length;
            this.ordenFilter.sort(function(a, b) {
              return b.id - a.id;
            });
            this.spinner = false;
          });
        });
      });
    });
  }
  validarFechas() {
    if (Date.parse(this.busqueda.desde) > Date.parse(this.busqueda.hasta)) {
      alert("La fecha 'Desde' no puede ser mayor");
      this.busqueda.desde = "";
    } else {
      this.busqueda.desdeM = Date.parse(this.busqueda.desde); //conversion de fecha input a milisegundos
      this.busqueda.hastaM = Date.parse(this.busqueda.hasta); //conversion de fecha input a milisegundos
      // this.ordenesEnFire();
    }
  }
  todos() {
    this.busqueda.cliente = "TODOS";
  }
  ordenesEnFire() {
    return new Promise((resolve, reject) => {
      this.firebaseService
        .getOrdenesFecha(this.busqueda)
        .valueChanges()
        .subscribe(ordenes => {
          this.ordenFire = ordenes;
          console.log(ordenes);
          resolve(this.ordenFire);
        });
    }).catch(this.error);
  }
  error(arg0: string) {
    alert(arg0);
  }
  clienteFiltro() {
    return new Promise((resolve, reject) => {
      this.clientSeleted = [];
      if (this.busqueda.cliente == "TODOS") {
        this.ordenFilter = this.ordenFire.filter(orden => orden.cliente);

        resolve(this.ordenFilter);
      } else {
        this.ordenFilter = this.ordenFire.filter(
          orden => orden.cliente == this.busqueda.cliente
        );
        resolve(this.ordenFilter);
      }
    });
  }
  estadoFiltro() {
    return new Promise((resolve, reject) => {
      if (this.busqueda.estado == "TODOS") {
        this.ordenFilter = this.ordenFilter.filter(orden => orden.cliente);
        resolve(this.ordenFilter);
      } else {
        this.ordenFilter = this.ordenFilter.filter(
          orden => orden.estado == this.busqueda.estado
        );
        resolve(this.ordenFilter);
      }
    });
  }
  usuarioFiltro() {
    return new Promise((resolve, reject) => {
      if (this.busqueda.tecnico == "TODOS") {
        this.ordenFilter = this.ordenFilter.filter(orden => orden.cliente);
        resolve(this.ordenFilter);
      } else {
        this.ordenFilter = this.ordenFilter.filter(
          orden => orden.tecnicoAsignado == this.busqueda.tecnico
        );
        resolve(this.ordenFilter);
      }
    });
  }
  cerradaFiltro() {
    return new Promise((resolve, reject) => {
      if (this.busqueda.cerrada == "TODOS") {
        this.ordenFilter = this.ordenFilter.filter(orden => orden.cliente);
        resolve(this.ordenFilter);
      } else {
        if (this.busqueda.cerrada == "ABIERTAS") {
          this.ordenFilter = this.ordenFilter.filter(
            orden => orden.cerrada == false
          );
          resolve(this.ordenFilter);
        } else {
          this.ordenFilter = this.ordenFilter.filter(
            orden => orden.cerrada == true
          );
          resolve(this.ordenFilter);
        }
      }
    });
  }
  // -----------llenado de select's---------------
  listaClientes() {
    this.listCliente = [];
    this.allClientes.forEach(cliente => {
      if (!this.listCliente.includes(cliente.nombre)) {
        this.listCliente.push(cliente.nombre);
        this.listCliente.sort();
      }
    });
  }
  listaEstados() {
    this.listEstado = [];
    this.allEstados.forEach(estado => {
      if (!this.listEstado.includes(estado.nombre)) {
        this.listEstado.push(estado.nombre);
        this.listEstado.sort();
      }
    });
  }
  listaUsuario() {
    this.listUser = [];
    this.allUsers.forEach(user => {
      if (!this.listUser.includes(user.nombre)) {
        this.listUser.push(user.nombre);
        this.listUser.sort();
      }
    });
  }
  // llenarListas() {
  //   this.listaClientes();
  //   this.listaEstados();
  //   this.listaUsuario();
  // }
  ngOnInit() {
    // --------obtener clientes --------
    this.comunicationService.getAllClients.subscribe(clientes => {
      this.allClientes = clientes;
      this.listaClientes();
    });
    // ------obtener usuarios-------
    this.comunicationService.getAllUser.subscribe(users => {
      this.allUsers = users;
      this.listaUsuario();
    });
    // --------obtener estados-------
    this.comunicationService.getAllStates.subscribe(estados => {
      this.allEstados = estados;
      this.listaEstados();
    });
    this.buildForm();
    setTimeout(() => {
      console.log(this.busqueda);
    }, 2000);
  }
  // -----------formulario------------
  private buildForm() {
    this.formGroup = new FormGroup({
      desde: new FormControl(this.busqueda.desde, [Validators.required]),
      hasta: new FormControl(this.busqueda.hasta, [Validators.required]),
      tecnico: new FormControl(this.busqueda.tecnico, [Validators.required]),
      estado: new FormControl(this.busqueda.estado, [Validators.required]),
      cliente: new FormControl(this.busqueda.cliente, [
        Validators.required,
        Validators.minLength(5)
      ]),
      cerrada: new FormControl(this.busqueda.cerrada, [Validators.required])
    });
  }
  // Filtro busqueda de cliente
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 3
          ? []
          : this.listCliente
              .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );
}
