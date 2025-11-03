import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorFieldComponent } from '../error-field/error-field.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-2-fa',
  imports: [ReactiveFormsModule, ErrorFieldComponent],
  templateUrl: './form-2-fa.component.html',
  styleUrl: './form-2-fa.component.css'
})
export class Form2FAComponent {
  #fb = inject(FormBuilder);
  #router = inject(Router);
  public authService = inject(AuthService);

  public code = this.#fb.control('', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]*$')]);

  onSubmit() {
    if (this.code.invalid) {
      this.code.markAsTouched();
      return;
    }

    this.authService.verify2FA(this.code.value!).subscribe(res => {
      console.log(res);
      if(res){
        this.#router.navigate(['/product/products'])
      }
      
    });

    this.code.reset();
  }


  generateNewCode2FA() {
    this.authService.generateNewCode2FA().subscribe((result) => {
      console.log(result);
    })
  }

  onCancel() {
    this.#router.navigate(['/auth/login']);
  }
}
