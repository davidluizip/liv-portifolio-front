import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LivSuccessResponse } from 'src/app/core/models/liv-portfolio-response-protocol.model';
import { environment } from 'src/environments/environment';

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable()
export class ApiLivGatewayService {
  private readonly _BASE_URL: string;

  constructor(private httpClient: HttpClient) {
    this._BASE_URL = environment.apiLiv;
  }

  get<T>(
    endpoint: string,
    options: IRequestOptions = {}
  ): Observable<LivSuccessResponse<T>['data']> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient
      .get<LivSuccessResponse<T>>(url, options)
      .pipe(map((response) => response.data));
  }

  post<T>(
    endpoint: string,
    body: unknown,
    options: IRequestOptions = {}
  ): Observable<LivSuccessResponse<T>['data']> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient
      .post<LivSuccessResponse<T>>(url, body, options)
      .pipe(map((response) => response.data));
  }

  put<T>(
    endpoint: string,
    body: unknown,
    options: IRequestOptions = {}
  ): Observable<LivSuccessResponse<T>['data']> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient
      .put<LivSuccessResponse<T>>(url, body, options)
      .pipe(map((response) => response.data));
  }

  patch<T>(
    endpoint: string,
    body: unknown,
    options: IRequestOptions = {}
  ): Observable<LivSuccessResponse<T>['data']> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient
      .patch<LivSuccessResponse<T>>(url, body, options)
      .pipe(map((response) => response.data));
  }

  delete(endpoint: string, options: IRequestOptions = {}): Observable<void> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient.delete<void>(url, options);
  }

  graphql<T>(
    query: string,
    options: IRequestOptions = {}
  ): Observable<LivSuccessResponse<T>['data']> {
    const url = encodeURI(this.service + '/graphql');
    return this.httpClient
      .post<LivSuccessResponse<T>>(url, JSON.stringify({ query }), options)
      .pipe(map((response) => response.data));
  }

  get service(): string {
    const url = this._BASE_URL.endsWith('/')
      ? this._BASE_URL.substring(0, this._BASE_URL.length - 1)
      : this._BASE_URL;
    return url;
  }
}
