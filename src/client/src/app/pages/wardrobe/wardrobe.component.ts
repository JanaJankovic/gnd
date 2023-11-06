import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.scss'],
})
export class WardrobeComponent implements OnInit {
  categories: any = [
    { title: 'Upper body', active: true },
    { title: 'Lower body', active: false },
    { title: 'Footwear', active: false },
    { title: 'Jacket', active: false },
    { title: 'Accessoires', active: false },
  ];

  wardrobe: any = [];

  constructor(
    private router: Router,
    private networkService: NetworkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getData(0);
  }

  async getData(index: number) {
    this.spinner.show();
    let data = localStorage.getItem('user');
    let user: any = data != null ? JSON.parse(data) : undefined;

    if (user != undefined) {
      let response = await lastValueFrom(
        this.networkService.wardrobeItems(user._id, index, undefined)
      );
      if (response != undefined && response.length > 0)
        this.wardrobe = response;
    }
    this.spinner.hide();
  }

  onAddClick() {
    this.router.navigate(['/wardrobe/add']);
  }

  onItemClick(item: any) {
    this.router.navigate(['/wardrobe/edit', item._id], {
      state: { item: item },
    });
  }

  onCategoryChanged(event: any) {
    this.getData(event);
  }
}
