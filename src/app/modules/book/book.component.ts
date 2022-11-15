import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { filter, from, fromEvent, map, mergeMap, Subject } from 'rxjs';

@Component({
  selector: 'liv-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
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

  private _switchingPage = false;
  private _switchingPageTimeout: NodeJS.Timeout;
  private _destroy$ = new Subject<boolean>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  get totalPages() {
    return this.pages.length;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    clearTimeout(this._switchingPageTimeout);

    this._destroy$.next(true);
    this._destroy$.complete();
  }

  ngAfterViewInit() {
    const pages = Array.from(
      this.document.getElementsByClassName('page')
    ) as HTMLDivElement[];

    from(pages)
      .pipe(
        mergeMap((page, index) => {
          page['pageNum'] = index + 1;
          if (index % 2 === 0) {
            this.renderer.setStyle(page, 'z-index', pages.length - index);
          }
          return fromEvent(page, 'click').pipe(
            filter(
              () =>
                !this._switchingPage && !page.classList.contains('cover-back')
            ),
            map(_ => ({ page, index }))
          );
        })
      )
      .subscribe(({ page }) => {
        this._switchingPage = true;
        if (page['pageNum'] % 2 === 0) {
          page.classList.remove('flipped');
          page.previousElementSibling.classList.remove('flipped');
        } else {
          page.classList.add('flipped');
          page.nextElementSibling.classList.add('flipped');
        }
        this._switchingPageTimeout = setTimeout(
          () => (this._switchingPage = false),
          250
        );

        const frontCover = this.document.getElementById('main-front-cover');
        if (pages.some(page => page.classList.contains('flipped'))) {
          frontCover.classList.add('main-cover--active');
        } else {
          frontCover.classList.remove('main-cover--active');
        }
      });
  }
}
