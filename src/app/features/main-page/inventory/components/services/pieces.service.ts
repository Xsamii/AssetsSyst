import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PiecesService {
  constructor(private _http: HttpClient
    , private _sharedService: SharedService
  ) { }

  getAllPieces(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'InventoryPiece'
    );
  }


  deletePiece(id: number): Observable<any> {
    return this._http.post(
      `${environment.url}InventoryPiece/Delete?id=${id}`,
      {}
    );
  }

  createPiece(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}InventoryPiece/Create`,
      obj
    );
  }

  updatePiece(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}InventoryPiece/Update`,
      obj
    );
  }

  getPieceById(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}InventoryPiece/GetById?id=${id}`
    );
  }

  recieveNewQuantity(obj): Observable<any> {
    return this._http.post<any>(
      `${environment.url}InventoryPiece/ReceiveQuantityOfPieces`,
      obj
    );
  }
  getPieceLog(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.url}InventoryPiece/GetAllHistory?InventoryPieceId=${id}`
    );
  }
  getPieceHistoryById(id: string): Observable<any> {
    return this._http.get<any>(
      `${environment.url}InventoryPiece/GetHistoryById?id=${id}`
    );
  }


}
