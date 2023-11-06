import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';
import { Observable, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  @Input()
  item: any;

  @Input()
  itemObservable!: Observable<any>;

  @Output()
  itemClicked = new EventEmitter();

  similarItems: any = [];

  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    if (this.item != undefined && this.item != null) this.getSimilarItems();

    this.itemObservable.subscribe((data) => {
      if (data != null && data != undefined) {
        this.item = data;
        this.getSimilarItems();
      }
    });
  }

  async getSimilarItems() {
    const result = await lastValueFrom(
      this.networkService.wardrobeItemsSimiliar(this.item)
    );

    if (result.length > 0) {
      this.similarItems = result;
      this.similarItems = this.similarItems.filter(
        (x: any) => x._id != this.item._id
      );
      this.similarItems = this.similarItems.slice(0, 7);
    }
  }

  onItemClick(item: any) {
    this.itemClicked.emit(item);
  }

  onArrowClick(left: boolean) {}
}
