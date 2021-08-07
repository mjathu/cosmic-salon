import { User } from "./user.interface";

export interface PaymentMethod {
    id: string;
    cardReference: string;
    fingerprint: string;
    brand: string;
    lastDigits: string;
    cardNumber: string;
    expiry: string;
    expMonth: number;
    expYear: number;
    default: boolean;
    createdAt: string;
    updatedAt: string;

    user?: User;
}