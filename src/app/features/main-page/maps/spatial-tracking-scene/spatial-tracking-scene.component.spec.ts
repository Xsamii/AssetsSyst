import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpatialTrackingSceneComponent } from './spatial-tracking-scene.component';

describe('SpatialTrackingSceneComponent', () => {
  let component: SpatialTrackingSceneComponent;
  let fixture: ComponentFixture<SpatialTrackingSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpatialTrackingSceneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpatialTrackingSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

