import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, from, mergeMap, of, Subject, take, tap } from 'rxjs';
import { LoadingOverlayService } from 'src/app/shared/components/loading-overlay/loading-overlay.service';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { ResumeRegisterModel } from './models/portfolio-book.model';
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
export class BookComponent implements AfterViewInit, OnDestroy {
  readonly PageEnum = EPages;

  public currentPage = 0;
  public totalPages = 0;

  public bookColors$ = this.pageControllerService.colors$;
  public pages$ = this.pageControllerService.dynamicPages$.pipe(
    tap(pages => (this.totalPages = pages.length + 1))
  );

  private destroy$ = new Subject<boolean>();

  private coverBackPage: HTMLDivElementPage;

  public footerBackground: string;
  public pagesElement: HTMLDivElementPage[];

  private switchingPage = false;
  private currentIsCoverBackPage = false;

  /** Timeouts References */
  private bookTimeoutRef: NodeJS.Timeout;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private pageControllerService: PageControllerService,
    private loadingOverlayService: LoadingOverlayService
  ) {}

  get showPreviousButton() {
    return this.currentPage > 0;
  }

  get showNextButton() {
    return !this.currentIsCoverBackPage;
  }

  get showCloseButton() {
    return this.currentPage > 0;
  }

  ngOnDestroy(): void {
    clearTimeout(this.bookTimeoutRef);

    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.route.data
      .pipe(filter(data => !!data['book']))
      .subscribe(() => this.startConfigPages());
  }

  startConfigPages(resume?: ResumeRegisterModel) {
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

        this.awaitTimeout(() => this.loadingOverlayService.remove());
      });
  }

  handleCloseBook() {
    if (this.currentPage === 0) return;

    const flippedPages = this.document.getElementsByClassName('flipped');
    Array.from(flippedPages).forEach(page => page.classList.remove('flipped'));

    const frontCover = this.document.getElementById('main-front-cover');
    frontCover?.classList.remove('main-cover--active');

    this.currentPage = 0;
    this.currentIsCoverBackPage = false;
  }

  handlePreviousPage() {
    if (this.switchingPage || this.currentPage === 0) return;

    if (this.currentIsCoverBackPage) {
      this.currentIsCoverBackPage = false;
    }

    this.switchingPage = true;

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

    this.currentPage = lastFlippedPageNum - 3;
    this.pageControllerService.saveCurrentPage(this.currentPage);

    this.awaitTimeout(() => (this.switchingPage = false));
  }

  handleNextPage() {
    if (
      this.switchingPage ||
      (this.currentIsCoverBackPage &&
        this.coverBackPage['page-number'] % 2 !== 0)
    )
      return;

    this.switchingPage = true;

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

    nextPageToFlip?.classList.add('flipped');
    nextPageToFlip.nextElementSibling?.classList.add('flipped');

    if (nextPageToFlip['page-number'] === 1) {
      const frontCover = this.document.getElementById('main-front-cover');
      frontCover?.classList.add('main-cover--active');
    }

    this.currentPage = nextPageToFlip['page-number'] + 1;
    this.pageControllerService.saveCurrentPage(this.currentPage);

    this.currentIsCoverBackPage =
      this.currentPage >= this.totalPages ||
      this.pagesElement[this.currentPage]?.classList.contains('cover-back');

    this.awaitTimeout(() => (this.switchingPage = false));
  }

  private awaitTimeout(fn: () => void) {
    this.bookTimeoutRef = setTimeout(fn, 500);
  }
}
