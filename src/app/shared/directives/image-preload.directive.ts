import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'onError()',
    '(load)': 'onLoad()',
    '[src]': 'src',
  },
})
export class ImagePreloadDirective {
  @Input() src: string;
  @Input() default: string;
  @HostBinding('class') className: string;

  onError() {
    this.src = this.default;
  }

  onLoad() {
    this.className = 'image-loaded';
  }
}
