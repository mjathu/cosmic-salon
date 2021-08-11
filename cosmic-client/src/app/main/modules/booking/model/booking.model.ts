import { CalendarEventAction } from "angular-calendar";
import { Const } from "app/shared/Const";
import { UserLevel } from "app/shared/enum/user-level.enum";
import { Booking } from "app/shared/interface/booking.interface";
import { AuthService } from "app/shared/services/auth.service";
import { CommonService } from "app/shared/services/common-service.service";
import { endOfDay, startOfDay } from "date-fns";

export class BookingEvent {

    start: Date;
    end?: Date;
    title: string;
    color: {
        primary: string;
        secondary: string;
    };
    actions?: CalendarEventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: {
        booking: Booking,
    };
    blocked?: boolean;


    constructor(booking: Booking, commonService: CommonService, authService: AuthService) {

        this.start = commonService.bookingEventMinToDate(booking.startTime, booking.date);
        this.end = commonService.bookingEventMinToDate(booking.endTime, booking.date);
        this.title = booking.customer.fullName;
        this.color = Const.bookingColors[booking.status];
        this.draggable = false;
        this.resizable = {
            beforeStart: false,
            afterEnd: false
        };
        this.actions = [];
        this.allDay = false;
        this.cssClass = '';
        this.meta = {
            booking: booking,
        };

        if (authService.currentUserValue.role === UserLevel.CUSTOMER && booking.customer.id != authService.currentUserValue.id) {
            this.blocked = true;
            this.color = Const.bookingColors.unavailable;
            this.title = null;
        } else {
            this.blocked = false;
        }

    }

}