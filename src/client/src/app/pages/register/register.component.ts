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
    year: 2000,
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
    console.log(this.user.year);
    if (this.isNotValid()) {
      alert('Fill out all inputs');
      return;
    }
    if (!this.validateYear()) return;

    let response = await lastValueFrom(this.networkSerivce.register(this.user));
    if (response != undefined && response.error != undefined) {
      alert(response.error);
    }
    if (response != undefined && response.acknowledged != undefined) {
      this.router.navigate(['/login']);
    }
  }

  isNotValid() {
    return (
      this.user.fullname == '' ||
      this.user.email === '' ||
      this.user.password == ''
    );
  }

  validateYear(): boolean {
    if (this.user.year < 0) {
      alert('Year must be positive number');
      return false;
    }

    if (this.user.year >= 0 && this.user.year <= 1950) {
      alert('Year must bigger than 1940');
      return false;
    }

    if (this.user.year >= 2020) {
      alert('Year must lessr than 2020');
      return false;
    }

    return true;
  }
}
