import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { AuthService } from 'app/shared/services/auth.service';
import { NotificationService } from 'app/shared/services/notification-service';
import { passwordMatchValidator } from 'app/shared/validators/password-match-validator';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-new-password',
    templateUrl: './new-password.component.html',
    styleUrls: ['./new-password.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class NewPasswordComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    staffAccountSetupForm: FormGroup;
    loading: boolean;
    id: string;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _route: ActivatedRoute,
        private _router: Router,
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

        
        this._unsubscribeAll = new Subject();
        this.loading = false;

        this.id = this._route.snapshot.queryParamMap.get('id');
        
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

        this.staffAccountSetupForm = this._formBuilder.group({
            password: new FormControl(null, [Validators.required]),
            confirm_password: new FormControl(null, [Validators.required, passwordMatchValidator]),
            id: new FormControl(this.id, [Validators.required])
        });
    
    }

    get fc(): any {
        return this.staffAccountSetupForm.controls;
    }

    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.staffAccountSetupForm.invalid) {
            return;
        }

        this.loading = true;

        const sendObj = this.staffAccountSetupForm.value;

        this._authService.staffNewPassword(sendObj)
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
                    this._authService.redirectDefaultNonAuthenticatedRoute();
                }, 2000);
                
            });

    }

}
