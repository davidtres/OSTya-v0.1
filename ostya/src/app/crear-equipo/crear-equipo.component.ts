import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { Equipo } from "../interfaces/equipo";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { NgbRadioGroup } from "@ng-bootstrap/ng-bootstrap";
import { Licencias } from "../interfaces/licencias";
import { PCS } from "../interfaces/ePcs";
import { eComunicacion } from "../interfaces/eComunicacion";

@Component({
  selector: "app-crear-equipo",
  templateUrl: "./crear-equipo.component.html",
  styleUrls: ["./crear-equipo.component.css"]
})
export class CrearEquipoComponent implements OnInit {
  // Inicializacion de variables de la interface PCS
  newEquipo: PCS = {
    id: 1,
    cliente: null,
    tipo: null,
    garantia: null,
    doc: "equipos",
    datos: {
      marca: null,
      modelo: null,
      serial: null,
      ubicacion: null,
      usuario: null,
      clave: null,
      ip: null,
      mac: null
    },
    fechaCreacion: Date.now(),
    activo: true,
    proximoMantto: null,
    observaciones: null,
    caractersiticas: {
      procesador: null,
      memoria: null,
      disco: null,
      pantalla: null,
      garantia: null,
      otros: null
    },
    software: [
      {
        tipo: null,
        activa: null,
        serial: null,
        nota: null
      }
    ],
    comunicaciones: {
      confWan: {
        ipwan: null,
        mascara: null,
        pEnlace: null,
        dns: null
      },
      confPuertos: null,
      confWifi: {
        ssid: null,
        clave: null
      }
    }
  };
  // Creacion de formularios y validaciones.
  formGroup: FormGroup;
  radioGroupForm: FormGroup;
  formEquipo: FormGroup;
  frmAddLicencia: FormGroup;
  private buildForm() {
    this.formEquipo = new FormGroup({
      cliente: new FormControl(this.newEquipo.cliente, [Validators.required]),
      marca: new FormControl(this.newEquipo.datos["marca"], [
        Validators.required
      ]),
      modelo: new FormControl(this.newEquipo.datos["modelo"], [
        Validators.required
      ]),
      serial: new FormControl(this.newEquipo.datos["serial"], []),
      ubicacion: new FormControl(this.newEquipo.datos["ubicacion"], []),
      usuario: new FormControl(this.newEquipo.datos["usuario"], []),
      clave: new FormControl(this.newEquipo.datos["clave"], []),
      ip: new FormControl(this.newEquipo.datos["ip"], []),
      mac: new FormControl(this.newEquipo.datos["mac"], []),
      observaciones: new FormControl(this.newEquipo.observaciones, []),
      procesador: new FormControl(
        this.newEquipo.caractersiticas["procesador"],
        []
      ),
      memoria: new FormControl(this.newEquipo.caractersiticas["memoria"], []),
      disco: new FormControl(this.newEquipo.caractersiticas["disco"], []),
      pantalla: new FormControl(this.newEquipo.caractersiticas["pantalla"], []),
      garantia: new FormControl(this.newEquipo.caractersiticas["garantia"], []),
      otros: new FormControl(this.newEquipo.caractersiticas["otros"], []),
      tipoLic: new FormControl(this.newLicencia.tipo, []),
      activaLic: new FormControl(this.newLicencia.activa, []),
      serialLic: new FormControl(this.newLicencia.serial, []),
      notaLic: new FormControl(this.newLicencia.nota, []),
      ipwan: new FormControl(
        this.newEquipo.comunicaciones.confWan["ipwan"],
        []
      ),
      mascara: new FormControl(
        this.newEquipo.comunicaciones.confWan["mascara"],
        []
      ),
      pEnlace: new FormControl(
        this.newEquipo.comunicaciones.confWan["pEnlace"],
        []
      ),
      dns: new FormControl(this.newEquipo.comunicaciones.confWan["dns"], []),
      ssid: new FormControl(this.newEquipo.comunicaciones.confWifi["ssid"], []),
      clavew: new FormControl(
        this.newEquipo.comunicaciones.confWifi["clave"],
        []
      ),
      puertos: new FormControl(this.newEquipo.comunicaciones.confPuertos, []),
      confirmar: new FormControl(this.newEquipo.comunicaciones.confPuertos, [
        Validators.required
      ]),
      tEquipo: new FormControl(this.newEquipo.tipo, [Validators.required])
    });
  }

