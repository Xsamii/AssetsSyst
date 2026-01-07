import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbReportComponent } from './bread-crumb-report.component';

describe('BreadCrumbReportComponent', () => {
  let component: BreadCrumbReportComponent;
  let fixture: ComponentFixture<BreadCrumbReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreadCrumbReportComponent]
    });
    fixture = TestBed.createComponent(BreadCrumbReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
