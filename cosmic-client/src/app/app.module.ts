import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { AuthModule } from './main/auth/auth.module';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { AppErrorHandler } from './shared/error/error-handler';
import { HttpAuthInterceptor } from './shared/interceptors/http-auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxUiLoaderModule } from "ngx-ui-loader";

const appRoutes: Routes = [
    {
        path: 'welcome',
        loadChildren: () => import('./main/modules/welcome/welcome.module').then((m) => m.WelcomeModule)
    },
    {
        path: 'home',
        loadChildren: () => import('./main/modules/home/home.module').then((m) => m.HomeModule)
    },
    {
        path: 'profile',
        loadChildren: () => import('./main/modules/profile/profile.module').then((m) => m.ProfileModule)
    },
    {
        path: 'staff',
        loadChildren: () => import('./main/modules/staff/staff.module').then((m) => m.StaffModule)
    },
    {
        path: 'customers',
        loadChildren: () => import('./main/modules/customer/customer.module').then((m) => m.CustomerModule)
    },
    {
        path      : '**',
        redirectTo: 'home'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
        ReactiveFormsModule,

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-top-center',
            preventDuplicates: true,
            progressBar: true,
            progressAnimation: 'decreasing'
        }),

        // App modules
        LayoutModule,
        SampleModule,
        AuthModule
    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        {
            provide: ErrorHandler, 
            useClass: AppErrorHandler
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpAuthInterceptor,
            multi: true
        },
    ],
})
export class AppModule
{
}
