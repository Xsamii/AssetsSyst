import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEvaluationSettingsComponent } from './add-edit-evaluation-settings.component';

describe('AddEditEvaluationSettingsComponent', () => {
  let component: AddEditEvaluationSettingsComponent;
  let fixture: ComponentFixture<AddEditEvaluationSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditEvaluationSettingsComponent]
    });
    fixture = TestBed.createComponent(AddEditEvaluationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
