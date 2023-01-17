import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'substring'
})
export class SubstringPipe implements PipeTransform {
  transform(value: string, pos: number[]): string {
    const [start, end] = pos;

    return value.substring(start, end || value.length);
  }
}
