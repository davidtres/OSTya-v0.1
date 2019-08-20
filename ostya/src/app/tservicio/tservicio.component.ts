import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-tservicio",
  templateUrl: "./tservicio.component.html",
  styleUrls: ["./tservicio.component.css"]
})
export class TservicioComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  usuariosfire: any; //almacena usuario obtenidos de firebase
  nextFire: any; // guarda actual consecutivo en firebase
  Guardando: boolean;
  // inicializacion varible para interactuar con campos del HTML (Interfaces)
  tServ: any = {
    id: 0,
    nombre: "",
    visita: false,
    doc: "tServ",
    modificador: "new"
  };
  id: any = null; //para capturar parametro de la URL
  tServObtenido: any; //se guarda estado filtrado por el parametro para edicion
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {
    //Se captura parametro de la URl y se almacena en variable
    this.id = this.route.snapshot.params["id"];
    this.tServ.id = this.id;

    // Condicional para saber si el cliente es new o trae ID en el paramtro
    if (this.id != "new") {
      firebaseService
        .obtenerUnoId(this.tServ)
        .valueChanges()
        .subscribe(estado => {
          this.tServObtenido = estado;
          //console.log(this.clienteObtenido);
          //this.cliente = this.clienteObtenido
          this.tServ = this.tServObtenido;
          this.tServ.modificador = "act";
        });
    }
    firebaseService
      .getNext(this.tServ.doc)
      .valueChanges()
      .subscribe(next => {
        this.nextFire = next;
        //verificar Consecutivo vacio, crea objeto consecutivo 0 y guarda en firebase
        if (this.nextFire == 0) {
          this.nextFire = {
            doc: this.tServ.doc,
            next: 0
          };
          this.firebaseService.setNext(this.nextFire);
        }
      });
  }
  ngOnInit() {
    this.buildForm();
  }
  // constructor del formulario
  private buildForm() {
    this.formGroup = new FormGroup({
      Nombre: new FormControl(this.tServ.nombre, [
        Validators.required,
        Validators.minLength(3)
      ]),
      Visita: new FormControl(this.tServ.visita, [])
    });
  }
  // funcion del boton "Guardar"
  existe = false;
  guardartServ() {
    //NewCliente verdadero para enviar alert de creacion en html
    this.Guardando = true;
    //Si es nuevo, incrementa ID y se lo asigna
    if (this.tServ.modificador == "new") {
      this.tServ.id = this.nextFire[1] + 1;
    }
    //llamado funcion de guardar en firebase, con dos parametros (dato y consecutivo)
    this.firebaseService.guardarPorId(this.tServ, this.nextFire);

    //tiempo para guardado en firebase, reseteear formulario y regregar al listado de estados.
    setTimeout(() => {
      this.Guardando = false;
      this.onReset();
      this.ruta.navigate(["/listar-tservicio"]);
    }, 3000);
  }
  onReset() {
    this.formGroup.reset();
  }
}
