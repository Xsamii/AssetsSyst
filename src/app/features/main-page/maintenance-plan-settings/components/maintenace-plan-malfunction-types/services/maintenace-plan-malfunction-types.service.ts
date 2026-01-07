import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaintenacePlanMalfunctionTypesService {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService
  ) {}

  // -----------------------------
  // Get All Malfunction Types
  // -----------------------------

  getAllMalfunctionTypes(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'PlanMalfunctionType'
    );
  }

  // -----------------------------
  // Delete Malfunction Type
  // -----------------------------

  deleteMalfunctionType(id: number): Observable<any> {
    return this._http.post(`${environment.url}PlanMalfunctionType/Delete?id=${id}`, {});
  }

  // -----------------------------
  // ADD Malfunction Type
  // -----------------------------
  createMalfunctionType(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}PlanMalfunctionType/Create`,
      obj
    );
  }

  // -----------------------------
  // EDIT Malfunction Type
  // -----------------------------
  updateMalfunctionType(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}PlanMalfunctionType/Update`,
      obj
    );
  }

  // ------------------------------------
  // GET Malfunction Type BY ID
  // ------------------------------------
  getMalfunctionTypeById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}PlanMalfunctionType/GetById?id=${id}`
    );
  }
}
