import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { Cliente } from "../interfaces/cliente";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { database } from "firebase";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-crear-cliente",
  templateUrl: "./crear-cliente.component.html",
  styleUrls: ["./crear-cliente.component.css"]
})
export class CrearClienteComponent implements OnInit {
  // Variable contiene formulario HTML
  public formGroup: FormGroup;

  // varible para interactuar con campos del HTML (Interfaces)
  cliente: Cliente = {
    id: null,
    nombre: "",
    correo: "",
    password: "",
    direcciones: [],
    telefono: null,
    celular: 0,
    fechaCreacion: new Date(Date.now()),
    contacto: "",
    coordenadas: [0, 0],
    tipo: "",
    lastBuy: null,
    activo: true,
    acceder: false
  };
  tPersona: any = [
    { tipo: "P. Natural" },
    { tipo: "P. Juridica" },
    { tipo: "Cualquier otra" }
  ];

  static creado: any;
  static NewClietne: any;
  clientesfire: any; //almacena listado de clientes get_fire
  id: any = null; //para capturar parametro
  clienteObtenido: any; //se guarda cliente filtrado por el paramtro

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    //Se guardan los clientes obtenidos de firebase
    firebaseService
      .getCliente()
      .valueChanges()
      .subscribe(clientes => {
        this.clientesfire = clientes;
      });
    //Se captura parametro de la URl
    this.id = this.route.snapshot.params["id"];
    // Condicional para saber si el cliente es new o trae ID en el paramtro
    if (this.id != "new") {
      firebaseService
        .obtenerCliente(this.id)
        .valueChanges()
        .subscribe(cliente => {
          this.clienteObtenido = cliente;
          //console.log(this.clienteObtenido);
          //this.cliente = this.clienteObtenido
          this.cliente = this.clienteObtenido;
        });
    }
  }

  ngOnInit() {
    this.buildForm(); //inicializa contructor del formulario
  }
  // constructor del formulario + validaciones
  private buildForm() {
    this.formGroup = new FormGroup({
      Id: new FormControl(this.cliente.id, [Validators.required]),
      Nombre: new FormControl(this.cliente.nombre, [
        Validators.required,
        Validators.minLength(3)
      ]),
      Correo: new FormControl(this.cliente.correo, [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
      ]),
      Dir: new FormControl(this.cliente.direcciones, [Validators.required]),
      Cel: new FormControl(this.cliente.celular, [
        Validators.required,
        Validators.minLength(10)
      ]),
      Tel: new FormControl(this.cliente.celular, [Validators.minLength(7)]),
      Contact: new FormControl(this.cliente.contacto, []),
      Tipo: new FormControl(this.cliente.tipo, [Validators.required]),
      Lat: new FormControl(this.cliente.coordenadas[0], []),
      Long: new FormControl(this.cliente.coordenadas[1], []),
      Acceso: new FormControl(this.cliente.acceder, []),
      fecha: new FormControl(this.cliente.fechaCreacion, [Validators.required])
    });
  }

  // funcion del boton "Crear cliente"
  guardarCliente() {
    //Asignacion de fecha de creacion del cliente
    this.asignarFecha();
    // llamado al metodo "guardarCliente del servicio para comunicacion con firebase"
    this.firebaseService.guardarCliente(this.cliente);
    //NewCliente verdadero para enviar alert de creacion en html
    this.NewCliente = true;
    //tiempo para guardado en firebase, reseteear formulario y regregar al listado de clientes.
    setTimeout(() => {
      this.NewCliente = false;
      this.onReset();
      this.ruta.navigate(["/listar-cliente"]);
    }, 3000);
  }

  // Borrar el formulario
  onReset() {
    this.formGroup.reset();
  }

  existe = false;
  NewCliente: boolean = false;

  // Validacion si el cliente existe.
  validarCliente() {
    const resultado = this.clientesfire.find(
      client => client.id === this.cliente.id
    );
    if (resultado == undefined) {
      this.existe = false;
    } else {
      this.existe = true;
      setTimeout(() => {
        this.existe = false;
        this.cliente.id = null;
      }, 3000);
    }
  }
  asignarFecha() {
    let fechaHoy: any;
    fechaHoy = Date.now();
    this.cliente.fechaCreacion = fechaHoy;
    //return console.log(this.cliente.fechaCreacion);
  }
}
