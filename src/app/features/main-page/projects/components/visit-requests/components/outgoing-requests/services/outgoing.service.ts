import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OutgoingService {
  constructor(private _http: HttpClient) {}

  // -------------------------------------------
  // CREATE Request
  // -------------------------------------------
  create(obj: any): Observable<any> {
    return this._http.post(`${environment.url}VisitRequest/Create`, obj);
  }
  // -------------------------------------------
  // CREATE Request
  // -------------------------------------------
  update(obj: any): Observable<any> {
    return this._http.post(`${environment.url}VisitRequest/Update`, obj);
  }

  //
  // -------------------------------------------
  // get Request By Id
  // -------------------------------------------
  getRequestById(id: any): Observable<any> {
    return this._http.get(`${environment.url}VisitRequest/GetById?id=${id}`);
  }
}
