import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CustomerService } from 'app/main/modules/customer/services/customer.service';
import { StaffService } from 'app/main/modules/staff/services/staff.service';
import { User } from 'app/shared/interface/user.interface';
import { CommonService } from 'app/shared/services/common-service.service';
import { NotificationService } from 'app/shared/services/notification-service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { AuthService } from 'app/shared/services/auth.service';
import { UserLevel } from 'app/shared/enum/user-level.enum';
import { BookingService } from '../../services/booking.service';

@Component({
    selector: 'app-booking-filter-sidebar',
    templateUrl: './booking-filter-sidebar.component.html',
    styleUrls: ['./booking-filter-sidebar.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class BookingFilterSidebarComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;


    loading: boolean;
    filterForm: FormGroup;
    staffList: User[];
    customerList: User[];

    filterDefault: any;

    constructor(
        private _formBuilder: FormBuilder,
        private _notificationService: NotificationService,
        private _commonService: CommonService,
        private _authService: AuthService,
        private _staffService: StaffService,
        private _customerService: CustomerService,
        private _bookingService: BookingService
    ) {

        this._unsubscribeAll = new Subject();

        this.loading = false;
        this.customerList = [];
        this.staffList = [];

        this.filterDefault = {
            customer: null,
            staff: null
        };

        this.createForm();

    }

    ngOnInit(): void {

        this._staffService
            .onStaffDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: User[]) => {
                this.staffList = data;
            });

        this._customerService
            .onCustomerDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: User[]) => {
                this.customerList = data;
            });

        this._bookingService
            .onTableLoading
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: boolean) => {
                this.loading = value;
            });

        this.setVisibility();

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    //------------------------ Methods ----------------------//

    createForm(): void {

        this.filterForm = this._formBuilder.group({
            staff: new FormControl(null),
            customer: new FormControl(null),
        });

    }

    disableReset(): boolean {
        return _.isEqual(this.filterDefault, {...{staff: null, customer: null}, ...this.filterForm.value});
    }

    reset(event: MouseEvent): void {
        event.preventDefault();
        this.filterForm.patchValue(this.filterDefault);
        this._bookingService.onFilterChanged.next(null);
    }

    setVisibility(): void {

        const authUser = this._authService.currentUserValue;

        if (authUser.role === UserLevel.CUSTOMER) {
            this.filterForm.get('customer').disable();
        } else if (authUser.role === UserLevel.STAFF) {
            this.filterForm.get('staff').disable();
        }

    }

    submit(event: MouseEvent): void {

        event.preventDefault();

        const sendObj = this.filterForm.value;
        
        this._bookingService.onFilterChanged.next(sendObj);

    }

}
