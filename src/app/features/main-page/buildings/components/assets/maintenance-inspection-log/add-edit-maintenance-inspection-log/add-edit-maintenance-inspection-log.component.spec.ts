import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMaintenanceInspectionLogComponent } from './add-edit-maintenance-inspection-log.component';

describe('AddEditMaintenanceInspectionLogComponent', () => {
  let component: AddEditMaintenanceInspectionLogComponent;
  let fixture: ComponentFixture<AddEditMaintenanceInspectionLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditMaintenanceInspectionLogComponent]
    });
    fixture = TestBed.createComponent(AddEditMaintenanceInspectionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
