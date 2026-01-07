import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitRequestsComponent } from './visit-requests.component';

describe('VisitRequestsComponent', () => {
  let component: VisitRequestsComponent;
  let fixture: ComponentFixture<VisitRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
