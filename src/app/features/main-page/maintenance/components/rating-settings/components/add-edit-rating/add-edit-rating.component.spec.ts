import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRatingComponent } from './add-edit-rating.component';

describe('AddEditRatingComponent', () => {
  let component: AddEditRatingComponent;
  let fixture: ComponentFixture<AddEditRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditRatingComponent]
    });
    fixture = TestBed.createComponent(AddEditRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
