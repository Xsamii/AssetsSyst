import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestTypeService {
  constructor(
    private _http: HttpClient
    , private _sharedService: SharedService
  ) { }

  // -----------------------------
  // Get All REQUEST TYPES
  // -----------------------------

  getAllVisitRequestTypes(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'VisitRequestType'
    );
  }

  // -----------------------------
  // Delete VISIT REQUEST TYPE
  // -----------------------------

  deleteVisitRequestType(id: number): Observable<any> {
    return this._http.post(`${environment.url}VisitRequestType/Delete/${id}`, id);
  }
  // -----------------------------
  // ADD VISIT REQUEST TYPE
  // -----------------------------
  createVisitRequestType(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}VisitRequestType/Create`,
      obj
    );
  }
  // -----------------------------
  // EDIT VISIT REQUEST TYPE
  // -----------------------------
  updateVisitRequestType(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}VisitRequestType/Update`,
      obj
    );
  }
  // ------------------------------------
  // GET VISIT REQUEST TYPE BY ID
  // ------------------------------------
  getVisitReuestTypeById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}VisitRequestType/GetById?id=${id}`
    );
  }
}
