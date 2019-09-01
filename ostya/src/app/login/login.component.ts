import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { database } from "firebase";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email: string = null;
  password: string = null;
  constructor(private authenticationService: AuthenticationService) {}

  login() {
    this.authenticationService
      .loginWithEmail(this.email, this.password)
      .then(data => {
        alert("Loggueado correctamente");
        console.log(data);
      })
      .catch(error => {
        alert("Ha ocurrido un error: .\n" + error.message);
        console.log(error);
      });
  }

  register() {
    this.authenticationService
      .registerWithEmail(this.email, this.password)
      .then(data => {
        alert("REgistrado correctamente");
        console.log(data);
      })
      .catch(error => {
        alert("Ha ocurrido un error");
        console.log(error);
      });
  }
  ngOnInit() {}
}
