import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { LivPortfolioErrorResponse } from '../models/liv-portfolio-response-protocol.model';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone) {}

  handleError(
    error: Error | LivPortfolioErrorResponse | HttpErrorResponse
  ): void {
    this.zone.run(() => {
      console.error(error);
    });
  }
}
