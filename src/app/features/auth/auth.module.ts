import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ActiveUserComponent } from './components/active-user/active-user.component';
@NgModule({
  declarations: [LoginComponent, VerifyOtpComponent, ResetPasswordComponent, ForgetPasswordComponent, ActiveUserComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SweetAlertMessageComponent,
    NgOtpInputModule,
  ],
})
export class AuthModule {}
