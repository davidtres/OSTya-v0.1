import { Component, OnInit, ViewChild } from "@angular/core";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGrigPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for dateClick
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-agenda-pr",
  templateUrl: "./agenda-pr.component.html",
  styleUrls: ["./agenda-pr.component.css"]
})
export class AgendaPrComponent implements OnInit {
  @ViewChild("calendar") calendarComponent: FullCalendarComponent; // the #calendar in the template
  ahora = new Date();
  fin = new Date(this.ahora);
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [
    {
      title: "Event Now",
      start: this.ahora,
      end: this.fin.setHours(this.fin.getHours() + 2.1),
      color: "#00ff80",
      overlap: false,
      id: "a"
    }
  ];

  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  datoCambio(info) {
    alert(
      info.event.title + " Fue movido a: " + info.event.start.toISOString()
    );
    console.log(info);

    if (!confirm("Are you sure about this change?")) {
      info.revert();
    }
  }
  resizeEvento(info) {
    alert(info.event.title + " end is now " + info.event.end.toISOString());
    console.log(info);
    //._instance.range.start
    if (!confirm("is this okay?")) {
      info.revert();
    }
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate("2018-10-01"); // call a method on the Calendar object
  }

  handleDateClick(arg) {
    let hora = "01:30";
    let dura = new Date("March 13, 08 " + hora);
    console.log(dura.getHours());
    console.log(dura.getMinutes());
    if (confirm("¿Desea agregar un evento a  " + arg.dateStr + "  ?")) {
      let start = new Date(arg.date);
      let fecha = new Date(arg.date);
      fecha.setHours(fecha.getHours() + 3);
      this.calendarEvents = this.calendarEvents.concat({
        // add new event data. must create new array
        title: "New Event",
        start: start,
        end: fecha,
        allDay: arg.allDay
      });

      console.log(arg);

      console.log(this.calendarEvents);
    }
  }
  title = "El titulo del evento";
  ordenFire: any;
  data = {
    doc: "orden"
  };
  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getPorId(this.data)
      .valueChanges()
      .subscribe(orden => {
        this.ordenFire = orden;
        console.log(this.ordenFire);
      });
  }
  ngOnInit() {}
}
