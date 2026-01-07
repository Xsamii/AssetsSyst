import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsCategoriesComponent } from './projects-categories.component';

describe('ProjectsCategoriesComponent', () => {
  let component: ProjectsCategoriesComponent;
  let fixture: ComponentFixture<ProjectsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
