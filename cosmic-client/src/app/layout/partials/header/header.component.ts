import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    @Output() toggleSideNavEvent: EventEmitter<any>;

    constructor() {
        this.toggleSideNavEvent = new EventEmitter();
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    onNavToggle(event: MouseEvent): void {

        event.preventDefault();
        this.toggleSideNavEvent.next();

    }

}
