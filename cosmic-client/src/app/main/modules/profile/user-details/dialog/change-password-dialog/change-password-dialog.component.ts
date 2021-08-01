import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { ApiCommonResponse } from 'app/shared/interface/http-common-response.interface';
import { AuthService } from 'app/shared/services/auth.service';
import { NotificationService } from 'app/shared/services/notification-service';
import { UserService } from 'app/shared/services/user.service';
import { passwordMatchValidator } from 'app/shared/validators/password-match-validator';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-change-password-dialog',
    templateUrl: './change-password-dialog.component.html',
    styleUrls: ['./change-password-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ]
})
export class ChangePasswordDialogComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;
    passwordForm: FormGroup;
    loading: boolean;

    constructor(
        public matDialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _authService: AuthService,
        private _notificationService: NotificationService
    ) {

        this._unsubscribeAll = new Subject();

        this.loading = false;
        this.createForm();


    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    //------------------------ Methods ----------------------//

    createForm(): void {

        this.passwordForm = this._formBuilder.group({
            current_password: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required]),
            confirm_password: new FormControl(null, [Validators.required, passwordMatchValidator]),
        });

    }

    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.passwordForm.invalid) {
            return;
        }

        this.loading = true;

        const sendObj = this.passwordForm.value;

        this._authService.changePassword(sendObj)
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
                    this.matDialogRef.close();
                }, 500);

            });

    }
}
