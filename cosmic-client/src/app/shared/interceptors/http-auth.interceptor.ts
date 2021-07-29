import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

    constructor (
        private _authService: AuthService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this._authService.getCurrentUserLocalStorage()?.token || null;

        const modRequest = request.clone({ 
            setHeaders: {
                'Authorization': `Bearer ${token}`,
            }
        });

        return next.handle(modRequest);

    }

}