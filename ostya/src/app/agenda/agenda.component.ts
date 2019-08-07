import { Component, OnInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";

@Component({
  selector: "app-agenda",
  templateUrl: "./agenda.component.html",
  styleUrls: ["./agenda.component.css"]
})
export class AgendaComponent implements OnInit {
  calendarPlugins = [dayGridPlugin]; // important!
  eventos: any = [
    { title: "event 1", date: "2019-08-01" },
    { title: "event 2", date: "2019-08-01", color: "red", editable: "true" }
  ];

  calendarEvents = [
    { title: "event 1", date: "2019-08-01", url: "https://google.com" }
  ];

  addEvent() {
    this.calendarEvents.push({
      title: "event 2",
      date: "2019-08-02",
      url: "https://google.com"
    });
  }

  modifyTitle(eventIndex, newTitle) {
    this.calendarEvents[eventIndex].title = newTitle;
    // handler method
  }
  handleDateClick(arg) {
    alert(arg.dateStr);
    debugger;
  }
  constructor() {}

  ngOnInit() {}
}
