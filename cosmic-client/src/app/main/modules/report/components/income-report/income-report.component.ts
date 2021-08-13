import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { BookingService } from 'app/main/modules/booking/services/booking.service';
import { CommonService } from 'app/shared/services/common-service.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ReportService } from '../../services/report.service';

@Component({
    selector: 'app-income-report',
    templateUrl: './income-report.component.html',
    styleUrls: ['./income-report.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class IncomeReportComponent implements OnInit, OnDestroy, AfterViewInit {

    private _unsubscribeAll: Subject<any>;

    tableLoading: boolean;
    reportForm: FormGroup;
    reportData: [];

    displayedColumns = ['customer', 'staff', 'date', 'paymentMethod', 'paymentReference', 'price'];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    @Input() type: string;

    constructor(
        private _reportService: ReportService,
        private _commonService: CommonService,
        private _formBuilder: FormBuilder,
        private _bookingService: BookingService
    ) { 

        this._unsubscribeAll = new Subject();
        this.tableLoading = false;
        this.reportData = [];
        this.createForm();

        this.dataSource = new MatTableDataSource<any>(this.reportData);

    }

    ngOnInit(): void {

        this._reportService
            .onReportDateChanged
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((data: any) => {
                this.reportData = data || [];
                this.dataSource.data = this.reportData;
            });

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._reportService.resetServiceData();
    }

    createForm(): void {

        this.reportForm = this._formBuilder.group({
            start_date: new FormControl(null, [Validators.required]),
            end_date: new FormControl(null, [Validators.required])
        });

    }

    getStatus(status: string): string {
        return this._bookingService.getStatusDescription(status);
    }

    submit(event: MouseEvent, download: boolean): void {

        event.preventDefault();

        const sendObj = this.reportForm.value;

        this.tableLoading = true;

        this._reportService.getIncomeReportData(sendObj, download)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.tableLoading = false;
                })
            )
            .subscribe()

    }

}
