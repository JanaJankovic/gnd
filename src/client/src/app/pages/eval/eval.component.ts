import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import { NetworkService } from 'src/app/services/network.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-eval',
  templateUrl: './eval.component.html',
  styleUrls: ['./eval.component.scss'],
})
export class EvalComponent implements OnInit {
  @ViewChild('chartTemp')
  chartTemp?: ElementRef<HTMLCanvasElement>;

  @ViewChild('chartPrec')
  chartPrec?: ElementRef<HTMLCanvasElement>;

  @ViewChild('chartWind')
  chartWind?: ElementRef<HTMLCanvasElement>;

  data: any = undefined;

  constructor(
    private networkService: NetworkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  async getData() {
    this.spinner.show();
    this.data = await lastValueFrom(this.networkService.getEval());
    this.spinner.hide();

    console.log(this.chartTemp != undefined);
    if (this.data != undefined) {
      if (this.chartTemp != undefined) {
        this.getChart(this.chartTemp.nativeElement, this.data.temp);
      }

      if (this.chartPrec != undefined) {
        this.getChart(this.chartPrec.nativeElement, this.data.prec);
      }

      if (this.chartWind != undefined) {
        this.getChart(this.chartWind.nativeElement, this.data.wind);
      }
    }
  }

  async getChart(element: HTMLCanvasElement, data: any) {
    let mae: any = [];
    let mse: any = [];
    let evs: any = [];
    let date: any = [];

    data.forEach((e: any) => {
      mae.push(e.MAE);
      mse.push(e.MSE);
      evs.push(e.EVS);
      date.push(e.date);
    });

    new Chart(element, {
      type: 'line',
      data: {
        labels: date,
        datasets: [
          {
            label: 'MAE',
            data: mae,
          },
          {
            label: 'MSE',
            data: mse,
          },
          {
            label: 'EVS',
            data: evs,
          },
        ],
      },
    });
  }
}
