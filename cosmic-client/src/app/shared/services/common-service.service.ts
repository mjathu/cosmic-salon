import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Const } from '../Const';
import { ApiCommonResponse } from '../interface/http-common-response.interface';
import { AuthService } from './auth.service';
import * as _ from 'lodash';
import { UserLevel } from '../enum/user-level.enum';
import { User } from '../interface/user.interface';
import { Booking } from '../interface/booking.interface';
import * as moment from 'moment';

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

        const authUser: User = this._authService.currentUserValue;

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
                    id       : 'service',
                    title    : 'Services',
                    type     : 'item',
                    icon     : 'settings',
                    url      : '/services'
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
                    url      : '/customers'
                },
                {
                    id       : 'booking',
                    title    : 'Booking',
                    type     : 'item',
                    icon     : 'today',
                    url      : '/booking'
                },
                {
                    id       : 'payments',
                    title    : 'Payments',
                    type     : 'item',
                    icon     : 'attach_money',
                    url      : '/payments'
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
                },
                {
                    id       : 'booking',
                    title    : 'Booking',
                    type     : 'item',
                    icon     : 'today',
                    url      : '/booking'
                }
            ];

        } else if (authUser.role === UserLevel.CUSTOMER) {

            navItems = [
                {
                    id       : 'home',
                    title    : 'Home',
                    type     : 'item',
                    icon     : 'home',
                    url      : '/home'
                },
                {
                    id       : 'booking',
                    title    : 'Booking',
                    type     : 'item',
                    icon     : 'today',
                    url      : '/booking'
                },
                {
                    id       : 'payment-method',
                    title    : 'Payment Method',
                    type     : 'item',
                    icon     : 'credit_card',
                    url      : '/payment-method'
                },
                {
                    id       : 'payments',
                    title    : 'Payments',
                    type     : 'item',
                    icon     : 'attach_money',
                    url      : '/payments'
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

    bookingEventMinToDate(time: number, date: string = null,  format: string = null): any {

        let dateObj = date ? moment(date) : moment();

        dateObj.startOf('day').set({
            'hour': Math.floor( time/ 60),
            'minute': Math.floor(time % 60),
            'second': 0,
            'millisecond': 0
        });

        if (format) {
            return dateObj.format(format);
        } else {
            return dateObj.toDate();
        }

    }

    timeInputToMin(input: string): number {

        let obj = moment(input, 'HH:mm');

        return obj.diff(moment().startOf('day'), 'minutes');

    }

    dbFormatDate(date: any): string {
        return moment(date).format('YYYY-MM-DD');
    }

}
