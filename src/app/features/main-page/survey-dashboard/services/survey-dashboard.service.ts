import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurveyDashboardService {

  constructor(private _http: HttpClient) { }

  getAllSurvey(): Observable<any> {
    return this._http.get<any>(`${environment.url}DashboardSurvey/GetSurveyDashboard`);
   
  }
}
