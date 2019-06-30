import { Component, OnInit } from "@angular/core";
import { Equipo } from "../interfaces/equipo";
import { UsuarioPlat } from "../interfaces/user-platzinger";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  friends: UsuarioPlat[];
  constructor() {}

  ngOnInit() {}
}
