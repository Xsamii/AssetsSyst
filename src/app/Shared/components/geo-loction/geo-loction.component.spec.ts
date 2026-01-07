import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoLoctionComponent } from './geo-loction.component';

describe('GeoLoctionComponent', () => {
  let component: GeoLoctionComponent;
  let fixture: ComponentFixture<GeoLoctionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeoLoctionComponent]
    });
    fixture = TestBed.createComponent(GeoLoctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
