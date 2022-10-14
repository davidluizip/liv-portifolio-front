import { TestBed } from '@angular/core/testing';

import { CapitalizeService } from './capitalize.service';

describe('CapitalizeService', () => {
  let service: CapitalizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapitalizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
