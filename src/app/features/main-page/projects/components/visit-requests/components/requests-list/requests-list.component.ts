import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { VisitRequests } from './services/request-visits.service';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { forkJoin } from 'rxjs';
import { TreeSelectModule } from 'primeng/treeselect';
import { IncomingRequestsService } from '../incoming-requests/services/incoming-requests.service';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-requests-list',
  standalone: true,
  imports: [
    CommonModule,
    BreadCrumbComponent,
    ListComponent,
    DropdownModule,
    SweetAlertMessageComponent,
    ReactiveFormsModule,
    CalendarModule,
    TreeSelectModule,
    NoDataYetComponent,
  ],
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
})
export class RequestsListComponent {
  // ------------------------------------
  // VALUES
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  totalPageCount!: number;
  searchValue!: string;
  isSearchingReasult: boolean = false;
  showBreadcrumb: boolean = true;
  currentRequestId: number;
  displayDialog: boolean = false;
  selectedNodes;
  filterDataParams = new FilterDataParams();
  searchForm = this._fb.group({
    projectName: [],
    projectTaskName: [],
    visitRequestStatusId: [],
    visitRequestTypeName: [],
    visitDateTime: [],
  });

  get formControls() {
    return this.searchForm.controls;
  }

  alertSuccess: boolean = false;
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  alertSuccessFun(value) {
    if (value) {
      this.alertSuccess = false;
    }
  }

  alertWarningFun(value) {
    if (value) {
      this.alertWarning = false;
    } else {
      this.alertWarning = false;
    }
  }

  alertConfirmFun(value) {
    if (value) {
      this._visitRequestsService
        .deleteVisitRequest(this.visitRequestId)
        .subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.alertConfirm = false;
              this.alertSuccessMsg =
                'تم حذف الطلب بنجاح من قائمة الطلبات يمكنك المتابعة';
              this.alertSuccess = true;
              this.getData();
            } else {
              this.alertErrorMsg = res.errors[0].message;
              this.alertError = true;
              this.alertConfirm = false;
            }
          },
          error: (err) => {
            this.alertError = true;
          },
        });
    } else {
      this.alertConfirm = false;
    }
  }

  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
  // ------------------------------------
  // CONSTRUCTOR
  // ------------------------------------
  constructor(
    private _visitRequestsService: VisitRequests,
    private _fb: FormBuilder,
    private _sharedService: SharedService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _incomingRequestsService: IncomingRequestsService
  ) {}
  // ------------------------------------
  // FILTER
  // ------------------------------------
  showDialog() {
    this.searchForm.reset();
    this.selectedNodes = null;
    this.displayDialog = true;
    this.getLookUps();
  }
  hideDialog() {
    // this.searchForm.reset();
    this.filterDataParams.ProjectId = null;
    this.filterDataParams.GlobalProjectId = null;
    this.displayDialog = false;
    this.popupFilter();
  }

  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];
    if (this.searchForm.value.projectName) {
      this.filterDataParams.ProjectId = this.searchForm.value.projectName;
    }
    if (this.searchForm.value.projectTaskName)
      this.filterDataParams.filterItems.push({
        key: 'projectTaskId',
        operator: 'equals',
        value: String(this.searchForm.value.projectTaskName),
      });

    if (this.searchForm.value.visitRequestStatusId) {
      this.filterDataParams.filterItems.push({
        key: 'visitRequestStatusId',
        operator: 'equals',
        value: String(this.searchForm.value.visitRequestStatusId),
      });
    }
    if (this.searchForm.value.visitRequestTypeName) {
      this.filterDataParams.filterItems.push({
        key: 'RequestTypeId',
        operator: 'equals',
        value: String(this.selectedNodes.id),
      });
    }
    if (this.searchForm.value.visitDateTime) {
      let date = new Date(
        this.searchForm.value.visitDateTime.setHours(new Date().getHours() + 1)
      );
      this.filterDataParams.filterItems.push({
        key: 'visitDateTime',
        operator: 'equals',
        value:
          date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear(),
      });
    }
   
    this.getData();
    this.displayDialog = false;
  }
  submitSearchForm() {
    this.popupFilter();
  }

  // ------------------------------------
  // Get Requests
  // ------------------------------------
  getData(paganations?: any) {
    this._visitRequestsService
      .getAllVisitRequests(paganations, this.filterDataParams)
      .subscribe(
        (data) => {
          this.values = data.data.items;
          if (
            this.isSearchingReasult == true ||
            (this.isSearchingReasult == false && this.values.length != 0)
          ) {
            this.showBreadcrumb = true;
          } else {
            this.showBreadcrumb = false;
          }
          this.totalPageCount = data.data.totalCount;
        },
        (err) => {
          // this.alertErrorMsg =
          //   'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
          // this.alertError = true;
        }
      );
  }
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;

    this.getData();
  }

  projectOrginList;
  projectsList;
  projectTaskList;
  visitRequestTypesList;
  maintenanceRequestList;
  visitRequestStatusList;
  getLookUps() {
    forkJoin({
      requestTypeReq: this._sharedService.getVisitRequestTypes(),
      visitStatusReq: this._incomingRequestsService.getAllVisitRequestStatus(),
    }).subscribe(({  requestTypeReq, visitStatusReq }) => {
      this.visitRequestTypesList = requestTypeReq.data;
      this.visitRequestStatusList = visitStatusReq['data'];
    });
  }
  // ---------------------------------------------------------
  // Get My Excutive Projects By Global Project Type id
  // ---------------------------------------------------------
  showMaintenanceControls: boolean = false;
  getMyExcutiveProjects() {
   
    this._sharedService
      .getAllExecutiveProjectsList()
      .subscribe((res) => {
        this.projectsList = res['data'];
      });
  }

  // tasksList: any[] = [];
  getProjectTaskByProjectId(value) {
    this._incomingRequestsService
      .getProjectTaskByProjectId(value)
      .subscribe((res) => {
        this.projectTaskList = res['data'];
      });
  }

  getMaintenanceRequestByProjectId(value) {
    this._incomingRequestsService
      .getMaintenanceRequestByProjectId(value)
      .subscribe((res) => {
        this.maintenanceRequestList = res['data'];
      });
  }
  // ------------------------------------
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.getMyExcutiveProjects();
    this.getData();
    this.cols = [
      new listColumns({ field: 'orderNumber', header: '#' }),
      new listColumns({ field: 'projectName', header: 'المشروع' }),
      new listColumns({ field: 'projectTaskName', header: ' المهمة ' }),
      new listColumns({ field: 'visitRequestTypeName', header: 'نوع الطلب' }),
      new listColumns({
        field: 'visitRequestStatusName',
        header: ' حالة الطلب  ',
        visitRequestStatusId: 'visitRequestStatusId',
      }),

      new listColumns({
        field: 'visitDateTime',
        header: '  تاريخ الزيارة ',
        isDate: true,
      }),
    ];
  }

  // ---------------------------------------------------------
  // redirect To Request Details
  // ---------------------------------------------------------
  redirectToRequestDetails(id) {
    this._router.navigate([`request-details/${id}`], {
      relativeTo: this._activatedRoute,
    });
  }
  onAddNewRequest() {
    this._router.navigate(['add'], { relativeTo: this._activatedRoute });
  }

  editRequest(value) {
    this._router.navigate(['edit/' + value], {
      relativeTo: this._activatedRoute,
    });
  }
  visitRequestId: any;
  deleteRequest(value) {
    this.visitRequestId = value;
    this.alertConfirm = true;
  }
}
