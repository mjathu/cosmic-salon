import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, shareReplay, tap } from 'rxjs/operators';
import { Const } from '../Const';
import { ApiCommonResponse } from '../interface/http-common-response.interface';
import { User } from '../interface/user.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _isAuthenticated: boolean;
    private _currentUserSubject: BehaviorSubject<User>;
    onAuthChange: BehaviorSubject<boolean>;
    currentUser: Observable<User>;

    constructor (
        private _router: Router,
        private _httpClient: HttpClient
    ) {

        this._isAuthenticated = this.getCurrentUserLocalStorage() ? true : false;
        this._currentUserSubject = new BehaviorSubject<User>(this.getCurrentUserLocalStorage());
        this.currentUser = this._currentUserSubject.asObservable();
        this.onAuthChange = new BehaviorSubject(this._isAuthenticated);

    }

    setCurrentUserLocalStorage(authUser: User): void {
        localStorage.setItem(Const.storageKeyName.currentUser, JSON.stringify(authUser));
    }

    removeCurrentUserLocalStorage(): void {
        localStorage.removeItem(Const.storageKeyName.currentUser);
    }

    getCurrentUserLocalStorage(): User | null {
        return JSON.parse(localStorage.getItem(Const.storageKeyName.currentUser));
    }

    get currentUserValue(): User {
        return this._currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    login(loginData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/login`, loginData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.data || {};
                }),
                tap((user: User) => {

                    this.loginSteps(user);

                }),
                shareReplay()
            );

    }

    loginSteps(user: User): void {
        this.setCurrentUserLocalStorage(user);
        this._isAuthenticated = true;
        this._currentUserSubject.next(user);
        this.onAuthChange.next(true);

        this.redirectDefaultAuthenticatedRoute();
    }

    logout(): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/logout`, {})
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message || '';
                }), 
                finalize(() => {
                   
                    this.logoutSteps();
                    
                }),
                shareReplay()
            );

    }

    logoutSteps(): void {
        this.removeCurrentUserLocalStorage();
        this._isAuthenticated = false;
        this._currentUserSubject.next(null);
        this.onAuthChange.next(false);

        this.redirectDefaultNonAuthenticatedRoute();
    }

    forgotPassword(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/forgot-password`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message || '';
                }),
                shareReplay()
            );

    }

    resetPassword(postData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/reset-password`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message || '';
                }),
                shareReplay()
            );

    }

    redirectDefaultNonAuthenticatedRoute(): void {
        this._router.navigate(['/login']);
    }

    redirectDefaultAuthenticatedRoute(): void {
        this._router.navigate(['/home']);
    }

    register(registerData: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/register-customer`, registerData)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message || null;
                }),
                shareReplay()
            );

    }

    verifyEmail(id: string): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/verify-email`, {id})
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.data || null;
                }),
                shareReplay()
            );

    }

    updateAuthUserProfile(user: User | User): void {
        
        if (this.currentUserValue.id === user.id) {

            const updatedObj = {...this.currentUserValue, ...user};

            this.removeCurrentUserLocalStorage();
            this.setCurrentUserLocalStorage(updatedObj);
            this._currentUserSubject.next(updatedObj);

        }

    }

    changePassword(data: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/change-password`, data)
            .pipe(
                tap((response: ApiCommonResponse) => {
                    
                    this.updateAuthUserProfile(response.data);

                }),
                map((response: ApiCommonResponse) => {
                    return response.message;
                }), 
                shareReplay()
            );

    }

    staffNewPassword(data: any): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/staff-set-password`, data)
            .pipe(
                map((response: ApiCommonResponse) => {
                    return response.message;
                }), 
                shareReplay()
            );

    }
}
