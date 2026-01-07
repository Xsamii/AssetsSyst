import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabComponent } from './sub-tab.component';

describe('SubTabComponent', () => {
  let component: SubTabComponent;
  let fixture: ComponentFixture<SubTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubTabComponent]
    });
    fixture = TestBed.createComponent(SubTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
