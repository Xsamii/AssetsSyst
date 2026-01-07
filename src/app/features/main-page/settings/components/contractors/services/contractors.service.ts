import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractorsService {
  constructor(private _http: HttpClient) {}

  // ------------------------------------
  // GET ALL OFFICE
  // ------------------------------------
  getAllOffices(paganations?: any, SearchTerm?: string): Observable<any> {
    return this._http.get<any>(`${environment.url}Office/GetResultsByFilter`, {
      params: {
        SkipCount: paganations?.first ? paganations?.first : 0,
        MaxResultCount: paganations?.rows ? paganations?.rows : 10,
        SearchTerm: SearchTerm ? SearchTerm : '',
      },
    });
  }
  // ------------------------------------
  // GET  OFFICE By Id
  // ------------------------------------
  getOfficeById(id): Observable<any> {
    return this._http.get<any>(`${environment.url}Office/GetById?id=${id}`);
  }

  // ------------------------------------
  // CREATE OFFICE
  // ------------------------------------

  createOffice(obj): Observable<any> {
    return this._http.post<any>(`${environment.url}Office/Create`, obj);
  }
  // ------------------------------------
  // UPDATE OFFICE
  // ------------------------------------
  updateOffice(obj): Observable<any> {
    return this._http.post<any>(`${environment.url}Office/Update`, obj);
  }
  // ------------------------------------
  // DELETE OFFICE
  // ------------------------------------
  deleteOffice(id): Observable<any> {
    return this._http.post<any>(
      `${environment.url}Office/Delete`,
      {},
      { params: { id: id } }
    );
  }
}
