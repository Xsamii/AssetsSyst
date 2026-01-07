import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IncomingRequestsService } from '../../../incoming-requests/services/incoming-requests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesService } from 'src/app/Shared/services/files.service';
import { File } from 'src/app/Shared/models/files';
import { FileSelectEvent } from 'primeng/fileupload';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
})
export class RequestDetailsComponent {
  // --------------------------------------
  // VALUES
  // --------------------------------------
  uploadedFiles: File[] = [];
  // filesArr: {
  //   filePath: string;
  //   fullPath: string;
  //   originalName: string;
  //   attachTypeId: number | null;
  // }[] = [];
  editeId!: number;
  editMode: boolean = false;
  // -----
  showBreadcrumb: boolean = true;
  showCustomizeOrder: boolean = false;
  requestData: any[] = [];
  usersForAssignList: any[] = [];
  requestId: number;
  projectId: number;
  visitRequestStatusId: number;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertSuccessMsg: string = '';
  errorMsg: string = '';

  alertSuccessFun(value: boolean) {
    if (value) {
      this.alertSuccess = false;
      this._router.navigate(['/projects/visit-requests/specified-requests']);
    }
  }
  alertErrorFun(value: boolean) {
    if (value) {
      this.alertError = false;
    }
  }
  alertWarningFun(value: boolean) {
    if (value) {
      this.alertWarning = false;
    } else {
      this.alertWarning = false;
    }
  }
  alertConfirmFun(value: boolean) {}
  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------
  constructor(
    private _incomingRequestsService: IncomingRequestsService,
    private _activaRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _filesServices: FilesService
  ) {}
  // ----------------------------------------
  // FORM
  // ----------------------------------------
  complateRequestForm = this._fb.group({
    visitRequestId: 0,
    description: [''],
    descriptionUserAssignOrRefuse: [''],
    statusId: ['', Validators.required],
    fileUploads: this._fb.array([]),
  });
  get formControl() {
    return this.complateRequestForm.controls;
  }

  // --------------------------------------
  // get Request By Id
  // --------------------------------------
  getRequestById() {
    this._incomingRequestsService
      .getRequestById(this.requestId)
      .subscribe((res) => {
        this.requestData = res?.data;
        this.projectId = res.data.projectId;
        this.visitRequestStatusId = res.data.visitRequestStatusId;
        this.maintenanceFiles = res.data.fileUploads;
      });
  }

  // ------------------------------------------
  // Assign Visit Request To User
  // ------------------------------------------
  changeStatusOfVisitRequest() {
    const model = {
      visitRequestId: this.requestData['id'],
      description: this.complateRequestForm.value.description,
      descriptionChangeStatus:
        this.complateRequestForm.value.descriptionUserAssignOrRefuse,
      statusId: +this.complateRequestForm.value.statusId,
      fileUploads: this.uploadedFiles,
    };

    this._incomingRequestsService.changeStatusOfVisitRequest(model).subscribe({
      next: (_) => {
        this.alertSuccessMsg = 'تم تحديد حالة الزيارة بنجاح، يمكنك المتابعة';
        this.alertSuccess = true;
        this.getRequestById();
      },
      error: (_) => {
        this.errorMsg = 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
        this.alertError = true;
      },
    });
  }

  cancleRequest() {
    this._router.navigate(['/projects/visit-requests/specified-requests']);
  }
  // --------------------------------------
  // ONINIT
  // --------------------------------------
  ngOnInit(): void {
    this._activaRoute.params.subscribe((res) => {
      this.requestId = res['id'];
    });
    this.getRequestById();

    this.editeId != null
      ? this.getRequestById()
      : this.getPickedFiles('specified-requests/add');


  }

  // ------------------------------------
  //  PICKED FILES
  // ------------------------------------
  maintenanceFiles;
  // ************************************************************
  // ************************************************************
  currentId;
  isEdit: boolean = false;
  // FILES FUNCTIONS
  SelectedFile(event: FileSelectEvent, fileUpload, attachTypeId) {
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
      }
      this.uploadedFiles = [...this.uploadedFiles];
      this.uploadedFiles?.push({
        name: FileName,
        size: fullSize,
        originalName: FileName,
        attachTypeId: attachTypeId,
        progress: 0,
      });

      // this.filterFilesByAttachementType(this.uploadedFiles)
      this.changeFileIcon(this.uploadedFiles);
      let currentUplodedFileIndex = this.uploadedFiles.length - 1;
      let pageRoute = 'specified-requests/add';
      if (this.isEdit) {
        pageRoute = `specified-requests/edit/${this.currentId}`;
      }
      this._filesServices
        .uploadFileWithProgress(file, pageRoute, attachTypeId)
        .subscribe({
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
                    attachTypeId: attachTypeId,
                    originalName: element.originalName,
                    id: element.id,
                    progress: 100,
                  };
                  this.uploadedFiles[currentUplodedFileIndex] = fileItem;
                  this.uploadedFiles.map((e) => (e.isPicked = true));

                  this.filesArr.push({
                    filePath: element.filePath,
                    fullPath: element.fullPath,
                    originalName: element.originalName,
                    attachTypeId: attachTypeId,
                  });
                }
              }
            }
          },
          error: (error) => {
            console.error('Upload error:', error);
          },
        });
    }
    fileUpload.clear();
  }
  changeFileIcon(files) {
    this.uploadedFiles.map((e) => (e.isPicked = true));
  }
  filesArr: {
    filePath: string;
    fullPath: string;
    originalName: string;
    attachTypeId: number | null;
  }[] = [];
  remove(filePath: string, index: number, attachementTypeId, file) {
    this.uploadedFiles.splice(index, 1);

    this._filesServices.deleteFile(filePath).subscribe((data) => {});
  }
  getPickedFiles(pickedPath) {
    this._filesServices.getPickedFiles(pickedPath).subscribe((res) => {
      res.data.map((e) => {
        e.isPicked = true;
      });
      if (this.isEdit) {
        this.uploadedFiles = [...res.data];
      } else {
        this.uploadedFiles = [...res.data];
      }

      res.data.forEach((element) => {
        element.id = null;
      });
    });
  }
  downloadFile(data) {
    saveAs(`${data.fullPath}`, `${data.originalName}`);
    window.open(`${data.fullPath}`, '_blank');
  }

  // ************************************************************
  // ************************************************************
}
