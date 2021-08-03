import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { OpenRouteGuard } from 'app/shared/guards/open-route.guard';
import { SharedModule } from 'app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';

const routes: Routes = [
    {
        path: 'login',
        canActivate: [OpenRouteGuard],
        component: LoginComponent
    },
    {
        path: 'register',
        canActivate: [OpenRouteGuard],
        component: RegisterComponent
    },
    {
        path: 'verify-email',
        component: VerifyEmailComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [OpenRouteGuard]
    },
    {
        path: 'reset-password',
        component: PasswordResetComponent,
        canActivate: [OpenRouteGuard]
    },
    {
        path: 'staff-account-setup',
        component: NewPasswordComponent,
        canActivate: [OpenRouteGuard]
    }
];

@NgModule({
    declarations: [LoginComponent, RegisterComponent, PasswordResetComponent, VerifyEmailComponent, ForgotPasswordComponent, NewPasswordComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,

        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,

        FlexLayoutModule,

        SharedModule
    ]
})
export class AuthModule { }
