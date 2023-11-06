import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWardrobeItemComponent } from './add-wardrobe-item.component';

describe('AddWardrobeItemComponent', () => {
  let component: AddWardrobeItemComponent;
  let fixture: ComponentFixture<AddWardrobeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWardrobeItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWardrobeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
