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
  public formGroupNota: FormGroup; //variable para formulario Nota
  userSistema: boolean = true;
  ordenGet = {
    //guarda parametro id: de la orden, para luego recuperar desde Firebase
    id: "0",
    doc: "orden"
  };
  agendaGet = {
    //guarda parametro id: de la orden, para luego recuperar desde Firebase
    id: "0",
    doc: "agenda"
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
  agendaFire: any;
  cOp: boolean = false; //para saber si la orden tiene estados "Creado" o "Programado"
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    this.ordenGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url
    this.agendaGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url
    firebaseService //obtener agenda por ID
      .obtenerUnoId(this.agendaGet)
      .valueChanges()
      .subscribe(agenda => {
        this.agendaFire = agenda;
        console.log(this.agendaFire);
      });

    firebaseService //obtener orden por ID
      .obtenerUnoId(this.ordenGet)
      .valueChanges()
      .subscribe(orden => {
        this.ordenFire = orden;
        //actualiza variable a guardar con los datos de la orden actual
        this.update.orden = this.ordenFire.id;
        this.update.usuario = this.ordenFire.tecnicoAsignado;
        //crea array de actualizaciones de la orden actual
        let actualiza = Object.entries(this.ordenFire.updates);
        this.updateFire = actualiza;
        //filtro actualizaciones sin usuario "Sistemas"
        let sinSistema = this.updateFire.filter(
          sistema => sistema[1].usuario != "Sistema"
        );
        this.noSistem = sinSistema;
        //determina si la orden tiene estado "Creado" o "Programado"
        if (this.ordenFire.estado == "Creado") {
          this.cOp = true;
        }
        if (this.ordenFire.estado == "Programado") {
          this.cOp = true;
        }
        if (this.ordenFire.estado == "Reprogramado") {
          this.cOp = true;
        }
        console.log(this.ordenFire);
      });
    firebaseService //obtener Estados
      .getPorDoc(this.data)
      .valueChanges()
      .subscribe(estados => {
        this.estadosFire = estados;
        console.log(this.estadosFire);

        this.estadoQueCierran = this.estadosFire.filter(
          cierra => cierra.finOrden == true
        );
      });
  }
  estadoQueCierran: any;
  spinner = false;
  noSistem = [];
  guardarUpdates() {
    this.spinner = true;
    if (confirm("¿Desea actualizar la orden ?")) {
      this.ordenFire.estado = this.update.estado;
      console.log(this.agendaFire);
      if (!this.agendaFire === null) {
        this.agendaFire.estado = this.update.estado;
      }
      this.cerrarOrden();
      this.firebaseService.ActOrdenEstado(this.ordenFire);
      this.firebaseService.guardarUpdates(this.update);
      setTimeout(() => {
        this.salirSitio();
        this.spinner = false;
        this.ruta.navigate(["/listar-ordenes"]);
      }, 2000);
    }
  }
  saliendoSitio: boolean = false;
  salirSitio() {
    if (this.saliendoSitio) {
      this.agendaFire.endOk = Date.now();
      this.firebaseService.guardarAgendaHTecnico(this.agendaFire);
      this.firebaseService.guardarAgendaHOrden(this.agendaFire);
      this.firebaseService.guardarAgendaHfecha(this.agendaFire);
      this.firebaseService.EliminarAgenda(this.agendaFire);
    }
  }
  enSitio() {
    this.agendaFire.estado = "En sitio";
    this.agendaFire.startOk = Date.now();
    let fechaHoy = new Date(Date.now());
    this.update = {
      update:
        "Reporte en sitio : " +
        fechaHoy.toUTCString() +
        ", tecnico: " +
        this.ordenFire.tecnicoAsignado,
      estado: "En sitio",
      usuario: "Sistema",
      orden: this.update.orden,
      fecha: Date.now()
    };
    this.ordenFire.estado = this.update.estado;
    this.ordenFire.enTriage = false;
    this.firebaseService.ActOrdenAgendada(this.ordenFire);
    this.firebaseService.guardarUpdates(this.update);
    this.firebaseService.guardarAgenda(this.agendaFire);
    console.log(this.agendaFire);
    this.ruta.navigate(["/home"]);
  }
  Nota: string;
  addNota() {
    let hoy = new Date(Date.now());
    let fechaHoy =
      hoy.getDate() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear();

    let horaHoy = hoy.getHours() + ":" + hoy.getMinutes();
    console.log(this.Nota);
    this.ordenFire.nota +=
      "  <+> " + this.Nota + " ( " + fechaHoy + " - " + horaHoy + "). ";
    this.firebaseService.ActOrdenEstado(this.ordenFire);
    this.Nota = "";
    location.reload();
  }
  cerrarOrden() {
    let estados = this.estadoQueCierran;
    for (let i = 0; i < estados.length; i++) {
      if (estados[i].nombre == this.update.estado) {
        this.ordenFire.cerrada = true;
      }
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
      estado: new FormControl(this.update.estado, [Validators.required]),
      salirsitio: new FormControl(this.saliendoSitio, [])
    });
    // -------formulario nota --------
    this.formGroupNota = new FormGroup({
      nota: new FormControl(this.update.estado, [Validators.required])
    });
  }
}
