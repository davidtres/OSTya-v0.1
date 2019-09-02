import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-triage",
  templateUrl: "./triage.component.html",
  styleUrls: ["./triage.component.css"]
})
export class TriageComponent implements OnInit {
  ordenFire: any;
  ordenTriage: any;
  colorVence = "#b2ffff";
  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getOrdenesEnTriage()
      .valueChanges()
      .subscribe(orden => {
        this.ordenFire = orden;
        // console.log(orden);
        this.tiempoRestante(this.ordenFire);
        this.ordenarVencimiento(this.ordenFire);
      });
    // console.log(this.ordenFire);
  }
  ordenOrdenada: any;

  ordenarVencimiento(a) {
    a = a.sort(function(a, b) {
      if (a.tf < b.tf) return -1;
      if (a.tf > b.tf) return 1;
      return 0;
    });
  }
  fechaAhora = new Date(Date.now());
  tiempoFinal: any;
  tiempoFalta: any;
  tiempoRestante(tiempo) {
    for (let i = 0; i < this.ordenFire.length; i++) {
      switch (tiempo[i].triage) {
        case 1:
          this.tiempoFinal = tiempo[i].fechaSolicitud + 432000000;
          this.tiempoFalta = this.tiempoFinal - this.fechaAhora.getTime();
          this.ordenFire[i].tr = this.convertirFecha(this.tiempoFalta);
          this.ordenFire[i].color = this.asignarColor(this.tiempoFalta);
          this.ordenFire[i].tf = this.tiempoFalta;
          break;
        case 2:
          this.tiempoFinal = tiempo[i].fechaSolicitud + 259200000;
          this.tiempoFalta = this.tiempoFinal - this.fechaAhora.getTime();
          this.ordenFire[i].tr = this.convertirFecha(this.tiempoFalta);
          this.ordenFire[i].color = this.asignarColor(this.tiempoFalta);
          this.ordenFire[i].tf = this.tiempoFalta;
          break;
        case 3:
          this.tiempoFinal = tiempo[i].fechaSolicitud + 86400000;
          this.tiempoFalta = this.tiempoFinal - this.fechaAhora.getTime();
          this.ordenFire[i].tr = this.convertirFecha(this.tiempoFalta);
          this.ordenFire[i].color = this.asignarColor(this.tiempoFalta);
          this.ordenFire[i].tf = this.tiempoFalta;
          break;
        case 4:
          this.tiempoFinal = tiempo[i].fechaSolicitud + 28800000;
          this.tiempoFalta = this.tiempoFinal - this.fechaAhora.getTime();
          this.ordenFire[i].tr = this.convertirFecha(this.tiempoFalta);
          this.ordenFire[i].color = this.asignarColor(this.tiempoFalta);
          this.ordenFire[i].tf = this.tiempoFalta;
          break;
        case 5:
          this.tiempoFinal = tiempo[i].fechaSolicitud + 14400000;
          this.tiempoFalta = this.tiempoFinal - this.fechaAhora.getTime();
          this.ordenFire[i].tr = this.convertirFecha(this.tiempoFalta);
          this.ordenFire[i].color = this.asignarColor(this.tiempoFalta);
          this.ordenFire[i].tf = this.tiempoFalta;
          break;
        default:
          break;
      }
    }

    // console.log(this.ordenFire);
  }
  asignarColor(tiempo) {
    if (tiempo < 0) {
      return "#FF0F00";
    }
    if (tiempo < 14400000 && tiempo > 0) {
      return "#FF00E0";
    }
    if (tiempo < 28800000 && tiempo > 14400000) {
      return "#FF7C00";
    }
    if (tiempo < 86400000 && tiempo > 28800000) {
      return "#F7FF00";
    }
    if (tiempo < 259200000 && tiempo > 86400000) {
      return "#afff00";
    }
    if (tiempo > 259200000) {
      return "#00d5ff";
    }
  }
  convertirFecha(fecha) {
    if (fecha < 0) {
      return "Incumplido";
    } else {
      let _second = 1000;
      let _minute = _second * 60;
      let _hour = _minute * 60;
      let _day = _hour * 24;
      let timer;

      let days = Math.floor(fecha / _day);
      let hours = Math.floor((fecha % _day) / _hour);
      let minutes = Math.floor((fecha % _hour) / _minute);
      let seconds = Math.floor((fecha % _minute) / _second);

      timer = days + " dias, ";
      timer += hours + " : ";
      timer += minutes;
      return timer;
    }
  }

  ngOnInit() {}
}
