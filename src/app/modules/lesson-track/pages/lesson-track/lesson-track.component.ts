import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Colors,
  PageControllerService
} from '../../../../shell/services/page-controller.service';
import { LessonTrackContextService } from '../../services/lesson-track-context.service';

@Component({
  selector: 'liv-lesson-track',
  templateUrl: './lesson-track.component.html',
  styleUrls: ['./lesson-track.component.scss']
})
export class LessonTrackComponent {
  @Input() lessonTrackPageId: number;

  public readonly colors$: Observable<Colors> =
    this.pageControllerService.colors$;
  public lessonTrack$ = this.lessonTrackContextService.lessonTrack$;

  constructor(
    private pageControllerService: PageControllerService,
    private lessonTrackContextService: LessonTrackContextService
  ) {}
}
