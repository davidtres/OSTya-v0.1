import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FirebaseService } from "../services/firebase.service";
import { FullCalendarComponent } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGrigPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for dateClick
import { EventInput } from "@fullcalendar/core";
import { Agenda } from "../interfaces/agenda";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Alert } from "selenium-webdriver";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-programacion",
  templateUrl: "./programacion.component.html",
  styleUrls: ["./programacion.component.css"]
})
export class ProgramacionComponent implements OnInit {
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
  //------------------------------------------------------//
  public formGroup: FormGroup; //variable para formulario
  btnProgramar = false;
  ordenFire: any = {
    //guarda ordenes desde Firebase
    id: 0,
    cliente: "",
    solicitud: ""
  };
  userFire: any; //se guarda usuarios desde Firebase
  agendaFire: any; //Se guarda la agenda por tecnico desde Firebase
  verTodas: boolean = true;
  agenda: Agenda = {
    //Variable array datos a guardar agenda.
    title: "",
    fecha: new Date(Date.now()),
    start: null,
    duracion: "",
    end: null,
    orden: 0,
    color: "",
    estado: "Programado",
    url: "",
    llegada: null,
    salida: null,
    dif: 0,
    tecnico: "",
    editable: true,
    startOk: null,
    endOk: null,
    userId: 0
  };
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
  update: any = {
    update: "",
    estado: "",
    usuario: "",
    orden: 0,
    fecha: Date.now()
  };
  agendaExiste: any;
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    this.ordenGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url
    this.agendaGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url

    firebaseService //obtener orden por ID
      .obtenerUnoId(this.ordenGet)
      .valueChanges()
      .subscribe(orden => {
        this.ordenFire = orden;
        if (this.ordenFire.estado != "Creado") {
          this.newEvent = false;
          firebaseService //obtener agenda del tecnico seleccionado
            .getAllAgendas()
            .valueChanges()
            .subscribe(agendas => {
              this.agendaFire = agendas;
              this.verTodasAgendas();
            });
        } else {
          this.newEvent = true;
        }
      });
    firebaseService //obtener orden por ID
      .obtenerUnoId(this.agendaGet)
      .valueChanges()
      .subscribe(agenda => {
        this.agendaExiste = agenda;
        if (!this.agendaExiste) {
          this.newEvent = true;
        }
      });

