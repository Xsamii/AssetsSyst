import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceEvaluationTermsComponent } from './maintenance-evaluation-terms.component';

describe('MaintenanceEvaluationTermsComponent', () => {
  let component: MaintenanceEvaluationTermsComponent;
  let fixture: ComponentFixture<MaintenanceEvaluationTermsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceEvaluationTermsComponent]
    });
    fixture = TestBed.createComponent(MaintenanceEvaluationTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
