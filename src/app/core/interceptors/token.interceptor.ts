import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export const urisNoNeedsAuthToken = ['/assets/'];

export function requestNeedsAuthToken(request: HttpRequest<any>) {
  return !new RegExp(urisNoNeedsAuthToken.join('|')).test(request.url);
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const auth = this.authStore.authSnapshot;
    if (
      request.url.includes('openid-configuration') ||
      request.url.includes('googleapi')
    ) {
      return next.handle(request);
    }

    // if (auth?.token && requestNeedsAuthToken(request))
    //   return next.handle(
    //     request.clone({
    //       setHeaders: {
    //         Authorization: `Bearer ${auth.token}`,
    //       },
    //     })
    //   );

    return next.handle(request);
  }
}
