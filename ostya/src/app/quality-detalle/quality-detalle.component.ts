import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-quality-detalle",
  templateUrl: "./quality-detalle.component.html",
  styleUrls: ["./quality-detalle.component.css"]
})
export class QualityDetalleComponent implements OnInit {
  id: any = null; //para capturar parametro
  quality: any[] = [];
  qualityFire: any;
  success: boolean;
  warning: boolean;
  danger: boolean;
  userFire: any[];
  listOrden: any[] = [];
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private ruta: Router
  ) {}
  qltParams: any;
  ngOnInit() {
    this.id = this.route.snapshot.params["id"];
    // this.user = this.route.snapshot.queryParams["user"];
    this.route.queryParamMap.subscribe(params => {
      this.qltParams = { ...params.keys, ...params };
    });

    this.firebaseService
      .getQuality(this.id)
      .valueChanges()
      .subscribe(quality => {
        this.qualityFire = quality;
        this.qualityFire.LLT.forEach(qlt => {
          if (!this.listOrden.includes(qlt.orden)) {
            this.listOrden.push(qlt.orden);
            this.listOrden.sort();
          }
        });
      });
  }
}
