import { Component, OnInit, ViewChild } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGrigPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for dateClick
import { FullCalendarComponent } from "@fullcalendar/angular";
import { EventInput } from "@fullcalendar/core";
import { FirebaseService } from "../services/firebase.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-agenda",
  templateUrl: "./agenda.component.html",
  styleUrls: ["./agenda.component.css"]
})
export class AgendaComponent implements OnInit {
  @ViewChild("calendar") calendarComponent: FullCalendarComponent; // the #calendar in the template
  /*Variables para el calendario*/
  calendarVisible = true; //ocultar mostrar calendario
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; //inyeccion de pluginis
  calendarWeekends = true; //tipo de vista semanal predeterminada.
  calendarEvents: EventInput[] = []; //array de eventos a mostrar en el calendario
  idioma = "es";
  agendaFire: any;
  listUser: any;
  listUserColor: any;
  public formGroup: FormGroup; //variable para formulario
  constructor(private firebaseService: FirebaseService) {
    firebaseService //obtener agenda del tecnico seleccionado
      .getAllAgendas()
      .valueChanges()
      .subscribe(agendas => {
        this.agendaFire = agendas;
        this.verAgendas();
        console.log(this.agendaFire);
      });
  }
  verAgendas() {
    for (let i = 0; i < this.agendaFire.length; i++) {
      this.calendarEvents = this.calendarEvents.concat({
        // adiciona el resto de agendas a la vista.
        title: this.agendaFire[i].title,
        start: this.agendaFire[i].start,
        end: this.agendaFire[i].end,
        allDay: false,
        color: this.agendaFire[i].color,
        editable: this.agendaFire[i].editable,
        orden: this.agendaFire[i].orden,
        tecnico: this.agendaFire[i].tecnico
      });
    }
    this.filtrarTecnico();
  }
  filtrarTecnico() {
    this.listUser = [];
    this.listUserColor = [];
    this.agendaFire.forEach((agenda, i) => {
      console.log(agenda);
      if (!this.listUser.includes(agenda.tecnico)) {
        this.listUserColor.push({
          tecnico: agenda.tecnico,
          color: agenda.color
        });
        this.listUserColor.sort(function(a, b) {
          //funcion de ordenacion.
          if (a.tecnico > b.tecnico) {
            return 1;
          }
          if (a.tecnico < b.tecnico) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        this.listUser.push(agenda.tecnico);
        this.listUser.sort();
      }
    });
    console.log(this.listUser);
  }
  contador = 0;
  eventInfo(event) {
    console.log(event);
  }
  agendaTecnico() {
    if (this.contador == 0) {
      let filtroUsuario = this.calendarEvents.filter(
        eventos => eventos.tecnico == this.tecnicoSeleccionado
      );
      this.calendarEvents = [];
      this.calendarEvents = this.calendarEvents.concat(filtroUsuario);
      this.contador = 1;
    } else {
      if (this.tecnicoSeleccionado == "TODOS") {
        this.calendarEvents = [];
        this.verAgendas();
      } else {
        this.verAgendas();
        let filtroUsuario = this.calendarEvents.filter(
          eventos => eventos.tecnico == this.tecnicoSeleccionado
        );
        this.calendarEvents = [];
        this.calendarEvents = this.calendarEvents.concat(filtroUsuario);
      }
    }
  }
  tecnicoSeleccionado = "";
  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      tecnico: new FormControl(this.tecnicoSeleccionado, [Validators.required])
    });
  }
}
