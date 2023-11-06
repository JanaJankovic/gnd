import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StatDialogComponent } from '../stat-dialog/stat-dialog.component';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss'],
})
export class LocationDialogComponent implements OnInit {
  currentLocation: string = '';
  locations = ['Maribor', 'Bled', 'Celje', 'Koper', 'Ljubljana'];

  constructor(
    public dialogRef: MatDialogRef<StatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const location = localStorage.getItem('location');
    this.currentLocation =
      location != null && location != undefined ? location : 'Maribor';
  }

  closeDialog() {
    localStorage.setItem('location', this.currentLocation);
    this.dialogRef.close({ data: this.currentLocation });
  }

  onLocationClick(i: number) {
    this.currentLocation = this.locations[i];
  }
}
