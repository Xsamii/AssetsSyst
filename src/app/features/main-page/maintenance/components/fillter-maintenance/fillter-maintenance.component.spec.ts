import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillterMaintenanceComponent } from './fillter-maintenance.component';

describe('FillterMaintenanceComponent', () => {
  let component: FillterMaintenanceComponent;
  let fixture: ComponentFixture<FillterMaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FillterMaintenanceComponent]
    });
    fixture = TestBed.createComponent(FillterMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
