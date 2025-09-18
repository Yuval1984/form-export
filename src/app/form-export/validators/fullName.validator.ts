import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function fullNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const rawValue = control.value || '';

        if (!rawValue) return null;

        if (/^\d/.test(rawValue)) {
            return { startsWithNumber: true };
        }

        if (!rawValue.includes(' ')) {
            return { missingSpace: true }; // no space at all
        }

        const parts = rawValue.split(/\s+/).map((p: string) => p.trim()).filter(Boolean);
        if (parts.length < 2) {
            return { missingSecondName: true }; // space exists, but no valid second word
        }

        return null;
    };
}
