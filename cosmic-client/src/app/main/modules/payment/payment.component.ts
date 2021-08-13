import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { Payment } from 'app/shared/interface/payment.interface';
import { NotificationService } from 'app/shared/services/notification-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaymentDetailDialogComponent } from './dialogs/payment-detail-dialog/payment-detail-dialog.component';
import { PaymentService } from './services/payment.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class PaymentComponent implements OnInit, OnDestroy, AfterViewInit {

    private _unsubscribeAll: Subject<any>;

    paymentList: Payment[];
    tableLoading: boolean;
    displayedColumns = ['customer', 'date', 'paymentReference', 'buttons'];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _paymentService: PaymentService,
        public _matDialog: MatDialog,
        private _notificationService: NotificationService,
    ) { 

        this._unsubscribeAll = new Subject();

        this.paymentList = [];
        this.tableLoading = false;

        this.dataSource = new MatTableDataSource<Payment>(this.paymentList);

    }

    ngOnInit(): void {

        this._paymentService
            .onTableLoading
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: boolean) => {
                this.tableLoading = value;
            });

        this._paymentService
            .onPaymentDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((payments: Payment[]) => {

                this.paymentList = payments;
                this.dataSource.data = this.paymentList;

            });

        this._paymentService.listPayments().subscribe();

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._paymentService.resetServiceData();
    }

    openDetailDialog(event: MouseEvent, payment: Payment): void {

        event.preventDefault();

        this._matDialog.open(PaymentDetailDialogComponent, {
            panelClass: 'payment-detail-dialog',
            closeOnNavigation: true,
            disableClose: true,
            autoFocus: false,
            data: {
                payment: payment
            }
        });

    }

    reloadTable(event: MouseEvent): void {
        
        event.preventDefault();

        this._paymentService.listPayments().subscribe();
        
    }

}
