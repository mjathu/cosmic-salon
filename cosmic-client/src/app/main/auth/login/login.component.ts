import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthService } from 'app/shared/services/auth.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class LoginComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    loginForm: FormGroup;
    loading: boolean;

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

        this.loginForm = this._formBuilder.group({
            email: new FormControl('admin@gmail.com', [Validators.required, Validators.email]),
            password: new FormControl('password', [Validators.required])
        });
    
    }

    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;

        const sendObj = this.loginForm.value;

        this._authService.login(sendObj)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe();
    }

}
