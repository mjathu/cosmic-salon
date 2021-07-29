import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthGuard } from 'app/shared/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: WelcomeComponent
    }
];

@NgModule({
    declarations: [WelcomeComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FuseSharedModule,

        MatButtonModule,
        MatIconModule,
    ]
})
export class WelcomeModule { }
