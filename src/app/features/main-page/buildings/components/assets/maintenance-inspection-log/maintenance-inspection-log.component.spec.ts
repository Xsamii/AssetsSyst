import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceInspectionLogComponent } from './maintenance-inspection-log.component';

describe('MaintenanceInspectionLogComponent', () => {
  let component: MaintenanceInspectionLogComponent;
  let fixture: ComponentFixture<MaintenanceInspectionLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceInspectionLogComponent]
    });
    fixture = TestBed.createComponent(MaintenanceInspectionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
