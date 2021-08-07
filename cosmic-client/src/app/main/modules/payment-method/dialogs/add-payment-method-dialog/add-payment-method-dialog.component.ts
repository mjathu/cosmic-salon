import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { CommonService } from 'app/shared/services/common-service.service';
import { NotificationService } from 'app/shared/services/notification-service';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { of, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { PaymentMethodService } from '../../services/payment-method.service';

@Component({
    selector: 'app-add-payment-method-dialog',
    templateUrl: './add-payment-method-dialog.component.html',
    styleUrls: ['./add-payment-method-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ]
})
export class AddPaymentMethodDialogComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    paymentMethodForm: FormGroup;
    loading: boolean;
    cardValid: boolean;

    @ViewChild(StripeCardComponent) card: StripeCardComponent;

    cardOptions: StripeCardElementOptions;
    elementsOptions: StripeElementsOptions;

    constructor(
        public matDialogRef: MatDialogRef<AddPaymentMethodDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _notificationService: NotificationService,
        private _commonService: CommonService,
        private _paymentMethodService: PaymentMethodService,
        private _stripeService: StripeService
    ) {

        this._unsubscribeAll = new Subject();

        this.cardOptions = {
            style: {
                base: {
                    iconColor: '#666EE8',
                    color: '#31325F',
                    fontWeight: 300,
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSize: '18px',
                    '::placeholder': {
                      color: '#CFD7E0'
                    }
                }
            },
            hidePostalCode: true
        };

        this.elementsOptions = {
            locale: 'en'
        };

        this.loading = false;
        this.cardValid = false;
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

        this.paymentMethodForm = this._formBuilder.group({
            name: new FormControl(null, [Validators.required])
        });

    }

    cardValChange(event: any): void {

        this.cardValid = event.complete;

    }

    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.paymentMethodForm.invalid || !this.cardValid) {
            return;
        }

        const name = this.paymentMethodForm?.value?.name;

        this.loading = true;

        this._stripeService
            .createToken(this.card.element, {name: name})
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((tokenResponse: any) => {

                    const sendObj = {
                        name: name,
                        token: tokenResponse?.token?.id
                    };

                    return this._paymentMethodService.addPaymentMethod(sendObj);

                }),
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((message: string) => {

                if (message) {
                    this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                }

                setTimeout(() => {
                    this.matDialogRef.close();
                    this._paymentMethodService.listPaymentMethod().subscribe();
                }, 100);

            });


    }

}
