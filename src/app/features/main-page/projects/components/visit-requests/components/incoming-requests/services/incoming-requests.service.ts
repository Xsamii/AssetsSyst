import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IncomingRequestsService {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService,
    private _fb: FormBuilder
  ) {}

  // ------------------------------------------
  // Get All Requests
  // ------------------------------------------
  getAllRequests(paganations?: any, filterValue?: any): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'VisitRequest'
    );
  }

  // ------------------------------------------
  // Get Request BY ID
  // ------------------------------------------

  getRequestById(id: any): Observable<any> {
    return this._http.get(`${environment.url}VisitRequest/GetById?id=${id}`);
  }

  // ------------------------------------------
  // Get Users For Assign
  // ------------------------------------------

  getUsersForAssign(projectId: any): Observable<any> {
    return this._http.get(
      `${environment.url}VisitRequest/GetUsersForAssign?projectId=${projectId}`
    );
  }
  // ------------------------------------------
  // Get Users For Assign Maintenance
  // ------------------------------------------

  getUsersForAssignMaintenance(requestId: any): Observable<any> {
    return this._http.get(
      `${environment.url}VisitRequest/GetUsersForAssignMaintenance?requestId=${requestId}`
    );
  }
  // ------------------------------------------
  // Assign Visit Request To User
  // ------------------------------------------
  assignVisitRequestToUser(model: any): Observable<any> {
    return this._http.post(
      `${environment.url}VisitRequest/AssignVisitRequestToUser`,
      model
    );
  }
  // ------------------------------------------
  // Refuse VisitRequestToUser
  // ------------------------------------------
  refuseVisitRequestToUser(model: any): Observable<any> {
    return this._http.post(
      `${environment.url}VisitRequest/RefuseVisitRequestToUser`,
      model
    );
  }

  // ---------------------------------------------------------
  // Change Status Of Visit Request (Complate OR UNComplate)
  // ---------------------------------------------------------
  changeStatusOfVisitRequest(obj: any): Observable<any> {
    return this._http.post(
      `${environment.url}VisitRequest/ChangeStatusOfVisitRequest`,
      obj
    );
  }

  // ---------------------------------------------------------
  // Get My Excutive Projects By Global Project Type id
  // ---------------------------------------------------------
  getMyExcutiveProjectsByGlobalProjectType(id: any) {
    return this._http.get(
      `${environment.url}VisitRequest/GetMyExcutiveProjectsByGlobalProjectType?globalProjectId=${id}`
    );
  }
  getMyExcutiveProjectsByGlobalProjectType2(id: any) {
    return this._http.get(
      `${environment.url}VisitRequest/GetMyExcutiveProjectsByGlobalProjectType?globalProjectId=${id}`
    );
  }
  // ---------------------------------------------------------
  // Get Project Task By Project Id
  // ---------------------------------------------------------
  getProjectTaskByProjectId(id: any) {
    return this._http.get(
      `${environment.url}LookUp/GetProjectTaskByProjectId?projectId=${id}`
    );
  }

  // ---------------------------------------------------------
  // Get Visit Request Type
  // ---------------------------------------------------------
  getVisitRequestType() {
    return this._http.get(`${environment.url}LookUp/GetVisitRequestType`);
  }

  // ---------------------------------------------------------
  // Get All Visit Request Status
  // ---------------------------------------------------------
  getAllVisitRequestStatus() {
    return this._http.get(`${environment.url}LookUp/GetAllVisitRequestStatus`);
  }

  // ---------------------------------------------------------
  // Get Maintenance Request By Project Id
  // ---------------------------------------------------------
  getMaintenanceRequestByProjectId(id: any) {
    return this._http.get(
      `${environment.url}LookUp/GetMaintenanceRequestByProjectId?ProjectId=${id}`
    );
  }
}
