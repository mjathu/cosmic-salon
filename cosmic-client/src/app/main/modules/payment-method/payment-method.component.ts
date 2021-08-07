import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { PaymentMethod } from 'app/shared/interface/payment-method.interface';
import { NotificationService } from 'app/shared/services/notification-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddPaymentMethodDialogComponent } from './dialogs/add-payment-method-dialog/add-payment-method-dialog.component';
import { PaymentMethodService } from './services/payment-method.service';

@Component({
    selector: 'app-payment-method',
    templateUrl: './payment-method.component.html',
    styleUrls: ['./payment-method.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class PaymentMethodComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    paymentMethodList: PaymentMethod[];
    tableLoading: boolean;
    displayedColumns = ['brand', 'cardNumber', 'expiry', 'default', 'buttons'];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _paymentMethodService: PaymentMethodService,
        public _matDialog: MatDialog,
        private _notificationService: NotificationService,
    ) { 

        this._unsubscribeAll = new Subject();

        this.paymentMethodList = [];
        this.tableLoading = false;

        this.dataSource = new MatTableDataSource<PaymentMethod>(this.paymentMethodList);

    }

    ngOnInit(): void {

        this._paymentMethodService
            .onTableLoading
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: boolean) => {
                this.tableLoading = value;
            });

        this._paymentMethodService.listPaymentMethod().subscribe();

    }

    ngAfterViewInit(): void {

        this.dataSource.paginator = this.paginator;

        this._paymentMethodService
            .onPaymentMethodDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: PaymentMethod[]) => {

                this.paymentMethodList = data;
                this.dataSource.data = this.paymentMethodList;

            });

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._paymentMethodService.resetServiceData();
    }

    openAddEditDialog(event: MouseEvent): void {

        event.preventDefault();

        this._matDialog.open(AddPaymentMethodDialogComponent, {
            panelClass: 'add-payment-method-dialog',
            closeOnNavigation: true,
            disableClose: true,
            autoFocus: false,
            data: {}
        });

    }

    setDefault(event: MouseEvent, paymentMethod: PaymentMethod): void {

        event.preventDefault();

        this._paymentMethodService.updatePaymentMethod(paymentMethod.id)
            .pipe(
                takeUntil(this._unsubscribeAll),
            ).subscribe((message: string) => {

                if (message) {
                    this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                }

                setTimeout(() => {
                    this._paymentMethodService.listPaymentMethod().subscribe();
                }, 100);

            });

    }

    deletePaymentMethod(event: MouseEvent, paymentMethod: PaymentMethod): void {

        event.preventDefault();

        this._paymentMethodService.deletePaymentMethod(paymentMethod.id)
            .pipe(
                takeUntil(this._unsubscribeAll),
            ).subscribe((message: string) => {

                if (message) {
                    this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                }

                setTimeout(() => {
                    this._paymentMethodService.listPaymentMethod().subscribe();
                }, 100);

            });

    }

}
