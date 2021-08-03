import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { User } from 'app/shared/interface/user.interface';
import { NotificationService } from 'app/shared/services/notification-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddEditCustomerDialogComponent } from './dialogs/add-edit-customer-dialog/add-edit-customer-dialog.component';
import { CustomerService } from './services/customer.service';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class CustomerComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    customerList: User[];
    tableLoading: boolean;
    displayedColumns = ['name', 'email', 'phone', 'status', 'buttons'];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _customerService: CustomerService,
        public _matDialog: MatDialog,
        private _notificationService: NotificationService,
    ) { 

        this._unsubscribeAll = new Subject();

        this.customerList = [];
        this.tableLoading = false;

        this.dataSource = new MatTableDataSource<User>(this.customerList);

    }

    ngOnInit(): void {

        this._customerService
            .onTableLoading
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: boolean) => {
                this.tableLoading = value;
            });

        this._customerService
            .onCustomerDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((staff: User[]) => {

                this.customerList = staff;
                this.dataSource.data = this.customerList;

            });

        this._customerService.listCustomers().subscribe();

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._customerService.resetServiceData();
    }

    openAddEditDialog(event: MouseEvent, customer: User): void {

        event.preventDefault();

        this._matDialog.open(AddEditCustomerDialogComponent, {
            panelClass: 'add-edit-customer-dialog',
            closeOnNavigation: true,
            disableClose: true,
            autoFocus: false,
            data: {
                customer: customer
            }
        });

    }

    deleteCustomer(event: MouseEvent, staff: User): void {

        event.preventDefault();

        this._customerService.deleteCustomer(staff.id)
            .pipe(
                takeUntil(this._unsubscribeAll),
            ).subscribe((message: string) => {

                if (message) {
                    this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                }

                setTimeout(() => {
                    this._customerService.listCustomers().subscribe();
                }, 100);

            });

    }

}
