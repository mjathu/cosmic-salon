import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/shared/guards/auth.guard';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddEditStaffDialogComponent } from './dialogs/add-edit-staff-dialog/add-edit-staff-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';


const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: StaffComponent
    }
];

@NgModule({
    declarations: [
        StaffComponent,
        AddEditStaffDialogComponent
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
export class StaffModule { }
