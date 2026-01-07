import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MalfunctionsService {
  constructor(private _http: HttpClient) { }
  // ------------------------------------
  // GET ALL MAL FUNCTIONS
  // ------------------------------------
  gettAllMalfunctionTypes(paganations?: any, SearchTerm?: string): Observable<any> {
    return this._http.get<any>(
      `${environment.url}MaintenanceRequestType/GetResultsByFilter`,
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
  getMalfunctionById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}MaintenanceRequestType/GetMaintenanceRequestTypeById?id=${id}`
    );
  }

  // ------------------------------------
  // CREATE MAL FUNCTION
  // ------------------------------------
  createMalfunction(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequestType/Create`,
      obj
    );
  }
  // ------------------------------------
  // UPDATE MAL FUNCTION
  // ------------------------------------

  updateMalfunction(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequestType/Update`,
      obj
    );
  }
  // ------------------------------------
  // DELETE MAL FUNCTION
  // ------------------------------------
  deleteMalfunction(id: number): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequestType/Delete`,
      {},
      { params: { id: id } }
    );
  }
}
