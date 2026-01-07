import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMainCategoryComponent } from './asset-main-category.component';

describe('AssetMainCategoryComponent', () => {
  let component: AssetMainCategoryComponent;
  let fixture: ComponentFixture<AssetMainCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetMainCategoryComponent]
    });
    fixture = TestBed.createComponent(AssetMainCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
