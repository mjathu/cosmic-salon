import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NotificationType } from "../enum/notification-type.enum";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private _toastr: ToastrService) {}


    displayNotification(message: string, type: NotificationType, title: string = '', options: any = {}): void {

        this._toastr[type](message, title, options);

    }

    clearNotifications(): void {
        this._toastr.clear();
    }

}