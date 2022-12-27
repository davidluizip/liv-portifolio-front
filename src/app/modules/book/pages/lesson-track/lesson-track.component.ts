import { Component, OnInit } from '@angular/core';
import { filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { MediaModel } from '../../models/media.model';
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
  pageData$: Observable<PagesModel> = null;

  constructor(
    private pageControllerService: PageControllerService,
    private lessonTrackService: LessonTrackService
  ) {}

  ngOnInit(): void {
    this.getLessonTrack();
  }

  getLessonTrack(): void {
    this.pageData$ = this.pageControllerService.currentPage$.pipe(
      tap(console.log),
      filter(page => EPages.lesson_track === page || 4 === page),
      switchMap(() =>
        this.lessonTrackService.getTrailActivities().pipe(take(1))
      ),
      map(res => res.attributes.paginas)
    );
  }
}
