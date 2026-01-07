import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private _http: HttpClient) {}
  profileImage = new Subject<any>();
  changeProfileImage(value) {
    this.profileImage.next(value);
  }
  // ---------------------------
  // GET PROFILE
  // ---------------------------
  getProfile(): Observable<any> {
    return this._http.get(`${environment.url}Account/GetProfile`);
  }
  // ---------------------------
  // Update Profile
  // ---------------------------
  updateProfile(obj: any): Observable<any> {
    return this._http.post(`${environment.url}Account/UpdateProfile`, obj);
  }
}
