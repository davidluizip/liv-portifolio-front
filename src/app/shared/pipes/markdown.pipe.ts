import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml | string {
    if (value && value.length > 0) {
      return this.sanitizer.bypassSecurityTrustHtml(marked(value));
    }
    return value;
  }
}
