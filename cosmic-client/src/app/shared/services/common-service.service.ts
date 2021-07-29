import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Const } from '../Const';
import { ApiCommonResponse } from '../interface/http-common-response.interface';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    ) { }

    checkExistingEmail(email: string): Observable<any> {

        const params = new HttpParams().set('email', email);

        return this._httpClient.get(`${Const.apiBaseUrl}/check-email-exists`, {params})
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.data || false;
                })
            );

    }

}
