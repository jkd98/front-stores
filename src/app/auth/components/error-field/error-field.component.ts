import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-error-field',
  imports: [],
  templateUrl: './error-field.component.html',
  styleUrl: './error-field.component.css'
})
export class ErrorFieldComponent {
  @Input({ required: true }) control!: AbstractControl;
  @Input({ required: true }) fieldName = 'campo'

  isValidField(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched)
  }

  getErrorField(): string | null {
    const errors = this.control.errors ?? {};
    console.log(errors);
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `El campo ${this.fieldName} es obligatorio`
        case 'email':
          return `El campo ${this.fieldName} debe tener un formato válido`
        case 'minlength':
          return `El campo ${this.fieldName} debe tener ${errors['minlength']['requiredLength']} caracteres`
      }
    }
    return null
  }

}
