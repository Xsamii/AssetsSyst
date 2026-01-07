import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CreateUpdateDeleteSubUnit,
  SubUnitData,
  GetAllSubUnits,
} from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class SubUnitService {
  constructor(private _http: HttpClient) {}
  // ------------------------------------
  // GET ALL SUB UNITS
  // ------------------------------------
  getAllSubUnits(
    paganations?: any,
    SearchTerm?: string
  ): Observable<GetAllSubUnits> {
    return this._http.get<GetAllSubUnits>(
      `${environment.url}BuildingSubUnit/GetResultsByFilter`,
      {
        params: {
          SkipCount: paganations?.first ? paganations?.first : 0,
          MaxResultCount: paganations?.rows ? paganations?.rows : 10,
          SearchTerm: SearchTerm ? SearchTerm : '',
        },
      }
    );
  }
  // ------------------------------------
  // GET SUB UNIT BY ID
  // ------------------------------------
  getSubUnitById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}BuildingSubUnit/GetMainBuildingById?id=${id}`
    );
  }

  // ------------------------------------
  // CREATE SUB UNIT
  // ------------------------------------
  createSubUnit(obj: SubUnitData): Observable<CreateUpdateDeleteSubUnit> {
    return this._http.post<CreateUpdateDeleteSubUnit>(
      `${environment.url}BuildingSubUnit/Create`,
      obj
    );
  }
  // ------------------------------------
  // UPDATE SUB UNIT
  // ------------------------------------

  updateSubUnit(obj: SubUnitData): Observable<CreateUpdateDeleteSubUnit> {
    return this._http.post<CreateUpdateDeleteSubUnit>(
      `${environment.url}BuildingSubUnit/Update`,
      obj
    );
  }
  // ------------------------------------
  // DELETE SUB UNIT
  // ------------------------------------
  deleteSubUnit(id: number): Observable<CreateUpdateDeleteSubUnit> {
    return this._http.post<CreateUpdateDeleteSubUnit>(
      `${environment.url}BuildingSubUnit/Delete`,
      {},
      { params: { id: id } }
    );
  }
}
