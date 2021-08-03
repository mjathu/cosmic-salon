import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { User } from 'app/shared/interface/user.interface';
import { CommonService } from 'app/shared/services/common-service.service';
import { NotificationService } from 'app/shared/services/notification-service';
import { emailExistsAsyncValidator } from 'app/shared/validators/email-exists-async.validator';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { CustomerService } from '../../services/customer.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-add-edit-customer-dialog',
    templateUrl: './add-edit-customer-dialog.component.html',
    styleUrls: ['./add-edit-customer-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ]
})
export class AddEditCustomerDialogComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    customerForm: FormGroup;
    loading: boolean;
    editMode: boolean;
    customer: User;

    constructor(
        public matDialogRef: MatDialogRef<AddEditCustomerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _notificationService: NotificationService,
        private _commonService: CommonService,
        private _customerService: CustomerService
    ) {

        this._unsubscribeAll = new Subject();

        this.loading = false;
        this.createForm();

        this.customer = this._data.customer || null;
        this.editMode = this.customer ? true : false;

    }

    ngOnInit(): void {

        if (this.editMode) {
            this.setEditData();
        } else {
            this.prepareNewForm();
        }

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    //------------------------ Methods ----------------------//

    createForm(): void {

        this.customerForm = this._formBuilder.group({
            id: new FormControl(null, [Validators.required]),
            firstName: new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.required, Validators.email], [emailExistsAsyncValidator(this._commonService)]),
            phone: new FormControl(null, [Validators.required]),
            active: new FormControl(false)
        });

    }

    setEditData(): void {

        this.customerForm.patchValue({
            id: this.customer.id,
            firstName: this.customer.firstName,
            lastName: this.customer.lastName,
            email: this.customer.email,
            phone: this.customer.phone,
            active: this.customer.active
        });

        this.customerForm.get('email').disable();

    }

    prepareNewForm(): void {

        this.customerForm.get('active').disable();
        this.customerForm.get('id').disable();

    }

    formChanged(): boolean {

        if (this.editMode) {

            const formValue = this.customerForm.value;
            const originalValue = _.pick(this.customer, ['firstName', 'lastName', 'phone', 'active', 'id']);

            return !_.isEqual(formValue, originalValue);

        } else {
            return true;
        }
        
    }


    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.customerForm.invalid) {
            return;
        }

        const sendObj = this.customerForm.value;
        
        this.loading = true;

        if (this.editMode) {

            this._customerService.updateCustomer(sendObj)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.loading = false;
                    })
                ).subscribe((message: string) => {

                    if (message) {
                        this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                    }

                    setTimeout(() => {
                        this._customerService.listCustomers().subscribe();
                        this.matDialogRef.close();
                    }, 500);

                });

        }


    }

}
