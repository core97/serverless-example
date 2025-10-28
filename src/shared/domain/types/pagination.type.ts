export interface PaginationParams {
  skip: number;
  limit: number;
}

export interface PaginationResult<T> {
  results: T[];
  total: number;
}
