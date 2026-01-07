import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBuildingsComponent } from './main-buildings.component';

describe('MainBuildingsComponent', () => {
  let component: MainBuildingsComponent;
  let fixture: ComponentFixture<MainBuildingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainBuildingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainBuildingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
