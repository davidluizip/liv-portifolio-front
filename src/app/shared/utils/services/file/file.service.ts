import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  toBase64(file: File | Blob): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = e => reject(e);
    });
  }

  async getUrl(base64: string): Promise<string | null> {
    const response = await fetch(base64);
    const blob = await response.blob();
    const url = await this.toBase64(blob);
    return url ? url.toString() : null;
  }
}
