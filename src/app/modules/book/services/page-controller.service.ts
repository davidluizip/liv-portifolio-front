import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, shareReplay } from 'rxjs';

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

interface Content {
  className: string;
  gradeName: string;
  schoolName: string;
  teacherName: string;
}

export interface BookState {
  mascot: Mascot;
  colors: Colors;
  content: Content;
}

@Injectable({
  providedIn: 'root',
})
export class PageControllerService {
  private _state = new BehaviorSubject<BookState>({} as BookState);
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
      mascot: this._state.getValue()?.mascot,
      colors: this._state.getValue()?.colors,
      content: this._state.getValue()?.content,
    };
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

  saveContent(content: Content) {
    this._state.next({
      ...this.state,
      content,
    });
  }

  reset() {
    this._state.next({} as BookState);
  }
}
