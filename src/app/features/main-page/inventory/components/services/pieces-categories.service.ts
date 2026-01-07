import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PiecesCategoriesService {
  constructor(private _http: HttpClient) { }

  // -----------------------------
  // Get All Project Gategores
  // -----------------------------

  getAllInventoryCategoryList(
    paganations?: any,
    SearchTerm?: string
  ): Observable<any> {
    return this._http.get<any>(
      `${environment.url}InvintoryCategory/GetResultsByFilter`,
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
  deleteInventoryCategory(id: number): Observable<any> {
    return this._http.post(
      `${environment.url}InvintoryCategory/Delete?id=${id}`,
      {}
    );
  }
  // -----------------------------
  // ADD Project Gategore
  // -----------------------------
  createInventorycategory(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}InvintoryCategory/Create`,
      obj
    );
  }
  // -----------------------------
  // EDIT Project Gategore
  // -----------------------------
  updateInventoryCategory(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}InvintoryCategory/Update`,
      obj
    );
  }
  // ------------------------------------
  // GET PROJECT CLASSIFICATION BY ID
  // ------------------------------------
  getInventoryCategoryById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}InvintoryCategory/GetClassificationById?id=${id}`
    );
  }
}
