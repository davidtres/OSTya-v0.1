import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-updates",
  templateUrl: "./updates.component.html",
  styleUrls: ["./updates.component.css"]
})
export class UpdatesComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  userSistema: boolean = true;
  ordenGet = {
    //guarda parametro id: de la orden, para luego recuperar desde Firebase
    id: "0",
    doc: "orden"
  };
  ordenFire: any = {
    //guarda ordenes desde Firebase
    id: 0,
    cliente: "",
    solicitud: ""
  };
  update: any = {
    update: "",
    estado: "",
    usuario: "",
    orden: 0,
    fecha: Date.now()
  };
  data = {
    doc: "estados"
  };
  estadosFire: any;
  updateFire: any;
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    this.ordenGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url

    firebaseService //obtener orden por ID
      .obtenerUnoId(this.ordenGet)
      .valueChanges()
      .subscribe(orden => {
        this.ordenFire = orden;
        this.update.orden = this.ordenFire.id;
        this.update.usuario = this.ordenFire.tecnicoAsignado;
      });
    firebaseService
      .getPorId(this.data)
      .valueChanges()
      .subscribe(estados => {
        this.estadosFire = estados;
        let actualiza = Object.entries(this.ordenFire.updates);
        this.updateFire = actualiza;
        let sinSistema = this.updateFire.filter(
          sistema => sistema[1].usuario != "Sistema"
        );
        this.noSistem = sinSistema;
      });
  }
  spinner = false;
  noSistem = [];
  guardarUpdates() {
    this.spinner = true;
    this.ordenFire.estado = this.update.estado;
    if (confirm("¿Desea actualizar la orden ?")) {
      this.firebaseService.ActOrdenEstado(this.ordenFire);
      this.firebaseService.guardarUpdates(this.update);

      setTimeout(() => {
        this.spinner = false;
        this.ruta.navigate(["/listar-ordenes"]);
      }, 1500);
    }
  }

  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      update: new FormControl(this.update.update, [
        Validators.required,
        Validators.minLength(20)
      ]),
      estado: new FormControl(this.update.estado, [Validators.required])
    });
  }
}
