import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[overlay]',
})
export class OverlayDirective implements AfterViewInit, OnDestroy {
  @Output() onClickOuside = new EventEmitter<void>();
  @Input() set activeOverlay(value: boolean) {
    this._activeOverlay = value;
    if (this.activeOverlay) this.renderer.addClass(this._body, 'no-scroll');
    else this.renderer.removeClass(this._body, 'no-scroll');
  }
  get activeOverlay() {
    return this._activeOverlay;
  }
  private _activeOverlay: boolean;
  private _body: HTMLElement;
  private _documentClickSubscription: Subscription | undefined;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {
    this._body = this.document.body;
  }

  @HostBinding('class.overlay-panel--active') get addActiveClass() {
    return this.activeOverlay;
  }

  ngOnDestroy(): void {
    this._documentClickSubscription?.unsubscribe();
    if (this.activeOverlay) this.renderer.removeClass(this._body, 'no-scroll');
  }

  ngAfterViewInit(): void {
    this._documentClickSubscription = fromEvent(
      this.elementRef.nativeElement,
      'click'
    )
      .pipe(
        filter(() => !!this.elementRef?.nativeElement && this.activeOverlay)
      )
      .subscribe(() => this.onClickOuside.emit());
  }
}
