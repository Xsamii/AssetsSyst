import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingsDashboardComponent } from './buildings-dashboard.component';

describe('BuildingsDashboardComponent', () => {
  let component: BuildingsDashboardComponent;
  let fixture: ComponentFixture<BuildingsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildingsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
