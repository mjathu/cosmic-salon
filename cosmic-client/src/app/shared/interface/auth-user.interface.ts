import { UserLevel } from "../enum/user-level.enum";

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    active: boolean;
    email: string;
    phone: string;
    token?: string;
    createdAt: string;
    updatedAt: string;
    role: UserLevel.ADMIN | UserLevel.STAFF | UserLevel.CUSTOMER;
    rememberToken: string;
}