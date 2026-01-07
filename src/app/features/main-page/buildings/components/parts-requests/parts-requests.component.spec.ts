import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsRequestsComponent } from './parts-requests.component';

describe('PartsRequestsComponent', () => {
  let component: PartsRequestsComponent;
  let fixture: ComponentFixture<PartsRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartsRequestsComponent]
    });
    fixture = TestBed.createComponent(PartsRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
