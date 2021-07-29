import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class OpenRouteGuard implements CanActivate {

    constructor(
        private _authService: AuthService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {

        const currentUser = this._authService.getCurrentUserLocalStorage() || null;

        if (!currentUser) 
        {
            return true;
        }

        this._authService.redirectDefaultAuthenticatedRoute();

        return false;
        
    }

}
