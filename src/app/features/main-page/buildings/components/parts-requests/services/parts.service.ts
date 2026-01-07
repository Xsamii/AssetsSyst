import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartsService {


 constructor(
    private _http: HttpClient, private _sharedService: SharedService
  ) { }



  getAllPartsRequest(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'PiecesRequest'
    );
  }

  getStatus(): Observable<any> {
    return this._http.get(
      environment.url + '/LookUp/GetPartStatus'
    );
  }
  getById(id: number): Observable<any> {
    return this._http.get(environment.url + 'PiecesRequest/GetById', {
      params: {
        id: id
      }
    })
  }

  addPart(obj: any): Observable<any> {
      return this._http.post<any>(environment.url + 'PiecesRequest/Create', obj)
    }

    deletePart(id: number): Observable<any> {
      return this._http.post(environment.url + `PiecesRequest/Delete?id=${id}`, {

      })
    }

  editPart(obj: any): Observable<any> {
      return this._http.post<any>(environment.url + 'PiecesRequest/Update', obj)
    }


    approvePart(body:any): Observable<any> {
      return this._http.post(environment.url + `PiecesRequest/Approve`,body)

    }

    MaintenanceRequestAutoCompleteIds(id: number): Observable<any> {
      return this._http.post(environment.url + `MaintenanceRequest/AutoCompleteIds?orderNumber=${id}`, {

      })
    }
}

