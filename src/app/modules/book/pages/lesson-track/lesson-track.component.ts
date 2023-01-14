import { Component, Input, OnInit } from '@angular/core';
import { filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { PagesModel } from '../../models/portfolio-book.model';
import { LessonTrackService } from '../../services/api/lesson-track.service';
import {
  Colors,
  PageControllerService,
} from '../../services/page-controller.service';

@Component({
  selector: 'liv-lesson-track',
  templateUrl: './lesson-track.component.html',
  styleUrls: ['./lesson-track.component.scss'],
})
export class LessonTrackComponent implements OnInit {
  readonly colors$: Observable<Colors> = this.pageControllerService.colors$;
  pageData$: Observable<PagesModel>;

  @Input() pageId = 1;

  constructor(
    private pageControllerService: PageControllerService,
    private lessonTrackService: LessonTrackService
  ) {}

  ngOnInit(): void {
    this.getLessonTrack();
  }

  getLessonTrack(): void {
    this.pageData$ = this.pageControllerService.dynamicCurrentPage$.pipe(
      filter(
        ({ previous, current }) =>
          previous.page === EPages.lesson_track ||
          current.page === EPages.lesson_track
      ),
      switchMap(() =>
        this.lessonTrackService.getTrailActivities(this.pageId).pipe(take(1))
      ),
      map(({ attributes }) => attributes.paginas)
    );
  }
}
