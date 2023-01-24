import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LivPortfolioSuccessResponse } from 'src/app/core/models/liv-portfolio-response-protocol.model';
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

  get<T>(
    endpoint: string,
    options: IRequestOptions = {}
  ): Observable<LivPortfolioSuccessResponse<T>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient.get<LivPortfolioSuccessResponse<T>>(url, options);
  }

  upload<T>(
    endpoint: string,
    data: FormData,
    params: HttpParams
  ): Observable<HttpEvent<LivPortfolioSuccessResponse<T>>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient.request<LivPortfolioSuccessResponse<T>>(
      'post',
      url,
      {
        params,
        observe: 'events',
        body: data
      }
    );
  }

  download<T>(
    endpoint: string,
    options: IRequestOptions = {}
  ): Observable<LivPortfolioSuccessResponse<T>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient.get<LivPortfolioSuccessResponse<T>>(url, {
      ...options,
      responseType: 'blob' as 'json'
    });
  }

  post<T>(
    endpoint: string,
    body: unknown,
    options: IRequestOptions = {}
  ): Observable<LivPortfolioSuccessResponse<T>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient.post<LivPortfolioSuccessResponse<T>>(
      url,
      body,
      options
    );
  }

  put<T>(
    endpoint: string,
    body: unknown,
    options: IRequestOptions = {}
  ): Observable<LivPortfolioSuccessResponse<T>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient.put<LivPortfolioSuccessResponse<T>>(
      url,
      body,
      options
    );
  }

  patch<T>(
    endpoint: string,
    body: unknown,
    options: IRequestOptions = {}
  ): Observable<LivPortfolioSuccessResponse<T>> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient.patch<LivPortfolioSuccessResponse<T>>(
      url,
      body,
      options
    );
  }

  delete(endpoint: string, options: IRequestOptions = {}): Observable<void> {
    const url = encodeURI(this.service + endpoint);
    return this.httpClient.delete<void>(url, options);
  }

  graphql<T>(
    query: string,
    options: IRequestOptions = {}
  ): Observable<LivPortfolioSuccessResponse<T>> {
    const url = encodeURI(this.service + '/graphql');
    return this.httpClient.post<LivPortfolioSuccessResponse<T>>(
      url,
      JSON.stringify({ query }),
      options
    );
  }

  get service(): string {
    const url = this._BASE_URL.endsWith('/')
      ? this._BASE_URL.substring(0, this._BASE_URL.length - 1)
      : this._BASE_URL;
    return url;
  }
}
