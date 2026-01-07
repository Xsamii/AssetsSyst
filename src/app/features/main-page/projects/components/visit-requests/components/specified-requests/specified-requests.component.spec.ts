import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecifiedRequestsComponent } from './specified-requests.component';

describe('SpecifiedRequestsComponent', () => {
  let component: SpecifiedRequestsComponent;
  let fixture: ComponentFixture<SpecifiedRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecifiedRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecifiedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
