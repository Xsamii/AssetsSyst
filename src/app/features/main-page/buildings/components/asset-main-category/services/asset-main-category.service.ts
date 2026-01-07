import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AssetsMainCategoryService {
  constructor(private _http: HttpClient,
     private _sharedService: SharedService
  ) {}
  // ------------------------------------
  // GET ALL MAIN CATEGORY
  // ------------------------------------
  getAllMainCategories(
    paganations?: any,
    SearchTerm?: string,
    AssetTypeIds?: number[],
  ): Observable<any> {
    return this._http.get<any>(
      `${environment.url}AssetCategory/GetResultsByFilter`,
      {
        params: {
          SkipCount: paganations?.first ? paganations?.first : 0,
          MaxResultCount: paganations?.rows ? paganations?.rows : 10,
          SearchTerm: SearchTerm ? SearchTerm : '',
          AssetTypeIds: AssetTypeIds ? AssetTypeIds : [],
        },
      }
    );
  }

  // ------------------------------------
  // GET MAIN CATEGORY BY ID
  // ------------------------------------
  getMainCategoryById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}AssetCategory/GetById?id=${id}`
    );
  }

  // ------------------------------------
  // CREATE MAIN CATEGORY
  // ------------------------------------
  createMainCategory(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}AssetCategory/Create`,
      obj
    );
  }
  // ------------------------------------
  // UPDATE MAIN CATEGORY
  // ------------------------------------

  updateMainCategory(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}AssetCategory/Update`,
      obj
    );
  }
  // ------------------------------------
  // DELETE MAIN CATEGORY
  // ------------------------------------
  deleteMainCategory(id: number): Observable<any> {
    return this._http.post<any>(
      `${environment.url}AssetCategory/Delete`,
       id
    );
  }
}
