import { Component, Input } from '@angular/core';
import { filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { PagesModel } from '../../models/portfolio-book.model';
import { LessonTrackService } from '../../services/api/lesson-track.service';
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
  readonly colors$: Observable<Colors> = this.pageControllerService.colors$;

  pageData$: Observable<PagesModel>;
  @Input() pageId = 1;

  constructor(
    private pageControllerService: PageControllerService,
    private lessonTrackService: LessonTrackService
  ) {}
  getLessonTrack(): void {
    this.pageData$ = this.pageControllerService.currentPage$.pipe(
      filter(page => EPages.lesson_track_register === page),
      switchMap(() =>
        this.lessonTrackService.getTrailActivities(this.pageId).pipe(take(1))
      ),
      map(({ attributes }) => attributes.paginas),
      tap(console.log)
    );
  }
}
