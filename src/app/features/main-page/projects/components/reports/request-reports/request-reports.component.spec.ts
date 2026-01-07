import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestReportsComponent } from './request-reports.component';

describe('RequestReportsComponent', () => {
  let component: RequestReportsComponent;
  let fixture: ComponentFixture<RequestReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestReportsComponent]
    });
    fixture = TestBed.createComponent(RequestReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
