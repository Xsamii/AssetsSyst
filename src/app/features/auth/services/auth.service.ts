import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login, VerifyCode } from '../models/model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  // ---------------------------------------
  // LOGIN
  // ---------------------------------------
  login(obj): Observable<Login> {
    return this._http.post<Login>(`${environment.url}Account/Login`, obj);
  }

  // ---------------------------------------
  // Verify Code
  // ---------------------------------------
  verifyCode(obj): Observable<VerifyCode> {
    return this._http.post<VerifyCode>(
      `${environment.url}Account/VerifyCode`,
      obj
    );
  }
  // ---------------------------------------
  // Forgot Password
  // ---------------------------------------
  forgotPassword(email): Observable<VerifyCode> {
    return this._http.post<VerifyCode>(
      `${environment.url}Account/ForgotPassword`,
      email
    );
  }
  // ---------------------------------------
  // Reset Password
  // ---------------------------------------
  resetPassword(obj): Observable<VerifyCode> {
    return this._http.post<VerifyCode>(
      `${environment.url}Account/ResetPassword`,
      obj
    );
  }
  // ---------------------------------------
  // Account/ActiveUser
  // ---------------------------------------
  activeUser(obj): Observable<VerifyCode> {
    return this._http.post<VerifyCode>(
      `${environment.url}Account/ActiveUser`,
      obj
    );
  }

  getPermissions(): string {
    var session: any = localStorage.getItem('maintainanceRole');

    return session;
  }
  isAuthenticatedUser(): boolean {
    return !!this.getToken();
  }
  getToken(): string | null {
    return localStorage.getItem('maintainanceToken');
  }
}
