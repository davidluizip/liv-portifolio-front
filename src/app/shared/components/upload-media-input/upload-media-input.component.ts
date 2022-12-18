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
  private _base64: string | null;

  constructor(private fileService: FileService) {}

  get file(): File | null {
    return this._file;
  }

  set file(value: File | null) {
    if (value !== this.file) {
      this._file = value;
      this.onChangeCb(value);
    }
  }

  get base64(): string | null {
    return this._base64;
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
      this._base64 = (await this.fileService.base64Encode(this.file)) as string;
    }
  }

  async onChange(event: Event) {
    const { files } = event.target as DOMEvent<HTMLInputElement>['target'];
    if (files) {
      this.file = files[0];
      this._base64 = (await this.fileService.base64Encode(this.file)) as string;
    }
  }

  removePicture() {
    this.file = null;
    this._base64 = null;
  }
}
