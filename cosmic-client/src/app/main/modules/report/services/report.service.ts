import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Const } from 'app/shared/Const';
import { ApiCommonResponse } from 'app/shared/interface/http-common-response.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import * as _ from 'lodash';
import { Papa } from 'ngx-papaparse';
import * as moment from 'moment';
import { UpperCasePipe } from '@angular/common';
import { BookingService } from '../../booking/services/booking.service';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    onTableLoading: Subject<boolean>;
    onReportDateChanged: BehaviorSubject<any>;

    constructor(
        private _httpClient: HttpClient,
        private _csvParse: Papa,
        private _upperCasePipe: UpperCasePipe,
        private _bookingService: BookingService
    ) {

        this.onTableLoading = new Subject();
        this.onReportDateChanged = new BehaviorSubject([]);

    }


    getBookingReportData(postData: any, download: boolean): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/booking-report`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {

                    const data = response.data && _.isArray(response.data) ? response.data : [];
                    
                    this.onReportDateChanged.next(data);

                    if (download) {

                        const csvData = _.map(data, (item) => {

                            return {
                                'Customer': item.customer,
                                'Staff': item.staff,
                                'Date': item.date,
                                'Time': `${item.start_time} - ${item.end_time}`,
                                'Services': item.services,
                                'Price': new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(item.price),
                                'Status': this._bookingService.getStatusDescription(item.status)
                            };

                        });

                        this.downloadCsv(csvData, 'booking-report');

                    }

                    return response.message;

                }),
                shareReplay()
            );

    }

    getIncomeReportData(postData: any, download: boolean): Observable<any> {

        return this._httpClient.post(`${Const.apiBaseUrl}/income-report`, postData)
            .pipe(
                map((response: ApiCommonResponse) => {

                    const data = response.data && _.isArray(response.data) ? response.data : [];
                    
                    this.onReportDateChanged.next(data);

                    if (download) {

                        const csvData = _.map(data, (item) => {

                            return {
                                'Customer': item.customer,
                                'Staff': item.staff,
                                'Date': item.date,
                                'Payment Method': item.payment_method,
                                'Payment Reference': this._upperCasePipe.transform(item.payment_reference),
                                'Price': new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(item.price)
                            };

                        });

                        this.downloadCsv(csvData, 'income-report');

                    }

                    return response.message;

                }),
                shareReplay()
            );

    }

    downloadCsv(csvData: any[], name: string): void {

        const csv = this._csvParse.unparse(csvData);

        const csvBlob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        let csvURL =  null;

        let fileName = `${name}-${moment().unix()}.csv`;
        
        if (navigator.msSaveBlob)
        {
            csvURL = navigator.msSaveBlob(csvBlob, fileName);
        }
        else
        {
            csvURL = window.URL.createObjectURL(csvBlob);
        }

        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', fileName);
        tempLink.click();

    }



    resetServiceData(): void {
        this.onTableLoading.next(false);
        this.onReportDateChanged.next([]);
    }

}
