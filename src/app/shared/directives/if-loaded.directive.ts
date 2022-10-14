import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

export type Loaded<T> = { type: LoadingStateEnum.loaded; data: T };
export type Loading = { type: LoadingStateEnum.loading };
export type LoadingState<T> = Loaded<T> | Loading;
export enum LoadingStateEnum {
  loading = 'loading',
  loaded = 'loaded'
}

class IfLoadedContext<T> {
  $implicit: T;
}

@Directive({
  selector: '[livIfLoaded]'
})
export class IfLoadedDirective<T> implements OnInit {
  private _state: LoadingState<T>;
  private _context = new IfLoadedContext<T>();

  @Input('livIfLoaded') set state(state: LoadingState<T>) {
    if (!state) {
      state = {
        type: LoadingStateEnum.loading
      };
    } else {
      if (state.type === LoadingStateEnum.loaded) {
        this._context.$implicit = state.data;
        this._createContainer(this._context);
      }
    }
    this._state = state;
  }
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('livIfLoadedElse') placeholder: TemplateRef<unknown>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private template: TemplateRef<IfLoadedContext<T>>
  ) {}

  ngOnInit(): void {
    if (this._state.type === LoadingStateEnum.loading) {
      this._clearContainer();
    }
  }

  static ngTemplateGuard_livIfLoaded<T>(
    _: IfLoadedDirective<T>,
    expr: LoadingState<T>
  ): expr is Loaded<T> {
    return true;
  }

  private _createContainer(context: IfLoadedContext<T>): void {
    if (this.placeholder) {
      this.viewContainerRef.clear();
    }

    this.viewContainerRef.createEmbeddedView(this.template, context);
  }

  private _clearContainer(): void {
    this.viewContainerRef.clear();
    if (this.placeholder) {
      this.viewContainerRef.createEmbeddedView(this.placeholder);
    }
  }
}
