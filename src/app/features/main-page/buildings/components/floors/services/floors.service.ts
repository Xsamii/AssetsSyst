import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class FloorsService {
  constructor(private _http: HttpClient,
     private _sharedService: SharedService
  ) {}
  // ------------------------------------
  // GET ALL FLOORS
  // ------------------------------------
  getAllFloors(
    paganations?: any,
    SearchTerm?: string,
    BuildingSubUnitIds?: number[],
    buildingIds?: number[]
  ): Observable<any> {
    return this._http.get<any>(
      `${environment.url}Floor/GetResultsByFilter`,
      {
        params: {
          SkipCount: paganations?.first ? paganations?.first : 0,
          MaxResultCount: paganations?.rows ? paganations?.rows : 10,
          SearchTerm: SearchTerm ? SearchTerm : '',
          BuildingSubUnitIds: BuildingSubUnitIds ? BuildingSubUnitIds : [],
          BuildingIds: buildingIds ? buildingIds :  [],
        },
      }
    );
  }

  // ------------------------------------
  // GET FLOOR BY ID
  // ------------------------------------
  getFloorById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}Floor/GetById?id=${id}`
    );
  }

  // ------------------------------------
  // CREATE FLOOR
  // ------------------------------------
  createFloor(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}Floor/Create`,
      obj
    );
  }
  // ------------------------------------
  // UPDATE FLOOR
  // ------------------------------------

  updateFloor(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}Floor/Update`,
      obj
    );
  }
  // ------------------------------------
  // DELETE FLOOR
  // ------------------------------------
  deleteFloor(id: number): Observable<any> {
    return this._http.post<any>(
      `${environment.url}Floor/Delete`,
       id
    );
  }
}
