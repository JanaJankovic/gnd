import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StatDialogComponent } from '../stat-dialog/stat-dialog.component';

@Component({
  selector: 'app-gallery-dialog',
  templateUrl: './gallery-dialog.component.html',
  styleUrls: ['./gallery-dialog.component.scss'],
})
export class GalleryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    data.wardrobe.forEach((item: any) => {
      item.active = false;
    });
  }

  selectedItem: any = undefined;

  closeDialog() {
    this.dialogRef.close({ data: this.selectedItem });
  }

  onItemClick(item: any) {
    this.selectedItem = item;
    this.data.wardrobe.forEach((i: any) => {
      i.active = i._id == item._id;
    });
  }
}
