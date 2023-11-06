import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: any = {
    email: '',
    password: '',
  };

  icon = 0;

  constructor(
    private networkSerivce: NetworkService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let forecast: any = localStorage.getItem('forecast');
    forecast = forecast != undefined ? JSON.parse(forecast) : [];

    if (forecast != undefined && forecast != null && forecast.length > 0)
      this.icon = forecast[0].icon;
  }

  async onLoginClick() {
    let response = await lastValueFrom(this.networkSerivce.login(this.user));
    if (response != undefined && response.error != undefined) {
      alert(response.error);
    }
    if (response != undefined && response._id != undefined) {
      this.eventService.loginEvent(response);
      this.router.navigate(['/']);
    }
  }
}
