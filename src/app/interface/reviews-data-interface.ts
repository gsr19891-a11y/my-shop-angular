import { ReviewsItemsInterface } from './reviews-items-interface';

export interface ReviewsDataInterface {
  items: ReviewsItemsInterface[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasMore: boolean;
}
