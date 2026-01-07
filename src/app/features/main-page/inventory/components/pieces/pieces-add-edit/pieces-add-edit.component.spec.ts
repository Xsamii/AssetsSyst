import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecesAddEditComponent } from './pieces-add-edit.component';

describe('PiecesAddEditComponent', () => {
  let component: PiecesAddEditComponent;
  let fixture: ComponentFixture<PiecesAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiecesAddEditComponent]
    });
    fixture = TestBed.createComponent(PiecesAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
