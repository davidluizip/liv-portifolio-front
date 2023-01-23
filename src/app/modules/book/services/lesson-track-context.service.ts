import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  filter,
  map,
  merge,
  Observable,
  of,
  switchMap,
  take,
  tap
} from 'rxjs';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { PagesModel } from '../models/portfolio-book.model';
import { LessonTrackService } from './api/lesson-track.service';
import { PageControllerService } from './page-controller.service';

interface LessonTrack {
  content: PagesModel;
}
export type LessonTrackData = Record<string, LessonTrack>;

@Injectable({
  providedIn: 'root'
})
export class LessonTrackContextService {
  private _lessonTrack = new BehaviorSubject<LessonTrackData | null>({});
  lessonTrack$ = this._lessonTrack.asObservable();

  private _lessonTrackRegister = new BehaviorSubject<LessonTrackData | null>(
    {}
  );
  lessonTrackRegister$ = this._lessonTrackRegister.asObservable();

  constructor(
    private pageControllerService: PageControllerService,
    private lessonTrackService: LessonTrackService
  ) {}

  get snapshot() {
    return {
      lessonTrack: this._lessonTrack.getValue()
    };
  }

  private getLessonTrack(lessonTrackPageId: number): Observable<PagesModel> {
    return this.lessonTrackService
      .getTrailActivities(
        this.pageControllerService.snapshot.externalIdStrapi,
        lessonTrackPageId
      )
      .pipe(map(({ attributes }) => attributes.paginas));
  }

  listenLessonTrack(): void {
    this.pageControllerService.dynamicPreviousPage$
      .pipe(
        filter(({ indexPage, page }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          return currentPage - 1 === indexPage && page === EPages.lesson_track;
        }),
        switchMap((page) => {
          return this.getLessonTrack(page.pageId);
        })
      )
      .subscribe((data) => {
        const cachedLessonTrack = this._lessonTrack.getValue() || {};

        const { currentPage } = this.pageControllerService.snapshot;

        const previousPage = currentPage - 1;

        const lessonTrack = {
          ...cachedLessonTrack,
          [previousPage]: {
            content: data
          }
        };

        this._lessonTrack.next(lessonTrack);
      });

    this.pageControllerService.dynamicCurrentPage$
      .pipe(
        filter(({ indexPage, page }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          return currentPage === indexPage && page === EPages.lesson_track;
        }),
        switchMap((page) => {
          return this.getLessonTrack(page.pageId);
        })
      )
      .subscribe((data) => {
        const cachedLessonTrack = this._lessonTrack.getValue() || {};

        const { currentPage } = this.pageControllerService.snapshot;

        const lessonTrack = {
          ...cachedLessonTrack,
          [currentPage]: {
            content: data
          }
        };

        this._lessonTrack.next(lessonTrack);
      });
  }

  listenLessonTrackRegister(): void {
    this.pageControllerService.dynamicPreviousPage$
      .pipe(
        filter(({ indexPage, page }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          return (
            currentPage - 1 === indexPage &&
            page === EPages.lesson_track_register
          );
        }),
        switchMap((page) => {
          return this.getLessonTrack(page.pageId);
        })
      )
      .subscribe((data) => {
        const cachedLessonTrackRegister =
          this._lessonTrackRegister.getValue() || {};

        const { currentPage } = this.pageControllerService.snapshot;

        const previousPage = currentPage - 1;

        const lessonTrackRegister = {
          ...cachedLessonTrackRegister,
          [previousPage]: {
            content: data
          }
        };

        this._lessonTrackRegister.next(lessonTrackRegister);
      });

    this.pageControllerService.dynamicCurrentPage$
      .pipe(
        filter(({ indexPage, pageId, page }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          return (
            currentPage === indexPage && page === EPages.lesson_track_register
          );
        }),
        switchMap((page) => {
          return this.getLessonTrack(page.pageId);
        })
      )
      .subscribe((data) => {
        const cachedLessonTrackRegister =
          this._lessonTrackRegister.getValue() || {};

        const { currentPage } = this.pageControllerService.snapshot;

        const lessonTrackRegister = {
          ...cachedLessonTrackRegister,
          [currentPage]: {
            content: data
          }
        };

        this._lessonTrackRegister.next(lessonTrackRegister);
      });
  }
}
