import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillterProjectComponent } from './fillter-project.component';

describe('FillterProjectComponent', () => {
  let component: FillterProjectComponent;
  let fixture: ComponentFixture<FillterProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FillterProjectComponent]
    });
    fixture = TestBed.createComponent(FillterProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
