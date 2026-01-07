import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private _http: HttpClient) { }

  getSurveyById(id): Observable<any> {
    return this._http.get(
      `${environment.url}Survey/GetByIdAsync?id=` +
      id
    );
  }

  addSurvey(body, surveyId: number, macAddress: string):Observable<any> {
    return this._http.post<any>(`${environment.url}Survey/AnswerQuestion?MacAddress=${macAddress}&surveyId=${surveyId}`, body)
  }
}
