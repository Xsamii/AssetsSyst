import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsDashboardService {
  constructor(private _http: HttpClient
    , private _sharedService: SharedService
  ) { }

  counts(): Observable<any> {
    return this._http.get(environment.url + 'Dashboard/GetCounts')
  }

  getProjectClassificationChartData(): Observable<any> {
    return this._http.get(environment.url + 'Dashboard/GetProjectClassificationChartData')
  }

  getProjectStatueChartData(): Observable<any> {
    return this._http.get(environment.url + 'Dashboard/GetProjectStatueChartData')
  }

  getVisitStatueChartData(): Observable<any> {
    return this._http.get(environment.url + 'Dashboard/GetVisitStatueChartData')
  }

  getProjectsToMap(): Observable<any> {
    return this._http.get(environment.url + 'Dashboard/GetProjectsToChart')
  }

  getVisitRequestStatueChartData(): Observable<any> {
    return this._http.get(environment.url + 'Dashboard/GetVisitRequestStatueChartData')
  }
  getById(id: number): Observable<any> {
    return this._http.get(environment.url + 'Project/GetById', {
      params: {
        id: id
      }
    })
  }
  getProjectsTaskCompletionRate(): Observable<any> {
    return this._http.get(environment.url + 'Dashboard/GetProjectsTaskCompletionRate')
  }
}
