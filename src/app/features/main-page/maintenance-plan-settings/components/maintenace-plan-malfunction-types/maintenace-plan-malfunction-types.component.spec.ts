import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenacePlanMalfunctionTypesComponent } from './maintenace-plan-malfunction-types.component';

describe('MaintenacePlanMalfunctionTypesComponent', () => {
  let component: MaintenacePlanMalfunctionTypesComponent;
  let fixture: ComponentFixture<MaintenacePlanMalfunctionTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaintenacePlanMalfunctionTypesComponent]
    });
    fixture = TestBed.createComponent(MaintenacePlanMalfunctionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
