import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NetworkService } from 'src/app/services/network.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-outfit',
  templateUrl: './outfit.component.html',
  styleUrls: ['./outfit.component.scss'],
})
export class OutfitComponent implements OnInit {
  seasons: any = [
    { title: 'Winter', active: true },
    { title: 'Spring', active: false },
    { title: 'Summer', active: false },
    { title: 'Autumn', active: false },
  ];

  outfits: any = [];
  user: any;
  loading = true;

  constructor(
    private router: Router,
    private networkService: NetworkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.user = user != null ? JSON.parse(user) : undefined;
    this.getData(0);
  }

  async getData(i: number) {
    if (this.user == undefined) return;

    this.spinner.show();
    const data = await lastValueFrom(
      this.networkService.getOutfits(this.user._id, i)
    );

    data.forEach((el: any) => {
      const tiles = [
        {
          category: 'Jacket',
          cols: 1,
          rows: 3,
          color: '#d9d9d9',
          image: el.jacket != undefined ? el.jacket.image : '',
        },
        {
          category: 'Upper body',
          cols: 1,
          rows: 2,
          color: '#d9d9d9',
          image: el.upper != undefined ? el.upper.image : '',
        },
        {
          category: 'Footwear',
          cols: 1,
          rows: 2,
          color: '#d9d9d9',
          image: el.foot != undefined ? el.foot.image : '',
        },
        {
          category: 'Lower body',
          cols: 1,
          rows: 3,
          color: '#d9d9d9',
          image: el.lower != undefined ? el.lower.image : '',
        },
        {
          category: 'Umbrella',
          cols: 1,
          rows: 2,
          color: '#d9d9d9',
          image: el.umbrella != undefined ? el.umbrella.image : '',
        },
        {
          category: 'Gloves',
          cols: 1,
          rows: 1,
          color: '#d9d9d9',
          image:
            el.gloves_sunglasses != undefined ? el.gloves_sunglasses.image : '',
        },
        {
          category: 'Hat/Cap',
          cols: 1,
          rows: 1,
          color: '#d9d9d9',
          image: el.cap_hat != undefined ? el.cap_hat.image : '',
        },
      ];

      el.tiles = tiles;
    });

    this.outfits = data;
    this.spinner.hide();
    this.loading = false;
  }

  async onSeasonChanged(event: number) {
    this.getData(event);
  }

  onAddClick() {
    this.router.navigate(['/outfits/add']);
  }
}
