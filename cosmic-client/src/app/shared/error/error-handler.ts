import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { NotificationType } from "../enum/notification-type.enum";
import { NotificationService } from "../service/notification-service";

export interface ApiError {
    code: number;
    message: string;
}

@Injectable()
export class AppErrorHandler implements ErrorHandler {

    constructor(private _injector: Injector) {}

    handleError(error: any): void {

        const notificationService = this._injector.get(NotificationService);

        console.log('[Error Handler]', error);

        if (error instanceof HttpErrorResponse) {

            console.log('[Server Error]');
            notificationService.displayNotification(this.serverErrorMessage(error), NotificationType.ERROR);

        } else {

            console.log('[Client Error]');
            notificationService.displayNotification(this.clientErrorMessage(error), NotificationType.ERROR);

        }

        this.logError(error);

    }

    logError(error: any): void
    {
        console.error(error);
    }

    clientErrorMessage(error: Error): string 
    {
        return error.message ? error.message : error.toString();
    }

    serverErrorMessage(error: HttpErrorResponse): string
    {
        if((this.getErrors(error) != null && typeof this.getErrors(error).message !== 'undefined'))
        {
            return `${this.getErrors(error).message}`;
        }
        else
        {
            return error.status === 0 ? 'API Unavailable' : `${error.status} - ${error.message}`;
        }
    }

    private getErrors(error: any): any
    {
        try
        {
            if (error && error.error)
            {
                return <ApiError> error.error;   
            }
        }
        catch (err)
        {
            return null;
        }
    }

}