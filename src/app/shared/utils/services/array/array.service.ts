import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArrayService {
  flatArray<T>(items: T[]): any[] {
    return Array.isArray(items) && items.length > 0
      ? items.reduce((acc, item) => acc.concat(item), [])
      : [];
  }

  groupBy<T>(
    array: T[],
    predicate: (value: T, number: number, array: T[]) => string
  ): Record<string, T[]> {
    return array.reduce((acc, value, index, array) => {
      (acc[predicate(value, index, array)] ||= []).push(value);
      return acc;
    }, {} as Record<string, T[]>);
  }
}
