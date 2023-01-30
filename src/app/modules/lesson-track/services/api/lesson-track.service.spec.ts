import { TestBed } from '@angular/core/testing';
import { LessonTrackService } from './lesson-track.service';

describe('LessonTrackService', () => {
  let service: LessonTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
