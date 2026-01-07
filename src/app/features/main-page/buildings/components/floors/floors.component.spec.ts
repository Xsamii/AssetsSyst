import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorsComponent } from './floors.component';

describe('FloorsComponent', () => {
  let component: FloorsComponent;
  let fixture: ComponentFixture<FloorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloorsComponent]
    });
    fixture = TestBed.createComponent(FloorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
