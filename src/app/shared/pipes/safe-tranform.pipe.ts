import { Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeUrl
} from '@angular/platform-browser';

@Pipe({
  name: 'safeTransform'
})
export class SafeTransformPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    item: string,
    type: 'HTML' | 'URL' | 'RESOURCE'
  ): SafeHtml | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'HTML':
        return this.sanitizer.bypassSecurityTrustHtml(item);
      case 'URL':
        return this.sanitizer.bypassSecurityTrustUrl(item);
      case 'RESOURCE':
        return this.sanitizer.bypassSecurityTrustResourceUrl(item);
      default:
        throw Error(`Invalid type: ${String(type)}`);
    }
  }
}
