import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private _http: HttpClient
    , private _sharedService: SharedService
  ) { }

  // ==========================================
  // GET ALL
  // ==========================================
  // getAllList(filter): Observable<any> {
  //   return this._sharedService.getListByFilterGenric(filter, 'Building')
  // }

  getAllProjectsList(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'project'
    );
  }
  addProject(body): Observable<any> {
    return this._http.post(`${environment.url}Project/Create`, body)
  }
  editProject(body): Observable<any> {
    return this._http.post(`${environment.url}Project/Update`, body)
  }
  deleteProject(id): Observable<any> {
    return this._http.post(`${environment.url}Project/Delete/${id}`, id)
  }

  getProjectById(id): Observable<any> {
    return this._http.get(`${environment.url}Project/GetById?id=` + id)
  }



  getUser(): Observable<any> {
    return this._http.get<any>(
      ' http://192.168.1.106:150/api/LookUp/GetUserTypes'
    );
  }
}
