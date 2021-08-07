import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMethodComponent } from './payment-method.component';
import { AddPaymentMethodDialogComponent } from './dialogs/add-payment-method-dialog/add-payment-method-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { AuthGuard } from 'app/shared/guards/auth.guard';

import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'environments/environment';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: PaymentMethodComponent
    }
];

@NgModule({
    declarations: [
        PaymentMethodComponent,
        AddPaymentMethodDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FuseSharedModule,
        SharedModule,

        NgxStripeModule.forRoot(environment.stripeKey),

        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatToolbarModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatCheckboxModule
    ]
})
export class PaymentMethodModule { }
