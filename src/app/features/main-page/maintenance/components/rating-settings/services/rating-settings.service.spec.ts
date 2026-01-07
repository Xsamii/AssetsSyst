import { TestBed } from '@angular/core/testing';

import { RatingSettingsService } from './rating-settings.service';

describe('RatingSettingsService', () => {
  let service: RatingSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatingSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
