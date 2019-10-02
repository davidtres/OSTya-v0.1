import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Chart } from "chart.js";

@Component({
  selector: "app-actualizar-orden",
  templateUrl: "./actualizar-orden.component.html",
  styleUrls: ["./actualizar-orden.component.css"]
})
export class ActualizarOrdenComponent implements OnInit {
  @ViewChild("canvas") canvas: ElementRef<HTMLCanvasElement>;
  linechart = [];

  constructor() {}
  ngOnInit() {
    // ----------------------ESTRELLAS----------------------

    // total number of stars
    const starTotal = 5;

    // for (const rating in ratings) {
    //   const starPercentage = (ratings[rating] / starTotal) * 100;
    //   const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
    //   document.querySelector(
    //     `.${rating} .stars-inner`
    //   ).style.width = starPercentageRounded;
    // }
    // ---------------GRAFICO-------------------------------------
    let ctx = this.canvas.nativeElement.getContext("2d");
    let myChart = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: ["Oscar", "Oswaldo"],
        datasets: [
          {
            label: "CALIFICACION TECNICOS",
            data: [92, 79],
            backgroundColor: [
              "orange",
              "cyan"
              // "rgba(54, 162, 235, 0.2)",
              // "rgba(255, 206, 86, 0.2)",
              // "rgba(75, 192, 192, 0.2)",
              // "rgba(153, 102, 255, 0.2)",
              // "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)"
              // "rgba(255, 206, 86, 1)",
              // "rgba(75, 192, 192, 1)",
              // "rgba(153, 102, 255, 1)",
              // "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true
              },
              barPercentage: 1,
              categoryPercentage: 0.5,
              barThickness: 20,
              maxBarThickness: 40,
              minBarLength: 2,
              gridLines: {
                offsetGridLines: false
              }
            }
          ],
          xAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    });
  }
}
