import { Component, OnInit } from "@angular/core";
import { Equipo } from "../interfaces/equipo";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  constructor(
    private autheticationServices: AuthenticationService,
    private router: Router
  ) {
    autheticationServices.getStatus().subscribe(status => {
      if (!status) {
        this.router.navigate(["login"]);
      }
    });
  }

  ngOnInit() {}
}