  // Inicializacion de servicio Firebase, instancia de formularios,
  //obtener clientes para validacion de existencia y consecutivo.
  clientesFire: any;
  nextFire: any;
  newEquipoListo: boolean = false;
  constructor(
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder
  ) {
    firebaseService
      .getCliente()
      .valueChanges()
      .subscribe(clientes => {
        this.clientesFire = clientes;
        firebaseService.ordenanzaNombre(this.clientesFire);
      });
    firebaseService
      .getNext(this.newEquipo.doc)
      .valueChanges()
      .subscribe(next => {
        this.nextFire = next;
        console.log(this.nextFire);
        //verificar Consecutivo vacio desde el servicio y lo crea
        if (this.nextFire == 0) {
          this.nextFire = {
            doc: this.newEquipo.doc,
            next: 0
          };
          console.log(this.nextFire);
          console.log(this.nextFire.next);
          this.firebaseService.setNext(this.nextFire);
        }
      });
  }
  ngOnInit() {
    this.buildForm();
    this.radioGroupForm = this.formBuilder.group({
      model: true
    });
    console.log(this.newEquipo);
  }

  // **************** ------------------------------------********************************
  //
  // cambia nombre de cliente por su id, y guarda en Firebase.
  guardarEquipo() {
    this.encontrarId();
    setTimeout(() => {
      this.newEquipoListo = false;
      this.onReset();
    }, 5000);
  }

  // Funcion para asignar consecutivo de equipo creado, guardar el equipo e ingrementar consecutivo en firebase.
  nextEquipo() {
    setTimeout(() => {
      this.newEquipoListo = true;
      let Incrementar = this.nextFire[1] + 1;
      this.newEquipo.id = Incrementar;

      let newNext = {
        doc: this.newEquipo.doc,
        next: Incrementar
      };
      console.log(newNext);
      this.firebaseService.guardarEquipo(this.newEquipo);
      this.firebaseService.setNext(newNext);
    }, 100);
  }

  onReset() {
    this.formEquipo.reset();
    //this.frmAddLicencia.reset();
  }
  // asignar o remover software a un equipo.
  newLicencia = {
    tipo: null,
    activa: null,
    serial: null,
    nota: null
  };
  addLicencia() {
    if (
      this.newEquipo.software.length == 1 &&
      !this.newEquipo.software[0].tipo
    ) {
      this.newEquipo.software[0].tipo = this.newLicencia.tipo;
      this.newEquipo.software[0].activa = this.newLicencia.activa;
      this.newEquipo.software[0].serial = this.newLicencia.serial;
      this.newEquipo.software[0].nota = this.newLicencia.nota;
      this.newLicencia = {
        tipo: null,
        activa: null,
        serial: null,
        nota: null
      };
    } else {
      this.newEquipo.software.push(this.newLicencia);
      this.newLicencia = {
        tipo: null,
        activa: null,
        serial: null,
        nota: null
      };
    }
  }
  removeLic() {
    if (this.newEquipo.software.length == 1) {
      this.newEquipo.software[0].tipo = null;
      this.newEquipo.software[0].activa = null;
      this.newEquipo.software[0].serial = null;
      this.newEquipo.software[0].nota = null;
      this.newLicencia = {
        tipo: null,
        activa: null,
        serial: null,
        nota: null
      };
    } else {
      this.newEquipo.software.pop();
    }
  }
  // cambia nombre de cliente por su Id, en la variable a enviar a Firebase.
  encontrarId() {
    let cliente = this.newEquipo.cliente;
    this.clientesFire.forEach(nombre => {
      if (nombre.nombre == cliente) {
        cliente = nombre.id;
        this.newEquipo.cliente = cliente;
      }
    });
    this.nextEquipo();
  }
  // tslint:disable-next-line: member-ordering
  tipoEquipos: any = {
    comunicaciones: ["modem", "Router", "AP", "Swich"],
    equipos: ["Pc", "Portatil", "Impresora", "DVR"]
  };
}
