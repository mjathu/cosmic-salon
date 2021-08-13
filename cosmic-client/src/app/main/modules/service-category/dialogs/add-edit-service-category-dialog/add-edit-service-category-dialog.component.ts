import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { Service } from 'app/shared/interface/service.interface';
import { User } from 'app/shared/interface/user.interface';
import { CommonService } from 'app/shared/services/common-service.service';
import { NotificationService } from 'app/shared/services/notification-service';
import { Subject } from 'rxjs';
import { ServiceCategoryService } from '../../services/service-category.service';
import * as _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';
import { NotificationType } from 'app/shared/enum/notification-type.enum';

@Component({
    selector: 'app-add-edit-service-category-dialog',
    templateUrl: './add-edit-service-category-dialog.component.html',
    styleUrls: ['./add-edit-service-category-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ]
})
export class AddEditServiceCategoryDialogComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    serviceForm: FormGroup;
    loading: boolean;
    editMode: boolean;
    service: Service;

    constructor(
        public matDialogRef: MatDialogRef<AddEditServiceCategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _notificationService: NotificationService,
        private _commonService: CommonService,
        private _serviceCategoryService: ServiceCategoryService,
    ) {

        this._unsubscribeAll = new Subject();

        this.loading = false;
        this.createForm();

        this.service = this._data.service || null;
        this.editMode = this.service ? true : false;

    }

    ngOnInit(): void {

        if (this.editMode) {
            this.setEditData();
        } else {
            this.prepareNewForm();
        }

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    //------------------------ Methods ----------------------//

    createForm(): void {

        this.serviceForm = this._formBuilder.group({
            id: new FormControl(null, [Validators.required]),
            name: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
            price: new FormControl(null, [Validators.required, Validators.min(10)]),
            duration: new FormControl(null, [Validators.required, Validators.min(15)]),
            active: new FormControl(false)
        });

    }

    setEditData(): void {

        this.serviceForm.patchValue({
            id: this.service.id,
            name: this.service.name,
            description: this.service.description,
            price: this.service.price,
            duration: this.service.duration,
            active: this.service.active
        });

    }

    prepareNewForm(): void {

        this.serviceForm.get('active').disable();
        this.serviceForm.get('id').disable();

    }

    formChanged(): boolean {

        if (this.editMode) {

            const formValue = this.serviceForm.value;
            const originalValue = _.pick(this.service, ['name', 'description', 'price', 'duration', 'active', 'id']);

            return !_.isEqual(formValue, originalValue);

        } else {
            return true;
        }
        
    }


    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.serviceForm.invalid) {
            return;
        }

        const sendObj = this.serviceForm.value;
        
        this.loading = true;

        if (this.editMode) {

            this._serviceCategoryService.updateService(sendObj)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.loading = false;
                    })
                ).subscribe((message: string) => {

                    if (message) {
                        this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                    }

                    setTimeout(() => {
                        this._serviceCategoryService.listServices().subscribe();
                        this.matDialogRef.close();
                    }, 500);

                });

        } else {

            this._serviceCategoryService.addService(sendObj)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.loading = false;
                    })
                ).subscribe((message: string) => {

                    if (message) {
                        this._notificationService.displayNotification(message, NotificationType.SUCCESS);
                    }

                    setTimeout(() => {
                        this.matDialogRef.close();
                        this._serviceCategoryService.listServices().subscribe();
                    }, 100);

                });

        }


    }

}
