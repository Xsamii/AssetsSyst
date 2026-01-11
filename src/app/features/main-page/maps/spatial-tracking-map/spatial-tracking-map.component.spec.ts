import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpatialTrackingMapComponent } from './spatial-tracking-map.component';

describe('SpatialTrackingMapComponent', () => {
  let component: SpatialTrackingMapComponent;
  let fixture: ComponentFixture<SpatialTrackingMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpatialTrackingMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpatialTrackingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

