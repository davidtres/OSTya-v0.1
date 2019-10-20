import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { Iclouds } from "../interfaces/iclouds";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { ComunicationService } from "../services/comunication.service";

@Component({
  selector: "app-icloud",
  templateUrl: "./icloud.component.html",
  styleUrls: ["./icloud.component.css"]
})
export class IcloudComponent implements OnInit {
  formIcloud: FormGroup;
  clientesFire: any;
  nuevo: boolean = true;
  data: any = {
    id: 0,
    doc: "icloud"
  };
  newIcloud: any = {
    id: null,
    proveedor: null,
    vencimiento: null,
    descripcion: null
  };
  clientes: any;
  clienteDigitado: string;
  clienteSeleccionado: string;
  fechaDigitado: any;
  icloudFire: any[];
  editando: any[];
  constructor(
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private comunicationService: ComunicationService
  ) {}
  asignarIdClient() {
    this.clientesFire.forEach(cliente => {
      if (cliente.nombre == this.clienteDigitado) {
        this.newIcloud.id = cliente.id;
        this.clienteSeleccionado = cliente.nombre;
        this.data.id = cliente.id;
        this.nuevo = true;
        this.getIcloud();
      }
    });
  }
  nuevoIcloud() {
    this.nuevo = false;
    this.clientesFire.forEach(cliente => {
      if (cliente.id == this.newIcloud.id) {
        this.clienteDigitado = cliente.nombre;
      }
    });
  }
  cancelar() {
    let data = this.editando.reduce(accum => accum);
    this.icloudFire.push(data);
    this.resetForm();
    this.editando = null;
    this.nuevo = true;
  }
  eliminar() {
    if (confirm("Seguro quiere elminar?, no se podrá recuperar")) {
      this.resetForm();
      this.editando = null;
      this.nuevo = true;
      this.firebaseService.guardarXdocYid(this.data, this.icloudFire);
    }
  }
  editarIcloud($event) {
    this.nuevo = false;
    let proveedor = $event.path[3].children[0].textContent;
    let descripcion = $event.path[3].children[1].textContent;
    this.newIcloud.proveedor = proveedor;
    this.fechaDigitado = $event.path[3].children[2].textContent;
    this.newIcloud.descripcion = descripcion;
    this.clienteDigitado = this.clienteSeleccionado;
    this.validarFecha();
    let idTr = $event.path[3].sectionRowIndex;
    this.icloudFire.forEach((icloud, i) => {
      if (idTr == i) {
        this.editando = this.icloudFire.splice(i, 1);
      }
    });
  }
  guardarIcloud() {
    console.log(this.newIcloud);
    this.icloudFire.push(this.newIcloud);
    this.firebaseService.guardarXdocYid(this.data, this.icloudFire);
    this.nuevo = true;
    // this.newIcloud.id = "";
    this.resetForm();
    this.editando = null;
  }
  validarFecha() {
    let hoy = new Date();
    let vence = new Date(this.fechaDigitado);
    if (vence < hoy) {
      alert("La fecha no puede ser menor al dia de hoy");
      this.fechaDigitado = "";
    } else {
      this.newIcloud.vencimiento = Date.parse(this.fechaDigitado); //conversion de fecha input a milisegundos
      // console.log(this.newIcloud);
    }
  }
  getIcloud() {
    this.firebaseService
      .getIcloud(this.data)
      .valueChanges()
      .subscribe(icloud => {
        this.icloudFire = icloud;
        console.log(icloud);
      });
  }
  resetForm() {
    this.formIcloud.reset();
  }
  ngOnInit() {
    this.buildForm();
    this.comunicationService.getAllClientsNames.subscribe(clientes => {
      this.clientes = clientes;
    });
    this.comunicationService.getAllClients.subscribe(clientes => {
      this.clientesFire = clientes;
    });
  }
  private buildForm() {
    this.formIcloud = new FormGroup({
      Cliente: new FormControl(this.clienteDigitado, [Validators.required]),
      Proveedor: new FormControl(this.newIcloud.proveedor, [
        Validators.required
      ]),
      Vencimiento: new FormControl(this.newIcloud.Vencimiento, [
        Validators.required
      ]),
      Descripcion: new FormControl(this.newIcloud.descripcion, [
        Validators.required
      ])
    });
  }
  // ----------typeahead---------------
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
}
