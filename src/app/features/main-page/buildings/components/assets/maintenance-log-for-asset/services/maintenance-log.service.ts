import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class MaintenanceLogService {
  constructor(private _http: HttpClient,
     private _sharedService: SharedService
  ) {}
  // ------------------------------------
  // GET ALL LOGS
  // ------------------------------------

 getAllMaintenanceLogs(paganations?: any, filterValue?: any): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'AssetMaintenanceLog'
    );
  }

  // getAllMaintenanceLogs(
  //   paganations?: any,
  //   SearchTerm?: string,
    
  // ): Observable<any> {
  //   return this._http.get<any>(
  //     `${environment.url}AssetMaintenanceLog/GetResultsByFilter`,
  //     {
  //       params: {
  //         SkipCount: paganations?.first ? paganations?.first : 0,
  //         MaxResultCount: paganations?.rows ? paganations?.rows : 10,
  //         SearchTerm: SearchTerm ? SearchTerm : '', 
  //       },
  //     }
  //   );
  // }

  // ------------------------------------
  // GET LOG BY ID
  // ------------------------------------
  getLogById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}AssetMaintenanceLog/GetById?id=${id}`
    );
  }
 
}
