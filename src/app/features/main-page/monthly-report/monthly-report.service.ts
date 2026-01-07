import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MonthlyReportService {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService
  ) {}

  // ==========================================
  // GET ALL
  // ==========================================
  GetMainTabweebLookUp(): Observable<any> {
    return this._http.get(`${environment.url}Tabweeb/GetMainTabweebLookUp`);
  }
  GetMainTabweebData(id): Observable<any> {
    return this._http.get(
      `${environment.url}Tabweeb/GetMainTabweebData?id=` + id
    );
  }
  GetTabweebById(id): Observable<any> {
    return this._http.get(`${environment.url}Tabweeb/GetById?id=` + id);
  }
  GetSubTabweebData(id): Observable<any> {
    return this._http.get(
      `${environment.url}Tabweeb/GetSubTabweebFiles?id=` + id
    );
  }
  getAllList(paganations?: any, SearchTerm?: string): Observable<any> {
    return this._http.get<any>(`${environment.url}Tabweeb/GetResultsByFilter`, {
      params: {
        SkipCount: paganations?.first ? paganations?.first : 0,
        MaxResultCount: paganations?.rows ? paganations?.rows : 10,
        SearchTerm: SearchTerm ? SearchTerm : '',
      },
    });
  }

  addTabweeb(body): Observable<any> {
    return this._http.post(`${environment.url}Tabweeb/Create`, body);
  }
  addSubTabweebFilse(body): Observable<any> {
    return this._http.post(
      `${environment.url}Tabweeb/AddSubTabweebFilse?route=${body.route}&tabweebId=${body.tabweebId}`,
      body
    );
  }

  editTabweeb(body): Observable<any> {
    return this._http.post(`${environment.url}Tabweeb/Update`, body);
  }
  deleteTabweeb(id): Observable<any> {
    return this._http.post(`${environment.url}Tabweeb/Delete?id=${id}`, {});
  }
 deleteTabweebFiles(body): Observable<any> {
    return this._http.post(`${environment.url}Tabweeb/DeleteTabweebFiles?TabweebId=${body.TabweebId}&FileId=${body.FileId}`, {});
  }

}
