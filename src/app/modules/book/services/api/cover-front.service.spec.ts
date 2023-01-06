import { TestBed } from '@angular/core/testing';

import { CoverFrontService } from './cover-front.service';

describe('CoverFrontService', () => {
  let service: CoverFrontService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoverFrontService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
