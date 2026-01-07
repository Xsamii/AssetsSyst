import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingsSettingsComponent } from './buildings-settings.component';

describe('BuildingsSettingsComponent', () => {
  let component: BuildingsSettingsComponent;
  let fixture: ComponentFixture<BuildingsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingsSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildingsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
