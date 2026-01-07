import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsStatusComponent } from './projects-status.component';

describe('ProjectsStatusComponent', () => {
  let component: ProjectsStatusComponent;
  let fixture: ComponentFixture<ProjectsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
