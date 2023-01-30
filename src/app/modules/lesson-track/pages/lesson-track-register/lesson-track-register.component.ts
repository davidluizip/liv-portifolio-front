import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Colors,
  PageControllerService
} from 'src/app/shell/services/page-controller.service';
import { LessonTrackContextService } from '../../services/lesson-track-context.service';

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
