import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveTaskComponent } from './executive-task.component';

describe('ExecutiveTaskComponent', () => {
  let component: ExecutiveTaskComponent;
  let fixture: ComponentFixture<ExecutiveTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExecutiveTaskComponent]
    });
    fixture = TestBed.createComponent(ExecutiveTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
