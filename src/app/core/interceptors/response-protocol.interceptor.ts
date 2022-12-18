import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { shouldRetry } from 'src/app/shared/rxjs/custom-operators';
import {
  LivErrorResponse,
  LivResponseProtocol,
  LivSuccessResponse,
} from '../models/liv-response-protocol.model';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ResponseProtocolInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<LivSuccessResponse | LivErrorResponse>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          return event.clone({ body: this.handleResponse(event) });
        }
        return event;
      }),
      retry(
        shouldRetry({
          maxRetryAttempts: 2,
          scalingDuration: 3000,
          excludedStatusCodes: [404, 403, 401, 400],
        })
      ),
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  handleResponse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: HttpResponse<any>
  ): LivSuccessResponse | LivErrorResponse {
    const response: LivResponseProtocol = event.body;

    if (
      event.url?.includes('assets') ||
      event.url?.includes('google') ||
      event.body instanceof Blob
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return event.body;
    }

    if (response.status) {
      if (response.status === 401) {
        throw new HttpErrorResponse({
          status: response.status,
          error: response.error,
          url: event.url!,
        });
      }
      if (response?.error) {
        throw new HttpErrorResponse({
          status: event.status,
          error: response.error,
          url: event.url!,
        });
      }
      return {
        status: event.status,
        data: response.data ?? response,
      };
    } else {
      throw new HttpErrorResponse({
        status: event.status,
        error: event.body,
        url: event.url!,
      });
    }
  }

  handleError(response: HttpErrorResponse): Observable<never> {
    let message = 'Ocorreu um erro inesperado! Tente novamente mais tarde!';

    if (
      response.status === 401 &&
      !response.url?.toLocaleLowerCase().includes('login')
    ) {
      message = 'Sessão inválida! É necessario autenticar novamente!';
      this.toastService.error(message);
      // TO-DO
    }

    if (response.status === 500) {
      this.toastService.error(message);
    }

    return throwError(() => {
      return {
        status: response.status,
        error: {
          message: response.error,
          stack: {
            url: response.url,
          },
        },
      } as LivErrorResponse;
    });
  }
}
