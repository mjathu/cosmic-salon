import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Const } from "../Const";
import { ApiCommonResponse } from "../interface/http-common-response.interface";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor (
        private _httpClient: HttpClient
    ) {}

    updateProfile(data: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/update-profile`, data)
        .pipe(
            shareReplay()
        );

    }

}