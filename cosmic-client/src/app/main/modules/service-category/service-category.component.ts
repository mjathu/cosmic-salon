import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { Service } from 'app/shared/interface/service.interface';
import { NotificationService } from 'app/shared/services/notification-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddEditServiceCategoryDialogComponent } from './dialogs/add-edit-service-category-dialog/add-edit-service-category-dialog.component';
import { ServiceCategoryService } from './services/service-category.service';

@Component({
    selector: 'app-service-category',
    templateUrl: './service-category.component.html',
    styleUrls: ['./service-category.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class ServiceCategoryComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    serviceList: Service[];
    tableLoading: boolean;
    displayedColumns = ['name', 'description', 'price', 'duration', 'active', 'buttons'];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _serviceCategoryService: ServiceCategoryService,
        private _loader: NgxUiLoaderService,
        public _matDialog: MatDialog,
        private _notificationService: NotificationService,
    ) { 

        this._unsubscribeAll = new Subject();

        this.serviceList = [];
        this.tableLoading = false;

        this.dataSource = new MatTableDataSource<Service>(this.serviceList);

    }

    ngOnInit(): void {

        this._serviceCategoryService
            .onTableLoading
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: boolean) => {
                this.tableLoading = value;
            });

        this._serviceCategoryService.listServices().subscribe();

    }

    ngAfterViewInit(): void {

        this.dataSource.paginator = this.paginator;

        this._serviceCategoryService
            .onServiceDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((services: Service[]) => {

                this.serviceList = services;
                this.dataSource.data = this.serviceList;

            });

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._serviceCategoryService.resetServiceData();
    }

    openAddEditDialog(event: MouseEvent, service: Service): void {

        event.preventDefault();

        this._matDialog.open(AddEditServiceCategoryDialogComponent, {
            panelClass: 'add-edit-service-category-dialog',
            closeOnNavigation: true,
            disableClose: true,
            autoFocus: false,
            data: {
                service: service
            }
        });

    }

    deleteService(event: MouseEvent, service: Service): void {

        event.preventDefault();

        this._serviceCategoryService.deleteService(service.id)
            .pipe(
                takeUntil(this._unsubscribeAll),
            ).subscribe((message: string) => {

                if (message) {
                    this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                }

                setTimeout(() => {
                    this._serviceCategoryService.listServices().subscribe();
                }, 100);

            });

    }

}
