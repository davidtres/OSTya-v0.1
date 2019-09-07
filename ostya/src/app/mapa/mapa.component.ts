import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-mapa",
  templateUrl: "./mapa.component.html",
  styleUrls: ["./mapa.component.css"]
})
export class MapaComponent implements OnInit {
  lat: number = 0;
  lng: number = 0;
  constructor() {
    this.obtenetUbicacion();
  }

  loading = false;
  recalcular() {
    this.loading = true;
    setTimeout(() => {
      this.obtenetUbicacion();
    }, 2000);
  }
  obtenetUbicacion() {
    var startPos;
    var geoOptions = {
      enableHighAccuracy: true
    };
    var geoSuccess = position => {
      startPos = position;
      console.log(position);
      let startLat = parseFloat(startPos.coords.latitude);
      let startLon = parseFloat(startPos.coords.longitude);
      this.lat = startLat;
      this.lng = startLon;
      document.getElementById("accuracy").innerHTML =
        " Precisión: " +
        startPos.coords.accuracy +
        " mts ." +
        "Latitud: " +
        startPos.coords.latitude +
        " Longitud: " +
        startPos.coords.longitude;
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
    this.loading = false;
  }

  ngOnInit() {}
}
