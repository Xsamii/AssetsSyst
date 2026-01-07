import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingSidebarComponent } from './main-sidebar.component';

describe('BuildingSidebarComponent', () => {
  let component: BuildingSidebarComponent;
  let fixture: ComponentFixture<BuildingSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BuildingSidebarComponent]
    });
    fixture = TestBed.createComponent(BuildingSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
