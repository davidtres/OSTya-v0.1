import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public formGroup: FormGroup; //variable para formulario
  email: string = null;
  password: string = null;
  static loginOk: boolean = true;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    authenticationService.getStatus().subscribe(user => {
      if (user) {
        this.router.navigate(["/home"]);
      }
    });
  }

  login() {
    this.authenticationService
      .loginWithEmail(this.email, this.password)
      .then(data => {
        this.router.navigate(["/home"]);
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
        alert("Registrado correctamente");
      })
      .catch(error => {
        alert("Ha ocurrido un error");
        console.log(error);
      });
  }
  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({
      email: new FormControl(this.email, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
      ]),
      clave: new FormControl(this.password, [Validators.required])
    });
  }
}
