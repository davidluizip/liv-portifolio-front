import { TestBed } from '@angular/core/testing';

import { LessonTrackContextService } from './lesson-track-context.service';

describe('LessonTrackContextService', () => {
  let service: LessonTrackContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonTrackContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
