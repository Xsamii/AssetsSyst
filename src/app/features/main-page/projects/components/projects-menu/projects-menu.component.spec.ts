import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsMenuComponent } from './projects-menu.component';

describe('ProjectsMenuComponent', () => {
  let component: ProjectsMenuComponent;
  let fixture: ComponentFixture<ProjectsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
