import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { promise } from "protractor";
import { resolve } from "dns";
import { reject } from "q";

@Component({
  selector: "app-tequipo",
  templateUrl: "./tequipo.component.html",
  styleUrls: ["./tequipo.component.css"]
})
export class TequipoComponent implements OnInit {
  @ViewChild("nombre") equipoHtml: ElementRef;
  public formGroup: FormGroup; //variable para formulario
  id: any = null; //para capturar parametro de la URL
  tEquipo: any = {
    comunicaciones: [],
    equipos: [],
    doc: "tEquipo"
  };
  Guardando: boolean;
  tEquipoObtenido: any;
  categoria: any;
  equipo: string = "";
  disabled: boolean = false;
  arrayComunicaciones: any = [];
  arrayEquipos: any = [];
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    //Se captura parametro de la URl y se almacena en variable
    this.id = this.route.snapshot.params["id"];
  }

  subirEquipo() {
    return new Promise((resolve, reject) => {
      //llamado funcion de guardar en firebase
      this.firebaseService.guardarTequipo(this.tEquipo);
      resolve(true);
    });
  }

  guardartEquipo() {
    this.equipo = this.equipo.trim();
    // this.disabled = true;
    this.Guardando = true;
    if (this.categoria == "Comunicaciones") {
      this.tEquipo.comunicaciones.push(this.equipo);
    } else {
      this.tEquipo.equipos.push(this.equipo);
    }
    this.subirEquipo().then(() => {
      //tiempo para guardado en firebase, reseteear formulario.
      setTimeout(() => {
        this.Guardando = false;
        this.onReset();
        // this.ruta.navigate(["/listar-tequipo"]);
      }, 1000);
    });
  }
  onReset() {
    this.formGroup.reset();
  }
  editarEquipo($event) {
    // debugger;
    let tipoEquipo = $event.path[3].previousSibling.parentNode.previousSibling.innerText.trim();
    let dispositivo = $event.path[3].textContent.trim();
    if (tipoEquipo == "COMUNICACIONES") {
      this.tEquipo.comunicaciones.forEach((equipo, i) => {
        if (equipo == dispositivo) {
          this.equipo = dispositivo;
          this.categoria = "Comunicaciones";
          this.tEquipo.comunicaciones.splice(i, 1);
          this.equipoHtml.nativeElement.focus();
        }
      });
    }
    if (tipoEquipo == "EQUIPOS") {
      this.tEquipo.equipos.forEach((equipo, e) => {
        if (equipo == dispositivo) {
          this.equipo = dispositivo;
          this.categoria = "Equipos_PCS";
          this.tEquipo.equipos.splice(e, 1);
          this.equipoHtml.nativeElement.focus();
        }
      });
    }
  }

  ngOnInit() {
    this.buildForm();
    this.firebaseService
      .getPorDocObj(this.tEquipo)
      .valueChanges()
      .subscribe(Tequipo => {
        if (Tequipo) {
          this.tEquipo = Tequipo;
        }
        if (!this.tEquipo.equipos) {
          this.tEquipo.equipos = [];
        }
        if (!this.tEquipo.comunicaciones) {
          this.tEquipo.comunicaciones = [];
        }
        this.arrayComunicaciones = this.tEquipo.comunicaciones;
        this.arrayComunicaciones.sort();
        this.arrayEquipos = this.tEquipo.equipos;
        this.arrayEquipos.sort();
        console.log(this.tEquipo);
      });
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      Nombre: new FormControl(this.equipo, [
        Validators.required,
        Validators.minLength(3)
      ]),
      Tipo: new FormControl(this.categoria, [
        Validators.required,
        Validators.minLength(3)
      ])
    });
  }
}
