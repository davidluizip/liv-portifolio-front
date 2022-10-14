import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const whiteList = ['/assets/', '/importData'];

@Injectable()
export class ContentTypeInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const whiteListed = new RegExp(whiteList.join('|')).test(req.url);
    const request = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
    });

    if (whiteListed) {
      return next.handle(req);
    }
    return next.handle(request);
  }
}
