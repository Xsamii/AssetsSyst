import { HttpClient } from '@angular/common/http';
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
    paganations?: any,
    SearchTerm?: string,
    OfficeIds?: number[],
    FloorIds?: number[],
    BuildingSubUnitIds?: number[],
    buildingIds?: number[]
  ): Observable<any> {
    return this._http.get<any>(
      `${environment.url}BuildingOffice/GetOfficeResultsByFilter`,
      {
        params: {
          SkipCount: paganations?.first ? paganations?.first : 0,
          MaxResultCount: paganations?.rows ? paganations?.rows : 10,
          SearchTerm: SearchTerm ? SearchTerm : '',
          OfficeIds: OfficeIds ? OfficeIds : [],
          FloorIds: FloorIds ? FloorIds : [],
          BuildingSubUnitIds: BuildingSubUnitIds ? BuildingSubUnitIds : [],
          BuildingIds: buildingIds ? buildingIds : [],
        },
      }
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
