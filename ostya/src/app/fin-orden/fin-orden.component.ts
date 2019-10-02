import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FirebaseService } from "../services/firebase.service";
import { Router } from "@angular/router";
import { ToolsService } from "../services/tools.service";

@Component({
  selector: "app-fin-orden",
  templateUrl: "./fin-orden.component.html",
  styleUrls: ["./fin-orden.component.css"]
})
export class FinOrdenComponent implements OnInit {
  @Input() OrdenFire;
  ordenFire;
  formGroup: FormGroup;
  update: any = {
    nota: "",
    estado: "",
    usuario: "",
    orden: null,
    factura: null,
    valor: null,
    fecha: Date.now()
  };
  spinner: boolean;
  constructor(
    private firebaseService: FirebaseService,
    private ruta: Router,
    private tools: ToolsService
  ) {}
  guardarUpdates() {
    if (this.update.estado == "Facturado" && this.update.valor == 0) {
      alert("Debe ingresar un valor");
    } else {
      if (confirm("¿Desea actualizar la orden ?")) {
        this.spinner = true;
        this.notaFactura();
        this.ordenFire.estado = this.update.estado;
        this.ordenFire.factura = this.update.factura;
        this.ordenFire.valor = this.update.valor;
        this.ordenFire.nota = this.update.nota;
        this.ordenFire.facturada = true;
        this.ordenFire.cerrada = true;
        this.firebaseService.ActOrdenEstado(this.ordenFire).then(() => {
          setTimeout(() => {
            this.spinner = false;
            this.ruta.navigate(["/home"]);
          }, 2000);
        });
      }
    }
  }
  notaFactura() {
    let fechaHoy = this.tools.convFechaHora(new Date(Date.now()));
    this.update.nota =
      fechaHoy +
      " - Orden es: " +
      this.update.estado +
      ", Factura N° " +
      this.update.factura +
      " por valor de: $ " +
      this.update.valor +
      " - " +
      this.update.nota;
  }

  ngOnInit() {
    setTimeout(() => {
      this.ordenFire = this.OrdenFire;
      console.log(this.ordenFire);
    }, 2000);

    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      factura: new FormControl(this.update.update, [Validators.required]),
      estado: new FormControl(this.update.estado, [Validators.required]),
      valor: new FormControl(this.update.estado, [Validators.required]),
      nota: new FormControl(this.update.estado, [])
    });
  }
}
