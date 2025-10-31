import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ErrorFieldComponent } from '../error-field/error-field.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-register',
  imports: [ReactiveFormsModule, ErrorFieldComponent, RouterLink],
  templateUrl: './form-register.component.html',
  styleUrl: './form-register.component.css'
})
export class FormRegisterComponent {
  #fb = inject(FormBuilder);
  public authService = inject(AuthService);
  #router = inject(Router);

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('pass');
    const confirmPass = control.get('confirmPass');

    // Solo validar si ambos controles existen y tienen valores
    if (pass && confirmPass && pass.value !== confirmPass.value) {
      // Establece un error en el control 'confirmPass'
      confirmPass.setErrors({ noMatch: true });
      return { passwordsMismatch: true }; // Error a nivel de FormGroup
    } else {
      // Si coinciden y el error 'noMatch' estaba, lo remueve
      if (confirmPass && confirmPass.hasError('noMatch')) {
        confirmPass.setErrors(null);
      }
      return null; // Todo bien
    }
  };

  registerForm = this.#fb.group({
    name: ['test', [Validators.required]],
    lastN: ['test', [Validators.required]],
    email: ['test2@email.com', [Validators.required, Validators.email]],
    pass: ['Pass*123', [Validators.required, Validators.pattern('(?=.*[A-Z])(?=.*[0-9])(?=.*[-_!@#$%^&*()+={};:,.<>?~]).{8,}'), Validators.minLength(8),]],
    confirmPass: ['Pass*123', [Validators.required,]],
    telf: ['1234567098', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]]
  },
    {
      validators: [this.passwordMatchValidator]
    });

  ///
  get name() {
    return this.registerForm.get('name')
  }
  get lastN() {
    return this.registerForm.get('lastN')
  }
  get email() {
    return this.registerForm.get('email');
  }
  get pass() {
    return this.registerForm.get('pass');
  }
  get confirmPass() {
    return this.registerForm.get('confirmPass');
  }
  get telf() {
    return this.registerForm.get('telf');
  }


  ///
  onSubmit() {
    console.log(this.registerForm.invalid)
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.registerUser({
      name:this.name?.value!,
      lastN:this.lastN?.value!,
      email: this.email?.value!,
      pass:this.pass?.value!,
      telf:this.telf?.value!
    }).subscribe(res=>{
      if(res){
        this.registerForm.reset();
        this.#router.navigate([''])
      }
    })

  }

}
