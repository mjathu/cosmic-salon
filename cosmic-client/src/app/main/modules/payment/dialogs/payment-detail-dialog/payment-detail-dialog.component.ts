import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { Const } from 'app/shared/Const';
import { Payment } from 'app/shared/interface/payment.interface';
import { CommonService } from 'app/shared/services/common-service.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-payment-detail-dialog',
    templateUrl: './payment-detail-dialog.component.html',
    styleUrls: ['./payment-detail-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ]
})
export class PaymentDetailDialogComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    payment: Payment;

    constructor(
        public matDialogRef: MatDialogRef<PaymentDetailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _commonService: CommonService
    ) {

        this._unsubscribeAll = new Subject();


        this.payment = this._data.payment || null;

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    //------------------------ Methods ----------------------//

    getTime(): string {

        const booking = this.payment.booking;

        return `${this._commonService.bookingEventMinToDate(booking.startTime, booking.date, 'hh:mm A')} - ${this._commonService.bookingEventMinToDate(booking.endTime, booking.date, 'hh:mm A')}`;

    }

    getPaymentMethod(): string {

        if (this.payment.paymentMethod) {
            return `Card ending in ${this.payment.paymentMethod.lastDigits}`;
        } else {
            return 'Cash';
        }

    }
}
