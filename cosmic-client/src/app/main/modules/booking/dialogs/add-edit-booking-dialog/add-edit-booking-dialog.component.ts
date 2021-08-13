import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { UserLevel } from 'app/shared/enum/user-level.enum';
import { Booking } from 'app/shared/interface/booking.interface';
import { Service } from 'app/shared/interface/service.interface';
import { User } from 'app/shared/interface/user.interface';
import { AuthService } from 'app/shared/services/auth.service';
import { CommonService } from 'app/shared/services/common-service.service';
import { NotificationService } from 'app/shared/services/notification-service';
import { Subject } from 'rxjs';
import { BookingEvent } from '../../model/booking.model';
import { BookingService } from '../../services/booking.service';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { finalize, takeUntil } from 'rxjs/operators';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { BookingStatus } from 'app/shared/enum/booking-status.enum';
import { BookingChargeDialogComponent } from '../booking-charge-dialog/booking-charge-dialog.component';

export const MY_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

@Component({
    selector: 'app-add-edit-booking-dialog',
    templateUrl: './add-edit-booking-dialog.component.html',
    styleUrls: ['./add-edit-booking-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ],
    providers: [
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
    
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
      ],
})
export class AddEditBookingDialogComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    bookingForm: FormGroup;
    loading: boolean;
    editMode: boolean;
    bookingEvent: BookingEvent;
    customersList: User[];
    staffList: User[];
    servicesList: Service[];
    authUser: User;
    booking: Booking;
    todayDate: Date;
    bookingStatusEnum: typeof BookingStatus = BookingStatus;
    userLevelEnum: typeof UserLevel = UserLevel;
    disableInputs: boolean;
    dialogRef: any;

    constructor(
        public matDialogRef: MatDialogRef<AddEditBookingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _notificationService: NotificationService,
        private _commonService: CommonService,
        private _bookingService: BookingService,
        private _authService: AuthService,
        public _matDialog: MatDialog,
    ) {

        this._unsubscribeAll = new Subject();

        this.loading = false;
        this.todayDate = moment().toDate();
        this.createForm();

        this.bookingEvent = this._data.bookingEvent || null;
        this.editMode = this.bookingEvent ? true : false;
        this.booking = this.bookingEvent ? this.bookingEvent?.meta?.booking : null;
        this.customersList = this._data.customers || [];
        this.staffList = this._data.staff || [];
        this.servicesList = this._data.services || [];
        this.authUser = this._authService.currentUserValue;
        this.disableInputs = false;

    }

    ngOnInit(): void {

        if (this.authUser.role === UserLevel.ADMIN) {

            this.bookingForm.get('customer').enable();

        } else if (this.authUser.role === UserLevel.CUSTOMER) {

            this.bookingForm.get('customer').disable();

        } else if (this.authUser.role === UserLevel.STAFF) {
            this.disableInputs = true;
            this.setDisabledInputs();
        }

        if (this.editMode) {
            this.setEditData();
        } else {
            this.prepareNew();
        }

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    //------------------------ Methods ----------------------//

    createForm(): void {

        this.bookingForm = this._formBuilder.group({
            id: new FormControl(null, [Validators.required]),
            customer: new FormControl(null, [Validators.required]),
            staff: new FormControl(null, [Validators.required]),
            startTime: new FormControl(null, [Validators.required]),
            date: new FormControl(null, [Validators.required]),
            services: new FormArray([])
        });

    }

    get fc(): any {
        return this.bookingForm.controls;
    }

    get serviceFormArray(): FormArray {
        return this.bookingForm.get('services') as FormArray;
    }

    addService(event: MouseEvent): void {
        event.preventDefault();
        this.newService();
    }

    newService(value?: string): void {
        this.serviceFormArray.push(new FormControl(value || null, Validators.required));
    }

    removeService(index: number): void {
        this.serviceFormArray.removeAt(index);
    }

    setEditData(): void {

        this.bookingForm.patchValue({
            id: this.booking.id,
            customer: this.booking.customer.id,
            staff: this.booking.staff.id,
            startTime: this._commonService.bookingEventMinToDate(this.booking.startTime, null, 'HH:mm'),
            date: this.booking.date,
        });

        this.booking.services.forEach((value: Service) => {
            this.newService(value.id);
        });

    }

    setDisabledInputs(): void {

        this.bookingForm.get('customer').disable();
        this.bookingForm.get('staff').disable();
        this.bookingForm.get('startTime').disable();
        this.bookingForm.get('date').disable();
        this.bookingForm.get('services').disable();

    }

    prepareNew(): void {

        this.bookingForm.get('id').disable();
        this.newService(null);

    }

    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.bookingForm.invalid) {
            return;
        }

        const sendObj = {
            id: this.editMode ? this.booking.id : null,
            customer: this.fc.customer.value,
            staff: this.fc.staff.value,
            startTime: this._commonService.timeInputToMin(this.fc.startTime.value),
            date: this._commonService.dbFormatDate(this.fc.date.value),
            services: this.fc.services.value
        };

        this.loading = true;

        if (this.editMode) {

            this._bookingService.updateBooking(sendObj)
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

        } else {

            this._bookingService.addBooking(sendObj)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.loading = false;
                    })
                )
                .subscribe((message: string) => {

                    if (message) {
                        this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                    }

                    setTimeout(() => {
                        this._bookingService.listBookings().subscribe();
                        this.matDialogRef.close();
                    }, 500);

                });

        }


    }

    changeStatus(event: MouseEvent, status: string): void {

        if (status === this.bookingStatusEnum.COMPLETED) {

            this.dialogRef = this._matDialog.open(BookingChargeDialogComponent, {
                panelClass: 'booking-charge-dialog',
                closeOnNavigation: true,
                disableClose: true,
                autoFocus: false,
                data: {
                    booking: this.booking
                }
            });

            this.dialogRef
                .afterClosed()
                .subscribe((message: string) => {

                    if (!message) {
                        return;
                    }

                    setTimeout(() => {
                        this.matDialogRef.close();
                    }, 200);

                });
            

        } else {

            this.loading = true;

            this._bookingService.changeStatus({id: this.booking.id, status: status})
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

    }

}
