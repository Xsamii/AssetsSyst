import { TestBed } from '@angular/core/testing';

import { SurveyDashboardService } from './survey-dashboard.service';

describe('SurveyDashboardService', () => {
  let service: SurveyDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
