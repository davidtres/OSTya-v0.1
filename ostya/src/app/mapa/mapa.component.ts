import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-mapa",
  templateUrl: "./mapa.component.html",
  styleUrls: ["./mapa.component.css"]
})
export class MapaComponent implements OnInit {
  lat: number = 42.3246841;
  lng: number = -3.6968435;
  latPerlado = false;
  verUbica() {
    this.latPerlado = true;
  }
  ubicacion: any;
  ubicacion2: any;

  constructor() {
    var startPos;
    var geoOptions = {
      enableHighAccuracy: true
    };
    var geoSuccess = position => {
      startPos = position;
      console.log(position);

      let startLat = parseFloat(startPos.coords.latitude);
      let startLon = parseFloat(startPos.coords.longitude);
      this.ubicacion = startLat;
      this.ubicacion2 = startLon;
    };
    var geoError = function(error) {
      console.log("Error occurred. Error code: " + error.code);
      // error.code can be:
      //   0: unknown error
      //   1: permission denied
      //   2: position unavailable (error response from location provider)
      //   3: timed out
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }
  ngOnInit() {}
}
