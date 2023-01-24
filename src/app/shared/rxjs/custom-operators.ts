import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpResponse
} from '@angular/common/http';
import {
  MonoTypeOperatorFunction,
  Observable,
  pipe,
  throwError,
  timer,
  UnaryFunction
} from 'rxjs';
import { filter, map, RetryConfig, tap } from 'rxjs/operators';
import { LivPortfolioResponseProtocol } from 'src/app/core/models/liv-portfolio-response-protocol.model';

export function filterResponse<T>(): UnaryFunction<
  Observable<HttpResponse<T>>,
  Observable<T>
> {
  return pipe(
    filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
    map((response: HttpResponse<any>) => {
      const body = response.body as LivPortfolioResponseProtocol<T>;

      if (body.data) {
        return {
          data: body.data,
          meta: body.meta
        };
      }

      return response.body;
    })
  );
}

export function uploadProgress<T>(
  cb: (progress: number) => void
): MonoTypeOperatorFunction<HttpEvent<T>> {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress && event.total) {
      cb(Math.round((event.loaded * 100) / event.total));
    }
  });
}

export function shouldRetry({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = []
}: GenericRetryStrategy = {}): RetryConfig {
  return {
    count: maxRetryAttempts,
    delay(error, retryAttempt) {
      const err = error as HttpErrorResponse;
      if (
        retryAttempt > maxRetryAttempts ||
        excludedStatusCodes.some((statusCode) => statusCode === err.status)
      ) {
        return throwError(() => err);
      }
      return timer(retryAttempt * scalingDuration);
    }
  } as RetryConfig;
}

type GenericRetryStrategy = {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
};
