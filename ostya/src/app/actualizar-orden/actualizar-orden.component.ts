import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "../services/firebase.service";
import { AuthenticationService } from "../services/authentication.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-actualizar-orden",
  templateUrl: "./actualizar-orden.component.html",
  styleUrls: ["./actualizar-orden.component.css"]
})
export class ActualizarOrdenComponent implements OnInit {
  constructor(
    private firebaseService: FirebaseService,
    private authenticationServices: AuthenticationService
  ) {
    this.burcarUsuario();

    authenticationServices.getStatus().pipe(
      map(estado => {
        if (estado) {
          alert("estadoooo");
        } else {
          alert("naranjas");
        }
        console.log(estado);
      })
    );
  }

  burcarUsuario() {
    this.firebaseService
      .getUserUid("s4gfjNUZMahpsHkf9UxHEobbynA2")
      .valueChanges()
      .subscribe(user => {
        console.log(user);
      });
  }
  ngOnInit() {}
}
