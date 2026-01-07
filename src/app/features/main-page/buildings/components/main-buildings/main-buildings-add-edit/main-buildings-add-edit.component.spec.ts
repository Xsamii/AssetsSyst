import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBuildingsAddEditComponent } from './main-buildings-add-edit.component';

describe('MainBuildingsAddEditComponent', () => {
  let component: MainBuildingsAddEditComponent;
  let fixture: ComponentFixture<MainBuildingsAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainBuildingsAddEditComponent]
    });
    fixture = TestBed.createComponent(MainBuildingsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
