import { Component, Input, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  first,
  map,
  merge,
  Observable,
  switchMap,
  take,
  tap
} from 'rxjs';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { PagesModel } from '../../models/portfolio-book.model';
import { LessonTrackService } from '../../services/api/lesson-track.service';
import {
  Colors,
  PageControllerService,
  PagesConfig
} from '../../services/page-controller.service';

@Component({
  selector: 'liv-lesson-track-register',
  templateUrl: './lesson-track-register.component.html',
  styleUrls: ['./lesson-track-register.component.scss']
})
export class LessonTrackRegisterComponent implements OnInit {
  readonly colors$: Observable<Colors> = this.pageControllerService.colors$;

  currentPage: string;
  _pageData = new BehaviorSubject<
    Record<'currentPage', Observable<PagesModel>>
  >(null);
  pageData$ = this._pageData.asObservable();
  pageDataPrevious$: Observable<PagesModel>;
  pageDataCurrent$: Observable<PagesModel>;
  @Input() pageId = 1;

  constructor(
    private pageControllerService: PageControllerService,
    private lessonTrackService: LessonTrackService
  ) {}
  ngOnInit(): void {
    this.getLessonTrack();
  }
  getLessonTrack(): void {
    const { currentPage } = this.pageControllerService.snapshot;
    this.pageDataCurrent$ = this.pageControllerService.dynamicCurrentPage$.pipe(
      tap(d => console.log('lessontrackregister:current', d)),
      filter(
        current =>
          current.page === EPages.lesson_track_register &&
          current.indexPage === this.pageControllerService.snapshot.currentPage
      ),
      tap(({ indexPage }) => (this.currentPage = String(indexPage))),
      switchMap((current: PagesConfig) =>
        this.lessonTrackService
          .getTrailActivities(
            this.pageControllerService.snapshot.externalIdStrapi,
            current.pageId
          )
          .pipe(take(1))
      ),
      map(({ attributes }) => attributes.paginas)
    );
    this.pageDataPrevious$ =
      this.pageControllerService.dynamicPreviousPage$.pipe(
        tap(d => console.log('lessontrackregister:previous', d)),
        filter(
          previous =>
            previous.page === EPages.lesson_track_register &&
            previous.indexPage ===
              this.pageControllerService.snapshot.currentPage - 1
        ),
        tap(({ indexPage }) => (this.currentPage = String(indexPage))),
        switchMap(previous =>
          this.lessonTrackService
            .getTrailActivities(
              this.pageControllerService.snapshot.externalIdStrapi,
              previous.pageId
            )
            .pipe(take(1))
        ),
        map(({ attributes }) => attributes.paginas)
      );
    const configPage = {
      ...this._pageData.getValue(),
      [this.currentPage]: merge(this.pageDataCurrent$, this.pageDataPrevious$)
    };

    this._pageData.next(configPage);
    //this.pageData$ = configPage;
  }
}
