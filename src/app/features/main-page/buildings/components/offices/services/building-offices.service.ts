import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class BuildingOfficesService {
  constructor(private _http: HttpClient,
    private _sharedService: SharedService
  ) { }
  // ------------------------------------
  // GET ALL Buildings Offices
  // ------------------------------------
  getAllBuildingOffice(
    paganation?: any,
    SearchTerm?: string,
    OfficeIds?: number[],
    FloorIds?: number[],
    BuildingSubUnitIds?: number[],
    buildingIds?: number[]
  ): Observable<any> {
    let params = new HttpParams();

    // Pagination parameters
    params = params.set('SkipCount', paganation?.first ? paganation.first : 0);
    params = params.set('MaxResultCount', paganation?.rows ? paganation.rows : 10);

    // Search term
    if (SearchTerm) {
      params = params.set('SearchTerm', SearchTerm);
    }

    // Array parameters - convert to proper format
    if (OfficeIds && OfficeIds.length > 0) {
      OfficeIds.forEach(id => {
        params = params.append('OfficeIds', id.toString());
      });
    }

    if (FloorIds && FloorIds.length > 0) {
      FloorIds.forEach(id => {
        params = params.append('FloorIds', id.toString());
      });
    }

    if (BuildingSubUnitIds && BuildingSubUnitIds.length > 0) {
      BuildingSubUnitIds.forEach(id => {
        params = params.append('BuildingSubUnitIds', id.toString());
      });
    }

    if (buildingIds && buildingIds.length > 0) {
      buildingIds.forEach(id => {
        params = params.append('BuildingIds', id.toString());
      });
    }

    return this._http.get<any>(
      `${environment.url}BuildingOffice/GetOfficeResultsByFilter`,
      { params }
    );
  }

  // ------------------------------------
  // GET Building Office BY ID
  // ------------------------------------
  getBuildingOfficeById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}BuildingOffice/GetById?id=${id}`
    );
  }

  // ------------------------------------
  // CREATE Building Office
  // ------------------------------------
  createBuildingOffice(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}BuildingOffice/Create`,
      obj
    );
  }
  // ------------------------------------
  // UPDATE Building Office
  // ------------------------------------

  updateBuildingOffice(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}BuildingOffice/Update`,
      obj
    );
  }
  // ------------------------------------
  // DELETE Building Office
  // ------------------------------------
  deleteBuildingOffice(id: number): Observable<any> {
    return this._http.post<any>(
      `${environment.url}BuildingOffice/Delete`,
      id

    );
  }
}
