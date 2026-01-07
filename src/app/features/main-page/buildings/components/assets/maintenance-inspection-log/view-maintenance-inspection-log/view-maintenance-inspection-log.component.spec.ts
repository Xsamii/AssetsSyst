import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMaintenanceInspectionLogComponent } from './view-maintenance-inspection-log.component';

describe('ViewMaintenanceInspectionLogComponent', () => {
  let component: ViewMaintenanceInspectionLogComponent;
  let fixture: ComponentFixture<ViewMaintenanceInspectionLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMaintenanceInspectionLogComponent]
    });
    fixture = TestBed.createComponent(ViewMaintenanceInspectionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
