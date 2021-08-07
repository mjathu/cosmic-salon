import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Const } from 'app/shared/Const';
import { ApiCommonResponse } from 'app/shared/interface/http-common-response.interface';
import { PaymentMethod } from 'app/shared/interface/payment-method.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PaymentMethodService {

    onTableLoading: Subject<boolean>;
    onPaymentMethodDataChanged: BehaviorSubject<PaymentMethod[]>;

    constructor(
        private _httpClient: HttpClient
    ) {

        this.onTableLoading = new Subject();
        this.onPaymentMethodDataChanged = new BehaviorSubject([]);

    }

    listPaymentMethod(): Observable<any> {

        this.onTableLoading.next(true);

        return this._httpClient.get(`${Const.apiBaseUrl}/payment-method-list`)
            .pipe(
                map((response: ApiCommonResponse) => {

                    this.onPaymentMethodDataChanged.next(response.data);

                    return response.data;
                }),
                finalize(() => {
                    this.onTableLoading.next(false);
                }),
                shareReplay()
            );

    }

    addPaymentMethod(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/payment-method-store`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    updatePaymentMethod(id: string): Observable<any> {

        this.onTableLoading.next(true);

        return this._httpClient.post(`${Const.apiBaseUrl}/payment-method-update`, {id})
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

    deletePaymentMethod(id: string): Observable<any> {

        this.onTableLoading.next(true);

        return this._httpClient.post(`${Const.apiBaseUrl}/payment-method-delete`, {id})
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

    resetServiceData(): void {
        this.onTableLoading.next(false);
        this.onPaymentMethodDataChanged.next([]);
    }

}
