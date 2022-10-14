import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CapitalizeService {
  private _abbreviation(str: string): boolean {
    return /^([A-Z]\.)+$/.test(str);
  }

  private _romanNum(str: string): boolean {
    return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(str);
  }

  capitalize(text: string): string {
    const prepos = ['da', 'do', 'das', 'dos', 'a', 'e', 'de'];
    return text
      .split(' ')
      .map(word => {
        if (this._abbreviation(word) || this._romanNum(word)) {
          return word;
        }
        word = word.toLowerCase();
        if (prepos.includes(word)) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
}
