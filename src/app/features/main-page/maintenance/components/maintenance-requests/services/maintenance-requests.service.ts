import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRequestsService {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService
  ) {}

  // ==========================================
  // GET ALL Maintenance Request
  // ==========================================
  getAllMaintenanceRequest(
    paganations?: any,
    filterValue?: any,
    mainCatId?: number[]
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'MaintenanceRequest',

    );
  }
  // ==========================================
  // GET  Maintenance Request BY ID
  // ==========================================
  getMaintenanceById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}MaintenanceRequest/GetMaintenanceById?id=${id}`
    );
  }

  getMaintenanceHistoryById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}MaintenanceRequestHistory/GetRequestHistory?id=${id}`
    );
  }

  // ==========================================
  // CREATE Maintenance Request
  // ==========================================
  createMaintenanceRequest(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequest/Create`,
      obj
    );
  }

  // ==========================================
  // Update Maintenance Request
  // ==========================================
  updateMaintenanceRequest(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequest/Update`,
      obj
    );
  }
  // ==========================================
  // DELETE Maintenance Request
  // ==========================================
  deleteMaintenanceRequest(id: number): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequest/Delete`,
      {},
      {
        params: {
          id: id,
        },
      }
    );
  }

  // ==========================================
  // Receive Maintenance Request
  // ==========================================

  receiveRequest(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequest/ReceiveRequest` , obj,
      {}
    );
  }

  // ==========================================
  // Receive Maintenance Request
  // ==========================================

  addNotes(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequest/AddNotes`,
      obj
    );
  }
  // ==========================================
  // GetOffice Employee By Maintenance Request
  // ==========================================
  getOfficeEmployeeByMaintenanceRequest(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}LookUp/GetOfficeEmployeeByMaintenanceRequest?maintenanceRequestId=${id}`
    );
  }
  // ==========================================
  // Assign Employee To Preview
  // ==========================================
  assignPreview(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequest/AssignPreview`,
      obj
    );
  }

  // ==========================================
  // Request Preview
  // ==========================================
  requestPreview(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequest/RequestPreview`,
      obj
    );
  }

  // ==========================================
  // Request Preview
  // ==========================================
  statusPreview(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequest/AcceptReject`,
      obj
    );
  }
  // ==========================================
  // CONFIRM Preview
  // ==========================================
  confirmPreview(obj: any): Observable<any> {
    return this._http.post<any>(
      `${environment.url}MaintenanceRequest/Confirm?requestId=${obj.id}&isConfirmed=${obj.isConfirmed}`,
      {}
    );
  }
 // ==========================================
  // Get All Buildings
  // ==========================================
  getAllBuildingForMaintenanceRequest( ): Observable<any> {
    return this._http.get<any>(
      `${environment.url}Building/GetAllBuildingHaveOfficeAndManager`,

    );
  }

  addMaintenanceEvaluation(body): Observable<any> {
    return this._http.post(
      `${environment.url}MaintenanceRequest/AddRequestRate`,
      body
    );
  }
  editMaintenanceEvaluation(body): Observable<any> {
    return this._http.post(
      `${environment.url}MaintenanceRequest/EditeRequestRate`,
      body
    );
  }
  getEvaluationTermForMaintenance(id): Observable<any> {
    return this._http.get(
      `${environment.url}MaintenanceRequest/GetEvaluationTermsForRequest?requestId=` +
      id
    );
  }


}
