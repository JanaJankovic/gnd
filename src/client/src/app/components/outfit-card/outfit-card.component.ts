import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-outfit-card',
  templateUrl: './outfit-card.component.html',
  styleUrls: ['./outfit-card.component.scss'],
})
export class OutfitCardComponent {
  @Input()
  tiles: any = [];

  @Input()
  outfit_id: string = '';

  @Input()
  edit = false;

  @Output()
  tileClicked = new EventEmitter();

  onTileClick(i: number) {
    this.tileClicked.emit(i);
  }
}
