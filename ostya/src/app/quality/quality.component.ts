import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-quality",
  templateUrl: "./quality.component.html",
  styleUrls: ["./quality.component.css"]
})
export class QualityComponent implements OnInit {
  quality: any[] = [];
  qualityFire: any;
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
    this.qualityFire.forEach((qlt: any, i) => {
      this.userFire.forEach(user => {
        if (user.id == qlt.userId) {
          let calLLT = this.qualityFire
            .filter(q => {
              return q.userId == qlt.userId;
            })
            .map(cal => {
              return cal.LLT;
            })
            .reduce(function(accumulator, currentValue) {
              return accumulator.concat(currentValue);
            })
            .map(cal2 => {
              return cal2.calif;
            });

          let calRES = this.qualityFire
            .filter(q => {
              return q.userId == qlt.userId;
            })
            .map(cal => {
              return cal.RES;
            })
            .reduce(function(accumulator, currentValue) {
              return accumulator.concat(currentValue);
            })
            .map(cal2 => {
              return cal2.calif;
            });
          let calRSS = this.qualityFire
            .filter(q => {
              return q.userId == qlt.userId;
            })
            .map(cal => {
              return cal.RSS;
            })
            .reduce(function(accumulator, currentValue) {
              return accumulator.concat(currentValue);
            })
            .map(cal2 => {
              return cal2.calif;
            });
          const reducer = (accumulator, currentValue) =>
            accumulator + currentValue;
          let qLlt = (calLLT.reduce(reducer) / qlt.LLT.length) * 0.5 * 100;
          let qRss = (calRSS.reduce(reducer) / qlt.RSS.length) * 0.3 * 100;
          let qRes = (calRES.reduce(reducer) / qlt.RES.length) * 0.2 * 100;
          let qltUser = {
            userId: user.id,
            user: user.nombre,
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
    console.log(this.quality);
  }
}
