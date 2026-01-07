import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTypesComponent } from './assets-types.component';

describe('AssetsTypesComponent', () => {
  let component: AssetsTypesComponent;
  let fixture: ComponentFixture<AssetsTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetsTypesComponent]
    });
    fixture = TestBed.createComponent(AssetsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
