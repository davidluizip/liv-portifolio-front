import { TestBed } from '@angular/core/testing';

import { BeforeLoadGuard } from './before-load.guard';

describe('BeforeLoadGuard', () => {
  let guard: BeforeLoadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BeforeLoadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
