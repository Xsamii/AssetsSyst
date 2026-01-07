import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private _http: HttpClient) {}

  // =============================
  // ALL NOTIFICATIONS
  // =============================
  getAllNotifications(): Observable<any> {
    return this._http
      .get<any>(`${environment.url}Notification/GetResultsByFilter`)
      .pipe(map((el) => el.data.items));
  }

  // =============================
  // Read Notification
  // =============================
  readNotification(id: any): Observable<any> {
    return this._http.get<any>(`${environment.url}Notification/Read?id=${id}`);
  }

  // ===================================
  // READ ALL NOTIFICATIONS
  // ===================================
  ReadList(ids: any): Observable<any> {
    return this._http.post(`${environment.url}Notification/ReadList`, {
      ids: ids,
    });
  }
}
