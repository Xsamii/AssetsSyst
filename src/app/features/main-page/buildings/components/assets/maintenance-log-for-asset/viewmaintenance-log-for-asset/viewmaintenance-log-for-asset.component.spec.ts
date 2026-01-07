import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmaintenanceLogForAssetComponent } from './viewmaintenance-log-for-asset.component';

describe('ViewmaintenanceLogForAssetComponent', () => {
  let component: ViewmaintenanceLogForAssetComponent;
  let fixture: ComponentFixture<ViewmaintenanceLogForAssetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewmaintenanceLogForAssetComponent]
    });
    fixture = TestBed.createComponent(ViewmaintenanceLogForAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
