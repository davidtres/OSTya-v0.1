import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

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
  getEstados = {
    doc: "estados"
  };
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
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {}
  buscarOrden() {
    this.validarFechas();
  }

  validarFechas() {
    if (Date.parse(this.busqueda.desde) > Date.parse(this.busqueda.hasta)) {
      this.error("La fecha 'Desde' no puede ser mayor");
      this.busqueda.desde = "";
    } else {
      this.busqueda.desdeM = Date.parse(this.busqueda.desde); //conversion de fecha input a milisegundos
      this.busqueda.hastaM = Date.parse(this.busqueda.hasta); //conversion de fecha input a milisegundos
      this.ordenesEnFire();
    }
  }
  ordenesEnFire() {
    this.firebaseService
      .getOrdenesFecha(this.busqueda)
      .valueChanges()
      .subscribe(ordenes => {
        this.ordenFire = ordenes;
        this.ordenFilter = ordenes;
        this.llenarListas();
      });
  }
  error(arg0: string) {
    alert(arg0);
  }
  clienteFiltro() {
    this.busqueda.estado = "";
    this.busqueda.cerrada = "";
    this.busqueda.tecnico = "";
    if (this.busqueda.cliente == "TODOS") {
      this.listCliente = [];
      this.ordenFilter = this.ordenFire.filter(orden => orden.cliente);
      this.llenarListas();
    } else {
      this.listCliente = [];
      this.ordenFilter = this.ordenFire.filter(
        orden => orden.cliente == this.busqueda.cliente
      );
      this.llenarListas();
    }
  }
  estadoFiltro() {
    this.busqueda.cliente = "";
    this.busqueda.cerrada = "";
    this.busqueda.tecnico = "";
    if (this.busqueda.estado == "TODOS") {
      this.listEstado = [];
      this.ordenFilter = this.ordenFire.filter(orden => orden.cliente);
      this.llenarListas();
    } else {
      this.listEstado = [];
      this.ordenFilter = this.ordenFire.filter(
        orden => orden.estado == this.busqueda.estado
      );
      this.llenarListas();
    }
  }
  usuarioFiltro() {
    this.busqueda.estado = "";
    this.busqueda.cerrada = "";
    this.busqueda.cliente = "";
    if (this.busqueda.tecnico == "TODOS") {
      this.listUser = [];
      this.ordenFilter = this.ordenFire.filter(orden => orden.cliente);
      this.llenarListas();
    } else {
      this.listUser = [];
      this.ordenFilter = this.ordenFire.filter(
        orden => orden.tecnicoAsignado == this.busqueda.tecnico
      );
      this.llenarListas();
    }
  }
  cerradaFiltro() {
    this.busqueda.estado = "";
    this.busqueda.cliente = "";
    this.busqueda.tecnico = "";
    if (this.busqueda.cerrada == "TODOS") {
      this.ordenFilter = this.ordenFire.filter(orden => orden.cliente);
      this.llenarListas();
    } else {
      if (this.busqueda.cerrada == "ABIERTAS") {
        this.ordenFilter = this.ordenFire.filter(
          orden => orden.cerrada == false
        );
      } else {
        this.ordenFilter = this.ordenFire.filter(
          orden => orden.cerrada == true
        );
      }
      this.llenarListas();
    }
  }

  listaClientes() {
    this.registros = this.ordenFilter.length;
    this.listCliente = [];
    this.ordenFilter.forEach(orden => {
      if (!this.listCliente.includes(orden.cliente)) {
        this.listCliente.push(orden.cliente);
        this.listCliente.sort();
      }
    });
  }
  listaEstados() {
    this.listEstado = [];
    this.ordenFilter.forEach(orden => {
      if (!this.listEstado.includes(orden.estado)) {
        this.listEstado.push(orden.estado);
        this.listEstado.sort();
      }
    });
  }
  listaUsuario() {
    this.listUser = [];
    this.ordenFilter.forEach(orden => {
      if (!this.listUser.includes(orden.tecnicoAsignado)) {
        this.listUser.push(orden.tecnicoAsignado);
        this.listUser.sort();
      }
    });
  }
  llenarListas() {
    this.listaClientes();
    this.listaEstados();
    this.listaUsuario();
  }
  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      desde: new FormControl(this.busqueda.desde, [Validators.required]),
      hasta: new FormControl(this.busqueda.hasta, [Validators.required]),
      tecnico: new FormControl(this.busqueda.tecnico, []),
      estado: new FormControl(this.busqueda.estado, []),
      cliente: new FormControl(this.busqueda.cliente, []),
      cerrada: new FormControl(this.busqueda.cerrada, [])
    });
  }
}
