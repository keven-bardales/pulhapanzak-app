import { AbstractControl, ValidationErrors } from '@angular/forms';

export const maxDateValidator = (date: Date) => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && new Date(control.value) > date) {
      return { invalidDate: true };
    }
    return null;
  };
};
