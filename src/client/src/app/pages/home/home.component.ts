import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { lastValueFrom } from 'rxjs';
import { LocationDialogComponent } from 'src/app/components/location-dialog/location-dialog.component';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  forecast: any = [];
  clothesIcons: any = [];
  currentLocation: any = '';

  constructor(
    public dialog: MatDialog,
    private networkService: NetworkService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onDayClick(day: any) {
    this.forecast.forEach((day: any) => {
      day.active = false;
    });

    day.active = true;
  }

  onLocationClick() {
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  async getData() {
    await lastValueFrom(this.networkService.weather());
    this.loadData();
  }

  loadData() {
    const forecast = localStorage.getItem('forecast');
    this.forecast = forecast != undefined ? JSON.parse(forecast) : [];

    const clothesIcons = localStorage.getItem('clothesIcons');
    this.clothesIcons =
      clothesIcons != undefined ? JSON.parse(clothesIcons) : [];

    if (this.forecast.length > 0) {
      this.forecast[0].active = true;
    }

    const location = localStorage.getItem('location');
    this.currentLocation =
      location != null && location != undefined ? location : 'Maribor';
  }
}
