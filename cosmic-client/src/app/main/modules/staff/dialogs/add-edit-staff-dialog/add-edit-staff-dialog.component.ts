import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { NotificationType } from 'app/shared/enum/notification-type.enum';
import { User } from 'app/shared/interface/user.interface';
import { CommonService } from 'app/shared/services/common-service.service';
import { NotificationService } from 'app/shared/services/notification-service';
import { emailExistsAsyncValidator } from 'app/shared/validators/email-exists-async.validator';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { StaffService } from '../../services/staff.service';

@Component({
    selector: 'app-add-edit-staff-dialog',
    templateUrl: './add-edit-staff-dialog.component.html',
    styleUrls: ['./add-edit-staff-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ]
})
export class AddEditStaffDialogComponent implements OnInit {

    private _unsubscribeAll: Subject<any>;

    staffForm: FormGroup;
    loading: boolean;
    editMode: boolean;
    staff: User;

    constructor(
        public matDialogRef: MatDialogRef<AddEditStaffDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _notificationService: NotificationService,
        private _commonService: CommonService,
        private _staffService: StaffService
    ) {

        this._unsubscribeAll = new Subject();

        this.loading = false;
        this.createForm();

        this.staff = this._data.staff || null;
        this.editMode = this.staff ? true : false;

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

        this.staffForm = this._formBuilder.group({
            id: new FormControl(null, [Validators.required]),
            first_name: new FormControl(null, [Validators.required]),
            last_name: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.required, Validators.email], [emailExistsAsyncValidator(this._commonService)]),
            phone: new FormControl(null, [Validators.required]),
            active: new FormControl(false)
        });

    }

    setEditData(): void {

        this.staffForm.patchValue({
            id: this.staff.id,
            first_name: this.staff.firstName,
            last_name: this.staff.lastName,
            email: this.staff.email,
            phone: this.staff.phone,
            active: this.staff.active
        });

        this.staffForm.get('email').disable();

    }

    prepareNewForm(): void {

        this.staffForm.get('active').disable();
        this.staffForm.get('id').disable();

    }


    submit(event: MouseEvent): void {

        event.preventDefault();

        if (this.staffForm.invalid) {
            return;
        }

        const sendObj = this.staffForm.value;
        
        this.loading = true;

        if (this.editMode) {

            this._staffService.updateStaff(sendObj)
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
                        this._staffService.listStaff().subscribe();
                        this.matDialogRef.close();
                    }, 500);

                });

        } else {

            this._staffService.addStaff(sendObj)
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
                        this._staffService.listStaff().subscribe();
                    }, 100);

                });

        }


    }
}
