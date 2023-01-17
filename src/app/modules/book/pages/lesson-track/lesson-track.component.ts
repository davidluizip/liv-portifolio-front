import { Component, Input } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { LessonTrackContextService } from '../../services/lesson-track-context.service';
import {
  Colors,
  PageControllerService
} from '../../services/page-controller.service';

@Component({
  selector: 'liv-lesson-track',
  templateUrl: './lesson-track.component.html',
  styleUrls: ['./lesson-track.component.scss']
})
export class LessonTrackComponent {
  @Input() lessonTrackPageId: number;

  public readonly colors$: Observable<Colors> =
    this.pageControllerService.colors$;
  public lessonTrack$ = this.lessonTrackContextService.lessonTrack$.pipe(
    tap((data) => console.log('lessonTrack$', data))
  );

  constructor(
    private pageControllerService: PageControllerService,
    private lessonTrackContextService: LessonTrackContextService
  ) {}
}
