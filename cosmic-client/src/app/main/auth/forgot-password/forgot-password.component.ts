import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthService } from 'app/shared/services/auth.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    forgotPasswordForm: FormGroup;
    loading: boolean;
    submitSuccess: boolean;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authService: AuthService
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

        this.forgotPasswordForm = this._formBuilder.group({
            email: new FormControl(null, [Validators.required, Validators.email])
        });
    
    }

    get fc(): any {
        return this.forgotPasswordForm.controls;
    }

    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.forgotPasswordForm.invalid) {
            return;
        }

        this.loading = true;

        const sendObj = this.forgotPasswordForm.value;

        this._authService.forgotPassword(sendObj)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(() => {
                this.submitSuccess = true;
            });

    }

}
