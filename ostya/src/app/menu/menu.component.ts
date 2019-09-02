import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"]
})
export class MenuComponent implements OnInit {
  userFireAuth: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    authenticationService.getStatus().subscribe(user => {
      this.userFireAuth = user;
    });
  }
  logout() {
    this.authenticationService
      .logOut()
      .then(() => {
        this.router.navigate(["login"]);
      })
      .catch(err => {
        console.log(err);
      });
  }
  ngOnInit() {}
}
