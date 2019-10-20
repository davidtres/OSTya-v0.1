import { Component, OnInit, Input } from "@angular/core";

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
  bobo($event) {
    console.log($event);
  }
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
