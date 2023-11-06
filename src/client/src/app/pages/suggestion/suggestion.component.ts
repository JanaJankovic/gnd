import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { NetworkService } from 'src/app/services/network.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss'],
})
export class SuggestionComponent implements OnInit {
  categories: any = [];
  user: any;
  suggestion: any;

  submenu = [
    { title: 'Final look', active: true },
    { title: 'Upper body', active: false },
    { title: 'Lower body', active: false },
    { title: 'Footwear', active: false },
    { title: 'Jacket', active: false },
    { title: 'Hat/Cap', active: false },
    { title: 'Gloves/Sunglasses', active: false },
    { title: 'Umbrella', active: false },
  ];

  index: number = 0;
  submenuIndex: number = 0;
  currentItem: any;
  item$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private networkService: NetworkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.user = user != null ? JSON.parse(user) : undefined;
    this.getData();
  }

  async getData() {
    if (this.user == undefined) return;
    this.spinner.show();
    const response = await lastValueFrom(
      this.networkService.suggestions(this.user._id)
    );
    if (response != undefined) {
      this.suggestion = response;
      this.categories = this.suggestion.categories;
      this.categories[0].active = true;
    }
    this.spinner.hide();
  }

  onCategoryChanged(event: any) {
    this.index = event;
  }

  onSubmenuItemClick(i: number) {
    this.submenu.forEach((x: any) => {
      x.active = false;
    });
    this.submenu[i].active = true;
    this.submenuIndex = i;
    this.changeCurrentItem();
  }

  getTiles() {
    const outfit = this.suggestion.outfits[this.index];
    return [
      {
        category: 'Jacket',
        cols: 1,
        rows: 3,
        color: '#d9d9d9',
        image: outfit.jacket != undefined ? outfit.jacket.image : '',
      },
      {
        category: 'Upper body',
        cols: 1,
        rows: 2,
        color: '#d9d9d9',
        image: outfit.upper != undefined ? outfit.upper.image : '',
      },
      {
        category: 'Footwear',
        cols: 1,
        rows: 2,
        color: '#d9d9d9',
        image: outfit.foot != undefined ? outfit.foot.image : '',
      },
      {
        category: 'Lower body',
        cols: 1,
        rows: 3,
        color: '#d9d9d9',
        image: outfit.lower != undefined ? outfit.lower.image : '',
      },
      {
        category: 'Umbrella',
        cols: 1,
        rows: 2,
        color: '#d9d9d9',
        image: outfit.umbrella != undefined ? outfit.umbrella.image : '',
      },
      {
        category: 'Gloves',
        cols: 1,
        rows: 1,
        color: '#d9d9d9',
        image:
          outfit.gloves_sunglasses != undefined
            ? outfit.gloves_sunglasses.image
            : '',
      },
      {
        category: 'Hat/Cap',
        cols: 1,
        rows: 1,
        color: '#d9d9d9',
        image: outfit.cap_hat != undefined ? outfit.cap_hat.image : '',
      },
    ];
  }

  changeCurrentItem() {
    switch (this.submenuIndex) {
      case 1:
        this.currentItem = this.suggestion.outfits[this.index].upper;
        break;
      case 2:
        this.currentItem = this.suggestion.outfits[this.index].lower;
        break;
      case 3:
        this.currentItem = this.suggestion.outfits[this.index].foot;
        break;
      case 4:
        this.currentItem = this.suggestion.outfits[this.index].jacket;
        break;
      case 5:
        this.currentItem = this.suggestion.outfits[this.index].cap_hat;
        break;
      case 6:
        this.currentItem =
          this.suggestion.outfits[this.index].gloves_sunglasses;
        break;
      case 7:
        this.currentItem = this.suggestion.outfits[this.index].umbrella;
        break;
    }

    this.updateData(this.currentItem);
  }

  onItemClicked(event: any) {
    this.currentItem = event;
    this.updateData(event);

    switch (this.submenuIndex) {
      case 1:
        this.suggestion.outfits[this.index].upper = event;
        break;
      case 2:
        this.suggestion.outfits[this.index].lower = event;
        break;
      case 3:
        this.suggestion.outfits[this.index].foot = event;
        break;
      case 4:
        this.suggestion.outfits[this.index].jacket = event;
        break;
      case 5:
        this.suggestion.outfits[this.index].cap_hat = event;
        break;
      case 6:
        this.suggestion.outfits[this.index].gloves_sunglasses = event;
        break;
      case 7:
        this.suggestion.outfits[this.index].umbrella = event;
        break;
    }
  }

  updateData(newValue: any) {
    this.item$.next(newValue);
  }

  async onSaveClick() {
    const season = this.getCurrentSeason();
    const outfit = this.suggestion.outfits[this.index];
    const data = {
      season: season,
      user_id: this.user._id,
      upper_id: outfit.upper?._id,
      lower_id: outfit.lower?._id,
      jacket_id: outfit.jacket?._id,
      foot_id: outfit.foot?._id,
      gloves_sunglasses_id: outfit.gloves_sunglasses?._id,
      cap_hat_id: outfit.cap_hat?._id,
      umbrella_id: outfit.umbrella?._id,
    };

    const result = await lastValueFrom(this.networkService.createOutfit(data));
    if (result != undefined && result.acknowledged != undefined) {
      alert('Outfit saved');
    }

    if (result != undefined && result.error != undefined) alert(result.error);
  }

  getCurrentSeason() {
    const date = new Date();
    const month = date.getMonth() + 1; // Adding 1 since getMonth() returns zero-based index

    if (month >= 3 && month <= 5) {
      return 'Spring';
    } else if (month >= 6 && month <= 8) {
      return 'Summer';
    } else if (month >= 9 && month <= 11) {
      return 'Autumn';
    } else {
      return 'Winter';
    }
  }
}
