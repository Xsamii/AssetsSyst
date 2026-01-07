import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-active-user',
  templateUrl: './active-user.component.html',
  styleUrls: ['./active-user.component.scss'],
})
export class ActiveUserComponent {
  // -------------------------------
  // Constructor
  // -------------------------------
  constructor(
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService
  ) {}
  // -------------------------------
  // FORM
  // -------------------------------
  email;
  form = this._fb.group({
    newPassword: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#]).{8,}'
        ),
      ],
    ],
    confirmPassword: ['', Validators.required],
  });
  get formControll() {
    return this.form.controls;
  }
  // -------------------------------
  // Show Password Icon
  // -------------------------------
  inputTypePassword: string = 'password';
  inputTypeConfirmPassword: string = 'password';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  onShowPassword() {
    if (this.inputTypePassword == 'password') {
      this.inputTypePassword = 'text';
      this.showPassword = true;
    } else {
      this.inputTypePassword = 'password';
      this.showPassword = false;
    }
  }
  onShowConfirmPassword() {
    if (this.inputTypeConfirmPassword == 'password') {
      this.inputTypeConfirmPassword = 'text';
      this.showConfirmPassword = true;
    } else {
      this.inputTypeConfirmPassword = 'password';
      this.showConfirmPassword = false;
    }
  }

  submit() {
    const obj = {
      email: this.email,
      password: this.form.value.newPassword,
    };
    this._authService.activeUser(obj).subscribe((res) => {
      if (res.isSuccess) {
        this.successAlert = true;
      } else {
        this.errorAlert = true;
      }
    });
  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((res) => {
      this.email = res['email'];
    });
  }

  errorAlert: boolean = false;
  errorFunction(value) {
    if (value) {
      this.errorAlert = false;
    }
  }
  successAlert: boolean = false;
  successFunction(value) {
    if (value) {
      this.successAlert = false;
      this._router.navigate(['/auth']);
    }
  }
}
