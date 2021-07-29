import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor (
        private _authService: AuthService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next
            .handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {

                    console.log('[Error Interceptor]');

                    if (error.status === 401) {
                        // Logout and clear
                        this._authService.logoutSteps();
                    }

                    return throwError(error);
                })
            );


    }

}