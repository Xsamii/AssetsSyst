import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMaintenancePlanComponent } from './add-edit-maintenance-plan.component';

describe('AddEditMaintenancePlanComponent', () => {
  let component: AddEditMaintenancePlanComponent;
  let fixture: ComponentFixture<AddEditMaintenancePlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditMaintenancePlanComponent]
    });
    fixture = TestBed.createComponent(AddEditMaintenancePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
