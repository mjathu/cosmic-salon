import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { forkJoin, Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { finalize, takeUntil } from 'rxjs/operators';
import { BookingService } from './services/booking.service';
import { BookingEvent } from './model/booking.model';
import * as  moment from 'moment';
import { CalendarWeekViewComponent, DAYS_OF_WEEK } from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { AddEditBookingDialogComponent } from './dialogs/add-edit-booking-dialog/add-edit-booking-dialog.component';
import { StaffService } from '../staff/services/staff.service';
import { ServiceCategoryService } from '../service-category/services/service-category.service';
import { CustomerService } from '../customer/services/customer.service';
import { AuthService } from 'app/shared/services/auth.service';
import { UserLevel } from 'app/shared/enum/user-level.enum';
import { Service } from 'app/shared/interface/service.interface';
import { User } from 'app/shared/interface/user.interface';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { BookingStatus } from 'app/shared/enum/booking-status.enum';
import { BookingDetailDialogComponent } from './dialogs/booking-detail-dialog/booking-detail-dialog.component';

moment.updateLocale('en', {
    week: {
        dow: DAYS_OF_WEEK.MONDAY,
        doy: 0,
    }
});

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ]
})
export class BookingComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    refresh: Subject<any>;
    view: string;
    viewDate: Date;
    selectedDay: any;
    events: any;
    calenderLoading: boolean;
    services: Service[];
    staff: User[];
    customers: User[];
    filterBy: string[];
    authUser: User;
    showNewButton: boolean;

    constructor(
        private _bookingService: BookingService,
        public _matDialog: MatDialog,
        private _staffService: StaffService,
        private _serviceCategoryService: ServiceCategoryService,
        private _customerService: CustomerService,
        private _authService: AuthService,
        private _sideBarService: FuseSidebarService
    ) {

        this._unsubscribeAll = new Subject();
        this.refresh = new Subject();
        this.view = 'week';
        this.viewDate = new Date();
        this.selectedDay = {date: startOfDay(new Date())};
        this.events = [];
        this.calenderLoading = false;
        this.filterBy = [];
        this.authUser = this._authService.currentUserValue;

        this._bookingService.setEvents();
        this.showNewButton = this.authUser.role === UserLevel.STAFF ? false : true;

    }

    ngOnInit(): void {

        this._bookingService
            .onTableLoading
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: boolean) => {
                this.calenderLoading = value;
            });

        this._bookingService
            .onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: any) => {

                if (value) {
                    
                    this.filterBy = [];

                    for (let key in value) {

                        if (value[key]) {
                            this.filterBy.push(key);
                        }

                    }

                } else {
                    this.filterBy = [];
                }

            });

        this._bookingService
            .onBookingEventDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((bookings: BookingEvent[]) => {

                this.events = bookings;

            });

        

        this.loadSupportData();

        this._bookingService.listBookings().subscribe();


    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this.refresh.next();
        this.refresh.complete();

        this._bookingService.resetServiceData();
    }

    reloadTable(event: MouseEvent): void {
        
        event.preventDefault();

        this._bookingService.listBookings().subscribe();
        
    }

    openAddEditDialog(event: MouseEvent): void {

        event.preventDefault();

        this._matDialog.open(AddEditBookingDialogComponent, {
            panelClass: 'add-edit-booking-dialog',
            closeOnNavigation: true,
            disableClose: true,
            autoFocus: false,
            data: {
                services: this.services,
                staff: this.staff,
                customers: this.customers,
                bookingEvent: null
            }
        });

    }

    handleEventClick(event: BookingEvent): void {

        if (event.meta.booking.status === BookingStatus.BOOKED) {
            this.editBooking(event);
        } else {
            this.bookingDetail(event);
        }

    }

    editBooking(event: BookingEvent): void {

        if (event.blocked) {
            return;
        }

        this._matDialog.open(AddEditBookingDialogComponent, {
            panelClass: 'add-edit-booking-dialog',
            closeOnNavigation: true,
            disableClose: true,
            autoFocus: false,
            data: {
                services: this.services,
                staff: this.staff,
                customers: this.customers,
                bookingEvent: event
            }
        });

    }

    bookingDetail(event: BookingEvent): void {

        if (event.blocked) {
            return;
        }

        this._matDialog.open(BookingDetailDialogComponent, {
            panelClass: 'booking-detail-dialog',
            closeOnNavigation: true,
            disableClose: true,
            autoFocus: false,
            data: {
                bookingEvent: event
            }
        });

    }

    dateChange(event: any): void {
        this.selectedDay = {date: startOfDay(event)};
        this._bookingService.onDateChanged.next(event);
    }

    loadSupportData(): void {

        const obsArr = [
            this._staffService.listStaff(),
            this._serviceCategoryService.listServices(),
            this._customerService.listCustomers()
        ];

        forkJoin(obsArr)
        .pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(([staff, services, customers]) => {
            this.staff = staff;
            this.services = services;
            this.customers = customers || []
        });

    }

    openSideBar(event: MouseEvent): void {

        event.preventDefault();
        this._sideBarService.getSidebar('booking-filter').toggleOpen();

    }

}
