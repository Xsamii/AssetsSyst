import { AttachementTypesEnum } from 'src/app/Shared/enums/attachTypesEnum';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { saveAs } from 'file-saver';
import { FilesService } from '../../services/files.service';
import { environment } from 'src/environments/environment';
import { SweetAlertMessageComponent } from '../sweet-alert-message/sweet-alert-message.component';
import { ListComponent } from '../list/list.component';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
// import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './uploadFileGrid.component.html',
  standalone: true,
  imports: [CommonModule, FileUploadModule, SweetAlertMessageComponent, DirectivesModule],
  styleUrls: ['./uploadFileGrid.component.scss'],
  selector: 'app-uploadFileGrid',
  // providers: [DynamicDialogRef],
})
export class UploadFileGridComponent implements OnInit {
  @Input() uploadedFiles: any[] = [];
  @Input() currentId: number;
  @Input() editMode: boolean = false;
  @Input() errorVisible: boolean = false;
  @Input() showTitle: boolean;
  @Input() routeName: string;
  @Input() filesTitle: string;
  @Input() attachmentTypeId: number;
  @Input() disabled: boolean = false;
  @Input() autoHideUploadedFiles: boolean = false;
  @Input() values;
  @Input() cols;
  @Output() onFileUploaded = new EventEmitter<any>();
  hideUploadedFiles: boolean = false;
  filesArr: {
    filePath: string;
    fullPath: string;
    originalName: string;
    attachTypeId: number | null;
  }[] = [];
  constructor(private _filesServices: FilesService) { }

  ngOnInit() {

  }

  SelectedFile(event: FileSelectEvent, fileUpload) {

    for (let index = 0; index < event.currentFiles.length; index++) {
      let file = event.currentFiles[index];
      let FileName = file.name;
      let size = this._filesServices.getFileSize(file.size);
      let unit = this._filesServices.getFileSizeUnit(file.size);
      let fullSize;
      if (unit == 'KB') {
        fullSize = size + ' كيلو بايت';
      } else if (unit == 'MB') {
        fullSize = size + ' ميجا بايت';
      } else if (unit == 'bytes') {
        fullSize = size + 'بايت';
      }
      if ((unit === 'KB' && size < 15000) || (unit === 'MB' && size < 15) || (unit === 'bytes' && size < 15000000)) {
        this.uploadedFiles?.push({
          name: FileName,
          size: fullSize,
          originalName: FileName,
          progress: 0,
          attachTypeId: this.attachmentTypeId,
        });
        let currentUplodedFileIndex = this.uploadedFiles.length - 1;
        let pageRoute = `${this.routeName}/add`;
        if (this.editMode) {
          pageRoute = `${this.routeName}/edit/${this.currentId}`;
        }
        this._filesServices.uploadFileWithProgress(file, pageRoute, this.attachmentTypeId).subscribe({
          next: (data) => {



            this.uploadedFiles[currentUplodedFileIndex].progress =
              data.progress;



            if (data.response) {
              if (
                data.response.errors?.length == 0 &&
                data.response.data?.length != 0
              ) {
                let uplodedFilesTemp = data.response.data;
                for (let index = 0; index < uplodedFilesTemp?.length; index++) {
                  const element = uplodedFilesTemp[index];
                  let fileItem = {
                    name: FileName,
                    size: fullSize,
                    fullPath: element.fullPath,
                    filePath: element.filePath,
                    attachTypeId: element.attachTypeId,
                    originalName: element.originalName,
                    id: element.id,
                    progress: 100,
                    hide: true
                  };

                  this.onFileUploaded.emit(fileItem);

                  this.hideUploadedFiles = true;
                  this.uploadedFiles[currentUplodedFileIndex] = fileItem;
                  this.uploadedFiles.map((e) => {
                    e.isPicked = true;

                  });
                  this.filesArr.push({
                    filePath: element.filePath,
                    fullPath: element.fullPath,
                    originalName: element.originalName,
                    attachTypeId: element.attachTypeId,
                  });

                }
              }
            }
          },

          error: (error) => {
            console.error('Upload error:', error);
            this.errorVisible = true;
          },
        });
        fileUpload.clear();
      } else {
        this.errorAlertMsg = `مساحه الملف ${FileName} كبيره. يجب ان يكون حجم الملف اقل من 15 ميجابايت`;
        this.errorAlert = true;
        fileUpload.clear();
      }
    }
  }



  downloadFile(data) {
    const url = environment.filesUrl + data.filePath;
    window.open(url, '_blank');
    // saveAs(`${environment.filesUrl}` + `/${data.filePath}`, `${data.originalName}`);
    // saveAs(`${data.fullPath}`, `${data.originalName}`);
    // [href]="file?.filePath"
    //         target="_blank"
  }
  remove(filePath: string, index: number, file) {
    this.filesArr.splice(index, 1);
    this.uploadedFiles.splice(index, 1);
    if (file.isPicked == true) {
      this._filesServices.deleteFile(filePath).subscribe((data) => { });
    }
  }

  errorAlert: boolean = false;
  errorAlertMsg: string = 'false';
  errorFunction(value) {
    if (value) {
      this.errorAlert = false;
    }
  }
}
