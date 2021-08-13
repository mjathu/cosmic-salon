import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from './booking.component';
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
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarModule as AngularCalendarModule, DateAdapter, CalendarDateFormatter, CalendarMomentDateFormatter, MOMENT } from 'angular-calendar';
import { AddEditBookingDialogComponent } from './dialogs/add-edit-booking-dialog/add-edit-booking-dialog.component';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { BookingFilterSidebarComponent } from './sidebar/booking-filter-sidebar/booking-filter-sidebar.component';
import { MatSelectModule } from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import { BookingDetailDialogComponent } from './dialogs/booking-detail-dialog/booking-detail-dialog.component';
import { BookingChargeDialogComponent } from './dialogs/booking-charge-dialog/booking-charge-dialog.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: BookingComponent
    }
];

export function momentAdapterFactory() {
    return adapterFactory(moment);
}


@NgModule({
    declarations: [
        BookingComponent,
        AddEditBookingDialogComponent,
        BookingFilterSidebarComponent,
        BookingDetailDialogComponent,
        BookingChargeDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FuseSharedModule,
        SharedModule,
        FuseSidebarModule,

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
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatSelectModule,
        MatChipsModule,

        AngularCalendarModule.forRoot(
            {
                provide: DateAdapter,
                useFactory: momentAdapterFactory
            },
            {
                dateFormatter: {
                    provide: CalendarDateFormatter,
                    useClass: CalendarMomentDateFormatter,
                },
            }
        ),

        FuseSharedModule,
        FuseConfirmDialogModule
    ],
    providers: [
        {
          provide: MOMENT,
          useValue: moment,
        },
      ],
})
export class BookingModule { }
