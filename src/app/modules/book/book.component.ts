import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay, filter, from, mergeMap, of, Subject, take, tap } from 'rxjs';
import { EPages } from 'src/app/shared/enum/pages.enum';
import bookConfig from './book-config';
import { CoverFrontService } from './services/api/cover-front.service';
import { LessonTrackService } from './services/api/lesson-track.service';
import { PageControllerService } from './services/page-controller.service';

interface HTMLDivElementPage extends HTMLDivElement {
  ['page-number']: number;
}

@Component({
  selector: 'liv-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookComponent implements OnInit, AfterViewInit {
  readonly PageEnum = EPages;

  currentPage = 0;
  totalPages = 0;

  pages$ = this.pageControllerService.pages$.pipe(
    tap(pages => (this.totalPages = pages.length))
  );
  bookColors$ = this.pageControllerService.colors$;

  private _switchingPage = false;
  private _switchingPageTimeout: NodeJS.Timeout;
  private _destroy$ = new Subject<boolean>();

  private coverBackPage: HTMLDivElementPage;

  footerBackground: string;
  pagesElement: HTMLDivElementPage[];

  private currentIsCoverBackPage = false;

  private startPageConfig$ = new Subject<boolean>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private pageControllerService: PageControllerService,
    private coverFrontService: CoverFrontService,
    private lessonTrackService: LessonTrackService
  ) {}

  get showPreviousButton() {
    return this.currentPage > 0;
  }

  get showNextButton() {
    return (
      this.currentPage <= this.totalPages + 1 &&
      (!this.currentIsCoverBackPage ||
        this.coverBackPage['page-number'] % 2 === 0)
    );
  }

  get showCloseButton() {
    return this.currentPage > 0;
  }

  getFirstLessonTrackPage() {
    this.lessonTrackService
      .getTrailActivities()
      .pipe(
        filter(({ attributes }) => attributes && attributes.paginas?.count > 0)
      )
      .subscribe(({ attributes }) => {
        Array.from({ length: attributes.paginas.count }).forEach(() => {
          this.pageControllerService.savePage(EPages.lesson_track);
        });
        this.pageControllerService.savePage(EPages.register);
        this.pageControllerService.savePage(EPages.register);
      });
  }

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');

    const id = Number(bookId);

    this.pageControllerService.saveBookId(id);
    this.coverFrontService
      .getClassData(id)
      .pipe(take(1))
      .subscribe(data => {
        if (data.attributes) {
          const serie = data.attributes.serie.replace(/ /g, '-');

          const { colors, mascot } = bookConfig[serie];

          this.pageControllerService.saveContent(data);
          this.pageControllerService.saveColors(colors);
          this.pageControllerService.saveMascot(mascot);

          this.startPageConfig$.next(true);

          this.getFirstLessonTrackPage();
        }
      });
  }

  ngOnDestroy(): void {
    clearTimeout(this._switchingPageTimeout);

    this._destroy$.next(true);
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.startPageConfig$
      .pipe(
        filter(start => !!start),
        delay(250)
      )
      .subscribe(() => this.startConfigPages());
  }

  startConfigPages() {
    const pages = Array.from(
      this.document.getElementsByClassName('page')
    ) as HTMLDivElementPage[];

    this.pagesElement = pages;
    this.coverBackPage = this.document.getElementById(
      'cover-back-page'
    ) as HTMLDivElementPage;

    from(pages)
      .pipe(mergeMap((page, index) => of({ page, index })))
      .subscribe(({ page, index }) => {
        page['page-number'] = index + 1;
        if (index % 2 === 0) {
          this.renderer.setStyle(page, 'z-index', pages.length - index);
        }
      });
  }

  handleCloseBook() {
    if (this.currentPage === 0) return;

    const flippedPages = this.document.getElementsByClassName('flipped');
    Array.from(flippedPages).forEach(page => page.classList.remove('flipped'));

    const frontCover = this.document.getElementById('main-front-cover');
    frontCover?.classList.remove('main-cover--active');

    this.currentPage = 0;
  }

  handlePreviousPage() {
    if (this._switchingPage || this.currentPage === 0) return;

    if (this.currentIsCoverBackPage) {
      this.currentIsCoverBackPage = false;
    }

    this._switchingPage = true;

    const flippedPages = this.pagesElement.filter(page =>
      page.classList.contains('flipped')
    );

    const lastFlippedPageIndex = flippedPages.length - 1;
    const lastFlippedPage = flippedPages[lastFlippedPageIndex];

    const lastFlippedPageNum = lastFlippedPage['page-number'];
    const previousPageToFlip = this.pagesElement.find(
      page => page['page-number'] === lastFlippedPageNum
    );

    previousPageToFlip?.classList.remove('flipped');
    previousPageToFlip?.previousElementSibling?.classList.remove('flipped');

    if (lastFlippedPageNum - 2 === 0) {
      const frontCover = this.document.getElementById('main-front-cover');
      if (frontCover?.classList.contains('main-cover--active')) {
        frontCover.classList.remove('main-cover--active');
      }
    }

    this.currentPage = lastFlippedPageNum - 2;
    this.pageControllerService.saveCurrentPage(this.currentPage);
    this._switchingPageTimeout = setTimeout(
      () => (this._switchingPage = false),
      450
    );

    console.log(this.totalPages, this.currentPage);
  }

  handleNextPage() {
    if (
      this._switchingPage ||
      (this.currentIsCoverBackPage &&
        this.coverBackPage['page-number'] % 2 !== 0)
    )
      return;

    this._switchingPage = true;

    let nextPageToFlip = this.pagesElement[0];

    const flippedPages = this.pagesElement.filter(page =>
      page.classList.contains('flipped')
    );

    if (flippedPages.length > 0) {
      const lastFlippedPageIndex = flippedPages.length - 1;
      const lastFlippedPage = flippedPages[lastFlippedPageIndex];

      const lastFlippedPageNum = lastFlippedPage['page-number'];

      nextPageToFlip = this.pagesElement.find(
        page => page['page-number'] === lastFlippedPageNum + 1
      )!;
    }

    nextPageToFlip.classList.add('flipped');
    nextPageToFlip.nextElementSibling?.classList.add('flipped');

    if (nextPageToFlip['page-number'] === 1) {
      const frontCover = this.document.getElementById('main-front-cover');
      frontCover?.classList.add('main-cover--active');
    }

    console.log(nextPageToFlip['page-number']);

    this.currentPage = nextPageToFlip['page-number'];
    this.pageControllerService.saveCurrentPage(this.currentPage);

    this.currentIsCoverBackPage =
      this.currentPage >= this.totalPages ||
      this.pagesElement[this.currentPage + 1].classList.contains('cover-back');

    this._switchingPageTimeout = setTimeout(
      () => (this._switchingPage = false),
      450
    );
  }
}