    firebaseService //obtener usuarios activos
      .getUusariosActivos()
      .valueChanges()
      .subscribe(usuarios => {
        this.userFire = usuarios;
      });
  }
  verTodasAgendas() {
    this.calendarEvents = [{}]; //limpia eventos
    this.btnProgramar = false;
    if (this.verTodas) {
      this.activarCalendario();
      this.calendarEvents = [{}]; //limpia eventos
      this.firebaseService //obtener todas agendas
        .getAllAgendas()
        .valueChanges()
        .subscribe(agendas => {
          this.agendaFire = agendas;
        });
      setTimeout(() => {
        //Espera carga de datos agendas,recorrer agendas obtenidas para crear vista en calendario.
        for (let index = 0; index < this.agendaFire.length; index++) {
          if (this.agendaFire[index].orden == this.ordenGet.id) {
            //obtener agenda de orden seleccionada.
            this.agenda = this.agendaFire[index]; //actualiza variable a guardar en Firebase con datos actuales.
            let fechaActual = new Date(Date.now());
            //verificar fecha de agenda obtenida, y actualizar fecha actual solo para la vista
            if (this.agendaFire[index].start < fechaActual) {
              this.calendarEvents = this.calendarEvents.concat({
                // adicionar agenda de la orden seleccionada a variable de la vista
                title: this.agendaFire[index].title,
                start: fechaActual.setMinutes(0),
                end: fechaActual.setMinutes(60),
                allDay: false,
                color: this.agendaFire[index].color,
                editable: true,
                borderColor: "red",
                orden: this.agendaFire[index].orden
              });
            } else {
              //adiciona agenda de orden seleccionada sin actualizar fecha
              this.calendarEvents = this.calendarEvents.concat({
                // add new event data. must create new array
                title: this.agendaFire[index].title,
                start: this.agendaFire[index].start,
                end: this.agendaFire[index].end,
                allDay: false,
                color: this.agendaFire[index].color,
                editable: true,
                borderColor: "red",
                orden: this.agendaFire[index].orden
              });
            }
          } else {
            this.calendarEvents = this.calendarEvents.concat({
              // adiciona el resto de agendas a la vista.
              title: this.agendaFire[index].title,
              start: this.agendaFire[index].start,
              end: this.agendaFire[index].end,
              allDay: false,
              color: this.agendaFire[index].color,
              editable: this.agendaFire[index].editable,
              orden: this.agendaFire[index].orden
            });
          }
        }
      }, 500);
    } else {
      this.btnProgramar = false;
      this.calendarEvents = [{}]; //limpia eventos
      this.consultarAgenda();
    }
  }
  consultarAgenda() {
    //actualiza vista calendario con datos tecnico seleccionado.
    this.activarCalendario();

    this.firebaseService //obtener agenda del tecnico seleccionado
      .getAgendaTecnico(this.agenda)
      .valueChanges()
      .subscribe(tecnico => {
        this.agendaFire = tecnico;
        console.log(this.agendaFire);
      });
    setTimeout(() => {
      //Espera carga de datos tecnico, para actualizar calendario.
      for (let index = 0; index < this.agendaFire.length; index++) {
        this.calendarEvents = this.calendarEvents.concat({
          // add new event data. must create new array
          title: this.agendaFire[index].title,
          start: this.agendaFire[index].start,
          end: this.agendaFire[index].end,
          allDay: false,
          color: this.agendaFire[index].color,
          editable: this.agendaFire[index].editable,
          orden: this.agendaFire[index].orden
        });
      }
      console.log(this.calendarEvents);
    }, 500);

    console.log(this.calendarEvents);
  }
  moveEvent(info) {
    this.btnProgramar = true;
    this.btnCmbTecnico = true;
    let logInicialStart = this.agenda.start;
    let logInicialEnd = this.agenda.end;
    //Actualiza agenda a guardar start, end : al mover el evento.
    let startMili: any = info.event.start.getTime();
    let endMili: any = info.event.end.getTime();
    this.agenda.start = startMili;
    this.agenda.end = endMili;
    //guardar movimiento de evento en variable para log
    if (this.newLog) {
      this.logAgenda = {
        orden: this.ordenFire.id,
        inicial: {
          start: logInicialStart,
          end: logInicialEnd
        },
        final: {
          start: info.event.start.getTime(),
          end: info.event.end.getTime()
        }
      };
      this.newLog = false;
    } else {
      this.logAgenda = {
        orden: this.ordenFire.id,
        inicial: {
          start: info.oldEvent.start.getTime(),
          end: info.oldEvent.end.getTime()
        },
        final: {
          start: info.event.start.getTime(),
          end: info.event.end.getTime()
        }
      };
    }
  }
  resizeEvent(info) {
    let logInicialStart = this.agenda.start;
    let logInicialEnd = this.agenda.end;
    this.btnProgramar = true;
    this.btnCmbTecnico = true;
    //Actualiza agenda a guardar start, end : al cambiar tamaño del evento.
    let startMili: any = info.event.start.getTime();
    let endMili: any = info.event.end.getTime();
    this.agenda.start = startMili;
    this.agenda.end = endMili;
    let duracion: any = (endMili - startMili) / 1000 / 3600;
    this.agenda.duracion = duracion;
    if (this.newLog) {
      this.logAgenda = {
        orden: this.ordenFire.id,
        inicial: {
          start: logInicialStart,
          end: logInicialEnd
        },
        final: {
          start: info.event.start.getTime(),
          end: info.event.end.getTime()
        }
      };
      this.newLog = false;
    } else {
      this.logAgenda = {
        orden: this.ordenFire.id,
        inicial: {
          start: info.prevEvent.start.getTime(),
          end: info.prevEvent.end.getTime()
        },
        final: {
          start: info.event.start.getTime(),
          end: info.event.end.getTime()
        }
      };
    }
  }
  retecnico = false;
  btnCmbTecnico = false;
  arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }

  reTecnico() {
    this.retecnico = true;
    this.btnCmbTecnico = false;
    //filtra orden actual por index
    let indice = this.arrayObjectIndexOf(
      this.calendarEvents,
      this.ordenFire.id,
      "orden"
    );
    //actualizar color y id en la agenda segun tecnico seleccionado
    for (let i = 0; i < this.userFire.length; i++) {
      if (this.userFire[i].nombre == this.agenda.tecnico) {
        this.agenda.color = this.userFire[i].color;
        this.agenda.userId = this.userFire[i].id;
      }
    }
    let eventUpdate: any = {
      title: this.agenda.title,
      start: this.agenda.start,
      end: this.agenda.end,
      allDay: false,
      color: this.agenda.color,
      editable: true,
      borderColor: "red",
      orden: this.agenda.orden
    };
    this.calendarEvents.splice(indice, 1, eventUpdate);
    this.calendarEvents = this.calendarEvents.concat({ eventUpdate });
    console.log(this.calendarEvents);
  }

  guardarAgenda() {
    if (confirm("¿Seguro que desea guardar esta programación?")) {
      this.agenda.editable = false; //bloquea evento para editar en la vista
      if (this.newEvent) {
        //verificar si el evento es nuevo
        this.ordenFire.estado = this.agenda.estado; // asigna estado a la orden "Programado"
      } else {
        //si es viejo "Reprogramado"
        this.ordenFire.estado = "Reprogramado";
        this.agenda.estado = "Reprogramado";
      }
      this.ordenFire.tecnicoAsignado = this.agenda.tecnico; //Asigna a la orden el tecnico asignado
      this.firebaseService.ActOrdenAgendada(this.ordenFire); // Guarda la orden
      this.firebaseService.guardarAgenda(this.agenda); //Guarda la agenda
      this.btnProgramar = false; //oculta boton programar
      setTimeout(() => {
        if (this.newEvent) {
          // si es nuevo, actualiza orden con primer agendamiento
          let startAgenda = new Date(this.agenda.start);
          // console.log(startAgenda.toDateString());
          this.update = {
            update:
              "Orden agendada para el dia : " +
              startAgenda.toUTCString() +
              ", asistirá el tecnico: " +
              this.agenda.tecnico,
            estado: this.agenda.estado,
            usuario: "Sistema",
            orden: this.agenda.orden,
            fecha: Date.now()
          };
          this.firebaseService.guardarUpdates(this.update);
        } else {
          // si evento viejo guardar log y actualiza con reprogramacion.
          if (this.logAgenda.orden != 0) {
            this.firebaseService.guardarLogAgenda(this.logAgenda);
          }
          let startAgenda = new Date(this.agenda.start);
          console.log(startAgenda.toDateString());
          this.update = {
            update:
              "Orden Reprogramada para el dia : " +
              startAgenda.toUTCString() +
              ", asistirá el tecnico: " +
              this.agenda.tecnico,
            estado: this.agenda.estado,
            usuario: "Sistema",
            orden: this.agenda.orden,
            fecha: Date.now()
          };
          this.firebaseService.guardarUpdates(this.update);
        }
        this.ruta.navigate(["/updates/" + this.agenda.orden]);
      }, 1500);
    }
  }

  duracion = [
    //Llega select Duracion HTML.
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00"
  ];
  // actualiza variable agenda, para guardar datos de tecnico seleccionado. Titulo, color y N° Orden.
  activarCalendario() {
    for (let index = 0; index < this.userFire.length; index++) {
      this.calendarVisible = true;
      if (this.userFire[index].nombre == this.agenda.tecnico) {
        this.agenda.color = this.userFire[index].color;
        this.agenda.userId = this.userFire[index].id;
        this.agenda.title = this.ordenFire.id + " - " + this.ordenFire.cliente;
        this.agenda.orden = this.ordenFire.id;
      }
    }
  }
  //Actualiza la variable agenda con datos de fechas y horas programadas, al hacer primer clic en calenadario.
  handleDateClick(arg) {
    if (
      this.agenda.tecnico == "Asignar un usuario ..." ||
      this.agenda.duracion == "Duracion ..." ||
      this.agenda.duracion == ""
    ) {
      return alert("Debe seleccionar un usuario y duracion");
    } else {
      let agendando = this.agenda;
      if (
        confirm(
          "¿Desea programar a " +
            this.agenda.tecnico +
            " " +
            arg.dateStr +
            "  ?"
        )
      ) {
        if (this.newEvent) {
          // this.consultarAgenda();
          let fechaHoy: any = Date.now();
          let start = new Date(arg.date);
          let fecha = new Date(arg.date);
          let duraHoras = new Date(
            "March 13, 08 " + agendando.duracion
          ).getHours();
          let duraMinutos = new Date(
            "March 13, 08 " + agendando.duracion
          ).getMinutes();
          fecha.setHours(start.getHours() + duraHoras);
          fecha.setMinutes(fecha.getMinutes() + duraMinutos);
          let startMili: any = start.getTime();
          let fechaMili: any = fecha.getTime();
          let duration: any = duraHoras + duraMinutos;
          agendando = {
            title: this.agenda.title,
            fecha: fechaHoy,
            start: startMili,
            duracion: duration,
            end: fechaMili,
            orden: this.agenda.orden,
            color: this.agenda.color,
            estado: "Programado",
            url: "",
            llegada: null,
            salida: null,
            dif: 0,
            tecnico: this.agenda.tecnico,
            editable: true,
            startOk: null,
            endOk: null,
            userId: this.agenda.userId
          };
          this.agenda = agendando;
          console.log(this.agenda);

          this.calendarEvents = this.calendarEvents.concat({
            // add new event data. must create new array
            title: agendando.title,
            start: agendando.start,
            end: agendando.end,
            allDay: false,
            color: agendando.color,
            editable: agendando.editable,
            borderColor: "red"
          });
          this.btnProgramar = true;
          // console.log(this.calendarEvents);
        } else {
          alert("Evento ya asignado, modifique y guarde");
        }
      }
    }
  }
  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      tecnico: new FormControl(this.agenda.tecnico, [Validators.required]),
      duracion: new FormControl(this.agenda.duracion, [Validators.required]),
      todasAgendas: new FormControl(this.verTodas, [])
    });
  }
}
