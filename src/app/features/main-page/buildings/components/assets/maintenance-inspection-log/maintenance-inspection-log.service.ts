import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceInspectionLogService {

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
         'RegularCheckLog',
         'GetPagedList'
       );
     }
   
     addMaintenanceInspectionLog(body): Observable<any> {
       return this._http.post(`${environment.url}RegularCheckLog/Create`, body);
     }
     editMaintenanceInspectionLog(body): Observable<any> {
       return this._http.post(`${environment.url}RegularCheckLog/Update`, body);
     }
     deleteMaintenanceInspectionLog(id): Observable<any> {
       return this._http.post(`${environment.url}RegularCheckLog/Delete?id=${id}`, {});
     }
   
     getMaintenanceInspectionLogById(id): Observable<any> {
       return this._http.get(
         `${environment.url}RegularCheckLog/GetById?id=` + id
       );
     }
      getRegularMaintenanceItemList(paganations?: any, filterValue?: any): Observable<any> {
      return this._sharedService.getListByFilterGenric(
        paganations,
        filterValue,
        'RegularMaintenanceItem',
        'GetFilteredLookupItems'
      );
    }
    
    
}
