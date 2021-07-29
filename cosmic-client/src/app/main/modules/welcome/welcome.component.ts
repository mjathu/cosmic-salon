import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Const } from 'app/shared/Const';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { AuthService } from 'app/shared/services/auth.service';
import { NotificationService } from 'app/shared/services/notification-service';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

    constructor(private _httpClient: HttpClient, private _notificationService: NotificationService, private _authService: AuthService) { }

    ngOnInit(): void {
    }

    apiCall(): void {

        this._httpClient.get('https://jsonplaceholder.typicode.com/posts/1')
            .subscribe((res) => {
                console.log(res);
                this._notificationService.displayNotification('Ok', NotificationType.SUCCESS);
            });

    }

    badCall(): void {

        this._httpClient.get('https://jsonplaceholder.typicode.com/posts/2000')
            .subscribe((res) => {
                console.log(res);
            });

    }

    getUsers(): void {

        this._httpClient.get(`${Const.apiBaseUrl}/user`).subscribe();

    }

    logout(): void {

        this._authService.logout().subscribe();

    }

}
