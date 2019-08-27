import { Component, OnInit, ViewChild } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGrigPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for dateClick
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Alert } from "selenium-webdriver";
@Component({
  selector: "app-agendaxtecnico",
  templateUrl: "./agendaxtecnico.component.html",
  styleUrls: ["./agendaxtecnico.component.css"]
})
export class AgendaxtecnicoComponent implements OnInit {
  @ViewChild("calendar") calendarComponent: FullCalendarComponent; // the #calendar in the template
  /*Variables para el calendario*/
  calendarVisible = false; //pcultar mostrar calendario
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; //inyeccion de pluginis
  calendarWeekends = true; //tipo de vista semanal predeterminada.
  calendarEvents: EventInput[] = [{}]; //array de eventos a mostrar en el calendario
  newEvent: boolean = false;
  newLog: boolean = true;
  logAgenda: any = {
    orden: 0
  };
  idioma = "es";
  rangoVisible = {
    start: Date.now()
  };
  agendaGet = {
    //guarda parametro id: de la orden, para luego recuperar desde Firebase
    id: "0",
    doc: "agendaHT",
    desde: "",
    hasta: "",
    tecnico: "",
    desdeM: 0,
    hastaM: 0
  };
  agendaFire: any = [];
  error: string;
  usuariosFire: any;
  botonBuscar: boolean = true;
  public formGroup: FormGroup; //variable para formulario
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    firebaseService
      .getUusariosActivos()
      .valueChanges()
      .subscribe(usuarios => {
        this.usuariosFire = usuarios;
        console.log(this.usuariosFire);
      });
  }
  agendaFechaFire: any;
  validarDesde() {
    if (Date.parse(this.agendaGet.desde) > Date.parse(this.agendaGet.hasta)) {
      this.errorAgenda("La fecha 'Desde' no puede ser mayor");
      this.agendaGet.desde = "";
    }
  }
  errorAgenda(error) {
    this.error = error;
    setTimeout(() => {
      this.error = null;
    }, 4000);
  }
  agendaTodos() {
    this.firebaseService
      .getAgendaHF(this.agendaGet)
      .valueChanges()
      .subscribe(agendas => {
        this.agendaFire = agendas;
        console.log(this.agendaFire);
      });
  }
  agendaHTxFecha() {
    this.firebaseService
      .getAgendaHTxfecha(this.agendaGet)
      .valueChanges()
      .subscribe(agenda => {
        this.agendaFire = agenda;
        console.log(this.agendaFire);
      });
  }
  buscarOrden() {
    // Primero se validan campos de  fecha
    if (Date.parse(this.agendaGet.desde) > Date.parse(this.agendaGet.hasta)) {
      this.errorAgenda("La fecha 'Desde' no puede ser mayor");
      this.agendaGet.desde = "";
    } else {
      // Si pasa la validacion consultamos el historico de agenda segun los datosl formiulario
      this.agendaGet.desdeM = Date.parse(this.agendaGet.desde); //conversion de fecha input a milisegundos
      this.agendaGet.hastaM = Date.parse(this.agendaGet.hasta); //conversion de fecha input a milisegundos
      //llamamos al servicio de firebase para recuperar las agendas con los filtros de fecha
      if (this.agendaGet.tecnico == "TODOS") {
        this.agendaTodos();
      } else {
        this.agendaHTxFecha();
      }

      this.botonBuscar = false;
      setTimeout(() => {
        //Validacion si el tecnico no tiene agendas y mensaje de error
        if (this.agendaFire.length == 0) {
          this.errorAgenda(
            "El usuario " +
              this.agendaGet.tecnico +
              "  no tiene agendas en las fechas selecionadas"
          );
          this.agendaGet.tecnico = "";
          //aramamos el array para eventos a mostrar en el calendario.
        } else {
          for (let i = 0; i < this.agendaFire.length; i++) {
            //Validacion de tiempo minimo 30 minutos para completar y mostrar en agenda
            let tiempoMinimo =
              this.agendaFire[i].endOk - this.agendaFire[i].startOk;
            if (tiempoMinimo < 1800000) {
              let completarTiempo = 1800000 - tiempoMinimo;
              this.agendaFire[i].endOk =
                completarTiempo + this.agendaFire[i].endOk;
            }
            //Captura fecha de la primera agenda para llevar al formulario a ese punto como inicial
            if (i == 0) {
              this.primeraAgenda = this.agendaFire[i].startOk;
            }
            //aramado de array de eventos a mostrar en la agenda
            this.calendarEvents = this.calendarEvents.concat({
              title: this.agendaFire[i].title,
              start: this.agendaFire[i].startOk,
              end: this.agendaFire[i].endOk,
              allDay: false,
              color: this.agendaFire[i].color,
              editable: this.agendaFire[i].editable,
              orden: this.agendaFire[i].orden,
              tecnico: this.agendaFire[i].tecnico
            });
          }
        }
        //Lleva el foco del calendario a la primera fecha encontrada.
        this.calendarComponent.getApi().gotoDate(this.primeraAgenda);
      }, 500);
    }
  }
  primeraAgenda: any;

  escojerTecnico() {
    this.botonBuscar = true;
    this.calendarEvents = [];
    for (let i = 0; i < this.usuariosFire.length; i++) {
      if (this.usuariosFire[i].nombre == this.agendaGet.tecnico) {
        this.agendaGet.id = this.usuariosFire[i].id;
      }
    }
  }

  orden: any;
  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      desde: new FormControl(this.orden, [Validators.required]),
      hasta: new FormControl(this.orden, [Validators.required]),
      tecnico: new FormControl(this.orden, [Validators.required])
    });
  }
}
