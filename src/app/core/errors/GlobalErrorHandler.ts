import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { LivErrorResponse } from '../models/liv-response-protocol.model';
import { ToastService } from '../services/toast.service';
import { ErrorService } from './services/error.service';
import { LoggerService } from './services/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone, private injector: Injector) {}

  handleError(error: Error | LivErrorResponse | HttpErrorResponse): void {
    const toastService = this.injector.get(ToastService);
    const errorService = this.injector.get(ErrorService);
    const loggerService = this.injector.get(LoggerService);

    let message: string;
    let stackTrace: string;

    if (error instanceof HttpErrorResponse) {
      message = errorService.getServerMessage(error);
      stackTrace = errorService.getServerStack(error);
    } else if (this._isLivErrorResponse(error)) {
      message = errorService.getServerMessage(error);
      stackTrace = errorService.getServerStack(error);
    } else {
      message = errorService.getClientMessage(error);
      stackTrace = errorService.getClientStack(error);
    }

    this.zone.run(() => {
      toastService.error(message);
      loggerService.logError(message, stackTrace);
      loggerService.sendErrorToServer(message);
    });
  }

  private _isLivErrorResponse(
    error: Error | LivErrorResponse | HttpErrorResponse
  ): error is LivErrorResponse {
    return true;
  }
}
