import { ProjectTabsEnum } from './../../../../../../../../Shared/enums/projectTabsEnum';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { forkJoin } from 'rxjs';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { ProjectsService } from '../../services/projects.service';
import { UploadFileGridComponent } from 'src/app/Shared/components/uploadFileGrid/uploadFileGrid.component';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { saveAs } from 'file-saver';
import { FilesService } from 'src/app/Shared/services/files.service';
import { AttachementTypesEnum } from 'src/app/Shared/enums/attachTypesEnum';
import { File } from 'src/app/Shared/models/files';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { CheckboxModule } from 'primeng/checkbox';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-projects-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    BreadCrumbComponent,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    GoogleMapsModule,
    UploadFileGridComponent,
    FileUploadModule,
    SweetAlertMessageComponent,
    InputNumberModule,
    ListComponent,
    CheckboxModule,
  ],
  templateUrl: './projects-add-edit.component.html',
  styleUrls: ['./projects-add-edit.component.scss'],
})
export class ProjectsAddEditComponent {
  //--dropdowns
  projectTypeList;
  projectOrginList;
  projectClassificationList;
  projectStatusList;
  officeList;
  projectManagerList;
  SupervisorOfficeList;
  showSupervisor: boolean = false;
  showSupervisorOnNature: boolean = false;
  filesTypesList = [
    { id: 1, name: 'الكراسه' },
    { id: 2, name: 'جدول الكميات مسعر' },
    { id: 3, name: 'جدول كميات - مفرغ' },
    { id: 4, name: 'ارتباط' },
    { id: 5, name: 'محضر فتح العروض' },
    { id: 6, name: 'تحليل فني ومالي' },
    { id: 7, name: 'محضر الترسيه' },
    { id: 8, name: 'محضر تسليم الموقع' },
    { id: 9, name: 'تبليغ المقاول' },
    { id: 10, name: 'المستخلصات' },
    { id: 11, name: 'محضر تسليم نهائي' },
    { id: 12, name: 'المخطط' },
    { id: 13, name: 'العقد' },
  ];
  cols: any[] = [];
  values: any[] = [];
  competitionTypes: any[] = [
    { id: 1, name: 'منافسة محدودة' },
    { id: 2, name: 'منافسة عامة' },
  ];
  // ---------------
  //--Tabs flags
  projectDeets: boolean = true;
  secondaryDeets: boolean = false;
  locationDeets: boolean = false;
  attachementDeets: boolean = false;
  projectTabsEnum = ProjectTabsEnum;
  activeTab: number = this.projectTabsEnum.projectDeets;
  // ---------------
  //--Map Variables
  hybrid = google.maps.MapTypeId.HYBRID;
  center: google.maps.LatLngLiteral = {
    lat: 21.4225,
    lng: 39.8262,
  };
  zoom = 14;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  markerPositions: google.maps.LatLngLiteral;
  selectedPoint: string = '';

  // ---------------

  //--Form
  projectDetailsForm: FormGroup;
  secondaryDetailsForm: FormGroup;
  // ---------------

  currentId;
  isEdit: boolean = false;
  uploadedFiles: File[] = [];
  attachementTypesEnum = AttachementTypesEnum;
  percentageValue: number = 0;

