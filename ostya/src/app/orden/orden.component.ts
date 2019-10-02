import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Orden } from "../interfaces/orden";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter
} from "rxjs/operators";
import { ComunicationService } from "../services/comunication.service";
import { DATE_PROPS } from "@fullcalendar/core/structs/event";

@Component({
  selector: "app-orden",
  templateUrl: "./orden.component.html",
  styleUrls: ["./orden.component.css"]
})
export class OrdenComponent implements OnInit {
  dateFire: any = this.firebaseService.dateFire;
  public formGroup: FormGroup; //variable para formulario
  usuariosfire: any; //almacena usuarios obtenidos de firebase
  tipoOrden: any;
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
    fechaSolicitud: this.dateFire,
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
    idCliente: 0,
    uid: "",
    Solucionador: "",
    sede: "",
    domicilio: null,
    factura: "0",
    valor: 0,
    facturada: false
  };
  clientes: any;
  userLogged: any;
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router,
    private comunication: ComunicationService
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
        this.clientes = this.clientesfire.map(cliente => {
          return cliente.nombre;
        });
        console.log(this.clientes);
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
    this.comunication.getUserLogeed.subscribe(user => {
      this.userLogged = user;
    });
  }
  domicilio() {
    this.tipoOrden.forEach(element => {
      if (element.nombre == this.orden.tipo) {
        if (element.visita == true) {
          this.orden.domicilio = true;
        } else {
          this.orden.domicilio = false;
        }
      }
      console.log(this.orden.domicilio);
    });
  }

  // constructor del formulario
  private buildForm() {
    this.formGroup = new FormGroup({
      cliente: new FormControl(this.orden.cliente, [Validators.required]),
      sede: new FormControl(this.orden.sede, [Validators.required]),
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
    // this.asignarFecha();
    //Si es nuevo, incrementa ID y se lo asigna
    if (this.orden.modificador == "new") {
      this.orden.id = this.consecutivofire[1] + 1;
    }
    //llamado funcion de guardar en firebase, con dos parametros (dato y consecutivo)
    this.firebaseService.guardarPorId(this.orden, this.consecutivofire);

    //tiempo para guardado en firebase, reseteear formulario e ir a "Programacion".
    setTimeout(() => {
      let startAgenda = new Date(Date.now());
      console.log(startAgenda.toDateString());
      this.update = {
        update:
          "Orden Creada el dia : " +
          startAgenda.toUTCString() +
          ", por el usuario: " +
          this.userLogged.nombre,
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
      }, 3000);
    }
  }
  // asignarFecha() {
  //   let fechaHoy: any;
  //   fechaHoy = Date.now();
  //   this.orden.fechaSolicitud = fechaHoy;
  // }
  // Filtro busqueda de cliente
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 3
          ? []
          : this.clientes
              .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );
}
