import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { BookingStatus } from 'app/shared/enum/booking-status.enum';
import { ChargeMethod } from 'app/shared/enum/charge-method.enum';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { Booking } from 'app/shared/interface/booking.interface';
import { NotificationService } from 'app/shared/services/notification-service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BookingService } from '../../services/booking.service';

@Component({
    selector: 'app-booking-charge-dialog',
    templateUrl: './booking-charge-dialog.component.html',
    styleUrls: ['./booking-charge-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ]
})
export class BookingChargeDialogComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    paymentForm: FormGroup;
    loading: boolean;
    booking: Booking;
    bookStatusEnum: typeof BookingStatus = BookingStatus;
    chargeMethodEnum: typeof ChargeMethod = ChargeMethod;

    constructor(
        public matDialogRef: MatDialogRef<BookingChargeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _notificationService: NotificationService,
        private _bookingService: BookingService,
    ) {

        this._unsubscribeAll = new Subject();

        this.loading = false;
        this.booking = this._data.booking || null;
        this.createForm();

    }

    ngOnInit(): void {


    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    //------------------------ Methods ----------------------//

    createForm(): void {

        this.paymentForm = this._formBuilder.group({
            method: new FormControl(null, [Validators.required]),
            reference: new FormControl(null, [Validators.required]),
            amount: new FormControl(this.booking.price),
        });

        this.paymentForm.get('amount').disable();
        this.paymentForm.get('reference').disable();

        this.paymentForm.get('method')
            .valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((val: string) => {

                const control = this.paymentForm.get('reference');

                if (val === 'manual') {
                    control.enable();    
                } else {
                    control.disable();
                }

            });

    }

    get fc(): any {
        return this.paymentForm.controls;
    }

    getCard(): string {
        return this.booking?.customer?.defaultPaymentMethod?.cardNumber || '';
    }

    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.paymentForm.invalid) {
            return;
        }
        
        this.loading = true;

        const sendObj = {
            id: this.booking.id, 
            status: this.bookStatusEnum.COMPLETED,
            method: this.fc.method.value,
            reference: this.fc.reference.value
        }

        this._bookingService.changeStatus(sendObj)
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
                    this.matDialogRef.close(true);
                }, 100);

            });

    }


}
