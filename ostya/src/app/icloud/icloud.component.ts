import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { Iclouds } from "../interfaces/iclouds";

@Component({
  selector: "app-icloud",
  templateUrl: "./icloud.component.html",
  styleUrls: ["./icloud.component.css"]
})
export class IcloudComponent implements OnInit {
  formIcloud: FormGroup;
  clienteFire: any;

  newIcloud: Iclouds = {
    cliente: null,
    tipo: null,
    nombre: null,
    proveedor: null,
    url: null,
    activa: false,
    correo: null,
    clave: null,
    serial: null,
    vecimiento: null,
    nota: null
  };

  constructor(
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder
  ) {
    firebaseService
      .getCliente()
      .valueChanges()
      .subscribe(clientes => {
        this.clienteFire = clientes;
      });
  }
  private buildForm() {
    this.formIcloud = new FormGroup({
      cliente: new FormControl(this.newIcloud.cliente, [Validators.required])
    });
  }

  ngOnInit() {
    this.buildForm();
  }
}
