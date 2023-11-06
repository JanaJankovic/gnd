import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { StatDialogComponent } from 'src/app/components/stat-dialog/stat-dialog.component';
import { EventService } from 'src/app/services/event.service';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-edit-wardrobe-item',
  templateUrl: './edit-wardrobe-item.component.html',
  styleUrls: ['./edit-wardrobe-item.component.scss'],
})
export class EditWardrobeItemComponent {
  @ViewChild('FileSelectInputDialog')
  FileSelectInputDialog!: ElementRef;

  item: any = undefined;

  stats = [
    {
      title: 'Warmth',
      icon: 'assets/sys-icons/status-inactive.svg',
    },
    {
      title: 'Waterproof',
      icon: 'assets/sys-icons/status-inactive.svg',
    },
    {
      title: 'Windproof',
      icon: 'assets/sys-icons/status-inactive.svg',
    },
  ];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private networkService: NetworkService,
    private eventService: EventService
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state != undefined && state['item'] != undefined) {
      this.item = state['item'];
      this.initStatus(this.item);
    }
  }

  openDialog(i: number) {
    const dialogRef = this.dialog.open(StatDialogComponent, {
      data: { stat: this.stats[i].title, index: i },
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      switch (i) {
        case 0:
          this.item.warmth = result.data.value;
          break;
        case 1:
          this.item.waterproof = result.data.value;
          break;
        case 2:
          this.item.windproof = result.data.value;
          break;
      }

      this.stats[i].icon =
        result.data.value < 34
          ? 'assets/sys-icons/status-bad.svg'
          : this.stats[i].icon;
      this.stats[i].icon =
        result.data.value > 34 && result.data.value < 66
          ? 'assets/sys-icons/status-moderate.svg'
          : this.stats[i].icon;
      this.stats[i].icon =
        result.data.value > 66
          ? 'assets/sys-icons/status-good.svg'
          : this.stats[i].icon;

      this.updateWardrobeItem();
    });
  }

  initStatus(item: any) {
    const values = [item.warmth, item.waterproof, item.windproof];

    for (let i = 0; i < this.stats.length; i++) {
      this.stats[i].icon =
        values[i] < 34 ? 'assets/sys-icons/status-bad.svg' : this.stats[i].icon;
      this.stats[i].icon =
        values[i] > 34 && values[i] < 66
          ? 'assets/sys-icons/status-moderate.svg'
          : this.stats[i].icon;
      this.stats[i].icon =
        values[i] > 66
          ? 'assets/sys-icons/status-good.svg'
          : this.stats[i].icon;
    }
  }

  onImageClick() {
    const e: HTMLElement = this.FileSelectInputDialog.nativeElement;
    e.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String: string = reader.result as string;
      this.item.image = base64String;
      this.updateWardrobeItem();
    };

    reader.readAsDataURL(file);
  }

  async updateWardrobeItem() {
    const result = await lastValueFrom(
      this.networkService.updateWardrobeItem(this.item)
    );
    if (result != undefined && result.acknowledged != undefined) {
      console.log('Item updated');
      this.eventService.itemUpdated();
    }

    if (result != undefined && result.error != undefined)
      console.log(result.error);
  }

  async onButtonDelete() {
    const result = await lastValueFrom(
      this.networkService.deleteWardrobeItem(this.item._id)
    );
    if (result != undefined && result.acknowledged != undefined) {
      alert('Item deleted');
      this.router.navigate(['/wardrobe']);
    }

    if (result != undefined && result.error != undefined)
      console.log(result.error);
  }

  onItemClicked(event: any) {
    console.log('clicked');
    this.router
      .navigate(['/wardrobe/edit', event._id], { state: { item: event } })
      .then(() => {
        window.location.reload();
      });
  }
}
