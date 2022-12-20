import { TestBed } from '@angular/core/testing';

import { RegisterContextService } from './register-context.service';

describe('RegisterContextService', () => {
  let service: RegisterContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
