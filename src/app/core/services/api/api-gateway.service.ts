import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LivSuccessResponse } from 'src/app/core/models/liv-response-protocol.model';
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
export class ApiGatewayService {
  private readonly _BASE_URL: string;
  constructor(private httpClient: HttpClient) {
    this._BASE_URL = environment.baseUserStrapi;
  }

  get<T>(endpoint: string, options: IRequestOptions = {}): Observable<LivSuccessResponse<T>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient
      .get<LivSuccessResponse<T>>(url, options)
      //.pipe(map(res => res.data));
  }

  upload<T>(
    endpoint: string,
    data: FormData,
    params: HttpParams
  ): Observable<HttpEvent<T>> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'multipart/form-data'
    );
    const url = encodeURI(this.service + endpoint);
    return this.httpClient.request<T>('post', url, {
      params,
      observe: 'events',
      body: data,
      headers,
    });
  }

  download<T>(endpoint: string, options: IRequestOptions = {}): Observable<T> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient.get<T>(url, {
      ...options,
      responseType: 'blob' as 'json',
    });
  }

  post<T>(
    endpoint: string,
    body: unknown,
    options: IRequestOptions = {}
  ): Observable<LivSuccessResponse<T>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient
      .post<LivSuccessResponse<T>>(url, body, options)
      //.pipe(map(res => res.data));
  }

  put<T>(
    endpoint: string,
    body: unknown,
    options: IRequestOptions = {}
  ): Observable<LivSuccessResponse<T>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient
      .put<LivSuccessResponse<T>>(url, body, options)
      //.pipe(map(res => res.data));
  }

  patch<T>(
    endpoint: string,
    body: unknown,
    options: IRequestOptions = {}
  ): Observable<LivSuccessResponse<T>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient
      .patch<LivSuccessResponse<T>>(url, body, options)
      //.pipe(map(res => res.data));
  }

  delete<T>(endpoint: string, options: IRequestOptions = {}): Observable<LivSuccessResponse<T>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient
      .delete<LivSuccessResponse<T>>(url, options)
      //.pipe(map(res => res.data));
  }

  graphql<T>(query: string, options: IRequestOptions = {}): Observable<LivSuccessResponse<T>> {
    const url = encodeURI(this.service + '/graphql');
    return this.httpClient
      .post<LivSuccessResponse<T>>(url, JSON.stringify({ query }), options)
      //.pipe(map(res => res.data));
  }

  get service(): string {
    const url = this._BASE_URL.endsWith('/')
      ? this._BASE_URL.substring(0, this._BASE_URL.length - 1)
      : this._BASE_URL;
    return url;
  }
}
