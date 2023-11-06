import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-category-tabs',
  templateUrl: './category-tabs.component.html',
  styleUrls: ['./category-tabs.component.scss'],
})
export class CategoryTabsComponent {
  @Input()
  categories: any = [];

  @Output()
  categoryChanged = new EventEmitter();

  onTabClick(category: any) {
    this.categories.forEach((c: any) => {
      c.active = category.title == c.title;
    });

    const index = this.categories.findIndex((obj: any) => obj.active === true);

    this.categoryChanged.emit(index);
  }

  onArrowClick(left: boolean) {
    let index = 0;
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].active) {
        index = i;
        this.categories[i].active = false;
      }
    }

    index = left ? --index : ++index;
    index = index < 0 ? this.categories.length - 1 : index;
    index = index > this.categories.length - 1 ? 0 : index;

    this.categories[index].active = true;
    this.categoryChanged.emit(index);
  }
}
