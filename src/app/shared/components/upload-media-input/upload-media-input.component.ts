import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOMEvent } from '../../interfaces/dom-event';
import { FileService } from '../../utils/services/file/file.service';

@Component({
  selector: 'liv-upload-media-input',
  templateUrl: './upload-media-input.component.html',
  styleUrls: ['./upload-media-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadMediaInputComponent),
      multi: true,
    },
  ],
})
export class UploadMediaInputComponent implements ControlValueAccessor {
  private _file: File | null;
  private _url: string | null;

  constructor(private fileService: FileService) {}

  get file(): File | null {
    return this._file;
  }

  set file(obj: File | null | string) {
    if (obj !== this.file) {
      if (typeof obj === 'string') {
        this._url = obj;
      } else {
        this._file = obj;
        if (this._file) {
          this._url = this.fileService.createObjectURL(obj);
        }
        this.onChangeCb(this._file);
      }
    }
  }

  get url(): string | null {
    return this._url;
  }

  onChangeCb: (_: File | null) => void = () => {};
  onTouchedCb: (_: File | null) => void = () => {};

  writeValue(file: File | null): void {
    this.file = file;
  }

  registerOnChange(fn: (_: File | null) => void): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: (_: File | null) => void): void {
    this.onTouchedCb = fn;
  }

  async onUpload(files: File[] | null): Promise<void> {
    if (files) {
      this.file = files[0];
    }
  }

  async onChange(event: Event) {
    const { files } = event.target as DOMEvent<HTMLInputElement>['target'];
    if (files) {
      this.file = files[0];
    }
  }

  removePicture() {
    this.file = null;

    if (this.url) {
      this.fileService.revokeObjectURL(this.url);
      this._url = null;
    }
  }
}
