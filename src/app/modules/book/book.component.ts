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
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, from, mergeMap, of, Subject } from 'rxjs';
import { grades } from './grades';

@Component({
  selector: 'liv-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookComponent implements OnInit, OnDestroy, AfterViewInit {
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

  gradeBook = grades['1-ano'];

  private _switchingPage = false;
  private _switchingPageTimeout: NodeJS.Timeout;
  private _destroy$ = new Subject<boolean>();

  media = new FormControl(null);
  currentPage = 0;

  isEnabledEditing = false;

  textareaValue = 'Escreva aqui um breve texto sobre a sua turma.';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  pagesElement: HTMLDivElement[];

  get totalPages() {
    return this.pages.length;
  }

  get textareaPlaceholder() {
    return this.isEnabledEditing
      ? `Profressor, escreva aqui um uma descrição da turma.\n\nSugestão: Quantidade de alunos, características da tumas (são animados, curiosos, divertidos...).`
      : '';
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
        this.gradeBook = grades[params['grade']];
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
    ) as HTMLDivElement[];
    this.pagesElement = pages;

    from(pages)
      .pipe(mergeMap((page, index) => of({ page, index })))
      .subscribe(({ page, index }) => {
        page['pageNum'] = index + 1;
        if (index % 2 === 0) {
          this.renderer.setStyle(page, 'z-index', pages.length - index);
        }
      });
  }

  handlePreviousPage() {
    const flippedPages = this.pagesElement.filter(page =>
      page.classList.contains('flipped')
    );

    if (this._switchingPage || flippedPages.length === 0) return;

    const lastFlippedPageIndex = flippedPages.length - 1;
    const lastFlippedPage = flippedPages[lastFlippedPageIndex];

    const lastFlippedPageNum = lastFlippedPage['pageNum'] as number;
    const previousPageToFlip = this.pagesElement.find(
      page => page['pageNum'] === lastFlippedPageNum
    );

    previousPageToFlip.classList.remove('flipped');
    previousPageToFlip.previousElementSibling.classList.remove('flipped');

    if (lastFlippedPageNum - 2 === 0) {
      const frontCover = this.document.getElementById('main-front-cover');
      if (frontCover.classList.contains('main-cover--active')) {
        frontCover.classList.remove('main-cover--active');
      }
    }

    this.currentPage = lastFlippedPageNum - 2;

    this._switchingPageTimeout = setTimeout(
      () => (this._switchingPage = false),
      250
    );
  }

  handleNextPage() {
    if (
      this._switchingPage ||
      this.pagesElement[this.currentPage + 1].classList.contains('cover-back')
    )
      return;

    let nextPageToFlip = this.pagesElement[0];

    const flippedPages = this.pagesElement.filter(page =>
      page.classList.contains('flipped')
    );

    if (flippedPages.length > 0) {
      const lastFlippedPageIndex = flippedPages.length - 1;
      const lastFlippedPage = flippedPages[lastFlippedPageIndex];

      const lastFlippedPageNum = lastFlippedPage['pageNum'] as number;
      nextPageToFlip = this.pagesElement.find(
        page => page['pageNum'] === lastFlippedPageNum + 1
      );
    }

    nextPageToFlip.classList.add('flipped');
    nextPageToFlip.nextElementSibling.classList.add('flipped');

    if (nextPageToFlip['pageNum'] === 1) {
      const frontCover = this.document.getElementById('main-front-cover');
      frontCover.classList.add('main-cover--active');
    }

    this.currentPage = nextPageToFlip['pageNum'];

    this._switchingPageTimeout = setTimeout(
      () => (this._switchingPage = false),
      250
    );
  }
}
