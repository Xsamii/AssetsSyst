import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  constructor(private _fb: FormBuilder, private _authService: AuthService) {}
  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get formControl() {
    return this.form.controls;
  }
  submit() {
    this._authService.forgotPassword(this.form.value).subscribe();
  }
}
