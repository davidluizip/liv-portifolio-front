import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  private _file: File;
  private _base64: string;

  constructor(private fileService: FileService) {}

  get file(): File {
    return this._file;
  }
  set file(value: File) {
    if (value !== this.file) {
      this._file = value;
      this.onChangeCb(value);
    }
  }

  get base64(): string {
    return this._base64;
  }

  onChangeCb: (_: File) => void = () => {};
  onTouchedCb: (_: File) => void = () => {};

  writeValue(file: File): void {
    this.file = file;
  }

  registerOnChange(fn: (_: File) => void): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: (_: File) => void): void {
    this.onTouchedCb = fn;
  }

  async upload(files: File[]): Promise<void> {
    const [file] = files;
    this.file = file;
    this._base64 = (await this.fileService.base64Encode(this.file)) as string;
  }

  removePicture() {
    this.file = null;
    this._base64 = null;
  }
}
