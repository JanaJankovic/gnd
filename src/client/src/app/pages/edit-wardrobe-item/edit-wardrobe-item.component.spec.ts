import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWardrobeItemComponent } from './edit-wardrobe-item.component';

describe('EditWardrobeItemComponent', () => {
  let component: EditWardrobeItemComponent;
  let fixture: ComponentFixture<EditWardrobeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWardrobeItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWardrobeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
