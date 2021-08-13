import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Const } from 'app/shared/Const';
import { ApiCommonResponse } from 'app/shared/interface/http-common-response.interface';
import { Payment } from 'app/shared/interface/payment.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    onTableLoading: Subject<boolean>;
    onPaymentDataChanged: BehaviorSubject<Payment[]>;

    constructor(
        private _httpClient: HttpClient
    ) {

        this.onTableLoading = new Subject();
        this.onPaymentDataChanged = new BehaviorSubject([]);

    }

    listPayments(): Observable<any> {

        this.onTableLoading.next(true);

        return this._httpClient.get(`${Const.apiBaseUrl}/payment-list`)
            .pipe(
                map((response: ApiCommonResponse) => {

                    this.onPaymentDataChanged.next(response.data);

                    return response.data;
                }),
                finalize(() => {
                    this.onTableLoading.next(false);
                }),
                shareReplay()
            );

    }

    resetServiceData(): void {
        this.onTableLoading.next(false);
        this.onPaymentDataChanged.next([]);
    }

}
