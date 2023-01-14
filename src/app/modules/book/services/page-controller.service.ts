import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, of, switchMap, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { TeacherBookModel } from '../models/teacher-book.model';

export interface Colors {
  brand: string;
  brand_light: string;
  primary: string;
  secondary: string;
  tertiary: string;
}

interface Mascot {
  src: string;
  alt?: string;
}

export interface BookState {
  mascot: Mascot;
  colors: Colors;
  content: Model<TeacherBookModel>;
}
export interface PagesConfig {
  page: EPages;
  pageId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PageControllerService {
  private pages: PagesConfig[][] = [];

  private _dynamicPages = new BehaviorSubject<PagesConfig[]>([]);
  public dynamicPages$ = this._dynamicPages.asObservable();

  private _currentPage = new BehaviorSubject<number>(null);
  public currentPage$ = this._currentPage.asObservable();

  public dynamicCurrentPage$ = this.currentPage$.pipe(
    switchMap(() => of(this.pages)),
    map(pages => {
      const book: Record<'previous' | 'current', any> = {
        previous: {},
        current: {},
      };

      let count = 0;

      const currentPageIndex = pages.findIndex(() => {
        const pos = (count += 2);
        return pos === this.snapshot.currentPage;
      });

      if (currentPageIndex > -1 && this.pages.length > 0) {
        const [previous, current] = this.pages[currentPageIndex];
        book.previous = previous;

        if (current) {
          book.current = current;
        }
      }

      return book;
    })
  );

  private _bookId = new BehaviorSubject<number>(null);
  public bookId$ = this._bookId.asObservable();

  private _externalIdStrapi = new BehaviorSubject<number>(null);
  public externalIdStrapi$ = this._bookId.asObservable();

  private _state = new BehaviorSubject<BookState>(null);
  public state$ = this._state.asObservable();

  public colors$ = this._state.asObservable().pipe(
    filter(state => !!state?.colors),
    map(({ colors }) => colors)
  );

  constructor() {
    const initialPages = [{ page: EPages.class }, { page: EPages.intro }];

    this._dynamicPages.next(initialPages);
    this.pages.push(initialPages);
  }

  private get state() {
    return this._state.getValue();
  }

  get snapshot() {
    return {
      dynamicPages: this._dynamicPages.getValue(),
      currentPage: this._currentPage.getValue(),
      bookId: this._bookId.getValue(),
      externalIdStrapi: this._externalIdStrapi.getValue(),
      mascot: this._state.getValue()?.mascot,
      colors: this._state.getValue()?.colors,
      content: this._state.getValue()?.content,
    };
  }

  savePages(pages: PagesConfig[]): void {
    this.pages.push(pages);
  }

  saveDynamicPage({ page, pageId }: PagesConfig): void {
    this._dynamicPages.next([
      ...this._dynamicPages.getValue(),
      { page, pageId },
    ]);
  }

  saveColors(colors: Colors) {
    this._state.next({
      ...this.state,
      colors,
    });
  }

  saveMascot(mascot: Mascot) {
    this._state.next({
      ...this.state,
      mascot,
    });
  }

  saveContent(content: Model<TeacherBookModel>) {
    this._state.next({
      ...this.state,
      content,
    });
  }

  saveBookId(bookId: number) {
    this._bookId.next(bookId);
  }

  saveExternalIdStrapi(externalIdStrapi: number) {
    this._externalIdStrapi.next(externalIdStrapi);
  }

  saveCurrentPage(page: number) {
    this._currentPage.next(page);
  }

  reset() {
    this._state.next(null);
  }
}
