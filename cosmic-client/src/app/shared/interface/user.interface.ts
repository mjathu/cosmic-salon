import { UserLevel } from "../enum/user-level.enum";
import { PaymentMethod } from "./payment-method.interface";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    active: boolean;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    role: UserLevel.ADMIN | UserLevel.STAFF | UserLevel.CUSTOMER;
    emailVerifiedAt: string;
    rememberToken: string;

    token?: string;
    paymentMethods?: PaymentMethod[],
    defaultPaymentMethod?: PaymentMethod
}