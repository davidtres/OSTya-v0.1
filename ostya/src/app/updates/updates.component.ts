import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-updates",
  templateUrl: "./updates.component.html",
  styleUrls: ["./updates.component.css"]
})
export class UpdatesComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  public formGroupNota: FormGroup; //variable para formulario Nota
  userSistema: boolean = true;
  sinCoordenadas: boolean = false;
  ordenGet = {
    //guarda parametro id: de la orden, para luego recuperar desde Firebase
    id: "0",
    doc: "orden"
  };
  clienteGet = {
    //guarda parametro id: de la orden, para luego recuperar desde Firebase
    id: "0",
    doc: "clientes"
  };
  agendaGet = {
    //guarda parametro id: de la orden, para luego recuperar desde Firebase
    id: "0",
    doc: "agenda"
  };
  ordenFire: any = {
    //guarda ordenes desde Firebase
    id: 0,
    cliente: "",
    solicitud: ""
  };
  update: any = {
    update: "",
    estado: "",
    usuario: "",
    orden: 0,
    fecha: Date.now()
  };
  data = {
    doc: "estados"
  };
  estadosFire: any;
  updateFire: any;
  agendaFire: any;
  cOp: boolean = false; //para saber si la orden tiene estados "Creado" o "Programado"
  clienteFire: any;
  lat: number;
  lng: number;
  distance: any = 0;
  userFire: any[];
  asignadoActual: string;
  lngFire: any;
  latFire: any;
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router,
    private authenticationService: AuthenticationService
  ) {
    this.ordenGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url
    this.agendaGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url
    //obtener agenda por ID
    firebaseService
      .obtenerUnoId(this.agendaGet)
      .valueChanges()
      .subscribe(agenda => {
        this.agendaFire = agenda;
      });
    //obtener orden por ID
    firebaseService
      .obtenerUnoId(this.ordenGet)
      .valueChanges()
      .subscribe(orden => {
        this.ordenFire = orden;
        this.asignadoActual = this.ordenFire.tecnicoAsignado;
        //actualiza variable a guardar con los datos de la orden actual
        this.update.orden = this.ordenFire.id;
        this.update.usuario = this.ordenFire.tecnicoAsignado;
        this.clienteGet.id = this.ordenFire.idCliente;
        //crea array de actualizaciones de la orden actual
        let actualiza = Object.entries(this.ordenFire.updates);
        this.updateFire = actualiza;
        //filtro actualizaciones sin usuario "Sistemas"
        let sinSistema = this.updateFire.filter(
          sistema => sistema[1].usuario != "Sistema"
        );
        this.noSistem = sinSistema;
        //determina si la orden tiene estado "Creado" o "Programado"
        if (this.ordenFire.estado == "Creado") {
          this.cOp = true;
        }
        if (this.ordenFire.estado == "Programado") {
          this.cOp = true;
        }
        if (this.ordenFire.estado == "Reprogramado") {
          this.cOp = true;
        }
        this.getCoordCliente();
      });
    //obtener Estados
    firebaseService
      .getPorDoc(this.data)
      .valueChanges()
      .subscribe(estados => {
        this.estadosFire = estados;
        this.estadoQueCierran = this.estadosFire.filter(
          cierra => cierra.finOrden == true
        );
      });
  }
  getCoordCliente() {
    //obtener cliente por ID
    this.firebaseService
      .obtenerUnoId(this.clienteGet)
      .valueChanges()
      .subscribe(cliente => {
        this.clienteFire = cliente;
        console.log(this.clienteFire);

        for (let i = 0; i < this.clienteFire.direcciones.length; i++) {
          if (this.clienteFire.direcciones[i].sede == this.ordenFire.sede) {
            this.latFire = this.clienteFire.direcciones[i].lat;
            this.lngFire = this.clienteFire.direcciones[i].lng;
            if (!this.clienteFire.direcciones[i].lat) {
              this.sinCoordenadas = true;
            } else {
              this.obtenetUbicacion();
            }
          }
        }
      });
  }
  estadoQueCierran: any;
  spinner = false;
  noSistem = [];
  guardarUpdates() {
    this.spinner = true;
    if (confirm("¿Desea actualizar la orden ?")) {
      this.ordenFire.estado = this.update.estado;
      // console.log(this.agendaFire);
      if (!this.agendaFire === null) {
        this.agendaFire.estado = this.update.estado;
      }
      this.cerrarOrden();
      this.firebaseService.ActOrdenEstado(this.ordenFire);
      this.firebaseService.guardarUpdates(this.update);
      setTimeout(() => {
        this.salirSitio();
        this.spinner = false;
        this.ruta.navigate(["/home"]);
      }, 2000);
    }
  }
  saliendoSitio: boolean = false;
  salirSitio() {
    if (this.saliendoSitio) {
      this.agendaFire.endOk = Date.now();
      this.firebaseService.guardarAgendaHTecnico(this.agendaFire);
      this.firebaseService.guardarAgendaHOrden(this.agendaFire);
      this.firebaseService.guardarAgendaHfecha(this.agendaFire);
      this.firebaseService.EliminarAgenda(this.agendaFire);
    }
  }
  obtenetUbicacion() {
    let startPos;
    let geoOptions = {
      enableHighAccuracy: true
    };
    let geoSuccess = position => {
      startPos = position;
      let startLat = parseFloat(startPos.coords.latitude);
      let startLon = parseFloat(startPos.coords.longitude);
      this.lat = startLat;
      this.lng = startLon;
    };

    let geoError = function(error) {
      // console.log("Error occurred. Error code: " + error.code);
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    setTimeout(() => {
      // console.log(this.lat + " - " + this.lng);
      this.distance = this.getKilometros(
        this.lat,
        this.lng,
        this.latFire,
        this.lngFire
      );
      // console.log(this.distance);
    }, 500);
  }
  // -----Calcular distancia del cliente -----
  getKilometros(lat1, lon1, lat2, lon2) {
    let rad = function(x) {
      return (x * Math.PI) / 180;
    };
    const R = 6378137; //Radio de la tierra en metros
    let dLat = rad(lat2 - lat1);
    let dLong = rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) *
        Math.cos(rad(lat2)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d.toFixed(0); //Retorna tres decimales
  }
  enSitio() {
    // if (this.clienteFire.coordenadas[0] == 0) {
    //   this.sinCoordenadas = true;
    //   // console.log("no tiene coordenadas ");
    // } else {
    this.agendaFire.coordenadas = [this.lat, this.lng];
    this.agendaFire.estado = "En sitio";
    this.agendaFire.startOk = Date.now();
    let fechaHoy = new Date(Date.now());
    this.update = {
      update:
        "Reporte en sitio : " +
        fechaHoy.toUTCString() +
        ", tecnico: " +
        this.ordenFire.tecnicoAsignado,
      estado: "En sitio",
      usuario: "Sistema",
      orden: this.update.orden,
      fecha: Date.now()
    };
    this.ordenFire.estado = this.update.estado;
    this.ordenFire.enTriage = false;
    this.firebaseService.ActOrdenAgendada(this.ordenFire);
    this.firebaseService.guardarUpdates(this.update);
    this.firebaseService.guardarAgenda(this.agendaFire);
    // console.log(this.agendaFire);
    this.ruta.navigate(["/home"]);
  }
  Nota: string;
  addNota() {
    let hoy = new Date(Date.now());
    let fechaHoy =
      hoy.getDate() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear();

    let horaHoy = hoy.getHours() + ":" + hoy.getMinutes();
    // console.log(this.Nota);
    this.ordenFire.nota +=
      "  <+> " + this.Nota + " ( " + fechaHoy + " - " + horaHoy + "). ";
    this.firebaseService.ActOrdenEstado(this.ordenFire);
    this.Nota = "";
    location.reload();
  }

  cambiarEstado() {
    for (let i = 0; i < this.estadosFire.length; i++) {
      if (this.estadosFire[i].nombre == this.update.estado) {
        if (this.estadosFire[i].asignado == "Queda igual") {
          this.ordenFire.tecnicoAsignado = this.asignadoActual;
        } else {
          this.ordenFire.tecnicoAsignado = this.estadosFire[i].asignado;
        }
        if (this.estadosFire[i].solucionado == true) {
          this.ordenFire.solucionador = this.asignadoActual;
        } else {
          this.ordenFire.solucionador = "";
        }
      }
    }
    console.log(this.ordenFire);
  }
  cerrarOrden() {
    let estados = this.estadoQueCierran;
    for (let i = 0; i < estados.length; i++) {
      if (estados[i].nombre == this.update.estado) {
        this.ordenFire.cerrada = true;
      }
    }
  }
  uidActual: any;
  ngOnInit() {
    this.buildForm();

    this.authenticationService.getStatus().subscribe(status => {
      this.uidActual = status.uid;
      this.firebaseService
        .getUserUid(this.uidActual)
        .valueChanges()
        .subscribe(user => {
          this.userFire = user;
          console.log(this.userFire);
        });
    });
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      update: new FormControl(this.update.update, [
        Validators.required,
        Validators.minLength(20)
      ]),
      estado: new FormControl(this.update.estado, [Validators.required]),
      salirsitio: new FormControl(this.saliendoSitio, [])
    });
    // -------formulario nota --------
    this.formGroupNota = new FormGroup({
      nota: new FormControl(this.update.estado, [Validators.required])
    });
  }
}
