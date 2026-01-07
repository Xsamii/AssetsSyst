import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsMaintenanceRequestsService {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService
  ) {}

  // ==========================================
  // GET ALL Maintenance Request for Projects
  // ==========================================
  getAllMaintenanceRequest(
    paganations?: any,
    filterValue?: any,
    routeName: string = 'GetPagedPms'
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'MaintenanceRequest',
      routeName
    );
  }

  // -------------------------------------------
  // RECIEVE REQUEST
  // -------------------------------------------
  recieveRequest(id): Observable<any> {
    return this._http.post(
      `${environment.url}MaintenanceRequest/ReceiveRequest?requestId=${id}`,
      id
    );
  }
  // -------------------------------------------
  // CLOSE REQUEST
  // -------------------------------------------
  close(id): Observable<any> {
    return this._http.post(
      `${environment.url}MaintenanceRequest/CloseRequest?requestId=${id}`,
      id
    );
  }
  // -------------------------------------------
  // ADD NOTES
  // -------------------------------------------
  addNotes(obj): Observable<any> {
    return this._http.post(
      `${environment.url}MaintenanceRequest/AddNotes`,
      obj
    );
  }

  // ==========================================
  // CREATE Maintenance Request
  // ==========================================
  // MaintenanceRequest/Create
  // createMaintenanceRequest(obj: any): Observable<any> {
  //   return this._http.post<any>(
  //     `${environment.url}MaintenanceRequest/Create`,
  //     obj
  //   );
  // }
  // ==========================================
  // DELETE Maintenance Request
  // ==========================================
  // deleteMaintenanceRequest(id: number): Observable<any> {
  //   return this._http.post<any>(
  //     `${environment.url}MaintenanceRequest/Delete`,
  //     {},
  //     {
  //       params: {
  //         id: id,
  //       },
  //     }
  //   );
  // }
}
