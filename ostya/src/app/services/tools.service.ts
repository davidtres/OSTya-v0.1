import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ToolsService {
  convFecha(date: Date) {
    let mes = date.getMonth();
    let dia = date.getDate();
    let anio = date.getFullYear();
    let mesT;
    let diaT;
    mes++;
    if (mes < 10) {
      mesT = "0" + mes;
    } else {
      mesT = mes;
    }
    if (dia < 10) {
      diaT = "0" + dia;
    } else {
      diaT = dia;
    }
    let fecha = diaT + "/" + mesT + "/" + anio;
    return fecha;
  }
  convFechaHora(date: Date) {
    let mes = date.getMonth();
    let dia = date.getDate();
    let anio = date.getFullYear();
    let hora = date.getHours();
    let minutos = date.getMinutes();
    let mesT;
    let diaT;
    let horaT;
    let minutosT;
    mes++;
    if (mes < 10) {
      mesT = "0" + mes;
    } else {
      mesT = mes;
    }
    if (dia < 10) {
      diaT = "0" + dia;
    } else {
      diaT = dia;
    }
    if (hora < 10) {
      horaT = "0" + hora;
    } else {
      horaT = hora;
    }
    if (minutos < 10) {
      minutosT = "0" + minutos;
    } else {
      minutosT = minutos;
    }
    let fecha = diaT + "/" + mesT + "/" + anio + " - " + horaT + ":" + minutosT;
    return fecha;
  }
  public ordenarPorId(items) {
    items.sort(function(a, b) {
      var idA = a.id;
      var idB = b.id;
      return idA - idB;
    });
  }
  constructor() {}
}
