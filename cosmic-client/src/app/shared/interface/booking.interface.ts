import { Service } from "./service.interface";
import { User } from "./user.interface";

export interface Booking {
    id: string;
    date: string;
    startTime: number;
    endTime: number;
    price: number;
    status: string;
    createdAt: string;
    updatedAt: string;

    customer?: User;
    staff?: User;
    services?: Service[]
}