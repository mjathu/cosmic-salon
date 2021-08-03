import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { AuthService } from 'app/shared/services/auth.service';
import { CommonService } from 'app/shared/services/common-service.service';
import { NotificationService } from 'app/shared/services/notification-service';
import { emailExistsAsyncValidator } from 'app/shared/validators/email-exists-async.validator';
import { passwordMatchValidator } from 'app/shared/validators/password-match-validator';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    animations: [
        fuseAnimations,
        
    ]
})
export class RegisterComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    registerForm: FormGroup;
    loading: boolean;
    submitSuccess: boolean;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _commonService: CommonService,
        private _notificationService: NotificationService
    ) {

        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                }
            }
        };

        this.createForm();

        this._unsubscribeAll = new Subject();
        this.loading = false;
        this.submitSuccess = false;
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

        this.registerForm = this._formBuilder.group({
            firstName: new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.required, Validators.email], [emailExistsAsyncValidator(this._commonService)]),
            password: new FormControl(null, [Validators.required, Validators.min(6)]),
            confirmPassword: new FormControl(null, [Validators.required, passwordMatchValidator])
        });
    
    }

    get fc(): any {
        return this.registerForm.controls;
    }

    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;

        const sendObj = this.registerForm.value;

        this._authService.register(sendObj)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe((message: string) => {

                this.submitSuccess = true;

                if (message) {
                    this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                }

            });

    }

}
