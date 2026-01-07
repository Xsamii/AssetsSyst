import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsStatusService {
  constructor(private _http: HttpClient) { }

  // -----------------------------
  // Get All Projects Status
  // -----------------------------

  getAllProjectStatue(paganations?: any, SearchTerm?: string): Observable<any> {
    return this._http.get<any>(
      `${environment.url}ProjectStatue/GetResultsByFilter`,
      {
        params: {
          SkipCount: paganations?.first ? paganations?.first : 0,
          MaxResultCount: paganations?.rows ? paganations?.rows : 10,
          SearchTerm: SearchTerm ? SearchTerm : '',
        },
      }
    );
  }

  // -----------------------------
  // Delete Project Status
  // -----------------------------

  deleteProjectStatue(id: number): Observable<any> {
    return this._http.post(`${environment.url}ProjectStatue/Delete/${id}`, {});
  }
  // -----------------------------
  // ADD Project STATUS
  // -----------------------------
  createProjectStatus(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}ProjectStatue/Create`,
      obj
    );
  }
  // -----------------------------
  // EDIT Project STATUS
  // -----------------------------
  updateProjectStatus(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}ProjectStatue/Update`,
      obj
    );
  }
  // ------------------------------------
  // GET PROJECT STATUS BY ID
  // ------------------------------------
  getProjectStatusById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}ProjectStatue/GetById?id=${id}`
    );
  }
}
