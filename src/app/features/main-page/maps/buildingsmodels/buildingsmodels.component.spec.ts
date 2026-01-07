import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingsmodelsComponent } from './buildingsmodels.component';

describe('BuildingsmodelsComponent', () => {
  let component: BuildingsmodelsComponent;
  let fixture: ComponentFixture<BuildingsmodelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingsmodelsComponent]
    });
    fixture = TestBed.createComponent(BuildingsmodelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
