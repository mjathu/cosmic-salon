import { environment } from "environments/environment";
import { BookingStatus } from "./enum/booking-status.enum";

export class Const {

    static readonly apiBaseUrl = environment.apiUrl;

    static readonly storageKeyName = {
        currentUser: 'currentUser'
    };

    static readonly bookingColors = {
        [BookingStatus.BOOKED]:  {
            primary: '#1e90ff',
            secondary: '#D1E8FF'
        },
        [BookingStatus.NOSHOW]:  {
            primary: '#f9b128',
            secondary: '#f5e2bb'
        },
        [BookingStatus.CANCELLED]:  {
            primary: '#ff1e31',
            secondary: '#fbbaba'
        },
        [BookingStatus.COMPLETED]:  {
            primary: '#61ce12',
            secondary: '#c4eab6'
        },
        'unavailable': {
            primary: '#a2a2a2',
            secondary: '#d2d2d2'
        }
    }

    static readonly dbDateFormat = 'YYYY-MM-DD';

}