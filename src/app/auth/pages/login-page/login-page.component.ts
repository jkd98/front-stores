import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Form2FAComponent } from '../../components/form-2-fa/form-2-fa.component';
import { FormLoginComponent } from '../../components/form-login/form-login.component';

@Component({
  imports: [FormLoginComponent,Form2FAComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export default class LoginPageComponent {
  ///
  public authService = inject(AuthService);

  onRegister(){
    this.authService.setStatusRegister();
  }

  onLogin(){
    this.authService.setStatusChecking();
  }

}
