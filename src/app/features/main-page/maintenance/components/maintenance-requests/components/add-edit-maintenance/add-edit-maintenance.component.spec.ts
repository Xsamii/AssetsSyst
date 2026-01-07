import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMaintenanceComponent } from './add-edit-maintenance.component';

describe('AddEditMaintenanceComponent', () => {
  let component: AddEditMaintenanceComponent;
  let fixture: ComponentFixture<AddEditMaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditMaintenanceComponent]
    });
    fixture = TestBed.createComponent(AddEditMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
