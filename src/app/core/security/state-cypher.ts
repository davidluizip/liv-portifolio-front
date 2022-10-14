import { AES, enc } from 'crypto-js';
import { environment } from 'src/environments/environment';

export function encrypt<T = unknown>(data: T): string {
  return AES.encrypt(
    JSON.stringify(data),
    environment.cypher_secret
  ).toString();
}

export function decrypt<T = unknown>(ciphertext: string): T {
  if (typeof ciphertext !== 'string') {
    throw new Error('Ciphertext must be a string');
  }
  const bytes = AES?.decrypt(ciphertext, environment.cypher_secret);
  return JSON.parse(bytes.toString(enc.Utf8)) as T;
}
