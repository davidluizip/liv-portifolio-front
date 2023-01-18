import { Component, Input } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LessonTrackContextService } from '../../services/lesson-track-context.service';
import {
  Colors,
  PageControllerService
} from '../../services/page-controller.service';

@Component({
  selector: 'liv-lesson-track-register',
  templateUrl: './lesson-track-register.component.html',
  styleUrls: ['./lesson-track-register.component.scss']
})
export class LessonTrackRegisterComponent {
  @Input() lessonTrackPageId: number;

  public readonly colors$: Observable<Colors> =
    this.pageControllerService.colors$;
  public lessonTrackRegister$ =
    this.lessonTrackContextService.lessonTrackRegister$;

  constructor(
    private pageControllerService: PageControllerService,
    private lessonTrackContextService: LessonTrackContextService
  ) {}
}
