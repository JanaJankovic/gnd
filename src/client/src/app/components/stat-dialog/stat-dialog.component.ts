import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stat-dialog',
  templateUrl: './stat-dialog.component.html',
  styleUrls: ['./stat-dialog.component.scss'],
})
export class StatDialogComponent {
  statSection = new FormGroup({
    value: new FormControl(0),
  });

  constructor(
    public dialogRef: MatDialogRef<StatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    switch (data.index) {
      case 0:
        this.titles.min = 'Light';
        this.titles.max = 'Warm';
        break;
      case 1:
        this.titles.min = 'Non-waterproof';
        this.titles.max = 'Waterproof';
        break;
      case 2:
        this.titles.min = 'Non-windroof';
        this.titles.max = 'Windproof';
        break;
    }
  }

  titles = { max: '', min: '' };

  closeDialog() {
    this.dialogRef.close({ data: this.statSection.value });
  }
}
