import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  constructor(private _http: HttpClient) { }
  //---------------------------

  getCounts(): Observable<any> {
    return this._http.get(`${environment.url}NewDashboard/GetCounts`);
  }
getMantinanceEvaluationChartsForRequest(): Observable<any> {
    return this._http.get(`${environment.url}NewDashboard/GetMantinanceEvaluationChartsForRequest`);
  }
  getMantinanceEvaluationChartsForContract(id: number): Observable<any> {
    return this._http.get(`${environment.url}NewDashboard/GetMantinanceEvaluationChartsForContract?ContractId=${id}`);
  }

   getProjectClassificationData(): Observable<any> {
    // API for project classification chart data
    return this._http.get(`${environment.url}NewDashboard/GetProjectClassificationCharts`);
  }
  getProjectStatusData(): Observable<any> {
    // API for project state chart data
    return this._http.get(`${environment.url}NewDashboard/GetProjectStatusCharts`);
  }
  getMaintenanceRequestStatusChart(): Observable<any> {
    return this._http.get(`${environment.url}NewDashboard/GetMaintenanceRequestStatusChart`);
  }
  getMalfunctionsTypesChart(): Observable<any> {
    return this._http.get(`${environment.url}NewDashboard/GetMaintenanceRequestTypeChart`);
  }
  getProjectDailyMaintenanceRequestCount(): Observable<any> {
    return this._http.get(`${environment.url}NewDashboard/GetProjectDailyMaintenanceRequestCount`);
  }
  //---------------------------





//


  //____________________________________

  getVisitStateData(): Observable<any> {
    // API for visit state chart data
    return this._http.get(`${environment.url}Dashboard/GetVisitStatueChartData`);
  }
  getMaintenanceStateData(): Observable<any> {
    // API for maintenance state chart data
    return this._http.get(`${environment.url}DashboardMaint/GetPriortyCharts`);
  }
  getMaintenanceTypeData(): Observable<any> {
    // API for maintenance type chart data
    return this._http.get(`${environment.url}DashboardMaint/GetCatCharts`);
  }
  getEvaluationData(terms): Observable<any> {
    // API for maintenance evaluation(term=2) and maintenance contracts evaluation(term=1) chart data
    return this._http.get(`${environment.url}DashboardMaint/GetMantinanceEvaluationCharts?EvaluationType=${terms}`);
  }

  getContractorsEvaluationPercentages(evaluationContractorId: number, contractorIds: number[]): Observable<any> {
    // API for contractors evaluation percentages chart
    const contractorIdsParam = contractorIds.map(id => `ContractorIds=${id}`).join('&');
    return this._http.get(`${environment.url}NewDashboard/GetContractorsEvaluationPercentages?EvaluationContractorId=${evaluationContractorId}&${contractorIdsParam}`);
  }
  //____________________________________

}
