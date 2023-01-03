import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

const COLORS = {
  ['NEUTRAL_HIGHT_PURE']: '#fff',
  ['NEUTRAL_HIGHT_PURE_MEDIUM']: '#e0e2e9',
} as const;

type ColorKey = keyof typeof COLORS;
type ColorValue = typeof COLORS[ColorKey];

@Directive({
  selector: '[livDragDropFileUpload]',
})
export class DragDropFileUploadDirective {
  @Output() fileDropped = new EventEmitter<File[]>();

  private _backgroundColor: ColorValue = COLORS.NEUTRAL_HIGHT_PURE;

  @HostBinding('style.backgroundColor') get backgroundColor(): ColorValue {
    return this._backgroundColor;
  }

  @HostListener('dragover', ['$event']) onDragOver(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this._backgroundColor = COLORS.NEUTRAL_HIGHT_PURE_MEDIUM;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this._backgroundColor = COLORS.NEUTRAL_HIGHT_PURE;
  }

  @HostListener('drop', ['$event']) onDrop(event: InputEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this._backgroundColor = COLORS.NEUTRAL_HIGHT_PURE;
    if (event.dataTransfer) {
      const { files } = event.dataTransfer;
      if (files.length > 0) {
        this.fileDropped.emit(Array.from(files).map(file => file));
      }
    }
  }
}
