import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class HttpAuthInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const modRequest = request.clone({ 
            setHeaders: {
                'Authorization': `Sample-Token`,
            }
        });

        return next.handle(modRequest);

    }

}