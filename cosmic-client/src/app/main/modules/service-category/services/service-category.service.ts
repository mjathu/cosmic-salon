import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Const } from 'app/shared/Const';
import { ApiCommonResponse } from 'app/shared/interface/http-common-response.interface';
import { Service } from 'app/shared/interface/service.interface';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ServiceCategoryService {

    onTableLoading: Subject<boolean>;
    onServiceDataChanged: BehaviorSubject<Service[]>;

    constructor(
        private _httpClient: HttpClient
    ) {

        this.onTableLoading = new Subject();
        this.onServiceDataChanged = new BehaviorSubject([]);

    }

    listServices(): Observable<any> {

        this.onTableLoading.next(true);

        return this._httpClient.get(`${Const.apiBaseUrl}/service-list`)
            .pipe(
                map((response: ApiCommonResponse) => {

                    this.onServiceDataChanged.next(response.data);

                    return response.data;
                }),
                finalize(() => {
                    this.onTableLoading.next(false);
                }),
                shareReplay()
            );

    }

    addService(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/service-store`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    updateService(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/service-update`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    deleteService(id: string): Observable<any> {

        this.onTableLoading.next(true);

        return this._httpClient.post(`${Const.apiBaseUrl}/service-delete`, {id})
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
        this.onServiceDataChanged.next([]);
    }
    
}
