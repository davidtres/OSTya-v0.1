import { Component, OnInit, ViewChild } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGrigPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for dateClick
import { FormGroup, FormControl, Validators } from "@angular/forms";
@Component({
  selector: "app-agendaxorden",
  templateUrl: "./agendaxorden.component.html",
  styleUrls: ["./agendaxorden.component.css"]
})
export class AgendaxordenComponent implements OnInit {
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
    doc: "agendaHO"
  };
  agendaFire: any;
  noAgenda: string = null;
  public formGroup: FormGroup; //variable para formulario
  primeraAgenda: any;
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {}
  buscarOrden() {
    this.firebaseService //obtener orden por ID
      .getAgendaHO(this.agendaGet)
      .valueChanges()
      .subscribe(agenda => {
        this.agendaFire = agenda;
        console.log(this.agendaFire);
        setTimeout(() => {
          if (this.agendaFire.length == 0) {
            this.noAgenda = "Esta orden no tiene historial de agendas";
            this.calendarEvents = [{}];
            setTimeout(() => {
              this.noAgenda = null;
              this.agendaGet.id = "0";
            }, 4000);
          } else {
            this.calendarEvents = [{}];
            this.primeraAgenda = this.agendaFire[0].start;
            for (let i = 0; i < this.agendaFire.length; i++) {
              if (!this.agendaFire[i].log) {
                this.calendarEvents = this.calendarEvents.concat({
                  title:
                    "id: " +
                    [i] +
                    " Programado : " +
                    this.agendaFire[i].tecnico,
                  start: this.agendaFire[i].start,
                  end: this.agendaFire[i].end,
                  allDay: false,
                  color: "#66E352",
                  editable: this.agendaFire[i].editable
                });
                this.calendarEvents = this.calendarEvents.concat({
                  title:
                    "id: " + [i] + " En sitio : " + this.agendaFire[i].tecnico,
                  start: this.agendaFire[i].startOk,
                  end: this.agendaFire[i].endOk,
                  allDay: false,
                  color: "#F47C7C",
                  editable: this.agendaFire[i].editable
                });
              } else {
                let e = Object.keys(this.agendaFire[i].log);
                console.log(e);
                for (let x = 0; x < e.length; x++) {
                  if (x == 0) {
                    this.calendarEvents = this.calendarEvents.concat({
                      title:
                        "id: " +
                        [i] +
                        " Programado : " +
                        this.agendaFire[i].tecnico,
                      start: this.agendaFire[i].log[e[x]].inicial.start,
                      end: this.agendaFire[i].log[e[x]].inicial.end,
                      allDay: false,
                      color: "#66E352",
                      editable: this.agendaFire[i].editable
                    });
                  } else {
                    this.calendarEvents = this.calendarEvents.concat({
                      title:
                        "id: " +
                        [i] +
                        " Reprogramado : " +
                        this.agendaFire[i].tecnico,
                      start: this.agendaFire[i].log[e[x]].inicial.start,
                      end: this.agendaFire[i].log[e[x]].inicial.end,
                      allDay: false,
                      color: "#7CBFF4",
                      editable: this.agendaFire[i].editable
                    });
                  }
                }
                this.calendarEvents = this.calendarEvents.concat({
                  title:
                    "id: " + [i] + " En sitio : " + this.agendaFire[i].tecnico,
                  start: this.agendaFire[i].startOk,
                  end: this.agendaFire[i].endOk,
                  allDay: false,
                  color: "#F47C7C",
                  editable: this.agendaFire[i].editable
                });
              }
            }
          }
          this.calendarComponent.getApi().gotoDate(this.primeraAgenda);
        }, 500);
      });
  }
  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      orden: new FormControl(this.agendaGet.id, [Validators.required])
    });
  }
}
