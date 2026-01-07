import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class SitesService {
  constructor(private _http: HttpClient,
     private _sharedService: SharedService
  ) {}
  // ------------------------------------
  // GET ALL SITES
  // ------------------------------------
  getAllSites(
    paganations?: any,
    SearchTerm?: string,
    BuildingSubUnitIds?: number[],
    buildingIds?: number[]
  ): Observable<any> {
    return this._http.get<any>(
      `${environment.url}Site/GetResultsByFilter`,
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
  // GET SITE BY ID
  // ------------------------------------
  getSiteById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}Site/GetById?id=${id}`
    );
  }

  // ------------------------------------
  // CREATE SITE
  // ------------------------------------
  createSite(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}Site/Create`,
      obj
    );
  }
  // ------------------------------------
  // UPDATE SITE
  // ------------------------------------

  updateSite(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}Site/Update`,
      obj
    );
  }
  // ------------------------------------
  // DELETE SITE
  // ------------------------------------
  deleteSite(id: number): Observable<any> {
    return this._http.post<any>(
      `${environment.url}Site/Delete`,
       id
    );
  }
}
