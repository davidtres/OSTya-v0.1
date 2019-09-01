import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Orden } from "../interfaces/orden";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-orden",
  templateUrl: "./orden.component.html",
  styleUrls: ["./orden.component.css"]
})
export class OrdenComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  usuariosfire: any; //almacena usuarios obtenidos de firebase
  clientesfire: any; //almacena clientes obtenidos de firebase
  consecutivofire: any; //almacena clientes obtenidos de firebase
  id: any = null; //para capturar parametro
  guardando: boolean = false;
  existe = false;
  NewOrden: boolean = false;

  // varible para interactuar con campos del HTML (Interfaces)
  orden: Orden = {
    id: 0,
    cliente: "",
    fechaSolicitud: new Date(Date.now()),
    tecnicoAsignado: "1. POR ASIGNAR",
    tipo: "",
    equipo: "",
    solicitud: "",
    nota: "",
    estado: "Creado",
    cerrada: false,
    triage: 0,
    enTriage: true,
    doc: "orden",
    modificador: "new",
    idCliente: 0
  };

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    let dataTserv = {
      doc: "tServ"
    };
    //obtener tipos de servicios
    firebaseService
      .getPorDoc(dataTserv)
      .valueChanges()
      .subscribe(tserv => {
        this.tipoOrden = tserv;
        // console.log(estados);
      });
    //Se guardan los clientes obtenidos de firebase
    firebaseService
      .getCliente()
      .valueChanges()
      .subscribe(clientes => {
        this.clientesfire = clientes;
        firebaseService.ordenanzaNombre(this.clientesfire);
      });

    //Se guardan los usuarios obtenidos de firebase
    firebaseService
      .getUsuarios()
      .valueChanges()
      .subscribe(usuarios => {
        this.usuariosfire = usuarios;
      });

    //Se obtiene ultimo consecutivo de orden.
    firebaseService
      .getNext(this.orden.doc)
      .valueChanges()
      .subscribe(next => {
        this.consecutivofire = next;
        console.log(this.consecutivofire);
        //verificar Consecutivo vacio desde el servicio y lo crea
        if (this.consecutivofire == 0) {
          this.consecutivofire = {
            doc: this.orden.doc,
            next: 0
          };
          // console.log(this.consecutivofire);
          this.firebaseService.setNext(this.consecutivofire);
        }
      });
    //Se captura parametro de la URl
    this.id = this.route.snapshot.params["id"];

    // Condicional para saber si el cliente es new o trae ID en el paramtro
    if (this.id != "new") {
      firebaseService
        .obtenerUsuario(this.id)
        .valueChanges()
        .subscribe(usuario => {
          this.usuariosfire = usuario;
          //console.log(this.clienteObtenido);
          //this.cliente = this.clienteObtenido
          // this.orden = this.usuariosfire;
          this.orden.modificador = "act";
        });
    } else {
      this.orden.id = this.id;
      console.log(this.orden.id);
    }
  }
  ngOnInit() {
    this.buildForm();
  }

  // constructor del formulario
  private buildForm() {
    this.formGroup = new FormGroup({
      cliente: new FormControl(this.orden.cliente, [Validators.required]),
      tiposerv: new FormControl(this.orden.tipo, [Validators.required]),
      servicio: new FormControl(this.orden.solicitud, [
        Validators.required,
        Validators.minLength(10)
      ]),
      comentarios: new FormControl(this.orden.nota, [Validators.minLength(7)]),
      triage: new FormControl(this.orden.triage, [Validators.min(1)])
    });
  }
  update: any;
  // funcion del boton "Crear Usuario"
  guardarOrden() {
    this.guardando = true;
    //Asignacion de fecha de creacion del la orden
    this.asignarFecha();
    //Si es nuevo, incrementa ID y se lo asigna
    if (this.orden.modificador == "new") {
      this.orden.id = this.consecutivofire[1] + 1;
    }
    //llamado funcion de guardar en firebase, con dos parametros (dato y consecutivo)
    this.firebaseService.guardarPorId(this.orden, this.consecutivofire);

    //tiempo para guardado en firebase, reseteear formulario y regregar al listado de estados.
    setTimeout(() => {
      let startAgenda = new Date(this.orden.fechaSolicitud);
      console.log(startAgenda.toDateString());
      this.update = {
        update:
          "Orden Creada el dia : " +
          startAgenda.toUTCString() +
          ", por el usuario: LOGUEADO",
        estado: this.orden.estado,
        usuario: "Sistema",
        orden: this.orden.id,
        fecha: Date.now()
      };
      this.firebaseService.guardarUpdates(this.update);
      this.guardando = false;
      this.onReset();
      this.ruta.navigate(["/programacion/" + this.orden.id]);
    }, 3000);
  }
  // Borrar el formulario
  onReset() {
    this.formGroup.reset();
  }
  setIdCliente() {
    for (let i = 0; i < this.clientesfire.length; i++) {
      if (this.clientesfire[i].nombre == this.orden.cliente) {
        this.orden.idCliente = this.clientesfire[i].id;
      }
    }
    console.log(this.orden.idCliente);
  }

  // Validacion si el cliente existe.
  validarUsuario() {
    const resultado = this.usuariosfire.find(user => user.id === this.orden.id);
    if (resultado == undefined) {
      this.existe = false;
    } else {
      this.existe = true;
      setTimeout(() => {
        this.existe = false;
        // this.orden = null;
      }, 3000);
    }
  }
  asignarFecha() {
    let fechaHoy: any;
    fechaHoy = Date.now();
    this.orden.fechaSolicitud = fechaHoy;
    //return console.log(this.cliente.fechaCreacion);
  }

  tipoOrden: any;
}
