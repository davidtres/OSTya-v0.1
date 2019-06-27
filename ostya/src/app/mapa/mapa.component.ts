import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-mapa",
  templateUrl: "./mapa.component.html",
  styleUrls: ["./mapa.component.css"]
})
export class MapaComponent implements OnInit {
  lat: number = 42.3246841;
  lng: number = -3.6968435;
  constructor() {}

  ngOnInit() {}
}
