import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceReportService {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService
  ) {}
  token = localStorage.getItem('maintainanceToken');
  getReportPDF(paganations?: any, filterValue?: any): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      `Report`,
      `GetReportMaintenanceRequests?token=${this.token}`,
      'blob'
    );
  }
}
