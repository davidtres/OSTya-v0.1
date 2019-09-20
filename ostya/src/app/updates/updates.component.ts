import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import * as jsPDF from "jspdf";
import { ToolsService } from "../services/tools.service";
import { promise } from "protractor";
import { reject } from "q";
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
  Nota: string;
  uidActual: any;
  estadoQueCierran: any;
  spinner = false;
  noSistem = [];
  saliendoSitio: boolean = false;
  quality: any = {
    LLT: [1],
    RES: [1],
    RSS: [1],
    userId: ""
  };
  qualityFire: any;
  qualityGet: any = {
    userId: 0
  };
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router,
    private authenticationService: AuthenticationService,
    private tools: ToolsService
  ) {
    this.ordenGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url
    this.agendaGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url
    //obtener agenda por ID
    firebaseService
      .obtenerUnoId(this.agendaGet)
      .valueChanges()
      .subscribe(agenda => {
        this.agendaFire = agenda;
        this.quality.userId = this.agendaFire.userId;
        this.loadQuality();
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
            this.ordenFire.direccion = this.clienteFire.direcciones[
              i
            ].direccion;
            if (!this.clienteFire.direcciones[i].lat) {
              this.sinCoordenadas = true;
            } else {
              this.obtenetUbicacion();
            }
          }
        }
      });
  }

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
  salirSitio() {
    if (this.saliendoSitio) {
      this.rss();
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
  fechaHoy = this.tools.convFechaHora(new Date(Date.now()));
  enSitio() {
    // if (this.clienteFire.coordenadas[0] == 0) {
    //   this.sinCoordenadas = true;
    //   // console.log("no tiene coordenadas ");
    // } else {
    this.agendaFire.coordenadas = [this.lat, this.lng];
    this.agendaFire.estado = "En sitio";
    this.agendaFire.startOk = Date.now();

    this.update = {
      update:
        "Reporte en sitio : " +
        this.fechaHoy +
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
    this.llt();
    this.res();
    // console.log(this.agendaFire);
    this.ruta.navigate(["/home"]);
  }

  addNota() {
    let hoy = new Date(Date.now());
    this.ordenFire.nota += "  <+> " + this.Nota + " ( " + this.fechaHoy + "). ";
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
  getQuality() {
    return new Promise((resolve, reject) => {
      this.firebaseService
        .getQuality(this.quality.userId)
        .valueChanges()
        .subscribe(quality => {
          this.qualityFire = quality;
          resolve(this.qualityFire);
        });
    });
  }
  loadQuality() {
    this.getQuality().then(quality => {
      console.log(this.qualityFire);
      if (this.qualityFire) {
        if (this.qualityFire.LLT) {
          this.quality.LLT = this.qualityFire.LLT;
          console.log(this.quality);
        }
        if (this.qualityFire.RES) {
          this.quality.RES = this.qualityFire.RES;
          console.log(this.quality);
        }
        if (this.qualityFire.RSS) {
          this.quality.RSS = this.qualityFire.RSS;
          console.log(this.quality);
        }
      }
    });
  }

  ngOnInit() {
    this.buildForm();
    this.authenticationService.getStatus().subscribe(status => {
      this.uidActual = status.uid;
      this.firebaseService
        .getUserUid(this.uidActual)
        .valueChanges()
        .subscribe(user => {
          this.userFire = user;
          // console.log(this.userFire);
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
  imprimir() {
    // Conversion de fecha de solicitud
    let fch = new Date(this.ordenFire.fechaSolicitud);
    let fechaSolicitud = this.tools.convFecha(fch);
    // variables calculo de espacios en parrafos
    const pageWidth = 200,
      lineHeight = 1.2,
      mg = 10,
      maxLineWidth = pageWidth - mg * 2,
      fontSize = 12,
      ptsPerInch = 72 / 25.6,
      oneLineHeight = (fontSize * lineHeight) / ptsPerInch,
      doc = new jsPDF({
        lineHeight: lineHeight
      }).setProperties({ title: "Orden " + this.ordenFire.id });
    // inicio de formato
    doc.line(10, 10, 200, 10);
    doc.setFontSize(18);
    doc.text("HARDSOFT COMPUTERS S.A.S", 150, 18, null, null, "center");
    doc.setFontSize(11);
    doc.text(
      "Calle 30 #64-105, Cartagena - Colombia.\n (5) 678 5089, 317 855 4109,  317 6818136.\n serviciotecnico@hardsoftcomputers.com.co ",
      150,
      25,
      null,
      null,
      "center"
    );
    doc.line(10, 37, 200, 37);
    let img = new Image();
    img.src = "assets/img/hsc.jpg";
    doc.addImage(img, "png", 10, 18);
    doc.setFontSize(18);
    doc.text(
      "ORDEN DE TRABAJO N°" + this.ordenFire.id,
      100,
      44,
      null,
      null,
      "center"
    );
    // ------------DATOS DEL CLIENTE-------------
    doc.setDrawColor(0);
    doc.setFillColor(220, 220, 220);
    doc.rect(10, 45, 190, 18, "F");
    doc.line(10, 45, 200, 45);
    doc.setFontSize(12);
    doc.setFontStyle("bold");
    doc.text(
      "CLIENTE: " +
        this.ordenFire.cliente +
        "  -  SEDE: " +
        this.ordenFire.sede,
      10,
      50
    );
    doc.setFontStyle("normal");
    doc.text(
      "DIRECCION: " +
        this.ordenFire.direccion +
        "\nTELEFONOS: " +
        this.clienteFire.telefono +
        " , " +
        this.clienteFire.celular,
      10,
      56
    );
    doc.text("ESTADO: " + this.ordenFire.estado, 100, 68, null, null, "center");
    doc.line(10, 70, 200, 70);
    // -----------------DATOS DE LA SOLICITUD---------------
    doc.setFontSize(11);
    doc.text("Fecha Solicitud: " + fechaSolicitud, 10, 76);
    doc.text("Tipo de Servicio: " + this.ordenFire.tipo, 100, 76);
    doc.text("Asignado a: " + this.ordenFire.tecnicoAsignado, 10, 82);
    // ------------------------------------------
    // SERVICIO SOLICITADO
    // ------------------------------------------
    doc.setFontStyle("bold");
    doc.text("Solicitud: ", 10, 90);
    doc.setFontStyle("normal");
    let solicitudTxt = doc.splitTextToSize(this.ordenFire.solicitud, 175);
    doc.text(solicitudTxt, 30, 90);
    let txtHg: number =
      (solicitudTxt.length * fontSize * lineHeight) / ptsPerInch + 90;
    // ------------------------------------------
    // NOTAS ADICIONALES
    // ------------------------------------------
    doc.setFontStyle("bold");
    doc.text("Notas : ", 10, txtHg);
    doc.setFontStyle("normal");
    let notasTxt = doc.splitTextToSize(this.ordenFire.nota, 175);
    doc.text(notasTxt, 30, txtHg);
    txtHg = (notasTxt.length * fontSize * lineHeight) / ptsPerInch + txtHg;
    doc.line(10, txtHg - 2, 200, txtHg - 2);
    // ------------------------------------------
    // ACTUALIZACIONES DE LA ORDEN
    // ------------------------------------------
    txtHg = txtHg + 6;
    doc.setFontSize(12);
    doc.setFontStyle("bold");
    doc.text("ACTUALIZACIONES", 100, txtHg, null, null, "center");
    txtHg = txtHg + 5;
    doc.setFontStyle("normal");
    doc.setFontSize(10);
    this.updateFire.forEach((update, i) => {
      // debugger;
      if (update[1].usuario != "Sistema") {
        let fchUpd = new Date(update[1].fecha);
        let fechaUpdate = this.tools.convFecha(fchUpd);
        doc.text("Fecha : " + fechaUpdate, 10, txtHg);
        // -------------Txt actualizacion---------------
        let actualizacionesTxt = doc.splitTextToSize(
          update[1].update +
            " - " +
            update[1].usuario +
            " - " +
            update[1].estado +
            ".",
          175
        );
        doc.text(actualizacionesTxt, 15, txtHg + 6);
        txtHg =
          txtHg +
          6 +
          (actualizacionesTxt.length * fontSize * lineHeight) / ptsPerInch;
      }
    });
    // -------------------FINAL-------------------------------
    doc.line(130, 264, 180, 264);
    doc.text("Firma Cliente ", 145, 267);
    doc.text(
      "Cliente recibe a satisfaccion los trabajos descritos en el presente informe. ",
      10,
      267
    );

    let orden = "Orden " + this.ordenFire.id + " - " + this.ordenFire.cliente;
    orden = orden.replace(/\./g, "");
    doc.save(orden);
  }
  // Valida llegada a tiempo - calificacion
  llt() {
    if (this.agendaFire.start < this.agendaFire.startOk) {
      this.addQualityLlt(0);
    } else {
      this.addQualityLlt(1);
    }
  }
  //Valida reporte en sitio - envía la calificacion
  res() {
    if (this.distance < 200) {
      this.addQualityRes(1);
    } else {
      this.addQualityRes(0);
    }
  }
  //Valida reporte salida de sitio - envía la calificacion
  rss() {
    if (this.distance < 200) {
      this.addQualityRss(1);
    } else {
      this.addQualityRss(0);
    }
  }
  //agrega la calificacion al array y solicita guardar.
  addQualityLlt(valor: number) {
    if (this.quality.LLT.length == 30) {
      this.quality.LLT.slice(-30, 1);
      this.quality.LLT.push(valor);
    } else {
      this.quality.LLT.push(valor);
    }
  }
  //agrega la calificacion al array y solicita guardar.
  addQualityRes(valor: number) {
    if (this.quality.RES.length == 30) {
      this.quality.RES.slice(-30, 1);
      this.quality.RES.push(valor);
      this.subirQuality();
    } else {
      this.quality.RES.push(valor);
      this.subirQuality();
    }
  }
  //agrega la calificacion al array y solicita guardar.
  addQualityRss(valor: number) {
    if (this.quality.RSS.length == 30) {
      this.quality.RSS.slice(-30, 1);
      this.quality.RSS.push(valor);
      this.subirQuality();
    } else {
      this.quality.RSS.push(valor);
      this.subirQuality();
    }
  }

  //Guarda calificacion asignada.
  subirQuality() {
    this.firebaseService.guardarQuality(this.quality);
  }
}
