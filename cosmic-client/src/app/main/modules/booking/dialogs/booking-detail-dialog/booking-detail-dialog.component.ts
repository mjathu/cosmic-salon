import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { BookingStatus } from 'app/shared/enum/booking-status.enum';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { UserLevel } from 'app/shared/enum/user-level.enum';
import { Booking } from 'app/shared/interface/booking.interface';
import { User } from 'app/shared/interface/user.interface';
import { AuthService } from 'app/shared/services/auth.service';
import { CommonService } from 'app/shared/services/common-service.service';
import { NotificationService } from 'app/shared/services/notification-service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BookingEvent } from '../../model/booking.model';
import { BookingService } from '../../services/booking.service';

@Component({
    selector: 'app-booking-detail-dialog',
    templateUrl: './booking-detail-dialog.component.html',
    styleUrls: ['./booking-detail-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ]
})
export class BookingDetailDialogComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    bookingEvent: BookingEvent;
    booking: Booking;
    loading: boolean;
    bookStatusEnum: typeof BookingStatus = BookingStatus;
    authUser: User;
    userLevelEnum: typeof UserLevel = UserLevel;

    constructor(
        public matDialogRef: MatDialogRef<BookingDetailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _notificationService: NotificationService,
        private _commonService: CommonService,
        private _authService: AuthService,
        private _bookingService: BookingService
    ) {

        this._unsubscribeAll = new Subject();
        this.bookingEvent = this._data.bookingEvent;
        this.booking = this.bookingEvent.meta.booking;
        this.loading = false;
        this.authUser = this._authService.currentUserValue;
    }

    ngOnInit(): void {



    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    //------------------------ Methods ----------------------//

    deleteBooking(event: MouseEvent): void {

        event.preventDefault();
        
        this.loading = true;

        this._bookingService.deleteDelete(this.booking.id)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe((message: string) => {

                if (message) {
                    this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                }

                setTimeout(() => {
                    this._bookingService.listBookings().subscribe();
                    this.matDialogRef.close();
                }, 500);

            });


    }

    getTime(): string {

        let start = this._commonService.bookingEventMinToDate(this.booking.startTime, this.booking.date, 'hh:mm A');
        let end = this._commonService.bookingEventMinToDate(this.booking.endTime, this.booking.date, 'hh:mm A');

        return `${start} - ${end}`;

    }

    getDesc(status: string): string {
        return this._bookingService.getStatusDescription(status);
    }
}
