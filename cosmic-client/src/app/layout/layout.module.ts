import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './partials/header/header.component';
import { NavigationComponent } from './partials/navigation/navigation.component';
import { ContentComponent } from './partials/content/content.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';





@NgModule({
    declarations: [
        MainLayoutComponent,
        HeaderComponent,
        NavigationComponent,
        ContentComponent
    ],
    imports: [
        CommonModule,
        RouterModule,

        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,

        FlexLayoutModule
    ],
    exports: [
        MainLayoutComponent,
        HeaderComponent,
        NavigationComponent,
        ContentComponent
    ]
})
export class LayoutModule { }
