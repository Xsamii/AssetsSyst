import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsReportsComponent } from './projects-reports.component';

describe('ProjectsReportsComponent', () => {
  let component: ProjectsReportsComponent;
  let fixture: ComponentFixture<ProjectsReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsReportsComponent]
    });
    fixture = TestBed.createComponent(ProjectsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
