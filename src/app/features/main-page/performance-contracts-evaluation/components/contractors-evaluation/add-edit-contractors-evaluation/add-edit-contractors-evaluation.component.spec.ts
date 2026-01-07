import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditContractorsEvaluationComponent } from './add-edit-contractors-evaluation.component';

describe('AddEditContractorsEvaluationComponent', () => {
  let component: AddEditContractorsEvaluationComponent;
  let fixture: ComponentFixture<AddEditContractorsEvaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditContractorsEvaluationComponent]
    });
    fixture = TestBed.createComponent(AddEditContractorsEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
