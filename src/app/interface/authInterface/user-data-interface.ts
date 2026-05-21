import { UserDetailsInterface } from "./user-details-interface";

export interface UserDataInterface {
    id: number;
    email:string;
    role:string;
    lastName:string;
    firstName:string;
    dateOfBirth?: string;
    details:UserDetailsInterface

}
