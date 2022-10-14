import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  isEmptyObj<T = unknown>(obj: Record<string, T>): boolean {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
}
