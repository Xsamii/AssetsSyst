import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiPointersComponent } from './kpi-pointers.component';

describe('KpiPointersComponent', () => {
  let component: KpiPointersComponent;
  let fixture: ComponentFixture<KpiPointersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiPointersComponent]
    });
    fixture = TestBed.createComponent(KpiPointersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
