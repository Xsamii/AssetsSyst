import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsAddEditComponent } from './projects-add-edit.component';

describe('ProjectsAddEditComponent', () => {
  let component: ProjectsAddEditComponent;
  let fixture: ComponentFixture<ProjectsAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsAddEditComponent]
    });
    fixture = TestBed.createComponent(ProjectsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
