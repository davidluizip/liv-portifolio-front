import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { LivErrorResponse } from '../models/liv-response-protocol.model';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone) {}

  handleError(error: Error | LivErrorResponse | HttpErrorResponse): void {
    this.zone.run(() => {
      console.error(error);
    });
  }
}
