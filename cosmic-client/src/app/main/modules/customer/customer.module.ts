import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { AddEditCustomerDialogComponent } from './dialogs/add-edit-customer-dialog/add-edit-customer-dialog.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/shared/guards/auth.guard';
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
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: CustomerComponent
    }
];

@NgModule({
    declarations: [
        CustomerComponent, 
        AddEditCustomerDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FuseSharedModule,
        SharedModule,

        NgxUiLoaderModule,


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
export class CustomerModule { }
