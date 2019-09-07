import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"]
})
export class MenuComponent implements OnInit {
  userFireAuth: any;
  public userFire: any;
  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

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
  ngOnInit() {
    this.authenticationService.getStatus().subscribe(user => {
      this.userFireAuth = user;
      console.log(this.userFireAuth);

      this.firebaseService
        .getUserUid(this.userFireAuth.uid)
        .valueChanges()
        .subscribe(usuario => {
          this.userFire = usuario;
          console.log(this.userFire);
        });
    });
  }
}
