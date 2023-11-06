import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss'],
})
export class WeatherCardComponent {
  @Input()
  title: string = '';

  @Input()
  temp: number = 0;

  @Input()
  prec: number = 0;

  @Input()
  wind: number = 0;

  @Input()
  icon: number = 0;

  @Input()
  active: boolean = false;
}
