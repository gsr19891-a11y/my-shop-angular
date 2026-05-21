import { Category } from "../interface/category";
import { CategoriesInterface } from "../interface/category-interface";
import { Specifications } from "./specifications";

export interface ProductItemInterface {
    id: number;
    stock: number;
    name: string;
    brand: string;
    model: string;
    rating: number;
    price: number;
    imageUrl: string;
    isFavorite: boolean;
    description: string;
    imageUrls: string[];
    category: Category;
    specifications: Specifications

}