import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ReportTypes } from 'app/shared/enum/report-type.enum';
import { CommonService } from 'app/shared/services/common-service.service';
import { Subject } from 'rxjs';
import { ReportService } from './services/report.service';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    animations: [
        fuseAnimations
    ]
})
export class ReportComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    tableLoading: boolean;
    reportTypes: {name: string, value: string}[];
    reportTypeInput: string;
    reportTypeEnum: typeof ReportTypes = ReportTypes;

    constructor(
        private _reportService: ReportService,
        private _commonService: CommonService
    ) { 

        this._unsubscribeAll = new Subject();
        this.tableLoading = false;
        this.reportTypeInput = null;
        this.reportTypes = this._commonService.getReportTypes();

    }

    ngOnInit(): void {


    }


    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // this._reportService.resetServiceData();
    }

}
