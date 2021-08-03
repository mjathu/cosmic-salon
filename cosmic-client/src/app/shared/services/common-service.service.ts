import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Const } from '../Const';
import { AuthUser } from '../interface/auth-user.interface';
import { ApiCommonResponse } from '../interface/http-common-response.interface';
import { AuthService } from './auth.service';
import * as _ from 'lodash';
import { UserLevel } from '../enum/user-level.enum';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService,
        private _fuseNavigationService: FuseNavigationService
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

    setNavigation(): void {

        const navItems = this.getNavigationItems();

        if (this._fuseNavigationService.getNavigation('main')) {

            this._fuseNavigationService.unregister('main');

        }

        // Register the navigation to the service
        this._fuseNavigationService.register('main', navItems);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

    }

    getNavigationItems(): FuseNavigation[] {

        if (!this._authService.isAuthenticated()) {
            return [];
        }

        const authUser: AuthUser = this._authService.currentUserValue;

        let navItems = [];

        if (authUser.role === UserLevel.ADMIN) {

            navItems = [
                {
                    id       : 'home',
                    title    : 'Home',
                    type     : 'item',
                    icon     : 'home',
                    url      : '/home'
                },
                {
                    id       : 'welcome',
                    title    : 'Welcome',
                    type     : 'item',
                    icon     : 'home',
                    url      : '/welcome'
                },
                {
                    id       : 'staff',
                    title    : 'Staff',
                    type     : 'item',
                    icon     : 'people',
                    url      : '/staff'
                },
                {
                    id       : 'customer',
                    title    : 'Customers',
                    type     : 'item',
                    icon     : 'people',
                    url      : '/clients'
                }
            ];

        } else if (authUser.role === UserLevel.STAFF) {

            navItems = [
                {
                    id       : 'home',
                    title    : 'Home',
                    type     : 'item',
                    icon     : 'home',
                    url      : '/home'
                }
            ];

        } else if (authUser.role === UserLevel.CLIENT) {

            navItems = [
                {
                    id       : 'home',
                    title    : 'Home',
                    type     : 'item',
                    icon     : 'home',
                    url      : '/home'
                }
            ];

        }

        return [{
            id       : 'modules',
            title    : '',
            type     : 'group',
            children : navItems
        }];

        
    }

}
