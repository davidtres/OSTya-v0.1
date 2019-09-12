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

  constructor() {}
}
