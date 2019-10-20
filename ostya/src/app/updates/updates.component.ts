import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import * as jsPDF from "jspdf";
import { ToolsService } from "../services/tools.service";
import { ComunicationService } from "../services/comunication.service";
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
  tipo = {
    doc: "tServ"
  };
  estadosFire: any;
  updateFire: any;
  agendaFire: any;
  cOp: boolean = false; //para saber si la orden tiene estados "Creado" o "Programado"
  clienteFire: any;
  lat: number = 0;
  lng: number = 0;
  distance: any;
  userFire: any[];
  asignadoActual: string;
  lngFire: any = 0;
  latFire: any = 0;
  Nota: string;
  userActual: any;
  estadoQueCierran: any;
  spinner = false;
  noSistem = [];
  saliendoSitio: boolean;
  quality: any = {
    LLT: [],
    RES: [],
    RSS: [],
    userId: ""
  };
  qualityFire: any;
  qualityGet: any = {
    userId: 0
  };
  domicilio: any; //para saber si la orden es a domicilio.
  tServFire: any[];
  eSr: boolean = false; //define estado en sitio o en remoto.
  facturar: boolean = false;
  tipoOrden: unknown[];
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router,
    private authenticationService: AuthenticationService,
    private tools: ToolsService,
    private comunicationService: ComunicationService
  ) {
    this.ordenGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url
    this.agendaGet.id = this.route.snapshot.params["id"]; //Recupera parametro id de url
    //obtener agenda por ID

    // firebaseService
    //   .obtenerUnoId(this.agendaGet)
    //   .valueChanges()
    //   .subscribe(agenda => {
    //     this.agendaFire = agenda;
    //     // setTimeout(() => {
    //     if (this.agendaFire) {
    //       // alert("llegó la agenda del usuario : " + this.agendaFire.userId);
    //     }
    //     // }, 1000);
    //   });

    //obtener Estados
    // firebaseService
    //   .getPorDoc(this.data)
    //   .valueChanges()
    //   .subscribe(estados => {
    //     this.estadosFire = estados;

    //   });
  }
  getCoordCliente() {
    //obtener cliente por ID
    this.firebaseService
      .obtenerUnoId(this.clienteGet)
      .valueChanges()
      .subscribe(cliente => {
        this.clienteFire = cliente;
        this.clienteFire.direcciones.forEach(cliente => {
          // debugger;
          if (cliente.sede == this.ordenFire.sede) {
            this.latFire = cliente.lat;
            this.lngFire = cliente.lng;
            this.ordenFire.direccion = cliente.direccion;
            console.log(this.latFire + "-" + this.lngFire);
            if (!this.latFire || !this.lngFire) {
              this.sinCoordenadas = true;
              console.log(this.sinCoordenadas);
            } else {
              this.obtenetUbicacion();
            }
          }
        });
        // for (let i = 0; i < this.clienteFire.direcciones.length; i++) {
        //   if (this.clienteFire.direcciones[i].sede == this.ordenFire.sede) {
        //     this.latFire = this.clienteFire.direcciones[i].lat;
        //     this.lngFire = this.clienteFire.direcciones[i].lng;
        //     this.ordenFire.direccion = this.clienteFire.direcciones[
        //       i
        //     ].direccion;
        //     if (!this.clienteFire.direcciones[i].lat) {
        //       this.sinCoordenadas = true;
        //     } else {
        //       this.obtenetUbicacion();
        //     }
        //   }
        // }
      });
  }
  guardarUpdates() {
    if (!this.saliendoSitio && this.eSr) {
      alert("No puede actualizar sin salir de sitio");
    } else {
      if (confirm("¿Desea actualizar la orden ?")) {
        this.spinner = true;
        this.ordenFire.estado = this.update.estado;
        // console.log(this.agendaFire);
        if (!this.agendaFire === null) {
          this.agendaFire.estado = this.update.estado;
        }
        this.cerrarOrden().then(() => {
          return this.firebaseService
            .ActOrdenEstado(this.ordenFire)
            .then(() => {
              return this.firebaseService
                .guardarUpdates(this.update)
                .then(() => {
                  this.salirSitio();
                });
            });
        });
      }
    }
  }
  salirSitio() {
    if (this.saliendoSitio) {
      this.agendaFire.endOk = Date.now();
      this.firebaseService.guardarAgendaHTecnico(this.agendaFire).then(() => {
        return this.firebaseService
          .guardarAgendaHOrden(this.agendaFire)
          .then(() => {
            return this.firebaseService
              .guardarAgendaHfecha(this.agendaFire)
              .then(() => {
                this.rss();
              });
          });
      });
    } else {
      setTimeout(() => {
        this.spinner = false;
        this.ruta.navigate(["/home"]);
      }, 1000);
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
      alert("Error occurrido. Error code: " + error.code);
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
    }, 1000);
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
    this.reporteUsuario();
  }
  reporteUsuario() {
    this.firebaseService.ActOrdenAgendada(this.ordenFire).then(() => {
      return this.firebaseService.guardarUpdates(this.update).then(() => {
        return this.firebaseService.guardarAgenda(this.agendaFire).then(() => {
          if (!this.qualityFire) {
            this.llt();
            this.res();
            this.rss();
          } else {
            this.llt();
            this.res();
          }
        });
      });
    });
  }

  enRemoto() {
    if (confirm("Seguro quiere iniciar soporte remoto?")) {
      this.agendaFire.coordenadas = [this.lat, this.lng];
      this.agendaFire.estado = "En remoto";
      this.agendaFire.startOk = Date.now();
      this.update = {
        update:
          "Reporte en remoto : " +
          this.fechaHoy +
          ", tecnico: " +
          this.ordenFire.tecnicoAsignado,
        estado: "En remoto",
        usuario: "Sistema",
        orden: this.update.orden,
        fecha: Date.now()
      };
      this.ordenFire.estado = this.update.estado;
      this.ordenFire.enTriage = false;
      this.reporteUsuario();
      // this.firebaseService.ActOrdenAgendada(this.ordenFire);
      // this.firebaseService.guardarUpdates(this.update);
      // this.firebaseService.guardarAgenda(this.agendaFire);
      // if (!this.qualityFire) {
      //   this.llt();
      //   this.res();
      //   this.rss();
      // } else {
      //   this.llt();
      //   this.res();
      // }
      // // console.log(this.agendaFire);
      // this.ruta.navigate(["/home"]);
    }
  }
  addNota($event) {
    // console.log();
    let laNota: string = $event.path[2].children[1].children[0][0].value;
    this.Nota = laNota;
    this.ordenFire.nota += "  - " + " ( " + this.fechaHoy + "). " + this.Nota;
    this.firebaseService.ActOrdenEstado(this.ordenFire).then(() => {
      alert("Nota agredada");
      this.ruta.navigate(["/home"]);
    });
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
    // console.log(this.ordenFire);
  }
  cerrarOrden() {
    return new Promise((resolve, reject) => {
      let estados = this.estadoQueCierran;
      for (let i = 0; i < estados.length; i++) {
        if (estados[i].nombre == this.update.estado) {
          this.ordenFire.cerrada = true;
        }
      }
      resolve(true);
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
    // this.formGroupNota = new FormGroup({
    //   nota: new FormControl(this.update.estado, [Validators.required])
    // });
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
      "TELEFONOS: " +
        this.clienteFire.telefono +
        " , " +
        this.clienteFire.celular,
      110,
      50
    );
    let direccionTxt = doc.splitTextToSize(
      "DIRECCION: " + this.ordenFire.direccion,
      175
    );
    doc.text(direccionTxt, 10, 56);
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
    // doc.setFontStyle("bold");
    // doc.text("Notas : ", 10, txtHg);
    // doc.setFontStyle("normal");
    // let notasTxt = doc.splitTextToSize(this.ordenFire.nota, 175);
    // doc.text(notasTxt, 30, txtHg);
    // txtHg = (notasTxt.length * fontSize * lineHeight) / ptsPerInch + txtHg;
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
    this.getQuality().then(() => {
      // console.log(this.qualityFire);
      if (this.qualityFire) {
        if (this.qualityFire.LLT) {
          this.quality.LLT = this.qualityFire.LLT;
          // console.log(this.quality);
        }
        if (this.qualityFire.RES) {
          this.quality.RES = this.qualityFire.RES;
          // console.log(this.quality);
        }
        if (this.qualityFire.RSS) {
          this.quality.RSS = this.qualityFire.RSS;
          // console.log(this.quality);
        }
      }
    });
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
    if (!this.ordenFire.domicilio) {
      this.addQualityRes(1);
    } else {
      if (this.distance < 200) {
        this.addQualityRes(1);
      } else {
        this.addQualityRes(0);
      }
    }
  }
  //Valida reporte salida de sitio - envía la calificacion
  rss() {
    if (!this.ordenFire.domicilio) {
      this.addQualityRss(1);
    } else {
      if (this.distance < 200) {
        this.addQualityRss(1);
      } else {
        this.addQualityRss(0);
      }
    }
  }
  //agrega la calificacion al array y solicita guardar.
  addQualityLlt(valor: number) {
    let data = {
      user: this.agendaFire.userId,
      orden: this.ordenFire.id,
      fhPro: this.agendaFire.start,
      fhLle: this.agendaFire.startOk,
      distance: this.distance,
      calif: valor
    };
    if (this.quality.LLT.length >= 30) {
      let aEliminar = this.quality.LLT.length - 29;
      this.quality.LLT.splice(-30, aEliminar);
      this.quality.LLT.push(data);
    } else {
      this.quality.LLT.push(data);
    }
  }
  //agrega la calificacion al array y solicita guardar.
  addQualityRes(valor: number) {
    let data = {
      user: this.agendaFire.userId,
      orden: this.ordenFire.id,
      fhPro: this.agendaFire.start,
      fhLle: this.agendaFire.startOk,
      distance: this.distance,
      calif: valor
    };
    if (this.quality.RES.length >= 30) {
      let aEliminar = this.quality.RES.length - 29;
      this.quality.RES.splice(-30, aEliminar);
      this.quality.RES.push(data);
      this.subirQuality();
    } else {
      this.quality.RES.push(data);
      this.subirQuality();
    }
  }
  //agrega la calificacion al array y solicita guardar.
  addQualityRss(valor: number) {
    // console.log(this.agendaFire);
    let hoy = new Date(Date.now());
    let data = {
      user: this.agendaFire.userId,
      orden: this.ordenFire.id,
      fhPro: this.agendaFire.start,
      fhLle: hoy,
      distance: this.distance,
      calif: valor
    };
    this.firebaseService.EliminarAgenda(this.agendaFire).then(() => {
      if (this.quality.RSS.length >= 30) {
        let aEliminar = this.quality.RSS.length - 29;
        this.quality.RSS.splice(-30, aEliminar);
        this.quality.RSS.push(data);
        this.subirQuality();
      } else {
        this.quality.RSS.push(data);
        this.subirQuality();
      }
    });
  }

  //Guarda calificacion asignada.
  subirQuality() {
    this.firebaseService.guardarQuality(this.quality).then(() => {
      setTimeout(() => {
        this.spinner = false;
        this.ruta.navigate(["/home"]);
      }, 1000);
    });
  }
  // --- Seleccionar estados que cierran y verifica estado solucionado de la orden para poder facturar---
  filtroEstados() {
    this.estadoQueCierran = this.estadosFire.filter(
      cierra => cierra.finOrden == true
    );
    this.estadosFire.forEach(estado => {
      if (estado.solucionado) {
        if (estado.solucionado == true) {
          if (estado.nombre == this.ordenFire.estado) {
            this.facturar = true;
          }
        }
      }
    });
  }
  getTiposServicios() {
    let dataTserv = {
      doc: "tServ"
    };
    //obtener tipos de servicios
    this.firebaseService
      .getPorDoc(dataTserv)
      .valueChanges()
      .subscribe(tserv => {
        this.tipoOrden = tserv;
        console.log(this.tipoOrden);
      });
  }
  changeTipo($event) {
    let newType =
      $event.path[3].firstElementChild.children[1].children[0][0].value;
    let visita: any = this.tipoOrden.filter((tipo: any) => {
      if (tipo.nombre == newType) {
        return tipo;
      }
    });
    if (confirm("Seguro quiere cambiar tipo a: " + newType + "?")) {
      this.ordenFire.tipo = newType;
      this.ordenFire.domicilio = visita[0].visita;
      this.firebaseService.ActOrdenEstado(this.ordenFire).then(() => {
        this.update = {
          update:
            "Cambio tipo de orden a: " +
            newType +
            " " +
            this.fechaHoy +
            ", por: " +
            this.userActual.nombre,
          estado: this.ordenFire.estado,
          usuario: this.userActual.nombre,
          orden: this.update.orden,
          fecha: Date.now()
        };
        this.firebaseService.guardarUpdates(this.update).then(() => {
          alert("Cambio realizado");
          this.ruta.navigate(["/home"]);
        });
      });
    } else {
      alert("Cambio Cancelado");
    }
  }
  ngOnInit() {
    this.obtenetUbicacion();
    this.buildForm();
    //--------obtener orden por ID-----------
    this.firebaseService
      .obtenerUnoId(this.ordenGet)
      .valueChanges()
      .subscribe(orden => {
        this.ordenFire = orden;
        this.asignadoActual = this.ordenFire.tecnicoAsignado;
        //actualiza variable a guardar con los datos de la orden actual
        this.update.orden = this.ordenFire.id;
        this.update.usuario = this.userActual.nombre;
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
        let estadoActual = this.ordenFire.estado;
        if (
          estadoActual == "Creado" ||
          estadoActual == "Programado" ||
          estadoActual == "Reprogramado"
        ) {
          this.cOp = true;
        }
        if (estadoActual == "En sitio" || estadoActual == "En remoto") {
          this.eSr = true;
        }
        this.getCoordCliente();
        this.filtroEstados();
        // console.log(this.ordenFire);
      });
    // ------------get Agenda de la orden---------------
    this.firebaseService
      .obtenerUnoId(this.agendaGet)
      .valueChanges()
      .subscribe(agenda => {
        this.agendaFire = agenda;
      });
    // ------------ get Usuario Actual --------------
    this.comunicationService.getUserLogeed.subscribe(user => {
      this.userActual = user;
      this.quality.userId = this.userActual.id;
      this.loadQuality();
    });
    // --------------get Estados ---------------------
    this.comunicationService.getAllStates.subscribe(estados => {
      this.estadosFire = estados;
      // console.log(this.facturar);
    });
    // ---------activa boton salir de sitio--------------
    setTimeout(() => {
      if (
        this.ordenFire.estado == "En sitio" ||
        this.ordenFire.estado == "En remoto"
      ) {
        this.saliendoSitio = true;
      } else {
        this.saliendoSitio = false;
      }
      // console.log(this.distance);
    }, 1000);
  }
}
