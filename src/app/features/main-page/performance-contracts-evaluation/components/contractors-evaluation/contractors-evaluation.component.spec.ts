import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorsEvaluationComponent } from './contractors-evaluation.component';

describe('ContractorsEvaluationComponent', () => {
  let component: ContractorsEvaluationComponent;
  let fixture: ComponentFixture<ContractorsEvaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractorsEvaluationComponent]
    });
    fixture = TestBed.createComponent(ContractorsEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
