import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UploadFiles } from '../models/files';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  fileSizeUnit: number = 1024;
  public isApiSetup = false;

  constructor(
    private _http: HttpClient
  ) { }


  uploadFileWithProgress(file: File, pageRoute: string, AttachTypeId?: number): Observable<{ progress: number, response?: UploadFiles }> {
    let formData = new FormData()
    formData.append('Files', file, file.name)
    formData.append('PageRoute', pageRoute)

    if (AttachTypeId) {
      formData.append('AttachTypeId', String(AttachTypeId))
    }
    `${environment.url}Project/Create`
    return this._http.post(`${environment.url}Files/UploadFiles`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 * event.loaded) / event.total);
          return { progress };
        } else if (event.type === HttpEventType.Response) {
          // Upload complete, return both progress and response data
          return { progress: 100, response: event.body };
        }
        return { progress: 0 };
      })
    );
  }


  // uploadFiles(filesArray: File[], path: string, AttachTypeId?: number): Observable<UploadFiles> {
  //   let formData = new FormData()
  //   for (let index = 0; index < filesArray.length; index++) {
  //     const element = filesArray[index];
  //     formData.append('Files', element, element.name)
  //   }
  //   formData.append('PageRoute', path)
  //   if (AttachTypeId) {
  //     formData.append('AttachTypeId', String(AttachTypeId))
  //   }
  //   return this._http.post<UploadFiles>(environment.baseUrl + '/Files/UploadFiles', formData)
  // }




  deleteFile(filePath: string) {
    return this._http.post(`${environment.url}Files/DeleteByPath`, {
      path: filePath
    })
  }


  getFileSize(fileSize: number): number {
    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSize = parseFloat((fileSize / this.fileSizeUnit).toFixed(2));
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSize = parseFloat(
          (fileSize / this.fileSizeUnit / this.fileSizeUnit).toFixed(2)
        );
      }
    }
    return fileSize;
  }

  getFileSizeUnit(fileSize: number) {
    let fileSizeInWords = 'bytes';

    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit) {
        fileSizeInWords = 'bytes';
      } else if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSizeInWords = 'KB';
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSizeInWords = 'MB';
      }
    }

    return fileSizeInWords;
  }
  getPickedFiles(pageRoute: string): Observable<any> {
    return this._http.get(`${environment.url}Files/GetPickedFiles?route=` + pageRoute)
  }



}
