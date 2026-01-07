import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePlanComponent } from './maintenance-plan.component';

describe('MaintenancePlanComponent', () => {
  let component: MaintenancePlanComponent;
  let fixture: ComponentFixture<MaintenancePlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenancePlanComponent]
    });
    fixture = TestBed.createComponent(MaintenancePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
