import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCategoryComponent } from './service-category.component';
import { AddEditServiceCategoryDialogComponent } from './dialogs/add-edit-service-category-dialog/add-edit-service-category-dialog.component';
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
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AuthGuard } from 'app/shared/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: ServiceCategoryComponent
    }
];

@NgModule({
    declarations: [
        ServiceCategoryComponent, 
        AddEditServiceCategoryDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FuseSharedModule,
        SharedModule,

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
export class ServiceCategoryModule { }
