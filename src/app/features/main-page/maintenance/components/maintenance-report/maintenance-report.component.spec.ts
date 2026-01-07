import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceReportComponent } from './maintenance-report.component';

describe('MaintenanceReportComponent', () => {
  let component: MaintenanceReportComponent;
  let fixture: ComponentFixture<MaintenanceReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceReportComponent]
    });
    fixture = TestBed.createComponent(MaintenanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
