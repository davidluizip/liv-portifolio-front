export interface Data<T> {
  data: Model<T>;
}

export interface DataPut<T> {
  data: T;
}

export interface DataArray<T> {
  data: Model<T>[];
}

export interface Model<T> {
  id: number;
  attributes: T;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface LivPortfolioResponseProtocol<T = unknown> {
  data: Model<T>;
  meta: Meta;
  error?: ErrorResponse;
}

export interface LivPortfolioSuccessResponse<T = unknown> {
  data: Model<T>;
  meta: Meta;
}

export interface LivSuccessResponse<T = unknown> {
  data: T;
  meta: Meta;
}

export interface LivPortfolioErrorResponse {
  status: number;
  error: ErrorResponse;
}

export interface LivPortfolioErrorStackResponse {
  url: string;
  [key: string]: string;
}

interface ErrorResponse {
  details: LivPortfolioErrorStackResponse;
  name: string;
  message: string;
  status: number;
}
