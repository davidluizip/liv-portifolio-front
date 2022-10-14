import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LivErrorResponse } from '../../models/liv-response-protocol.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
      return 'Sem conexão com a internet';
    }
    return error.message ? error.message : JSON.stringify(error);
  }

  getClientStack(error: Error): string {
    return error.stack;
  }

  getServerMessage(error: HttpErrorResponse | LivErrorResponse): string {
    const defaultMessage =
      'Houve um erro interno, não se preocupe no momento estamos trabalhando para resolver isso.';
    if (error instanceof HttpErrorResponse) {
      return error.message ?? defaultMessage;
    } else {
      return error.error?.message ?? defaultMessage;
    }
  }

  getServerStack(error: HttpErrorResponse | LivErrorResponse): string {
    if (error instanceof HttpErrorResponse) {
      return '';
    } else {
      return JSON.stringify(error.error.stack);
    }
  }
}
