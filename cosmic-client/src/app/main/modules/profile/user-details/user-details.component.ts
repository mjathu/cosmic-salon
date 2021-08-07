import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/shared/services/auth.service';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { UserService } from 'app/shared/services/user.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { NotificationService } from 'app/shared/services/notification-service';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { ApiCommonResponse } from 'app/shared/interface/http-common-response.interface';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from './dialog/change-password-dialog/change-password-dialog.component';
import { User } from 'app/shared/interface/user.interface';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class UserDetailsComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    profileForm: FormGroup;
    loading: boolean;
    user: User;

    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _userService: UserService,
        private _notificationService: NotificationService,
        public _matDialog: MatDialog
    ) {

        
        this._unsubscribeAll = new Subject();
        this.loading = false;
        
        this.user = this._authService.currentUserValue;
        this.createForm();

    }

    //------------------------ Life Cycle ----------------------//

    ngOnInit(): void {



    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    //------------------------ Methods ----------------------//

    createForm(): void {

        this.profileForm = this._formBuilder.group({
            email: new FormControl(this.user.email, [Validators.required, Validators.email]),
            firstName: new FormControl(this.user.firstName, [Validators.required]),
            lastName: new FormControl(this.user.lastName, [Validators.required]),
            phone: new FormControl(this.user.phone, [Validators.required]),
        });

        this.profileForm.get('email').disable();

    }

    formChanged(): boolean {
        const formValue = this.profileForm.value;
        const originalValue = _.pick(this.user, ['firstName', 'lastName', 'phone']);

        return !_.isEqual(formValue, originalValue);
    }

    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.profileForm.invalid) {
            return;
        }

        this.loading = true;

        const sendObj = this.profileForm.value;

        this._userService.updateProfile(sendObj)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe((response: ApiCommonResponse) => {

                if (response.message) {
                    this._notificationService.displayNotification(response.message, NotificationType.SUCCESS);
                }

                this._authService.updateAuthUserProfile(response.data);

            });

    }

    openChangePasswordDialog(event: MouseEvent): void {

        event.preventDefault();

        this._matDialog.open(ChangePasswordDialogComponent, {
            panelClass: 'change-password-dialog',
            closeOnNavigation: true,
            disableClose: true,
            autoFocus: false,
            data: {}
        });

    }
}
