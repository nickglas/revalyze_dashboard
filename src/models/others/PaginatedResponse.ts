import { PaginationMeta } from "./PaginationMeta";

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
