import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(
      private _http: HttpClient,
      private _sharedService: SharedService
    ) {}

    // ==========================================
    // GET ALL
    // ==========================================

    getAllList(paganations?: any, filterValue?: any): Observable<any> {
      return this._sharedService.getListByFilterGenric(
        paganations,
        filterValue,
        'Asset'
      );
    }

    addAsset(body): Observable<any> {
      return this._http.post(`${environment.url}Asset/Create`, body);
    }
    editAsset(body): Observable<any> {
      return this._http.post(`${environment.url}Asset/Update`, body);
    }
    deleteAsset(id): Observable<any> {
      return this._http.post(`${environment.url}Asset/Delete?id=${id}`, {});
    }

    getAssetById(id): Observable<any> {
      return this._http.get(
        `${environment.url}Asset/GetById?id=` + id
      );
    }
   getRegularMaintenanceItemList(paganations?: any, filterValue?: any): Observable<any> {
      return this._sharedService.getListByFilterGenric(
        paganations,
        filterValue,
        'RegularMaintenanceItem',
        'GetFilteredLookupItems',
      );
    }
     addRegularMaintenanceItem(body): Observable<any> {
       return this._http.post(`${environment.url}RegularMaintenanceItem/Create`, body);
     }

     searchAssetsByNumber(assetNumber: string): Observable<any> {
      return this._http.get(
        `${environment.url}Asset/SearchAtAssetsNumbers?assetNumber=` + assetNumber
      );
    }
    getAssetByNumber(assetNumber: string): Observable<any> {
       return this._http.get(
        `${environment.url}Asset/GetByAssetByNumber?assetNumber=` + assetNumber
      );
    }

  }
