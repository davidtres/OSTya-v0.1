import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"]
})
export class MenuComponent implements OnInit {
  @ViewChild("a") imgElement: ElementRef;

  tg() {
    console.log(this.imgElement.nativeElement);
  }
  constructor() {}

  ngOnInit() {}
}
