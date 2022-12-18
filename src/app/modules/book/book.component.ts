import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, from, mergeMap, of, Subject } from 'rxjs';
import { grades } from './grades';
import { PageControllerService } from './services/page-controller.service';

interface HTMLDivElementPage extends HTMLDivElement {
  pageNum: number;
}

@Component({
  selector: 'liv-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookComponent implements OnInit, AfterViewInit {
  pages: string[] = [
    'Primeira Pagina',
    'Segunda Pagina',
    'Terceira Pagina',
    'Quarta Pagina',
    'Quinta Pagina',
    'Sexta Pagina',
    'Setima Pagina',
    'Oitava Pagina',
  ];

  book = grades['1-ano'];

  private _switchingPage = false;
  private _switchingPageTimeout: NodeJS.Timeout;
  private _destroy$ = new Subject<boolean>();

  footerBackground: string;

  media = new FormControl(null);
  currentPage = 0;
  pagesElement: HTMLDivElementPage[];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private pageControllerService: PageControllerService
  ) {
    const { colors, content, mascot } = this.book;

    this.pageControllerService.saveColors(colors);
    this.pageControllerService.saveMascot(mascot);
    this.pageControllerService.saveContent(content);
  }

  get totalPages() {
    return this.pages.length;
  }

  get showPreviousButton() {
    return this.currentPage > 0;
  }

  get showNextButton() {
    return this.currentPage >= 0 && this.currentPage <= this.pages.length;
  }

  get showCloseButton() {
    return this.currentPage > 0;
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        filter(
          params =>
            params['grade'] &&
            Object.keys(grades).some(key => key === params['grade'])
        )
      )
      .subscribe(params => {
        const grade = (params as { grade: keyof typeof grades }).grade;
        this.book = grades[grade];

        const { colors, content, mascot } = this.book;
        this.pageControllerService.saveColors(colors);
        this.pageControllerService.saveMascot(mascot);
        this.pageControllerService.saveContent(content);
      });
  }

  ngOnDestroy(): void {
    clearTimeout(this._switchingPageTimeout);

    this._destroy$.next(true);
    this._destroy$.complete();
  }

  ngAfterViewInit() {
    const pages = Array.from(
      this.document.getElementsByClassName('page')
    ) as HTMLDivElementPage[];
    this.pagesElement = pages;

    from(pages)
      .pipe(mergeMap((page, index) => of({ page, index })))
      .subscribe(({ page, index }) => {
        page.pageNum = index + 1;
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

    this._switchingPage = true;

    const flippedPages = this.pagesElement.filter(page =>
      page.classList.contains('flipped')
    );

    const lastFlippedPageIndex = flippedPages.length - 1;
    const lastFlippedPage = flippedPages[lastFlippedPageIndex];

    const lastFlippedPageNum = (
      lastFlippedPage as HTMLDivElement & { pageNum: number }
    ).pageNum as number;
    const previousPageToFlip = this.pagesElement.find(
      page => page.pageNum === lastFlippedPageNum
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

    this._switchingPageTimeout = setTimeout(
      () => (this._switchingPage = false),
      450
    );
  }

  handleNextPage() {
    if (
      this._switchingPage ||
      this.pagesElement[this.currentPage + 1].classList.contains('cover-back')
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

      const lastFlippedPageNum = lastFlippedPage.pageNum;

      nextPageToFlip = this.pagesElement.find(
        page => page.pageNum === lastFlippedPageNum + 1
      )!;
    }

    nextPageToFlip.classList.add('flipped');
    nextPageToFlip.nextElementSibling?.classList.add('flipped');

    if (nextPageToFlip.pageNum === 1) {
      const frontCover = this.document.getElementById('main-front-cover');
      frontCover?.classList.add('main-cover--active');
    }

    this.currentPage = nextPageToFlip.pageNum;

    this._switchingPageTimeout = setTimeout(
      () => (this._switchingPage = false),
      450
    );
  }
}
