import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatDialogComponent } from './stat-dialog.component';

describe('StatDialogComponent', () => {
  let component: StatDialogComponent;
  let fixture: ComponentFixture<StatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
