import { UserLevel } from "../enum/user-level.enum";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    active: boolean;
    email: string;
    createdAt: string;
    updatedAt: string;
    role: UserLevel.ADMIN | UserLevel.STAFF | UserLevel.CUSTOMER;
    phone: string;
    emailVerifiedAt: string;
    rememberToken: string;
}