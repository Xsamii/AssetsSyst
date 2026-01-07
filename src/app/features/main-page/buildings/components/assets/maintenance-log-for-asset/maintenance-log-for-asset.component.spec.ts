import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceLogForAssetComponent } from './maintenance-log-for-asset.component';

describe('MaintenanceLogForAssetComponent', () => {
  let component: MaintenanceLogForAssetComponent;
  let fixture: ComponentFixture<MaintenanceLogForAssetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceLogForAssetComponent]
    });
    fixture = TestBed.createComponent(MaintenanceLogForAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
