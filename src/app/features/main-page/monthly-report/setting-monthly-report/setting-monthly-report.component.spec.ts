import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingMonthlyReportComponent } from './setting-monthly-report.component';

describe('SettingMonthlyReportComponent', () => {
  let component: SettingMonthlyReportComponent;
  let fixture: ComponentFixture<SettingMonthlyReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingMonthlyReportComponent]
    });
    fixture = TestBed.createComponent(SettingMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
