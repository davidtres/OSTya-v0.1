import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute } from "@angular/router/src/router_state";
import { Router } from "@angular/router/public_api";

@Component({
  selector: "app-tservicio",
  templateUrl: "./tservicio.component.html",
  styleUrls: ["./tservicio.component.css"]
})
export class TservicioComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  tServicio: any = {
    id: 0,
    nombre: "",
    doc: "tserv"
  };
  constructor() {}
  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      Nombre: new FormControl(this.tServicio.nombre, [
        Validators.required,
        Validators.minLength(3)
      ])
    });
  }

  guardarTservicio() {}
}
