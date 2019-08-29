import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { switchMap, map, debounceTime, filter } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-agenda-pr",
  templateUrl: "./agenda-pr.component.html",
  styleUrls: ["./agenda-pr.component.css"]
})
export class AgendaPrComponent implements OnInit {
  results: Observable<any>;
  private searchField: FormControl;
  formGroup: FormGroup;
  direccion: any;
  constructor(private http: HttpClient) {
    const URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    const apiKey = "key=AIzaSyAorrP1RL6rUh3NI1dEHYIxUUmhjaVWbfc";
    this.searchField = new FormControl();
    this.results = this.searchField.valueChanges.pipe(
      filter(text => text.length > 2),
      debounceTime(500),
      switchMap(q => this.http.get<any>(`${URL}${q}&${apiKey}`)),
      map(res => res.results)
    );
  }

  ngOnInit() {
    this.buildForm(); //inicializa contructor del formulario
  }
  // constructor del formulario + validaciones
  private buildForm() {
    this.formGroup = new FormGroup({
      Direccion: new FormControl(this.direccion, [
        Validators.required,
        Validators.minLength(7)
      ])
    });
  }
}