  // --alerts
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertWarning: boolean = false;
  alertError: boolean = false;
  // ---------------

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _sharedService: SharedService,
    private _formBuilder: FormBuilder,
    private _projectService: ProjectsService,
    private _filesServices: FilesService
  ) {
    this._activatedRoute.params.subscribe((params) => {
      this.currentId = params['id'];
      this.currentId != null ? (this.isEdit = true) : (this.isEdit = false);
    });
  }
  ngOnInit(): void {
    this.cols = [
      new listColumns({
        field: 'originalName',
        header: 'الاسم ',
        isClickable: true,
        fullPath: 'path',
      }),
      new listColumns({
        field: 'attachTypeId',
        header: 'النوع',
        attachmentTypeId: 'attachTypeId',
      }),
    ];

    this.getDropDowns();
    this.initializeForm();
    this.currentId != null
      ? this.getById()
      : this.getPickedFiles('projects-menu/add');
  }
  projectData;
  getById() {
    this._projectService.getProjectById(this.currentId).subscribe((res) => {
      this.projectData = res.data;
      this.markerPositions = {
        lat: this.projectData.lat,
        lng: this.projectData.long,
      };
      // this.SupervisorOfficeList.push({
      //   id: this.projectData?.supervisorOfficeId,
      //   name: this.projectData?.supervisorOfficeName,
      // });

      this.getAllProjectManagersByOfficeId(this.projectData.officeId);
      if (
        this.projectData.supervisorOfficeId &&
        this.projectData.projectTypeId == '2'
      ) {
        this.showSupervisor = true;
        this.showSupervisorOnNature = true;
      }

      this.percentageValue = 100;

      this.uploadedFiles = this.projectData.fileUploads;
      this.uploadedFiles.forEach((element) => {
        element.id = null;
        element.progress = 100;
        element.hide = true;
      });

      this.getPickedFiles(`projects-menu/edit/${this.currentId}`);
      this.handleFileUploaded();

      // this.filterFilesByAttachementType(this.projectData.fileUploads);
      this.filesArr = [];
      for (
        let index = 0;
        index < this.projectData.fileUploads.length;
        index++
      ) {
        const element = this.projectData.fileUploads[index];
        this.filesArr.push({
          filePath: element.filePath,
          fullPath: element.fullPath,
          originalName: element.originalName,
          attachTypeId: element.attachTypeId,
        });
      }
      this.patchData(this.projectData);
    });
  }

  patchData(data) {
    this.locationDetails = {
      address: data.address,
      latitude: data.lat,
      longitude: data.long,
    };

    this.projectDetailsForm.patchValue({
      ...data,
    });
    this.secondaryDetailsForm.patchValue({
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      biddingDate: data.biddingDate ? new Date(data.biddingDate) : null,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      envelopeOpeningDate: data.envelopeOpeningDate
        ? new Date(data.envelopeOpeningDate)
        : null,
      competitionAnnouncementDate: data.competitionAnnouncementDate
        ? new Date(data.competitionAnnouncementDate)
        : null,

      note: data.note,
    });
  }

  submit() {
    let obj = {
      ...this.projectDetailsForm.value,
      ...this.secondaryDetailsForm.value,
      lat: this.markerPositions?.lat ? this.markerPositions.lat : null,
      long: this.markerPositions?.lng ? this.markerPositions.lng : null,
      address: this.locationDetails?.address,
      startDate: this.secondaryDetailsForm.value.startDate
        ? moment(new Date(this.secondaryDetailsForm.value.startDate)).format(
            'YYYY-MM-DD'
          ) + 'T00:00:00'
        : null,
      endDate: this.secondaryDetailsForm.value.endDate
        ? moment(new Date(this.secondaryDetailsForm.value.endDate)).format(
            'YYYY-MM-DD'
          ) + 'T00:00:00'
        : null,
      biddingDate: this.secondaryDetailsForm.value.biddingDate
        ? moment(new Date(this.secondaryDetailsForm.value.biddingDate)).format(
            'YYYY-MM-DD'
          ) + 'T00:00:00'
        : null,
      deliveryDate: this.secondaryDetailsForm.value.deliveryDate
        ? moment(new Date(this.secondaryDetailsForm.value.deliveryDate)).format(
            'YYYY-MM-DD'
          ) + 'T00:00:00'
        : null,
      envelopeOpeningDate: this.secondaryDetailsForm.value.envelopeOpeningDate
        ? moment(
            new Date(this.secondaryDetailsForm.value.envelopeOpeningDate)
          ).format('YYYY-MM-DD') + 'T00:00:00'
        : null,
      competitionAnnouncementDate: this.secondaryDetailsForm.value
        .competitionAnnouncementDate
        ? moment(
            new Date(
              this.secondaryDetailsForm.value.competitionAnnouncementDate
            )
          ).format('YYYY-MM-DD') + 'T00:00:00'
        : null,
      fileUploads: this.uploadedFiles ? this.uploadedFiles : null,
      DepartmentId: null,
    };
    // update
    if (this.isEdit) {
      this._projectService.editProject(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تم تعديل تفاصيل المشروع بنجاح، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    }
    // add
    else {
      this._projectService.addProject(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تمت إضافة المشروع بنجاح إلى قائمة المشاريع، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    }
  }
  cancel() {
    this.alertWarning = true;
    // this._router.navigate(['/projects/projects-menu']);
  }

  locationDetails;
  addMarker(event: google.maps.MapMouseEvent) {
    const geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({ location: event.latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.locationDetails = {
            address: results[0].formatted_address,
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          };
        } else {
        }
      } else {
      }
    });

    this.markerPositions = event.latLng!.toJSON();
    this.selectedPoint =
      'lat : ' +
      String(this.markerPositions.lat) +
      ', lng : ' +
      String(this.markerPositions.lng);
    return (this.markerPositions = event.latLng!.toJSON());
  }

  initializeForm() {
    this.projectDetailsForm = this._formBuilder.group({
      id: [null],
      name: [
        ,
        [
          Validators.required,
          Validators.maxLength(400),
          ,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      ],
      number: [,],
      projectTypeId: [,  Validators.required],
      officeId: [, ],
      projectClassificationId: [, ],
      projectStatueId: [, ],
      value: [,],
      projectManagerId: [, ],
      extractsNumber: [,],
      globalProjectTypeId: [, ],
      supervisorOfficeId: [null, ],
      durationByDay: [null,],
      referenceNumber: [''],
      competitionType: [null,],
      financialConnection: [false],
      taskCompletionRate:[null]
    });
    this.secondaryDetailsForm = this._formBuilder.group({
      startDate: [null],
      endDate: [null],
      biddingDate: [null],
      deliveryDate: [null],
      competitionAnnouncementDate: [null],
      envelopeOpeningDate: [null],
      note: [null],
    });
  }
  get projectDeetsFormControls() {
    return this.projectDetailsForm.controls;
  }
  nextTab() {
    this.activeTab++;
  }
  changeTab(val) {
    this.activeTab = val;
  }

  getDropDowns() {
    forkJoin({
      projectTypeReq: this._sharedService.getProjectType(),
      projectClassificationReq: this._sharedService.getProjectClassifications(),
      projectStatusReq: this._sharedService.getProjectStatus(),
      OfficeReq: this._sharedService.getContractors(),
      // projectManagerReq: this._sharedService.getManagers(),
      SupervisorOfficeReq: this._sharedService.getSupervisorOfficeList(),
    }).subscribe(
      ({
        projectTypeReq,
        projectClassificationReq,
        projectStatusReq,
        OfficeReq,
        // projectManagerReq,
        SupervisorOfficeReq,
      }) => {
        this.projectTypeList = projectTypeReq.data;
        this.projectClassificationList = projectClassificationReq.data;
        this.projectStatusList = projectStatusReq.data;
        this.officeList = OfficeReq.data;
        // this.projectManagerList = projectManagerReq.data;
        this.SupervisorOfficeList = SupervisorOfficeReq.data;
      }
    );
  }
  showSupervisorProject(value) {
    if (value.value == 2) {
      this.showSupervisor = true;
    } else {
      this.showSupervisor = false;
      this.projectDetailsForm.value.supervisorOfficeId = null;
    }
  }
  chooseProjectNature(value) {
    if (value.value == 1) {
      this.showSupervisorOnNature = true;
    } else {
      this.showSupervisorOnNature = false;
      this.projectDetailsForm.value.supervisorOfficeId = null;
    }
  }
  getAllProjectManagersByOfficeId(event) {
    this._sharedService
      .getProjectManagersByOfficeId(event)
      .subscribe((data) => {
        this.projectManagerList = data.data;
      });
  }

  // FILES FUNCTIONS
  selectedFileTypeId: number | null = null;
  onFileTypeChange(event: any): void {
    this.selectedFileTypeId = event.value;
  }
  handleFileUploaded(file?: any) {
    this.uploadedFiles.forEach((element:any)=>{
      element.path=environment.filesUrl +element.filePath
    })
    this.values = [...this.uploadedFiles];
  }

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
      this.uploadedFiles = [];
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
      let pageRoute = 'projects-menu/add';
      if (this.isEdit) {
        pageRoute = `projects-menu/edit/${this.currentId}`;
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
                  this.filterFilesByAttachementType(this.uploadedFiles);

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
    switch (files.attachTypeId) {
      case 1:
        this.awardedProjectRecordFiles.map((e) => (e.isPicked = true));

        break;
      case 2:
        this.projectDeliveryFiles.map((e) => (e.isPicked = true));

        break;
      case 3:
        this.planFiles.map((e) => (e.isPicked = true));
        break;
      case 4:
        this.contractFiles.map((e) => (e.isPicked = true));
        break;
      default:
        break;
    }
  }

  projectFiles;

  contractFiles: File[] = [];
  planFiles: File[] = [];
  projectDeliveryFiles: File[] = [];
  awardedProjectRecordFiles: File[] = [];
  filesArr: {
    filePath: string;
    fullPath: string;
    originalName: string;
    attachTypeId: number | null;
  }[] = [];
  remove(deletedFile?) {
    let index = this.uploadedFiles.findIndex(
      (file) => file.filePath == deletedFile.filePath
    );
    this.uploadedFiles.splice(index, 1);

    if (deletedFile.isPicked == true) {
      this._filesServices
        .deleteFile(deletedFile.filePath)
        .subscribe((data) => {});
    }
    this.handleFileUploaded();
  }

  removeOLD(filePath: string, index: number, attachementTypeId, file) {
    switch (attachementTypeId) {
      case 1:
        this.awardedProjectRecordFiles.splice(index, 1);

        break;
      case 2:
        this.projectDeliveryFiles.splice(index, 1);

        break;
      case 3:
        this.planFiles.splice(index, 1);
        break;
      case 4:
        this.contractFiles.splice(index, 1);
        break;
      default:
        break;
    }

    this.filesArr.splice(index, 1);
    // this.uploadedFiles.splice(index, 1);
    if (file.isPicked == true) {
      this._filesServices.deleteFile(filePath).subscribe((data) => {});
    }
  }

  deleteFile(value) {
    this._filesServices.deleteFile(value).subscribe((data) => {});
    // this.currentId != null
    // ? this.getById()
    // : this.getPickedFiles('projects-menu/add');

    if (this.currentId != null) {
      this.getById();
    } else {
      this.getPickedFiles('projects-menu/add');
      this.handleFileUploaded();
      // this.values.splice(index, 1)
    }
  }

  getPickedFiles(pickedPath) {
    this._filesServices.getPickedFiles(pickedPath).subscribe((res) => {
      res.data.map((e) => {
        e.isPicked = true;
        e.progress = 100;
        e.hide = true;
      });
      this.values = [...this.values, ...res.data];
      if (this.isEdit) {
        this.uploadedFiles = [...res.data, ...this.uploadedFiles];
      } else {
        this.uploadedFiles = [...res.data];
      }
      this.filterFilesByAttachementType(res.data);
      res.data.forEach((element) => {
        element.id = null;
      });
    });
  }
  fileOnProgress(event) {
    // this.fileUpload.progress = event;
  }
  downloadFile(data) {
    // saveAs(`${data.fullPath}`, `${data.originalName}`);
    window.open(`${data.fullPath}`, '_blank');
  }

  filterFilesByAttachementType(files) {
    files.forEach((file) => {
      switch (file.attachTypeId) {
        case 1:
          this.awardedProjectRecordFiles.push(file);

          this.awardedProjectRecordFiles.forEach((e) => {
            e.progress = 100;
          });

          break;
        case 2:
          this.projectDeliveryFiles.push(file);

          this.projectDeliveryFiles.forEach((e) => {
            e.progress = 100;
          });

          break;
        case 3:
          this.planFiles.push(file);

          this.planFiles.forEach((e) => {
            e.progress = 100;
          });
          break;
        case 4:
          this.contractFiles.push(file);

          this.contractFiles.forEach((e) => {
            e.progress = 100;
          });

          break;
        default:
          break;
      }
    });
  }

  // END OF FILES FUNCTIONS

  alertSuccessFun(value) {
    if (value) {
      this._router.navigate(['/projects/projects-menu']);
    }
  }
  alertWarningFun(value: boolean) {
    if (value) {
      this.alertWarning = false;
      this._router.navigate(['/projects/projects-menu']);
    } else {
      this.alertWarning = false;
    }
  }

  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
  onlyNumberAndComma(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const cursorPos = input.selectionStart || 0;

    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

    if (allowedKeys.includes(event.key)) return;

    const isNumber = /[0-9]/.test(event.key);
    const isComma = event.key === ',';

    // Block anything not a digit or comma
    if (!isNumber && !isComma) {
      event.preventDefault();
      return;
    }

    const beforeCursor = value.substring(0, cursorPos);
    const afterCursor = value.substring(cursorPos);

    // Block if comma is next to another comma
    if (
      isComma &&
      (beforeCursor.endsWith(',') || afterCursor.startsWith(','))
    ) {
      event.preventDefault();
    }
  }

}
