import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private _http: HttpClient
      , private _sharedService: SharedService) { }
      token = localStorage.getItem('maintainanceToken'); 
      getReportPDF(paganations?: any, filterValue?: any): Observable<any> {
         return this._sharedService.getListByFilterGenric(
           paganations,
           filterValue,
           `Report`,
           `GetProjectReport?token=${this.token}`,
           'blob'
         );
       }
       getReportRequestPDF(paganations?: any, filterValue?: any): Observable<any> {
        return this._sharedService.getListByFilterGenric(
          paganations,
          filterValue,
          `Report`,
          `GetVisitRequestReport?token=${this.token}`,
          'blob'
        );
      }
}
