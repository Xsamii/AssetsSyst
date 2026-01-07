import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { IncomingRequestsService } from '../../../incoming-requests/services/incoming-requests.service';
import { FilesService } from 'src/app/Shared/services/files.service';
import * as moment from 'moment';
import { OutgoingService } from '../../services/outgoing.service';
import { File } from 'src/app/Shared/models/files';
import { Location } from '@angular/common';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit {
  // ------------------------------------
  //  VALUES
  // ------------------------------------
  uploadedFiles: File[] = [];
  filesArr: {
    filePath: string;
    fullPath: string;
    originalName: string;
    attachTypeId: number | null;
  }[] = [];
  editMode: boolean = false;
  currentRequestId!: number;

  alertError: boolean = false;
  alertErrorMsg: string = '';
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  userRole = +localStorage.getItem('maintainanceRole');
  userTypes = UserTypesEnum;
  alertSuccessFun(value) {
    if (value) {
      this.alertSuccess = false;
      this._router.navigate(['/projects/visit-requests']);
    }
  }
  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------
  selectedNodes: any = 0;
  constructor(
    private _fb: FormBuilder,
    private _sharedService: SharedService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _incomingRequestsService: IncomingRequestsService,
    private _fileService: FilesService,
    private _outgoingService: OutgoingService,
    private _location: Location
  ) {}
  // ------------------------------------------
  // Form
  // ------------------------------------------

  requestForm = this._fb.group({
    projectTaskId: [null, Validators.required],
    projectId: [null, Validators.required],
    requestTypeId: [null, Validators.required],
    visitDate: [null],
    visitTime: [null],
    requestAdress: [null, Validators.required],
    maintenanceRequestId: [null],
    fileUploads: this._fb.array([]),
  });

  get formControlls() {
    return this.requestForm.controls;
  }
  // ---------------------------------
  // ---------------------------------

  onSubmit() {
    // OBJECT
    this.uploadedFiles.forEach((element) => {
      element.id = null;
    });

    if (!this.editMode) {
      const obj = {
        id: this.currentRequestId,
        projectTaskId: this.requestForm.value.projectTaskId,
        projectId: this.requestForm.value.projectId,
        requestTypeId: this.selectedNodes.id,
        visitDateTime:
          moment(new Date(this.requestForm.value.visitDate)).format(
            'YYYY-MM-DD'
          ) +
          'T' +
          this.requestForm.value.visitTime.slice(0, 5),
        requestAdress: this.requestForm.value.requestAdress,
        maintenanceRequestId: this.requestForm.value.maintenanceRequestId,
        fileUploads: this.uploadedFiles,
      };
      this._outgoingService.create(obj).subscribe((res) => {
        if (res.isSuccess) {
          // Dynamic success message based on user role
          this.alertSuccessMsg = this.userRole === this.userTypes.Admin
            ? 'تمت إضافة الطلب بنجاح إلى قائمة الطلبات، يمكنك المتابعة'
            : 'تمت إضافة الطلب بنجاح إلى قائمة الطلبات الصادرة، يمكنك المتابعة';
          this.alertSuccess = true;
        } else {
          this.alertErrorMsg = res.errors[0].message;
          this.alertError = true;
        }
      });
    } else {
      const obj = {
        id: this.currentRequestId,
        projectTaskId: this.requestForm.value.projectTaskId,
        projectId: this.requestForm.value.projectId,
        requestTypeId: this.selectedNodes.id,
        visitDateTime:
          moment(new Date(this.requestForm.value.visitDate)).format(
            'YYYY-MM-DD'
          ) +
          'T' +
          String(this.requestForm.value.visitTime).slice(16, 21),
        requestAdress: this.requestForm.value.requestAdress,
        maintenanceRequestId: this.requestForm.value.maintenanceRequestId,
        UpdateFiles: this.uploadedFiles,
      };

      this._outgoingService.update(obj).subscribe((res) => {
        if (res.isSuccess) {
          // Dynamic success message based on user role
          this.alertSuccessMsg = this.userRole === this.userTypes.Admin
            ? 'تمت تعديل الطلب بنجاح إلى قائمة الطلبات، يمكنك المتابعة'
            : 'تمت تعديل الطلب بنجاح إلى قائمة الطلبات الصادرة، يمكنك المتابعة';
          this.alertSuccess = true;
        } else {
          this.alertErrorMsg = res.errors[0].message;
          this.alertError = true;
        }
      });
    }
  }

  // --------------------------------------
  // get Request By Id
  // --------------------------------------
  getRequestById() {
    this._outgoingService
      .getRequestById(this.currentRequestId)
      .subscribe((res) => {
        // ------------------------------------
        // ------------------------------------
        this.uploadedFiles = res.data.updateFiles;
        this.requestFiles = res.data.updateFiles;
        this.uploadedFiles.forEach((e) => {
          e.progress = 100;
        });
        this.requestFiles.forEach((e) => {
          e.id = null;
        });
        // -------------
        this.getPickedFiles(
          `projects/visit-requests/outgoing-requests/edit/${this.currentRequestId}`
        );
        for (let index = 0; index < res.data.updateFiles.length; index++) {
          const element = res.data.updateFiles[index];
          this.filesArr.push({
            filePath: element.filePath,
            fullPath: element.fullPath,
            originalName: element.originalName,
            attachTypeId: element.attachTypeId,
          });
        }
        // ------------------------------------
        // ------------------------------------
        this.getProjectTaskByProjectId(res.data.projectId);
        this.getMaintenanceRequestByProjectId(res.data.projectId);
        this.requestForm.patchValue({
          projectTaskId: res.data.projectTaskId,
          projectId: res.data.projectId,
          requestTypeId: res.data.rquestTypeDto,
          visitDate: new Date(res.data.visitDateTime),
          visitTime: new Date(res.data.visitDateTime),
          requestAdress: res.data.requestAdress,
          maintenanceRequestId: res.data.maintenanceRequestId,
        });
      });
  }
  // --------------------------------------
  // ONINIT
  // --------------------------------------

  ngOnInit(): void { 
    this.getVisitRequestType();
    this.getAllVisitRequestStatus();
    this.editMode?this.onEdit(): '';
    this.getMyExcutiveProjects();
  }
  // ------------------------------------
  // ON EDIT MODE
  // ------------------------------------
  onEdit() {
    this._activatedRoute.params.subscribe((params) => {
      this.currentRequestId = params['id'];
      if (this.currentRequestId) {
        this.editMode = true;
        this.getRequestById();
      } else {
        this.editMode = false;
      }
    });
    if(!this.editMode){
    }
    this.currentRequestId == null
      ? this.getRequestById()
      : this.getPickedFiles('projects/visit-requests/outgoing-requests/add');
  }
  // ******************************************************************************
  // START LOOKUPS
  // ******************************************************************************

  // ---------------------------------------------------------
  // Get My Excutive Projects By Global Project Type id
  // ---------------------------------------------------------
  projectList: any[] = [];
  getMyExcutiveProjects() {
    this._sharedService
      .getAllExecutiveProjectsHaveOfficeList()
      .subscribe((res) => {
        this.projectList = res['data'];
      });
  }

  // ---------------------------------------------------------
  // Get Project Task By Project Id
  // ---------------------------------------------------------
  tasksList: any[] = [];
  getProjectTaskByProjectId(value) {
    this._incomingRequestsService
      .getProjectTaskByProjectId(value)
      .subscribe((res) => {
        this.tasksList = res['data'];
      });
  }

  // ---------------------------------------------------------
  // Get Visit Request Type
  // ---------------------------------------------------------
  requestTypeList: any[] = [];
  getVisitRequestType() {
    this._incomingRequestsService.getVisitRequestType().subscribe((res) => {
      this.requestTypeList = res['data'];
    });
  }

  // ---------------------------------------------------------
  // Get All Visit Request Status
  // ---------------------------------------------------------
  requestStatusList: any[] = [];
  getAllVisitRequestStatus() {
    this._incomingRequestsService
      .getAllVisitRequestStatus()
      .subscribe((res) => {
        this.requestStatusList = res['data'];
      });
  }

  // ---------------------------------------------------------
  // Get Maintenance Request By Project Id
  // ---------------------------------------------------------
  maintenanceRequestList: any[] = [];
  getMaintenanceRequestByProjectId(value) {
    this._incomingRequestsService
      .getMaintenanceRequestByProjectId(value)
      .subscribe((res) => {
        this.maintenanceRequestList = res['data'];
        // this.requestForm.patchValue({
        //   maintenanceRequestId: maintenanceRequestId,

        // })
      });
  }
  // ******************************************************************************
  // END LOOKUPS
  // ******************************************************************************
  // ------------------------------------
  //  PICKED FILES
  // ------------------------------------
  requestFiles;
  getPickedFiles(pickedPath) {
    this._fileService.getPickedFiles(pickedPath).subscribe((res) => {
      res.data.map((e) => {
        e.isPicked = true;
        e.progress = 100;
      });
      if (this.editMode) {
        this.uploadedFiles = [...res.data, ...this.requestFiles];
      } else {
        this.uploadedFiles = [...res.data];
      }
    });
  }

  onCancleRequest() {
    this._location.back();
  }
}
