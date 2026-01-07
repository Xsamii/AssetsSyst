import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SweetAlertMessageComponent } from './sweet-alert-message.component';

describe('SweetAlertMessageComponent', () => {
  let component: SweetAlertMessageComponent;
  let fixture: ComponentFixture<SweetAlertMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SweetAlertMessageComponent]
    });
    fixture = TestBed.createComponent(SweetAlertMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
