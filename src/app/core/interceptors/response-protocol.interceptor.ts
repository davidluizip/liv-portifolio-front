import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { shouldRetry } from 'src/app/shared/rxjs/custom-operators';
import {
  LivPortfolioErrorResponse,
  LivPortfolioResponseProtocol,
  LivPortfolioSuccessResponse,
  Meta
} from '../models/liv-portfolio-response-protocol.model';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ResponseProtocolInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<
    HttpEvent<LivPortfolioSuccessResponse | LivPortfolioErrorResponse>
  > {
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
          excludedStatusCodes: [404, 403, 401, 400]
        })
      ),
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  handleResponse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: HttpResponse<any>
  ): LivPortfolioSuccessResponse | LivPortfolioErrorResponse {
    const response: LivPortfolioResponseProtocol = event.body;

    if (
      event.url?.includes('assets') ||
      event.url?.includes('google') ||
      event.body instanceof Blob
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return event.body;
    }

    if (response.data) {
      return {
        data: response.data,
        meta: response.meta || ({} as Meta)
      };
    } else {
      if (response.error) {
        if (response.error.status === 401) {
          throw new HttpErrorResponse({
            status: response.error.status,
            error: response.error,
            url: event.url
          });
        }
      }
      throw new HttpErrorResponse({
        status: event.status,
        error: event.body,
        url: event.url
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
          message: response.error.message,
          details: {
            ...response.error.details,
            url: response.url
          }
        }
      } as LivPortfolioErrorResponse;
    });
  }
}
