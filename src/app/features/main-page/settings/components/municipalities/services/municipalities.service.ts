import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MunicipalitiesService {
  constructor(private _http: HttpClient
    , private _sharedService: SharedService
  ) { }

  // -----------------------------
  // Get All MUNICIPALITIES TASK
  // -----------------------------

  getAllMunicipalities(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'Center'
    );
  }

  // -----------------------------
  // Delete MUNICIPALITY
  // -----------------------------

  deleteMunicipality(id: number): Observable<any> {
    return this._http.post(`${environment.url}Center/Delete?id=${id}`, {});
  }
  // -----------------------------
  // ADD MUNICIPALITY
  // -----------------------------
  createMunicipality(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}Center/Create`,
      obj
    );
  }
  // -----------------------------
  // EDIT MUNICIPALITY
  // -----------------------------
  updateMunicipality(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}Center/Update`,
      obj
    );
  }
  // ------------------------------------
  // GET MUNICIPALITY BY ID
  // ------------------------------------
  getMunicipalityById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}Center/GetCenterById?id=${id}`
    );
  }
}
