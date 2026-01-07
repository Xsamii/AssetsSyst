import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisoryTaskComponent } from './supervisory-task.component';

describe('SupervisoryTaskComponent', () => {
  let component: SupervisoryTaskComponent;
  let fixture: ComponentFixture<SupervisoryTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupervisoryTaskComponent]
    });
    fixture = TestBed.createComponent(SupervisoryTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
