import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-quality",
  templateUrl: "./quality.component.html",
  styleUrls: ["./quality.component.css"]
})
export class QualityComponent implements OnInit {
  quality: any[] = [];
  qualityFire: any[];
  success: boolean;
  warning: boolean;
  danger: boolean;
  userFire: any[];
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService
      .getUusariosActivos()
      .valueChanges()
      .subscribe(users => {
        this.userFire = users;
        console.log(this.userFire);
        this.firebaseService
          .getQualityAll()
          .valueChanges()
          .subscribe(quality => {
            this.qualityFire = quality;
            this.loadQuality();
          });
      });
  }

  loadQuality() {
    this.quality = [];
    this.qualityFire.forEach((qlt: any, q) => {
      this.userFire.forEach((user, u) => {
        if (user.id == qlt.userId) {
          const reducer = (accumulator, currentValue) =>
            accumulator + currentValue;
          let qLlt = (qlt.LLT.reduce(reducer) / qlt.LLT.length) * 0.5 * 100;
          let qRss = (qlt.RSS.reduce(reducer) / qlt.RSS.length) * 0.3 * 100;
          let qRes = (qlt.RES.reduce(reducer) / qlt.RES.length) * 0.2 * 100;
          let qltUser = {
            User: user.iniciales,
            Color: user.color,
            LLT: Math.trunc(qLlt) + "%",
            RES: Math.trunc(qRes) + "%",
            RSS: Math.trunc(qRss) + "%",
            TTL: Math.trunc(qLlt) + Math.trunc(qRss) + Math.trunc(qRes) + "%",
            TST:
              (Math.trunc(qLlt) + Math.trunc(qRss) + Math.trunc(qRes)) / 10 / 2
          };
          this.quality.push(qltUser);
          this.quality.sort(function(a, b) {
            return b.TST - a.TST;
          });
        }
      });
    });
  }
}
