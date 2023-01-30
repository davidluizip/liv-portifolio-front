import { TestBed } from '@angular/core/testing';

import { ClassPageService } from './class-page.service';

describe('ClassPageService', () => {
  let service: ClassPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
