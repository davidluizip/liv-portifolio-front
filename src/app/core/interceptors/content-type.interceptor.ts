import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const whiteList = ['/assets/', '/importData', '/upload'];

@Injectable()
export class ContentTypeInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const whiteListed = new RegExp(whiteList.join('|')).test(req.url);
    if (whiteListed) {
      return next.handle(req);
    }

    const request = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
    });

    return next.handle(request);
  }
}
