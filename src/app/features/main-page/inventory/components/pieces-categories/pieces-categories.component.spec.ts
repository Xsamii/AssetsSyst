import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecesCategoriesComponent } from './pieces-categories.component';

describe('PiecesCategoriesComponent', () => {
  let component: PiecesCategoriesComponent;
  let fixture: ComponentFixture<PiecesCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiecesCategoriesComponent]
    });
    fixture = TestBed.createComponent(PiecesCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
