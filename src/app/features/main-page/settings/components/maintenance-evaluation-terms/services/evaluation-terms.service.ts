import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EvaluationTermsService {
  constructor(private _http: HttpClient) { }
  // ------------------------------------
  // GET ALL MAL FUNCTIONS
  // ------------------------------------
  gettAllEvaluationTerms(paganations?: any, SearchTerm?: string): Observable<any> {
    return this._http.get<any>(
      `${environment.url}EvaluationTerms/GetResultsByFilter`,
      {
        params: {
          SkipCount: paganations?.first ? paganations?.first : 0,
          MaxResultCount: paganations?.rows ? paganations?.rows : 10,
          SearchTerm: SearchTerm ? SearchTerm : '',
        },
      }
    );
  }
  // ------------------------------------
  // GET MAL FUNCTION BY ID
  // ------------------------------------
  getEvaluationTermById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}EvaluationTerms/GetById?id=${id}`
    );
  }

  // ------------------------------------
  // CREATE MAL FUNCTION
  // ------------------------------------
  createEvaluationTerm(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}EvaluationTerms/Create`,
      obj
    );
  }
  // ------------------------------------
  // UPDATE MAL FUNCTION
  // ------------------------------------

  updateEvaluationTerm(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}EvaluationTerms/Update`,
      obj
    );
  }
  // ------------------------------------
  // DELETE MAL FUNCTION
  // ------------------------------------
  deleteEvaluationTerm(id: number): Observable<any> {
    return this._http.post<any>(
      `${environment.url}EvaluationTerms/Delete`,
      {},
      { params: { id: id } }
    );
  }
}
