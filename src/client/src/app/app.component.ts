import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NetworkService } from './services/network.service';
import { interval, lastValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  navItems: any = [
    {
      url: '/',
      text: 'Weather',
      active: false,
    },
    {
      url: '/suggestions',
      text: 'Suggestions',
      active: false,
    },
    {
      url: '/outfits',
      text: 'Outfits',
      active: false,
    },
    {
      url: '/wardrobe',
      text: 'Wardrobe',
      active: false,
    },
    {
      url: '/user',
      text: 'User',
      active: false,
    },
    {
      url: '/',
      text: 'Logout',
      active: false,
    },
    {
      url: '/login',
      text: 'Login',
      active: false,
    },
  ];

  visibleNavItems: any = [this.navItems[0], this.navItems[6]];

  constructor(
    private location: Location,
    private networkService: NetworkService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.initUi();
    this.getData();

    interval(60 * 60 * 1000)
      .pipe(switchMap(() => this.networkService.weather()))
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );

    this.eventService.loginEvent$.subscribe((eventData: any) => {
      this.initNav();
    });

    this.eventService.deleteUserEvent$.subscribe((event: any) => {
      this.initNav();
    });
  }

  initUi() {
    this.initNav();

    let currentUrl = this.location.path();
    currentUrl = currentUrl == '' ? '/' : currentUrl;
    currentUrl = currentUrl == '/register' ? '/login' : currentUrl;

    this.visibleNavItems.forEach((item: any) => {
      item.active = currentUrl == item.url;
      if (item.text == 'Logout') item.active = false;
    });
  }

  initNav() {
    let user = localStorage.getItem('user');
    const logged = user != undefined && user != null ? true : false;

    this.visibleNavItems = [this.navItems[0], this.navItems[6]];

    if (logged) {
      this.visibleNavItems = [];
      this.navItems.forEach((item: any) => {
        if (item.text != 'Login') this.visibleNavItems.push(item);
      });
    }

    this.visibleNavItems.forEach((item: any) => {
      item.active = false;
    });
    this.visibleNavItems[0].active = true;
  }

  async getData() {
    await lastValueFrom(this.networkService.weather());
  }

  onNavItemClick(item: any) {
    if (item.text == 'Logout') {
      localStorage.removeItem('user');
      this.initNav();
    } else {
      this.visibleNavItems.forEach((i: any) => {
        i.active = false;
      });
      item.active = true;
    }
  }
}
