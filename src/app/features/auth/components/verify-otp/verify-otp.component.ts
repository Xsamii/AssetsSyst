import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent {
  // ---------------------------
  // VALUES
  // ---------------------------
  errorAlert: boolean = false;
  YourFormControl: any;
  email!: string | null;
  code = localStorage.getItem('maintainanceCode');
  userTypes = UserTypesEnum;
  userRole;
  // ---------------------------
  // CONSTRUCTOR
  // ---------------------------
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) { }
  // ---------------------------
  // FORM
  // ---------------------------
  verifyCodeForm = this._fb.group({
    code: [null],
  });

  // ---------------------------
  // SEND VERIFY CODE
  // ---------------------------
  sendVerifyCode() {
    const obj = {
      code: this.otp,
      email: this.email,
    };
    this._authService.verifyCode(obj).subscribe((res) => {
      if (res.isSuccess) {
        localStorage.setItem('maintainanceToken', res.data.token);
        localStorage.setItem('maintainanceRole', JSON.stringify(res.data.role));
        localStorage.setItem(
          'userOfficeType',

          JSON.stringify(res.data.officeTypeId)
        );
        this.userRole = res.data.role;

        this.routing();
        // if (
        //   [
        //     this.userTypes.MaintenanceSupervisor,
        //     this.userTypes.ServiceRequester,
        //   ].includes(res.data.role)
        // ) {
        //   this._router.navigate(['/buildings']);
        // } else {
        //   this._router.navigate(['/']);
        // }
      } else {
        this.errorAlert = true;
      }
    });
  }

  routing() {
    switch (this.userRole) {
      case 1:
      case 2:
        this._router.navigate(['/dashboard']);
        break;
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        this._router.navigate(['/maintenance/maintenace-requests']);
        break;
      case 8:
        this._router.navigate(['/inventory/pieces']);
        break;
      default:

    }
  }

  // ---------------------------
  // RESEND VERIFY CODE
  // ---------------------------
  resendMsg: string = 'إعادة إرساله ';
  ResendCode() {
    // this.resendMsg = 'برجاء الأنتظار...';
    // const mail = String(localStorage.getItem('estimation_email'));
    // this._authService.ResendCode(mail).subscribe((res) => {
    //   if (res.isSuccess) {
    //     this.resendMsg = 'إعادة إرساله ';
    //   } else {
    //     this._router.navigate(['/auth']);
    //   }
    // });
  }
  // ---------------------------
  // OTP
  // ---------------------------
  otp: any;
  otpChanged(e: any) {
    this.otp = e;
  }
  // ---------------------------
  // SWEET ALERT (ERROR)
  // ---------------------------
  errorFunction(value: boolean) {
    if (value) {
      this.errorAlert = false;
    }
  }
  // ========================================
  // ON INIT
  // ========================================

  ngOnInit(): void {
    this.email = localStorage.getItem('maintainanceEmail');
  }
}
