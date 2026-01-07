import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditContractorComponent } from './add-edit-contractor.component';

describe('AddEditContractorComponent', () => {
  let component: AddEditContractorComponent;
  let fixture: ComponentFixture<AddEditContractorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditContractorComponent]
    });
    fixture = TestBed.createComponent(AddEditContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
