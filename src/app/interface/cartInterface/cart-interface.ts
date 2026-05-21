import { CartItemsInterface } from "./cart-items-interface";

export interface CartInterface {
    items: CartItemsInterface[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasMore: boolean;
}
