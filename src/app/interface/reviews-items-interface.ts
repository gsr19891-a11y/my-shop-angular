import { UserDataInterface } from "./authInterface/user-data-interface";

export interface ReviewsItemsInterface {
    id:number;
    rating:number;
    createdAt:string;
    user: UserDataInterface;
}
