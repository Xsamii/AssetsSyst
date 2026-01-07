import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MainBuildingsService {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService
  ) {}

  // ==========================================
  // GET ALL
  // ==========================================

  getAllList(paganations?: any, filterValue?: any): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'Building'
    );
  }

  addBuilding(body): Observable<any> {
    return this._http.post(`${environment.url}Building/Create`, body);
  }
  editBuilding(body): Observable<any> {
    return this._http.post(`${environment.url}Building/Update`, body);
  }
  deleteBuilding(id): Observable<any> {
    return this._http.post(`${environment.url}Building/Delete?id=${id}`, {});
  }

  getBuildingById(id): Observable<any> {
    return this._http.get(
      `${environment.url}Building/GetMainBuildingById?id=` + id
    );
  }
    getmapDetailsById(id): Observable<any> {
    return this._http.get(
      `${environment.url}Building/GetBuildingMapDetails?id=` + id
    );
  }

  getUser(): Observable<any> {
    return this._http.get<any>(
      ' http://192.168.1.106:150/api/LookUp/GetUserTypes'
    );
  }
  GetCoordinates(id): Observable<any> {
    return this._http.get(
      `${environment.url}Building/GetCoordinates?id=` + id
    );
  }
 AddCoordinates(body): Observable<any> {
    return this._http.post(`${environment.url}Building/AddCoordinates`, body);
  }
}
