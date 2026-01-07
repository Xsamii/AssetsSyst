import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  inputType: string = 'password';
  showPassword: boolean = false;

  alertError: boolean = false;
  alertErrorMsg: string = '';
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }

  constructor(
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _router: Router
  ) {}
  loginForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  get formControlls() {
    return this.loginForm.controls;
  }
  login() {
    this._authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          localStorage.setItem('maintainanceEmail', res.data.email);
          localStorage.setItem('maintainanceCode', res.data.code);
          this._router.navigate(['/auth/verify-otp']);
        } else {
          this.alertErrorMsg = res.errors[0].message;
          this.alertError = true;
        }
      },
      error: () => {
        this.alertErrorMsg =
          'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
        this.alertError = true;
      },
    });
  }

  // -------------------------------
  // Show Password Icon
  // -------------------------------
  onShowPassword() {
    if (this.inputType == 'password') {
      this.inputType = 'text';
      this.showPassword = true;
    } else {
      this.inputType = 'password';
      this.showPassword = false;
    }
  }
}
