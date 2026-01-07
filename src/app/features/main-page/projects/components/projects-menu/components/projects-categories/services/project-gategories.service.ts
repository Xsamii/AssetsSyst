import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectGategoriesService {
  constructor(private _http: HttpClient) { }

  // -----------------------------
  // Get All Project Gategores
  // -----------------------------

  getAllProjectGategories(
    paganations?: any,
    SearchTerm?: string
  ): Observable<any> {
    return this._http.get<any>(
      `${environment.url}ProjectClassification/GetResultsByFilter`,
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
  // Delete Project Gategore
  // -----------------------------
  deleteProjectGategore(id: number): Observable<any> {
    return this._http.post(
      `${environment.url}ProjectClassification/Delete/${id}`,
      {}
    );
  }
  // -----------------------------
  // ADD Project Gategore
  // -----------------------------
  createCategory(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}ProjectClassification/Create`,
      obj
    );
  }
  // -----------------------------
  // EDIT Project Gategore
  // -----------------------------
  updateCategory(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}ProjectClassification/Update`,
      obj
    );
  }
  // ------------------------------------
  // GET PROJECT CLASSIFICATION BY ID
  // ------------------------------------
  getClassificationById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}ProjectClassification/GetById?id=${id}`
    );
  }
}
