import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardMintService {
  constructor(private _http: HttpClient) {}
  // ------------------------------------------
  // GET COUNTS
  // ------------------------------------------
  getCounts(): Observable<any> {
    return this._http.get(`${environment.url}DashboardMaint/GetCounts`);
  }
  // ------------------------------------------
  // Get Cat Charts
  // ------------------------------------------
  getCatCharts(): Observable<any> {
    return this._http.get(`${environment.url}DashboardMaint/GetCatCharts`);
  }

  // ------------------------------------------
  // Get Location
  // ------------------------------------------
  getLocation(): Observable<any> {
    return this._http.get(`${environment.url}DashboardMaint/GetLocation`);
  }

  // ------------------------------------------
  // Get Priorty Charts
  // ------------------------------------------
  getPriortyCharts(): Observable<any> {
    return this._http.get(`${environment.url}DashboardMaint/GetPriortyCharts`);
  }
}
