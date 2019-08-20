import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Empleado } from "../interfaces/empleado";
import { Router, ActivatedRoute } from "@angular/router";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-crear-usuario",
  templateUrl: "./crear-usuario.component.html",
  styleUrls: ["./crear-usuario.component.css"]
})
export class CrearUsuarioComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  usuariosfire: any; //almacena usuario obtenidos de firebase
  // varible para interactuar con campos del HTML (Interfaces)
  empleado: Empleado = {
    id: 0,
    nombre: "",
    correo: "",
    password: "",
    direcciones: [],
    telefono: 0,
    celular: 0,
    fechaCreacion: new Date(Date.now()),
    coordenadas: [0, 0],
    activo: true,
    permisos: [],
    rol: "",
    foto: "",
    color: "",
    iniciales: ""
  };
  id: any = null; //para capturar parametro
  usuarioObtenido: any; //se guarda cliente filtrado por el paramtro
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    //Se guardan los clientes obtenidos de firebase
    firebaseService
      .getUsuarios()
      .valueChanges()
      .subscribe(usuarios => {
        this.usuariosfire = usuarios;
      });
    //Se captura parametro de la URl
    this.id = this.route.snapshot.params["id"];
    // Condicional para saber si el cliente es new o trae ID en el paramtro
    if (this.id != "new") {
      firebaseService
        .obtenerUsuario(this.id)
        .valueChanges()
        .subscribe(usuario => {
          this.usuarioObtenido = usuario;
          //console.log(this.clienteObtenido);
          //this.cliente = this.clienteObtenido
          this.empleado = this.usuarioObtenido;
          this.obtenerIniciales();
        });
    }
  }
  ngOnInit() {
    this.buildForm();
  }

  // constructor del formulario
  private buildForm() {
    this.formGroup = new FormGroup({
      Id: new FormControl(this.empleado.id, [Validators.required]),
      Nombre: new FormControl(this.empleado.nombre, [
        Validators.required,
        Validators.minLength(3)
      ]),
      Correo: new FormControl(this.empleado.correo, [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
      ]),
      Dir: new FormControl(this.empleado.direcciones, [Validators.required]),
      Cel: new FormControl(this.empleado.celular, [
        Validators.required,
        Validators.minLength(10)
      ]),
      Tel: new FormControl(this.empleado.celular, [Validators.minLength(7)]),
      Lat: new FormControl(this.empleado.coordenadas[0], []),
      Long: new FormControl(this.empleado.coordenadas[1], []),
      Activo: new FormControl(this.empleado.activo, []),
      Color: new FormControl(this.empleado.color, []),
      fecha: new FormControl(this.empleado.fechaCreacion, [Validators.required])
    });
  }
  // funcion del boton "Crear Usuario"
  guardarUsuario() {
    //Asignacion de fecha de creacion del cliente
    this.asignarFecha();
    // llamado al metodo "guardarCliente del servicio para comunicacion con firebase"
    this.firebaseService.guardarUsuario(this.empleado);
    //NewCliente verdadero para enviar alert de creacion en html
    this.NewUsuario = true;
    //tiempo para guardado en firebase, reseteear formulario y regregar al listado de clientes.
    setTimeout(() => {
      this.NewUsuario = false;
      this.onReset();
      this.ruta.navigate(["/listar-usuarios"]);
    }, 3000);
  }
  // Borrar el formulario
  onReset() {
    this.formGroup.reset();
  }

  existe = false;
  NewUsuario: boolean = false;

  // Validacion si el cliente existe.
  validarUsuario() {
    const resultado = this.usuariosfire.find(
      user => user.id === this.empleado.id
    );
    if (resultado == undefined) {
      this.existe = false;
    } else {
      this.existe = true;
      setTimeout(() => {
        this.existe = false;
        this.empleado.id = null;
      }, 3000);
    }
  }
  asignarFecha() {
    let fechaHoy: any;
    fechaHoy = Date.now();
    this.empleado.fechaCreacion = fechaHoy;
    //return console.log(this.cliente.fechaCreacion);
  }
  obtenerIniciales() {
    this.empleado.iniciales = "";
    let separador = " ", // un espacio en blanco
      arregloDeSubCadenas = this.empleado.nombre.split(separador); // SEPARA EL NOMBRE EN CADENAS INDIVIDUALES
    // IMPRIME LA PRIMERA LETRA DE CADA CADENA
    for (let i = 0; i < arregloDeSubCadenas.length; i++) {
      if (i <= 1) {
        this.empleado.iniciales += arregloDeSubCadenas[i].substring(0, 1);
      } else {
        return;
      }
    }
  }
}
