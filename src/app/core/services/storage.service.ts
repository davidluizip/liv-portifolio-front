import { Injectable } from '@angular/core';
import { decrypt, encrypt } from '../security/state-cypher';
import { environment as ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly isProdMode = ENV.production;

  save<T>(key: string, value: T): void {
    const storageValue = this.isProdMode
      ? encrypt(value)
      : JSON.stringify(value);

    localStorage.setItem(key, storageValue);
  }

  get<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value
        ? this.isProdMode
          ? decrypt<T>(value)
          : JSON.parse(value)
        : null;
    } catch {
      this.deleteAll();
      return null;
    }
  }

  exists(key: string): boolean {
    return !!localStorage.getItem(key);
  }

  delete(key: string): void {
    localStorage.removeItem(key);
  }

  deleteAll(): void {
    localStorage.clear();
  }
}
