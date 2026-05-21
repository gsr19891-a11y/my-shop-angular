import { Product } from "../product";

export interface CartItemsInterface {
    id: number,
    quantity: number;
    totalPrice: number;
    product:Product;

}
