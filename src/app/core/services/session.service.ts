import { Injectable } from '@angular/core';
import { decrypt, encrypt } from '../security/state-cypher';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  save<T>(key: string, value: T): void {
    sessionStorage.setItem(key, encrypt(value));
  }

  get<T>(key: string): T | null {
    try {
      const value = sessionStorage.getItem(key);
      return value ? decrypt<T>(value) : null;
    } catch {
      this.deleteAll();
      return null;
    }
  }

  exists(key: string): boolean {
    return !!sessionStorage.getItem(key);
  }

  delete(key: string): void {
    sessionStorage.removeItem(key);
  }

  deleteAll() {
    sessionStorage.clear();
  }
}
