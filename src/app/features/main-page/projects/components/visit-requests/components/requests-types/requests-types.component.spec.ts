import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsTypesComponent } from './requests-types.component';

describe('RequestsTypesComponent', () => {
  let component: RequestsTypesComponent;
  let fixture: ComponentFixture<RequestsTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
