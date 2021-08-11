import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { User } from 'app/shared/interface/user.interface';
import { NotificationService } from 'app/shared/services/notification-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AddEditStaffDialogComponent } from './dialogs/add-edit-staff-dialog/add-edit-staff-dialog.component';
import { StaffService } from './services/staff.service';

@Component({
    selector: 'app-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class StaffComponent implements OnInit, OnDestroy, AfterViewInit {

    private _unsubscribeAll: Subject<any>;

    staffList: User[];
    tableLoading: boolean;
    displayedColumns = ['name', 'email', 'phone', 'status', 'buttons'];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _staffService: StaffService,
        private _loader: NgxUiLoaderService,
        public _matDialog: MatDialog,
        private _notificationService: NotificationService,
    ) { 

        this._unsubscribeAll = new Subject();

        this.staffList = [];
        this.tableLoading = false;

        this.dataSource = new MatTableDataSource<User>(this.staffList);

    }

    ngOnInit(): void {

        this._staffService
            .onTableLoading
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: boolean) => {
                this.tableLoading = value;
            });

        this._staffService
            .onStaffDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((staff: User[]) => {

                this.staffList = staff;
                this.dataSource.data = this.staffList;

            });

        this._staffService.listStaff().subscribe();

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._staffService.resetServiceData();
    }

    openAddEditDialog(event: MouseEvent, staff: User): void {

        event.preventDefault();

        this._matDialog.open(AddEditStaffDialogComponent, {
            panelClass: 'add-edit-staff-dialog',
            closeOnNavigation: true,
            disableClose: true,
            autoFocus: false,
            data: {
                staff: staff
            }
        });

    }

    deleteStaff(event: MouseEvent, staff: User): void {

        event.preventDefault();

        this._staffService.deleteStaff(staff.id)
            .pipe(
                takeUntil(this._unsubscribeAll),
            ).subscribe((message: string) => {

                if (message) {
                    this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                }

                setTimeout(() => {
                    this._staffService.listStaff().subscribe();
                }, 100);

            });

    }

    reloadTable(event: MouseEvent): void {
        
        event.preventDefault();

        this._staffService.listStaff().subscribe();
        
    }

}
