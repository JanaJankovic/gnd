import { Component, ElementRef, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { StatDialogComponent } from 'src/app/components/stat-dialog/stat-dialog.component';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-add-wardrobe-item',
  templateUrl: './add-wardrobe-item.component.html',
  styleUrls: ['./add-wardrobe-item.component.scss'],
})
export class AddWardrobeItemComponent implements OnInit {
  @ViewChild('FileSelectInputDialog')
  FileSelectInputDialog!: ElementRef;

  categories = [
    'Upper body',
    'Lower body',
    'Footwear',
    'Jacket',
    'Accessories',
  ];

  subcategories = ['Hat', 'Sunglasses', 'Umbrella', 'Cap', 'Gloves'];

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

  item: any = {
    category: '',
    subcategory: '',
    image: '',
    warmth: 0,
    waterproof: 0,
    windproof: 0,
    user_id: 0,
    preference: 0,
  };

  constructor(
    public dialog: MatDialog,
    private networkService: NetworkService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('user');
    const user: any = data != null ? JSON.parse(data) : undefined;
    if (user != undefined) this.item.user_id = user._id;
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
    };

    reader.readAsDataURL(file);
  }

  onCategoryClick(i: number) {
    this.item.category = this.categories[i];
  }

  onSubcategoryClick(i: number) {
    this.item.subcategory = this.subcategories[i];
  }

  openDialog(i: number) {
    const dialogRef = this.dialog.open(StatDialogComponent, {
      data: { stat: this.stats[i].title, index: i },
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
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
      }
    });
  }

  async onAddClick() {
    if (!this.isPreferenceValid()) return;

    if (this.item.category != '') {
      const response = await lastValueFrom(
        this.networkService.createWardrobeItem(this.item)
      );
      if (response != undefined && response.acknowledged != undefined) {
        alert('Item created');
        this.router.navigate(['/wardrobe']);
      }
      if (response != undefined && response.error != undefined) {
        alert(response.error);
      }
    } else {
      alert('Pick category');
    }
  }

  isPreferenceValid() {
    if (this.item.preference < 0) {
      alert('Preference can only be positive');
      return false;
    }

    if (this.item.preference > 5) {
      alert('Preference can be maximum 5');
      return false;
    }

    return true;
  }
}
