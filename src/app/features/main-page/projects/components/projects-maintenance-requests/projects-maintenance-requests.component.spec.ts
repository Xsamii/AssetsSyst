import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsMaintenanceRequestsComponent } from './projects-maintenance-requests.component';

describe('ProjectsMaintenanceRequestsComponent', () => {
  let component: ProjectsMaintenanceRequestsComponent;
  let fixture: ComponentFixture<ProjectsMaintenanceRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsMaintenanceRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectsMaintenanceRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
