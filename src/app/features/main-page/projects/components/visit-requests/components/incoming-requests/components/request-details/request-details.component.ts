import { Component, OnInit } from '@angular/core';
import { IncomingRequestsService } from '../../services/incoming-requests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
})
export class RequestDetailsComponent implements OnInit {
  // --------------------------------------
  // VALUES
  // --------------------------------------
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
 userRole = +localStorage.getItem('maintainanceRole');
  userTypes = UserTypesEnum;
  alertSuccessFun(value: boolean) {
    if (value) {
      this.alertSuccess = false;
      this._location.back();
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
  alertConfirmFun(value: boolean) {
    if (value) {
      const model = {
        visitRequestId: this.requestData['id'],
        description: this.assignUserForm.value.description,
        descriptionChangeStatus:
          this.assignUserForm.value.descriptionUserAssignOrRefuse,
      };
      this._incomingRequestsService.refuseVisitRequestToUser(model).subscribe({
        next: (_) => {
          this.alertConfirm = false;
          this.alertSuccessMsg = 'تم رفض الطلب بنجاح، يمكنك المتابعة';
          this.alertSuccess = true;
          this.getRequestById();
        },
      });
    } else {
      this.alertConfirm = false;
    }
  }
  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------
  constructor(
    private _incomingRequestsService: IncomingRequestsService,
    private _activaRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _location: Location
  ) {}
  // ----------------------------------------
  // FORM
  // ----------------------------------------
  assignUserForm = this._fb.group({
    visitRequestId: 0,
    description: [''],
    descriptionUserAssignOrRefuse: [''],
    userAssignId: ['', Validators.required],
  });
  get formControl() {
    return this.assignUserForm.controls;
  }
  // --------------------------------------
  // get Request By Id
  // --------------------------------------
  maintenanceRequestId;
  getRequestById() {
    this._incomingRequestsService
      .getRequestById(this.requestId)
      .subscribe((res) => {
        this.requestData = res.data;
        this.projectId = res.data.projectId;
        this.maintenanceRequestId = res.data.maintenanceRequestId;
        this.visitRequestStatusId = res.data.visitRequestStatusId;
        this.getUsersForAssign();
      });
  }
  // --------------------------------------
  // get Users For Assign
  // --------------------------------------
  getUsersForAssign() {
    if (this.maintenanceRequestId == null) {
      this._incomingRequestsService
        .getUsersForAssign(this.projectId)
        .subscribe((res) => {
          this.usersForAssignList = res.data;
        });
    } else {
      this._incomingRequestsService
        .getUsersForAssignMaintenance(this.maintenanceRequestId)
        .subscribe((res) => {
          this.usersForAssignList = res.data;
        });
    }
  }
  // --------------------------------------
  // Show or Hide Customize Order Section
  // --------------------------------------
  onCustomizeOrder() {
    this.showCustomizeOrder = !this.showCustomizeOrder;
  }
  // ------------------------------------------
  // Assign Visit Request To User
  // ------------------------------------------
  assignVisitRequestToUser() {
    const model = {
      visitRequestId: this.requestData['id'],
      description: this.assignUserForm.value.description,
      descriptionChangeStatus:
        this.assignUserForm.value.descriptionUserAssignOrRefuse,
      userAssignId: this.assignUserForm.value.userAssignId,
    };

    this._incomingRequestsService.assignVisitRequestToUser(model).subscribe({
      next: (_) => {
        this.alertSuccessMsg = 'تم تخصيص الطلب بنجاح، يمكنك المتابعة';
        this.alertSuccess = true;
        this.getRequestById();
      },
      error: (_) => {
        this.errorMsg = 'برجاء اختيار الموظف المخصص';
        this.alertError = true;
      },
    });
  }
  // ------------------------------------------
  // Refuse VisitRequestToUser
  // ------------------------------------------
  refuseVisitRequestToUser() {
    this.alertConfirm = true;
  }
  // --------------------------------------
  // ONINIT
  // --------------------------------------
  ngOnInit(): void {
    this._activaRoute.params.subscribe((res) => {
      this.requestId = res['id'];
    });
    this.getRequestById();
  }
}
