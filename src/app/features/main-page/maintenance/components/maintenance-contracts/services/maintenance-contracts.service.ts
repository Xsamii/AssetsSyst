import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceContractsService {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService
  ) { }

  getAllProjectsList(paganations?: any, filterValue?: any): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'MaintenanceContract'
    );
  }
  deleteProject(id): Observable<any> {
    return this._http.post(
      `${environment.url}MaintenanceContract/Delete?id=${id}`,
      id
    );
  }

  getProjectById(id): Observable<any> {
    return this._http.get(
      `${environment.url}MaintenanceContract/GetMaintenanceContractById?id=` +
      id
    );
  }
  addProject(body): Observable<any> {
    return this._http.post(
      `${environment.url}MaintenanceContract/Create`,
      body
    );
  }
  editProject(body): Observable<any> {
    return this._http.post(
      `${environment.url}MaintenanceContract/Update`,
      body
    );
  }
  addContrateEvaluation(body): Observable<any> {
    return this._http.post(
      `${environment.url}MaintenanceContract/AddContractRate`,
      body
    );
  }
  editContrateEvaluation(body): Observable<any> {
    return this._http.post(
      `${environment.url}MaintenanceContract/EditeContractRate`,
      body
    );
  }
  getEvaluationTermForCOntract(id): Observable<any> {
    return this._http.get(
      `${environment.url}MaintenanceContract/GetEvaluationTermsForContract?contractid=` +
      id
    );
  }


}
