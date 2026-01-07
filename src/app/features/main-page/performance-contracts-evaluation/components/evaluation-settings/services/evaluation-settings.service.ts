import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/Shared/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class EvaluationSettingsService {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService
  ) {}

  // ------------------------------------
  // GET ALL Evaluation Settings
  // ------------------------------------
  getAllEvaluationSettings(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'EvaluationContractor'
    );
  }

  // ------------------------------------
  // GET Evaluation Setting By Id
  // ------------------------------------
  getEvaluationSettingById(id): Observable<any> {
    return this._http.get<any>(`${environment.url}EvaluationContractor/GetById?id=${id}`);
  }

  // ------------------------------------
  // CREATE Evaluation Setting
  // ------------------------------------
  createEvaluationSetting(obj): Observable<any> {
    return this._http.post<any>(`${environment.url}EvaluationContractor/Create`, obj);
  }

  // ------------------------------------
  // UPDATE Evaluation Setting
  // ------------------------------------
  updateEvaluationSetting(obj): Observable<any> {
    return this._http.post<any>(`${environment.url}EvaluationContractor/Update`, obj);
  }

  // ------------------------------------
  // DELETE Evaluation Setting
  // ------------------------------------
  deleteEvaluationSetting(id): Observable<any> {
    return this._http.post<any>(
      `${environment.url}EvaluationContractor/Delete?id=${id}`, {}
    );
  }
}
