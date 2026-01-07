import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractorsEvaluationService {
  constructor(
    private _http: HttpClient,
    private _sharedService: SharedService
  ) {}

  // -----------------------------
  // Get All Contractors Evaluation
  // -----------------------------
  getAllContractorsEvaluation(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'EvaluationContractorRate'
    );
  }

  // -----------------------------
  // Delete Contractor Evaluation
  // -----------------------------
  deleteContractorEvaluation(id: number): Observable<any> {
    return this._http.post(
      `${environment.url}EvaluationContractorRate/Delete?id=${id}`,
      {}
    );
  }

  // -----------------------------
  // Create Contractor Evaluation
  // -----------------------------
  createContractorEvaluation(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}EvaluationContractorRate/Create`,
      obj
    );
  }

  // -----------------------------
  // Update Contractor Evaluation
  // -----------------------------
  updateContractorEvaluation(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}EvaluationContractorRate/Update`,
      obj
    );
  }

  // ------------------------------------
  // Get Contractor Evaluation By ID
  // ------------------------------------
  getContractorEvaluationById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}EvaluationContractorRate/GetById?id=${id}`
    );
  }

    EvaluationContractorById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}EvaluationContractor/GetTerms?id=${id}`
    );
  }
}
