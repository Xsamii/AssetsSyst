import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectTaskService {
  constructor(private _http: HttpClient
    , private _sharedService: SharedService
  ) { }

  // -----------------------------
  // Get All Projects TASK
  // -----------------------------



  getAllProjectTasks(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'ProjectTask'
    );
  }

  // -----------------------------
  // Delete Project TASK
  // -----------------------------

  deleteProjectTask(id: number): Observable<any> {
    return this._http.post(`${environment.url}ProjectTask/Delete?id=${id}`, {});
  }
  // -----------------------------
  // ADD Project TASK
  // -----------------------------
  createProjectTask(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}ProjectTask/Create`,
      obj
    );
  }
  // -----------------------------
  // EDIT Project TASK
  // -----------------------------
  updateProjectTask(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}ProjectTask/Update`,
      obj
    );
  }
  // ------------------------------------
  // GET PROJECT TASK BY ID
  // ------------------------------------
  getProjectTaskById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}ProjectTask/GetById?id=${id}`
    );
  }
  getAllExecutiveProjects(): Observable<any> {
    return this._http.get(`${environment.url}ProjectTask/GetExcutiveProjectsForOffice`);
  }
  GetExecutiveProjectsHaveOffice(): Observable<any> {
    return this._http.get(`${environment.url}ProjectTask/GetExecutiveProjectsHaveOffice`);
  }
}
