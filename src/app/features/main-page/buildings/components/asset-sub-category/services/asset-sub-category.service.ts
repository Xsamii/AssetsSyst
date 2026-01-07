import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AssetsSubCategoryService {
  constructor(private _http: HttpClient,
     private _sharedService: SharedService
  ) {}
  // ------------------------------------
  // GET ALL SUB CATEGORY
  // ------------------------------------
  getAllSubCategories(
    paganations?: any,
    SearchTerm?: string,
    AssetTypeIds?: number[],
    CategoryIds?: number[],
  ): Observable<any> {
    return this._http.get<any>(
      `${environment.url}AssetSubCategory/GetResultsByFilter`,
      {
        params: {
          SkipCount: paganations?.first ? paganations?.first : 0,
          MaxResultCount: paganations?.rows ? paganations?.rows : 10,
          SearchTerm: SearchTerm ? SearchTerm : '',
          AssetTypeIds: AssetTypeIds ? AssetTypeIds : [],
          CategoryIds: CategoryIds ? CategoryIds : [],
        },
      }
    );
  }

  // ------------------------------------
  // GET SUB CATEGORY BY ID
  // ------------------------------------
  getSubCategoryById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}AssetSubCategory/GetById?id=${id}`
    );
  }

  // ------------------------------------
  // CREATE SUB CATEGORY
  // ------------------------------------
  createSubCategory(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}AssetSubCategory/Create`,
      obj
    );
  }
  // ------------------------------------
  // UPDATE SUB CATEGORY
  // ------------------------------------

  updateSubCategory(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}AssetSubCategory/Update`,
      obj
    );
  }
  // ------------------------------------
  // DELETE SUB CATEGORY
  // ------------------------------------
  deleteSubCategory(id: number): Observable<any> {
    return this._http.post<any>(
      `${environment.url}AssetSubCategory/Delete`,
       id
    );
  }
}
