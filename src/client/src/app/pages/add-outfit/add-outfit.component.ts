import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { GalleryDialogComponent } from 'src/app/components/gallery-dialog/gallery-dialog.component';
import { NetworkService } from 'src/app/services/network.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-outfit',
  templateUrl: './add-outfit.component.html',
  styleUrls: ['./add-outfit.component.scss'],
})
export class AddOutfitComponent implements OnInit {
  seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];

  tiles = [
    {
      category: 'Jacket',
      cols: 1,
      rows: 3,
      color: '#d9d9d9',
      image: '',
    },
    {
      category: 'Upper body',
      cols: 1,
      rows: 2,
      color: '#d9d9d9',
      image: '',
    },
    {
      category: 'Footwear',
      cols: 1,
      rows: 2,
      color: '#d9d9d9',
      image: '',
    },
    {
      category: 'Lower body',
      cols: 1,
      rows: 3,
      color: '#d9d9d9',
      image: '',
    },
    {
      category: 'Umbrella',
      cols: 1,
      rows: 2,
      color: '#d9d9d9',
      image: '',
    },
    {
      category: 'Gloves/Sunglasses',
      cols: 1,
      rows: 1,
      color: '#d9d9d9',
      image: '',
    },
    {
      category: 'Hat/Cap',
      cols: 1,
      rows: 1,
      color: '#d9d9d9',
      image: '',
    },
  ];

  outfit: any = {
    season: undefined,
    user_id: undefined,
    upper_id: undefined,
    lower_id: undefined,
    jacket_id: undefined,
    foot_id: undefined,
    gloves_sunglasses_id: undefined,
    cap_hat_id: undefined,
    umbrella_id: undefined,
  };

  user: any;

  edit = false;

  constructor(
    private networkService: NetworkService,
    public dialog: MatDialog,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.user = user != null ? JSON.parse(user) : undefined;
    if (this.user != undefined) this.outfit.user_id = this.user._id;

    this.edit = this.location.path().split('/')[2] == 'edit';
    if (this.edit) {
      this.getData(this.location.path().split('/')[3]);
    }
  }

  onSeasonClick(i: number) {
    this.outfit.season = this.seasons[i];
  }

  async getData(id: string) {
    const response = await lastValueFrom(this.networkService.getOutfit(id));
    if (response.error) alert(response.error);
    else {
      this.outfit = response;
      this.tiles[0].image =
        this.outfit.jacket != undefined ? this.outfit.jacket.image : '';
      this.tiles[1].image =
        this.outfit.upper != undefined ? this.outfit.upper.image : '';
      this.tiles[2].image =
        this.outfit.foot != undefined ? this.outfit.foot.image : '';
      this.tiles[3].image =
        this.outfit.lower != undefined ? this.outfit.lower.image : '';
      this.tiles[4].image =
        this.outfit.umbrella != undefined ? this.outfit.umbrella.image : '';
      this.tiles[5].image =
        this.outfit.gloves_sunglasses != undefined
          ? this.outfit.gloves_sunglasses.image
          : '';
      this.tiles[6].image =
        this.outfit.cap_hat != undefined ? this.outfit.cap_hat.image : '';
    }
  }

  async onAddClick() {
    const response = await lastValueFrom(
      this.networkService.createOutfit(this.outfit)
    );
    if (response != undefined && response.acknowledged != undefined) {
      this.router.navigate(['/outfits']);
    }
  }

  async onTileClicked(event: number) {
    if (this.user == undefined) {
      alert('Login needed!');
      return;
    }

    let category = 4;
    let subcategory = undefined;
    switch (event) {
      case 0:
        category = 3;
        break;
      case 1:
        category = 0;
        break;
      case 2:
        category = 2;
        break;
      case 3:
        category = 1;
        break;
    }

    subcategory = category == 4 ? event : undefined;

    let wardrobe = await lastValueFrom(
      this.networkService.wardrobeItems(this.user._id, category, subcategory)
    );

    if (wardrobe == undefined || wardrobe.length == 0) {
      alert('No items found in wardrobe');
      return;
    }

    const dialogRef = this.dialog.open(GalleryDialogComponent, {
      data: { wardrobe: wardrobe },
      height: '600px',
      width: '100vw',
      maxWidth: '100vw',
      position: { bottom: '0px' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.data != undefined) {
        this.tiles[event].image = result.data.image;

        switch (event) {
          case 0:
            this.outfit.jacket_id = result.data._id;
            break;
          case 1:
            this.outfit.upper_id = result.data._id;
            break;
          case 2:
            this.outfit.foot_id = result.data._id;
            break;
          case 3:
            this.outfit.lower_id = result.data._id;
            break;
          case 4:
            this.outfit.umbrella_id = result.data._id;
            break;
          case 5:
            this.outfit.gloves_sunglasses_id = result.data._id;
            break;
          case 6:
            this.outfit.cap_hat_id = result.data._id;
            break;
        }
      }
    });
  }

  async onUpdateClick() {
    const data = {
      _id: this.outfit._id,
      season: this.outfit.season,
      user_id: this.outfit.user_id,
      upper_id: this.outfit.upper_id,
      lower_id: this.outfit.lower_id,
      jacket_id: this.outfit.jacket_id,
      foot_id: this.outfit.foot_id,
      gloves_sunglasses_id: this.outfit.gloves_sunglasses_id,
      cap_hat_id: this.outfit.cap_hat_id,
      umbrella_id: this.outfit.umbrella_id,
    };
    const result = await lastValueFrom(this.networkService.updateOutfit(data));
    if (result != undefined && result.acknowledged != undefined) {
      alert('Outfit updated');
    }

    if (result != undefined && result.error != undefined) alert(result.error);
  }

  async onDeleteClick() {
    const result = await lastValueFrom(
      this.networkService.deleteOutfit(this.outfit._id)
    );
    if (result != undefined && result.acknowledged != undefined) {
      alert('Outfit deleted');
      this.router.navigate(['/outfits']);
    }

    if (result != undefined && result.error != undefined) alert(result.error);
  }
}
