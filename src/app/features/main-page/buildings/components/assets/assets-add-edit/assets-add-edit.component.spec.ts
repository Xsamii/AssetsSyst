import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAddEditComponent } from './assets-add-edit.component';

describe('AssetsAddEditComponent', () => {
  let component: AssetsAddEditComponent;
  let fixture: ComponentFixture<AssetsAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetsAddEditComponent]
    });
    fixture = TestBed.createComponent(AssetsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
