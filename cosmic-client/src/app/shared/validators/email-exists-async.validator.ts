import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { of } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, first, map, switchMap } from "rxjs/operators";
import { CommonService } from "../services/common-service.service";

export function emailExistsAsyncValidator(_commonService: CommonService): AsyncValidatorFn
{
    return (control: AbstractControl) => control
        .valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(() => _commonService.checkExistingEmail(control.value)),
            map((exists: boolean) => (exists == true ? { 'exists': true} : null)),
            catchError(() => of(null)),
            first()
        );
}