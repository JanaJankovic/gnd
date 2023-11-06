import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutfitComponent } from './add-outfit.component';

describe('AddOutfitComponent', () => {
  let component: AddOutfitComponent;
  let fixture: ComponentFixture<AddOutfitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOutfitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOutfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
