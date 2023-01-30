import { TestBed } from '@angular/core/testing';

import { LessonTrackRegisterContextService } from './lesson-track-register-context.service';

describe('LessonTrackRegisterContextService', () => {
  let service: LessonTrackRegisterContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonTrackRegisterContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
