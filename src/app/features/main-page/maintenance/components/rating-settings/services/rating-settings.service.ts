import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatingSettingsService {

  constructor(private _http: HttpClient, private _sharedService: SharedService) { }

  getAllSurvey(paganations?: any, filterValue?: any): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'Survey'
    );
  }

  addSurvey(body): Observable<any> {
    return this._http.post(`${environment.url}Survey/Create`,body);
  }
  
  getSurveyById(id): Observable<any> {
    return this._http.get(
      `${environment.url}Survey/GetByIdAsync?id=` +
      id
    );
  }

  updateSurvey(body): Observable<any> {
    return this._http.post(
      `${environment.url}Survey/Update`,
      body
    );
  }

   deleteSurvey(id: number, hardDelete: boolean = false): Observable<any> {
    return this._http.post(`${environment.url}Survey/Delete?id=${id}&HardDelet=${hardDelete}`, {});
  }
}
