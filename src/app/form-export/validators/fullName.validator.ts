import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fullNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value as string;
        if (!value) return null;

        if (/^\d/.test(value)) {
            return { startsWithNumber: true };
        }
        if (!/\s/.test(value)) {
            return { missingSpace: true };
        }
        return null;
    };
}
