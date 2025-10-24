import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorFieldComponent } from '../error-field/error-field.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-form-login',
  imports: [ReactiveFormsModule, ErrorFieldComponent,],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.css'
})
export class FormLoginComponent {
  #fb = inject(FormBuilder);
  public authService = inject(AuthService);
  loginForm = this.#fb.group({
    email: ['test1@email.com', [Validators.required, Validators.email]],
    pass: ['Pass*123456', [Validators.required]]
  });

  ///
  get email() {
    return this.loginForm.get('email');
  }

  get pass() {
    return this.loginForm.get('pass');
  }

  ///
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.email?.value!, this.pass?.value!).subscribe((result) => {
      console.log(result);
    })

    this.loginForm.reset()

  }
}
