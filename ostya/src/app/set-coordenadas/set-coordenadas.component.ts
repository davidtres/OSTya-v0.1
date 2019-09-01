import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-set-coordenadas",
  templateUrl: "./set-coordenadas.component.html",
  styleUrls: ["./set-coordenadas.component.css"]
})
export class SetCoordenadasComponent implements OnInit {
  lat: number = 0;
  lng: number = 0;
  clienteGet: any = {
    id: 0,
    doc: "clientes"
  };
  clienteFire: any = {};

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    this.obtenetUbicacion();
    this.clienteGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url

    firebaseService
      .obtenerUnoId(this.clienteGet)
      .valueChanges()
      .subscribe(cliente => {
        this.clienteFire = cliente;
        console.log(this.clienteFire);
      });
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
        " mts. Latitud: " +
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
  }
  addCoordenadas() {
    this.clienteFire.coordenadas[0] = this.lat;
    this.clienteFire.coordenadas[1] = this.lng;
    console.log(this.clienteFire.coordenadas);
    this.firebaseService.guardarCliente(this.clienteFire);
    this.ruta.navigate(["/home"]);
  }
  cancelar() {
    this.ruta.navigate(["/home"]);
  }

  ngOnInit() {}
}
