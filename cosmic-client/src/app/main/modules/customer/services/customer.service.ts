import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Const } from 'app/shared/Const';
import { ApiCommonResponse } from 'app/shared/interface/http-common-response.interface';
import { User } from 'app/shared/interface/user.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    onTableLoading: Subject<boolean>;
    onCustomerDataChanged: BehaviorSubject<User[]>;

    constructor(
        private _httpClient: HttpClient
    ) {

        this.onTableLoading = new Subject();
        this.onCustomerDataChanged = new BehaviorSubject([]);

    }

    listCustomers(): Observable<any> {

        this.onTableLoading.next(true);

        return this._httpClient.get(`${Const.apiBaseUrl}/customer-list`)
            .pipe(
                map((response: ApiCommonResponse) => {

                    this.onCustomerDataChanged.next(response.data);

                    return response.data;
                }),
                finalize(() => {
                    this.onTableLoading.next(false);
                }),
                shareReplay()
            );

    }

    updateCustomer(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/customer-update`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    deleteCustomer(id: string): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/customer-delete`, {id})
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    resetServiceData(): void {
        this.onTableLoading.next(false);
        this.onCustomerDataChanged.next([]);
    }
    
}
