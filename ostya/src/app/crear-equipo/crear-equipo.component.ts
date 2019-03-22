import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Equipo } from '../interfaces/equipo';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbRadioGroup } from '@ng-bootstrap/ng-bootstrap';
import { Licencias } from '../interfaces/licencias';
import { PCS } from '../interfaces/ePcs';
import { eComunicacion } from '../interfaces/eComunicacion';

@Component({
  selector: 'app-crear-equipo',
  templateUrl: './crear-equipo.component.html',
  styleUrls: ['./crear-equipo.component.css']
})
export class CrearEquipoComponent implements OnInit {

// Inicializacion de variables de las interfaces
  newEquipo: PCS = {
    id: 1,
    cliente: null,
    tipo: null,
    garantia: null,
    doc: 'equipos',
    datos: {
      marca: null,
      modelo: null,
      serial: null,
      ubicacion: null,
      usuario: null,
      clave: null,
      ip: null,
      mac: null,
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
    software: [{
      tipo: null,
      activa: null,
      serial: null,
      nota: null
    }],
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
  private buildForm(){
    this.formEquipo = new FormGroup({
      cliente: new FormControl(this.newEquipo.cliente, [
        Validators.required
      ]),
      marca: new FormControl(this.newEquipo.datos['marca'], [
        Validators.required
      ]),
      modelo: new FormControl(this.newEquipo.datos['modelo'], [
        Validators.required
      ]),
      serial: new FormControl(this.newEquipo.datos['serial'], [
      ]),
      ubicacion: new FormControl(this.newEquipo.datos['ubicacion'], [
      ]),
      usuario: new FormControl(this.newEquipo.datos['usuario'], [
      ]),
      clave: new FormControl(this.newEquipo.datos['clave'], [
      ]),
      ip: new FormControl(this.newEquipo.datos['ip'], [
      ]),
      mac: new FormControl(this.newEquipo.datos['mac'], [
      ]),
      observaciones: new FormControl(this.newEquipo.observaciones, [
      ]),
      procesador: new FormControl(this.newEquipo.caractersiticas['procesador'], [
      ]),
      memoria: new FormControl(this.newEquipo.caractersiticas['memoria'], [
      ]),
      disco: new FormControl(this.newEquipo.caractersiticas['disco'], [
      ]),
      pantalla: new FormControl(this.newEquipo.caractersiticas['pantalla'], [
      ]),
      garantia: new FormControl(this.newEquipo.caractersiticas['garantia'], [
      ]),
      otros: new FormControl(this.newEquipo.caractersiticas['otros'], [
      ]),
      tipoLic: new FormControl(this.newEquipo.software['tipo'], [
      ]),
      activaLic: new FormControl(this.newEquipo.software['activa'], [
      ]),
      serialLic: new FormControl(this.newEquipo.software['serial'], [
      ]),
      notaLic: new FormControl(this.newEquipo.software['nota'], [
      ]),
      ipwan: new FormControl(this.newEquipo.comunicaciones.confWan['ipwan'], [
      ]),
      mascara: new FormControl(this.newEquipo.comunicaciones.confWan['mascara'], [
      ]),
      pEnlace: new FormControl(this.newEquipo.comunicaciones.confWan['pEnlace'], [
      ]),
      dns: new FormControl(this.newEquipo.comunicaciones.confWan['dns'], [
      ]),
      ssid: new FormControl(this.newEquipo.comunicaciones.confWifi['ssid'], [
      ]),
      clavew: new FormControl(this.newEquipo.comunicaciones.confWifi['clave'], [
      ]),
      puertos: new FormControl(this.newEquipo.comunicaciones.confPuertos, [
      ]),
    });
  }

// Inicializacion de servicio Firebase, instancia de formularios, obtener clientes para validacion de existencia y consecutivo.
  clientesFire: any;
  nextFire: any;

  constructor( private firebaseService: FirebaseService, private formBuilder: FormBuilder) {
    firebaseService.getCliente()
      .valueChanges().subscribe(clientes => {
        this.clientesFire = clientes;
      });
    firebaseService.getNext()
    .valueChanges().subscribe(next => {
      this.nextFire = next;
      console.log(this.nextFire);

    });
  }
  ngOnInit() {
    this.buildForm();
    this.radioGroupForm = this.formBuilder.group({
      'model': true
    });

  }

  // **************** ------------------------------------********************************
  //
  // cambia nombre de cliente por su id, y guarda en Firebase.
  guardarEquipo() {
    this.encontrarId();
    this.firebaseService.guardarEquipo(this.newEquipo);
  }
  nextEquipo() {
    setTimeout(() => {
      let Incrementar = this.nextFire[0].next + 1
      console.log(Incrementar);
      let newNext = {
        doc : this.newEquipo.doc,
        next: Incrementar
      };
     this.firebaseService.setNext(newNext);
    }, 500);


  }
// asignar o remover software a un equipo.
  newLicencia = {
    tipo: null,
    activa: null,
    serial: null,
    nota: null
  };
  cero: number = 0;
  addLicencia(){
    if (this.cero == 0) {
      this.cero++
      console.log('de primero' + this.cero);
      this.newEquipo.software.push(this.newLicencia)
      console.log(this.newLicencia);
      this.newLicencia = {
        tipo: null,
        activa: null,
        serial: null,
        nota: null
      }
    } else {
      this.cero++
      this.newEquipo.software.push(this.newLicencia)
      console.log('de segundo' + this.cero);
      console.log(this.newLicencia);
      this.newLicencia = {
        tipo: null,
        activa: null,
        serial: null,
        nota: null
      }
    }
  };
  removeLic(){
    if (this.cero == 0) {
      this.newEquipo.software[0].tipo = null;
      this.newEquipo.software[0].activa = null;
      this.newEquipo.software[0].serial = null;
      this.newEquipo.software[0].nota= null;
    } else {
      this.cero--;
      this.newEquipo.software.pop();
      console.log(this.newEquipo.software);
    }
  }
  // cambia nombre de cliente por su Id, en la variable a enviar a Firebase.
  encontrarId() {
    let cliente = this.newEquipo.cliente;
    this.clientesFire.forEach(nombre => {
      if (nombre.nombre == cliente) {
        cliente = nombre.id;
        console.log(cliente);
        this.newEquipo.cliente = cliente;
      }
    });
  }
}
