import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {
  isEmptyObj<T = object>(obj: T): boolean {
    if (obj === undefined || obj === null) return true;

    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
}
