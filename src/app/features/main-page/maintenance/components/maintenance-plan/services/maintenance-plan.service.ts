import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenancePlanService {

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
        'MaintenancePlan'
      );
    }

    addMaintenancePlan(body): Observable<any> {
      return this._http.post(`${environment.url}MaintenancePlan/Create`, body);
    }
    editMaintenancePlan(body): Observable<any> {
      return this._http.post(`${environment.url}MaintenancePlan/Update`, body);
    }
    deleteMaintenancePlan(id): Observable<any> {
      return this._http.post(`${environment.url}MaintenancePlan/Delete?id=${id}`, {});
    }

    getMaintenancePlanById(id): Observable<any> {
      return this._http.get(
        `${environment.url}MaintenancePlan/GetById?id=` + id
      );
    }
  }