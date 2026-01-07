import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecesRequestsComponent } from './pieces-requests.component';

describe('PiecesRequestsComponent', () => {
  let component: PiecesRequestsComponent;
  let fixture: ComponentFixture<PiecesRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiecesRequestsComponent]
    });
    fixture = TestBed.createComponent(PiecesRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
