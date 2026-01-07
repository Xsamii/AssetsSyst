import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalfunctionsTypesComponent } from './malfunctions-types.component';

describe('MalfunctionsTypesComponent', () => {
  let component: MalfunctionsTypesComponent;
  let fixture: ComponentFixture<MalfunctionsTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MalfunctionsTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MalfunctionsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
