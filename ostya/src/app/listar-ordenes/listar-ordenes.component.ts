import { Component, OnInit, Input } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-listar-ordenes",
  templateUrl: "./listar-ordenes.component.html",
  styleUrls: ["./listar-ordenes.component.css"]
})
export class ListarOrdenesComponent implements OnInit {
  @Input() ordenFire;
  listUser: any;
  constructor() {
    this.listUser = [];
  }
  // ----- CRITERIO DE NOTIFICACIONES  ------
  // - NUEVO: Servicios ingresados las ultimas 24 horas.
  // - ACTUALIZADO: Ultima actualizacion hace menos de 24h.
  // - DESACTUALIZADO: Ultima actualizacion tiene mas de 3 dias y menos de 7 dias.
  // - ANTIGUO: Ultima actualizacion tiene mas de 7 dias.
  // - SIN NOTIFICACION: Está en periodo de ejecucion ultima actualizacion tiene menos de 3 dias y mas de 24h

  ngOnInit() {
    // filtrado de tecnicos que tienen ordenes abiertas asignadas.
    setTimeout(() => {
      this.ordenFire.forEach(orden => {
        if (!this.listUser.includes(orden.tecnicoAsignado)) {
          this.listUser.push(orden.tecnicoAsignado);
          this.listUser.sort();
        }
      });
    }, 500);
  }
}
