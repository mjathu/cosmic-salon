import { Booking } from "./booking.interface";
import { PaymentMethod } from "./payment-method.interface";
import { User } from "./user.interface";

export interface Payment {
    id: string;
    date: string;
    paymentReference: string;
    transactionReference: string;
    price: number;

    booking?: Booking;
    customer?: User;
    paymentMethod?: PaymentMethod;
}