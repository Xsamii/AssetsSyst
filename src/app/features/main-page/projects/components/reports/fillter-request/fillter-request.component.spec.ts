import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillterRequestComponent } from './fillter-request.component';

describe('FillterRequestComponent', () => {
  let component: FillterRequestComponent;
  let fixture: ComponentFixture<FillterRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FillterRequestComponent]
    });
    fixture = TestBed.createComponent(FillterRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
