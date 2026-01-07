import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPartComponent } from './details-part.component';

describe('DetailsPartComponent', () => {
  let component: DetailsPartComponent;
  let fixture: ComponentFixture<DetailsPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsPartComponent]
    });
    fixture = TestBed.createComponent(DetailsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
