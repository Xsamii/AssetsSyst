import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VisitRequests {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService
  ) {}

  // -----------------------------
  // Get All Visit Request
  // -----------------------------

  getAllVisitRequests(paganations?: any, filterValue?: any): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'VisitRequest'
    );
  }

  // -----------------------------
  // DELETE Visit Request
  // -----------------------------
  deleteVisitRequest(id): Observable<any> {
    return this._http.post<any>(
      `${environment.url}VisitRequest/Delete?id=${id}`,
      {}
    );
  }
}
