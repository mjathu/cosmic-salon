import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthUser } from 'app/shared/interface/auth-user.interface';
import { AuthService } from 'app/shared/services/auth.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;
    infoMessage: string;
    loading: boolean;
    success: boolean;
    id: string;

    constructor(
        private _authService: AuthService,
        private _fuseConfigService: FuseConfigService,
        private _activatedRoute: ActivatedRoute
    ) {
        
        this._unsubscribeAll = new Subject();

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

        this.infoMessage = 'Please wait...';
        this.loading = true;
        this.success = false;

        this.id = this._activatedRoute.snapshot.queryParamMap.get('id');

    }

    ngOnInit(): void {

        this._authService.verifyEmail(this.id)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((user: AuthUser) => {
                this.success = true;

                setTimeout(() => {
                    if (!this._authService.isAuthenticated()) {
                        this._authService.redirectDefaultNonAuthenticatedRoute();
                    } else {
                        this._authService.redirectDefaultAuthenticatedRoute();
                    }
                }, 3000);
            });

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
