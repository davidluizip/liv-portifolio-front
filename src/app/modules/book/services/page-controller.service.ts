import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';
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
  pageId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PageControllerService {
  private _pages = new BehaviorSubject<PagesConfig[]>([
    { page: EPages.intro, pageId: 0 }
  ]);
  public pages$ = this._pages.asObservable();

  private _currentPage = new BehaviorSubject<number>(null);
  public currentPage$ = this._currentPage.asObservable();
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

  private get state() {
    return this._state.getValue();
  }

  get snapshot() {
    return {
      currentPage: this._currentPage.getValue(),
      bookId: this._bookId.getValue(),
      externalIdStrapi: this._externalIdStrapi.getValue(),
      mascot: this._state.getValue()?.mascot,
      colors: this._state.getValue()?.colors,
      content: this._state.getValue()?.content
    };
  }

  savePage(page: EPages, pageId?: number): void {
    this._pages.next([...this._pages.getValue(), { page, pageId }]);
  }

  saveColors(colors: Colors) {
    this._state.next({
      ...this.state,
      colors
    });
  }

  saveMascot(mascot: Mascot) {
    this._state.next({
      ...this.state,
      mascot
    });
  }

  saveContent(content: Model<TeacherBookModel>) {
    this._state.next({
      ...this.state,
      content
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
