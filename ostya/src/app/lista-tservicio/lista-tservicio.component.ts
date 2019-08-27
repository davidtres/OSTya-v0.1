import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-lista-tservicio",
  templateUrl: "./lista-tservicio.component.html",
  styleUrls: ["./lista-tservicio.component.css"]
})
export class ListaTservicioComponent implements OnInit {
  data = {
    doc: "tServ"
  };
  tServfire: any;
  constructor(private firebaseService: FirebaseService) {
    firebaseService
      .getPorDoc(this.data)
      .valueChanges()
      .subscribe(tserv => {
        this.tServfire = tserv;
        // console.log(estados);
      });
  }

  ngOnInit() {}
}
