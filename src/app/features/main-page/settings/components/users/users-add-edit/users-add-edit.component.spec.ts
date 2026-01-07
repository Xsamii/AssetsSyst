import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAddEditComponent } from './users-add-edit.component';

describe('UsersAddEditComponent', () => {
  let component: UsersAddEditComponent;
  let fixture: ComponentFixture<UsersAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersAddEditComponent]
    });
    fixture = TestBed.createComponent(UsersAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
