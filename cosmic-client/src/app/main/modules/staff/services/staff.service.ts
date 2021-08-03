import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Const } from "app/shared/Const";
import { ApiCommonResponse } from "app/shared/interface/http-common-response.interface";
import { User } from "app/shared/interface/user.interface";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { finalize, map, shareReplay } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class StaffService {


    onTableLoading: Subject<boolean>;
    onStaffDataChanged: BehaviorSubject<User[]>;

    constructor(
        private _httpClient: HttpClient
    ) {

        this.onTableLoading = new Subject();
        this.onStaffDataChanged = new BehaviorSubject([]);

    }

    listStaff(): Observable<any> {

        this.onTableLoading.next(true);

        return this._httpClient.get(`${Const.apiBaseUrl}/staff-list`)
            .pipe(
                map((response: ApiCommonResponse) => {

                    this.onStaffDataChanged.next(response.data);

                    return response.data;
                }),
                finalize(() => {
                    this.onTableLoading.next(false);
                }),
                shareReplay()
            );

    }

    addStaff(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/staff-store`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    updateStaff(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/staff-update`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    deleteStaff(id: string): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/staff-delete`, {id})
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }),
                shareReplay()
            );

    }

    resetServiceData(): void {
        this.onTableLoading.next(false);
        this.onStaffDataChanged.next([]);
    }

}