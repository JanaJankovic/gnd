import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: any = {
    fullname: '',
    email: '',
    password: '',
    image: 'assets/sys-icons/image-placeholder.svg',
  };

  icon = 0;

  constructor(private networkSerivce: NetworkService, private router: Router) {}

  ngOnInit(): void {
    let forecast: any = localStorage.getItem('forecast');
    forecast = forecast != undefined ? JSON.parse(forecast) : [];

    if (forecast != undefined && forecast != null && forecast.length > 0)
      this.icon = forecast[0].icon;
  }

  async onRegisterClick() {
    let response = await lastValueFrom(this.networkSerivce.register(this.user));
    if (response != undefined && response.error != undefined) {
      alert(response.error);
    }
    if (response != undefined && response.acknowledged != undefined) {
      this.router.navigate(['/login']);
    }
  }
}
