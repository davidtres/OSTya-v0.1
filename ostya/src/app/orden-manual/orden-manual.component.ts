import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Orden } from "../interfaces/orden";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-orden-manual",
  templateUrl: "./orden-manual.component.html",
  styleUrls: ["./orden-manual.component.css"]
})
export class OrdenManualComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  usuariosfire: any; //almacena usuarios obtenidos de firebase
  clientesfire: any; //almacena clientes obtenidos de firebase
  consecutivofire: any; //almacena clientes obtenidos de firebase
  id: any = null; //para capturar parametro
  guardando: boolean = false;
  existe = false;
  NewOrden: boolean = false;
  fechaIngreso;
  // varible para interactuar con campos del HTML (Interfaces)
  orden = {
    id: null,
    cliente: "",
    fechaSolicitud: null,
    tecnicoAsignado: "GST",
    tipo: "GST",
    equipo: "",
    solicitud: "",
    nota: "",
    estado: "GST",
    cerrada: true,
    triage: 0,
    enTriage: false,
    doc: "orden",
    modificador: "new",
    idCliente: 0,
    uid: "",
    Solucionador: "",
    sede: "",
    updates: {
      0: {
        estado: "GST",
        fecha: null,
        orden: null,
        update: "",
        usuario: "GST"
      }
    }
  };
  ordenFire: any;

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
        // console.log(this.consecutivofire);
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
    this.firebaseService
      .getOrdenesKey()
      .valueChanges()
      .subscribe(ordenes => {
        this.ordenFire = ordenes;
      });
  }
  convFecha() {
    this.orden.fechaSolicitud = Date.parse(this.fechaIngreso);
  }
  updateOrden() {
    this.orden.updates[0].fecha = this.orden.fechaSolicitud;
    this.orden.updates[0].orden = this.orden.id;
    this.orden.updates[0].update = this.update;
    console.log(this.orden);
  }
  validarId() {
    const resultado = this.ordenFire.find(orden => orden.id == this.orden.id);
    if (resultado == undefined) {
      this.existe = false;
    } else {
      this.existe = true;
      setTimeout(() => {
        this.existe = false;
        this.orden.id = null;
      }, 3000);
    }
  }

  // constructor del formulario
  private buildForm() {
    this.formGroup = new FormGroup({
      cliente: new FormControl(this.orden.cliente, [Validators.required]),
      Id: new FormControl(this.orden.id, [Validators.required]),
      fecha: new FormControl(this.orden.fechaSolicitud, [Validators.required]),
      update: new FormControl(this.update, [Validators.required]),
      // tiposerv: new FormControl(this.orden.tipo, [Validators.required]),
      servicio: new FormControl(this.orden.solicitud, [
        Validators.required,
        Validators.minLength(10)
      ]),
      comentarios: new FormControl(this.orden.nota, [Validators.minLength(7)])
      // triage: new FormControl(this.orden.triage, [Validators.min(1)])
    });
  }
  update: any;
  // funcion del boton "Crear Usuario"

  guardarOrden() {
    if (confirm("Confirmar guardar orden")) {
      this.firebaseService.guardarOrdenM(this.orden);
      this.formGroup.reset();
    }
  }
  // Borrar el formulario
  onReset() {
    this.formGroup.reset();
  }
  clienteSeleccionado: any[] = [];
  setIdCliente() {
    this.clienteSeleccionado = [];
    for (let i = 0; i < this.clientesfire.length; i++) {
      if (this.clientesfire[i].nombre == this.orden.cliente) {
        this.orden.idCliente = this.clientesfire[i].id;
        this.clienteSeleccionado.push(this.clientesfire[i]);
        console.log(this.clienteSeleccionado[0].direcciones);
      }
    }
    // console.log(this.orden.idCliente);
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
