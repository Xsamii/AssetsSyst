import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectSettingsService {
  constructor(private _http: HttpClient
    , private _sharedService: SharedService
  ) { }
  // ------------------------------------
  // UPDATE SETTINGS
  // ------------------------------------
  updateSettings(obj): Observable<any> {
    return this._http.post<any>(`${environment.url}Setting/UpdateRequestSetting`, obj);
  }
  // ------------------------------------
  // GET SETTINGS
  // ------------------------------------
  getSettings(): Observable<any> {
    return this._http.get<any>(`${environment.url}Setting/GetSettings`);
  }

}
