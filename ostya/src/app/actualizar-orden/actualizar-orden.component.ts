import { Component, OnInit } from "@angular/core";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-actualizar-orden",
  templateUrl: "./actualizar-orden.component.html",
  styleUrls: ["./actualizar-orden.component.css"]
})
export class ActualizarOrdenComponent implements OnInit {
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  open(content) {
    console.log(content);

    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
}
