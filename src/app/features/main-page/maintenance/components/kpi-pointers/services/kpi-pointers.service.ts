import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class KpiPointersService {
  constructor(private _http: HttpClient,
     private _sharedService: SharedService
  ) {}
  // ------------------------------------
  // GET ALL KPIPointers
  // ------------------------------------
 getAllKpiPointers(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'KPIPointer'
    );
  }

  // ------------------------------------
  // GET KPIPointers BY ID
  // ------------------------------------
  getKpiPointerById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}KPIPointer/GetById?id=${id}`
    );
  }

  // ------------------------------------
  // CREATE KPIPointers
  // ------------------------------------
  createKpiPointer(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}KPIPointer/Create`,
      obj
    );
  }
  // ------------------------------------
  // UPDATE KPIPointers
  // ------------------------------------

  updateKpiPointer(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}KPIPointer/Update`,
      obj
    );
  }
  // ------------------------------------
  // DELETE KPIPointers
  // ------------------------------------
  deleteKpiPointer(id: number): Observable<any> {
    return this._http.post<any>(
      `${environment.url}KPIPointer/Delete?id=${id}`,{}
    );
  }
}
