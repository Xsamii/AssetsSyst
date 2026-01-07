import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private _http: HttpClient
    , private _sharedService: SharedService
  ) { }

  // ==========================================
  // GET ALL
  // ==========================================


  getAllList(
    paganations?: any,
    filterValue?: any
  ): Observable<any> {
    return this._sharedService.getListByFilterGenric(
      paganations,
      filterValue,
      'User'
    );
  }
  addUser(body): Observable<any> {
    return this._http.post(`${environment.url}User/Create`, body)
  }
  editUser(body): Observable<any> {
    return this._http.post(`${environment.url}User/Update`, body)
  }
  deleteUser(id): Observable<any> {
    return this._http.post(`${environment.url}User/Delete?id=${id}`, id)
  }

  getUserById(id): Observable<any> {
    return this._http.get(`${environment.url}User/GetById?id=` + id)
  }
  disableUser(id): Observable<any> {
    return this._http.post(`${environment.url}User/DisableUser?id=${id}`, id)
  }
  getUserType(): Observable<any> {
    return this._http.get(`${environment.url}User/GetUserTypes`)
  }

  getUser(): Observable<any> {
    return this._http.get<any>(
      ' http://192.168.1.106:150/api/LookUp/GetUserTypes'
    );
  }
}
