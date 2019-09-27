import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Estados } from "../interfaces/estados";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-estado",
  templateUrl: "./estado.component.html",
  styleUrls: ["./estado.component.css"]
})
export class EstadoComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  userFire: any; //almacena usuario obtenidos de firebase
  nextFire: any; // guarda actual consecutivo en firebase
  Guardando: boolean;
  // inicializacion varible para interactuar con campos del HTML (Interfaces)
  estado: Estados = {
    id: 0,
    nombre: "",
    finOrden: false,
    doc: "estados",
    modificador: "new",
    asignado: "",
    solucionado: false
  };
  id: any = null; //para capturar parametro de la URL
  estadoObtenido: any; //se guarda estado filtrado por el parametro para edicion

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    //Se captura parametro de la URl y se almacena en variable
    this.id = this.route.snapshot.params["id"];
    this.estado.id = this.id;

    // Condicional para saber si el cliente es new o trae ID en el paramtro
    if (this.id != "new") {
      this.firebaseService
        .obtenerUnoId(this.estado)
        .valueChanges()
        .subscribe(estado => {
          this.estadoObtenido = estado;
          //console.log(this.clienteObtenido);
          this.estado = this.estadoObtenido;
          this.estado.modificador = "act";
        });
    }
  }

  ngOnInit() {
    this.firebaseService
      .getUusariosActivos()
      .valueChanges()
      .subscribe(usuarios => {
        this.userFire = usuarios;
        console.log(this.userFire);
      });
    this.firebaseService
      .getNext(this.estado.doc)
      .valueChanges()
      .subscribe(next => {
        this.nextFire = next;
        //verificar Consecutivo vacio, crea objeto consecutivo 0 y guarda en firebase
        if (this.nextFire == 0) {
          this.nextFire = {
            doc: this.estado.doc,
            next: 0
          };
          this.firebaseService.setNext(this.nextFire);
        }
      });

    this.buildForm();
  }
  // constructor del formulario
  private buildForm() {
    this.formGroup = new FormGroup({
      Nombre: new FormControl(this.estado.nombre, [
        Validators.required,
        Validators.minLength(3)
      ]),
      Cierra: new FormControl(this.estado.finOrden, []),
      Solucionado: new FormControl(this.estado.solucionado, []),
      Asignado: new FormControl(this.estado.asignado, [Validators.required])
    });
  }
  // funcion del boton "Guardar"
  guardarEstado() {
    this.estado.nombre = this.estado.nombre.trim();
    //Guardando verdadero para enviar alert de creacion en html
    this.Guardando = true;
    //Si es nuevo, incrementa ID y se lo asigna
    if (this.estado.modificador == "new") {
      this.estado.id = this.nextFire[1] + 1;
    }
    //llamado funcion de guardar en firebase, con dos parametros (dato y consecutivo)
    this.firebaseService.guardarPorId(this.estado, this.nextFire);

    //tiempo para guardado en firebase, reseteear formulario y regregar al listado de estados.
    setTimeout(() => {
      this.Guardando = false;
      this.onReset();
      this.ruta.navigate(["/listado-estados"]);
    }, 3000);
  }
  onReset() {
    this.formGroup.reset();
  }

  existe = false;
}
