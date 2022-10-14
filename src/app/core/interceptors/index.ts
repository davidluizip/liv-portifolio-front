import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ContentTypeInterceptor } from './content-type.interceptor';
import { ResponseProtocolInterceptor } from './response-protocol.interceptor';
import { TokenInterceptor } from './token.interceptor';

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ResponseProtocolInterceptor,
    multi: true
  },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ContentTypeInterceptor, multi: true }
];
