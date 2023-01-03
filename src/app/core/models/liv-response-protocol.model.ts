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

export interface LivResponseProtocol<T = unknown> {
  data: Model<T>;
  meta: Meta;
  error?: ErrorResponse;
}

export interface LivSuccessResponse<T = unknown> {
  data: Model<T>;
  meta: Meta;
}

export interface LivErrorResponse {
  status: number;
  error: ErrorResponse;
}

export interface LivErrorStackResponse {
  url: string;
  [key: string]: string;
}

interface ErrorResponse {
  details: LivErrorStackResponse;
  name: string;
  message: string;
  status: number;
}
