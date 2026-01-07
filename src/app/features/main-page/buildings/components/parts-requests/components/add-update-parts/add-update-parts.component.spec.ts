import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePartsComponent } from './add-update-parts.component';

describe('AddUpdatePartsComponent', () => {
  let component: AddUpdatePartsComponent;
  let fixture: ComponentFixture<AddUpdatePartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpdatePartsComponent]
    });
    fixture = TestBed.createComponent(AddUpdatePartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
