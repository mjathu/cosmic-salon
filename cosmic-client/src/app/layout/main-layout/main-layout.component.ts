import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

    @ViewChild('drawer') drawerComp: MatDrawer;

    constructor() { }

    ngOnInit(): void {
    }

    toggleSideNav(): void {
        this.drawerComp.toggle();
    }

}
