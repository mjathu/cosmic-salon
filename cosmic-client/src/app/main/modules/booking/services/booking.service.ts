import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Booking } from 'app/shared/interface/booking.interface';
import { ApiCommonResponse } from 'app/shared/interface/http-common-response.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, map, shareReplay, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { BookingEvent } from '../model/booking.model';
import { Const } from 'app/shared/Const';
import { CommonService } from 'app/shared/services/common-service.service';
import { AuthService } from 'app/shared/services/auth.service';
import * as  moment from 'moment';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { BookingStatus } from 'app/shared/enum/booking-status.enum';

moment.updateLocale('en', {
    week: {
        dow: DAYS_OF_WEEK.MONDAY,
        doy: 0,
    }
});

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private _unsubscribeAll: Subject<any>;

    onTableLoading: Subject<boolean>;
    onBookingDataChanged: BehaviorSubject<Booking[]>;
    onBookingEventDataChanged: BehaviorSubject<BookingEvent[]>;

    onFilterChanged: Subject<any>;
    onDateChanged: Subject<any>;

    dateFilter: any;
    filterBy: any;

    constructor(
        private _httpClient: HttpClient,
        private _commonService: CommonService,
        private _authService: AuthService
    ) {

        this.onTableLoading = new Subject();
        this._unsubscribeAll = new Subject();
        this.onBookingDataChanged = new BehaviorSubject([]);
        this.onBookingEventDataChanged = new BehaviorSubject([]);

        this.onDateChanged = new Subject();
        this.onFilterChanged = new Subject();

        this.dateFilter = this.getDateFilter(null);
        this.filterBy = null;

    }

    listBookings(): Observable<any> {

        this.onTableLoading.next(true);

        const params = new HttpParams()
            .set('dates', JSON.stringify(this.dateFilter))
            .set('filters', JSON.stringify(this.filterBy));

        return this._httpClient.get(`${Const.apiBaseUrl}/booking-list`, {params})
            .pipe(
                map((response: ApiCommonResponse) => {

                    const bookingEvents = response.data && _.isArray(response.data) ? response.data.map((value: any) => new BookingEvent(value, this._commonService, this._authService)) : [];
                    this.onBookingDataChanged.next(response.data);
                    this.onBookingEventDataChanged.next(bookingEvents);

                    return {
                        bookings: response.data,
                        bookingEvents: bookingEvents
                    };
                }),
                finalize(() => {
                    this.onTableLoading.next(false);
                }),
                shareReplay()
            );

    }

    addBooking(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/booking-store`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    updateBooking(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/booking-update`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    changeStatus(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/booking-change-status`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    deleteDelete(id: string): Observable<any> {

        this.onTableLoading.next(true);

        return this._httpClient.post(`${Const.apiBaseUrl}/booking-delete`, {id})
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                finalize(() => {
                    this.onTableLoading.next(false);
                }),
                shareReplay()
            );

    }

    getDateFilter(date: any): any {

        const dateObj = date ? moment(date) : moment();

        return {
            startDate: dateObj.clone().startOf('week').format(Const.dbDateFormat),
            endDate: dateObj.clone().endOf('week').format(Const.dbDateFormat)
        };

    }

    setEvents(): void {

        this.onDateChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: any) => {

                this.dateFilter = this.getDateFilter(value);
                this.listBookings().subscribe();

            });

        this.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: any) => {

                this.filterBy = value;
                this.listBookings().subscribe();

            });


    }

    getStatusDescription(statusEnum: string): string {

        let desc = '';

        switch (statusEnum) {
            case BookingStatus.BOOKED:
                desc = 'Booked';
                break;
            case BookingStatus.NOSHOW:
                desc = 'No Show';
                break;
            case BookingStatus.CANCELLED:
                desc = 'Cancelled';
                break;
            case BookingStatus.COMPLETED:
                desc = 'Completed';
                break;
            default:
                break;
        };

        return desc;

    }

    resetServiceData(): void {

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._unsubscribeAll = new Subject();

        this.dateFilter = this.getDateFilter(null);
        this.filterBy = null;

        this.onTableLoading.next(false);
        this.onBookingDataChanged.next([]);
        this.onBookingEventDataChanged.next([]);

    }

}
