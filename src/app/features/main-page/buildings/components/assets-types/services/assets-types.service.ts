import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AssetsTypesService {
  constructor(private _http: HttpClient,
     private _sharedService: SharedService
  ) {}
  // ------------------------------------
  // GET ALL ASSET TYPES
  // ------------------------------------
  getAllAssetTypes(
    paganations?: any,
    SearchTerm?: string,
  ): Observable<any> {
    return this._http.get<any>(
      `${environment.url}AssetType/Get`,
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
  // GET ASSET TYPE BY ID
  // ------------------------------------
  getAssetTypeById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}AssetType/GetById?id=${id}`
    );
  }

  // ------------------------------------
  // CREATE ASSET TYPE
  // ------------------------------------
  createAssetType(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}AssetType/Create`,
      obj
    );
  }
  // ------------------------------------
  // UPDATE ASSET TYPE
  // ------------------------------------

  updateAssetType(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}AssetType/Update`,
      obj
    );
  }
  // ------------------------------------
  // DELETE ASSET TYPE
  // ------------------------------------
  deleteAssetType(id: number): Observable<any> {
    return this._http.post<any>(
      `${environment.url}AssetType/Delete`,
       id
    );
  }
}
