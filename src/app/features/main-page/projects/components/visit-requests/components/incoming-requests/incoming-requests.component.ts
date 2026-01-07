import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { IncomingRequestsService } from './services/incoming-requests.service';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeSelectModule } from 'primeng/treeselect';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';

@Component({
  selector: 'app-incoming-requests',
  standalone: true,
  imports: [
    CommonModule,
    BreadCrumbComponent,
    ListComponent,
    ReactiveFormsModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    TreeSelectModule,
    NoDataYetComponent,
  ],
  templateUrl: './incoming-requests.component.html',
  styleUrls: ['./incoming-requests.component.scss'],
})
export class IncomingRequestsComponent implements OnInit {
  // --------------------------------------
  // VALUES
  // --------------------------------------
  selectedNodes;
  showBreadcrumb: boolean = true;
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  values: any[] = [];
  totalPageCount!: number;
  filterDataParams = new FilterDataParams();
  searchValue!: string;
  displayDialog: boolean = false;
  projectOrginList;
  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------
  constructor(
    private _incomingRequestsService: IncomingRequestsService,
    private _fb: FormBuilder,
    private _sharedService: SharedService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}
  // ------------------------------------------
  // Form
  // ------------------------------------------
  filterForm = this._fb.group({
    GlobalProjectTypeId: [],
    project: [],
    tasks: [],
    requestType: [],
    requestStatus: [],
    visitDateTime: [],
    requestMaintainance: [],
  });
  get formControlls() {
    return this.filterForm.controls;
  }
  // ---------------------------------
  // ---------------------------------

  showDialog() {
    this.displayDialog = true;
  }
  hideDialog() {
    this.displayDialog = false;
    this.filterDataParams.ProjectId = null;
    this.filterDataParams.GlobalProjectId = null;
    this.filterForm.reset();
    this.popupFilter();
  }

  // --------------------------------------------
  // GET ALL  Requests
  // --------------------------------------------

  getAllRequests(paganations?: any) {
    this._incomingRequestsService
      .getAllRequests(paganations, this.filterDataParams)
      .subscribe((data) => {
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
        // this.successDeleteAlert = false;
      });
  }

  //=================================================
  // FILTERS BY TEXT
  //=================================================
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getAllRequests();
  }
  // ---------------------------------------------------------
  // Popup Filters
  // ---------------------------------------------------------

  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];

    // ------------------------------
    if (this.filterForm.value.GlobalProjectTypeId) {
      this.filterDataParams.GlobalProjectId =
        this.filterForm.value.GlobalProjectTypeId;
    }
    if (this.filterForm.value.project) {
      this.filterDataParams.ProjectId = this.filterForm.value.project;
    }
    // ------------------------------
    if (this.filterForm.value.requestMaintainance)
      this.filterDataParams.filterItems.push({
        key: 'MaintenanceRequestId',
        operator: 'equals',
        value: this.filterForm.value.requestMaintainance,
      });
    if (this.filterForm.value.visitDateTime)
      this.filterDataParams.filterItems.push({
        key: 'VisitTime',
        operator: 'equals',
        value: this.filterForm.value.visitDateTime.setHours(
          new Date().getHours() + 1
        ),
      });
    if (this.filterForm.value.requestType)
      this.filterDataParams.filterItems.push({
        key: 'RequestTypeId',
        operator: 'equals',
        value: this.selectedNodes.id,
      });
    if (this.filterForm.value.requestStatus)
      this.filterDataParams.filterItems.push({
        key: 'VisitRequestStatusId',
        operator: 'equals',
        value: this.filterForm.value.requestStatus,
      });
    if (this.filterForm.value.tasks)
      this.filterDataParams.filterItems.push({
        key: 'projectTaskId',

        operator: 'equals',
        value: this.filterForm.value.tasks,
      });
    this.displayDialog = false;
    this.getAllRequests();
  }

  // ---------------------------------------------------------
  // change Global Project Id
  // ---------------------------------------------------------
  globalProjectId: number;
  changeGlobalProjectId() {
    this.filterForm
      .get('GlobalProjectTypeId')
      .valueChanges.subscribe((changes) => {
        this.globalProjectId = changes;
      });
  }
  // ---------------------------------------------------------
  // redirect To Request Details
  // ---------------------------------------------------------
  redirectToRequestDetails(id) {
    this._router.navigate([`request-details/${id}`], {
      relativeTo: this._activatedRoute,
    });
  }
  // ******************************************************************************
  // START LOOKUPS
  // ******************************************************************************
  // ---------------------------------------------------------
  // Get My Excutive Projects By Global Project Type id
  // ---------------------------------------------------------
  projectList: any[] = [];
  getMyExcutiveProjectsByGlobalProjectType(value) {
    this._incomingRequestsService
      .getMyExcutiveProjectsByGlobalProjectType(value)
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
      });
  }
  // ******************************************************************************
  // END LOOKUPS
  // ******************************************************************************
  // --------------------------------------
  // ONINIT
  // --------------------------------------
  ngOnInit(): void {
    this.changeGlobalProjectId();
    this.filterDataParams!.filterType = 4;
    this.getAllRequests();
    this.cols = [
      new listColumns({ field: 'projectName', header: 'المشروع ' }),
      new listColumns({
        field: 'projectTaskName',
        header: 'المهمة ',
      }),
      new listColumns({ field: 'visitRequestTypeName', header: 'نوع الطلب ' }),
      new listColumns({
        field: 'visitRequestStatusId',
        header: 'حالة الطلب ',
        visitRequestStatusId: 'visitRequestStatusId',
      }),

      new listColumns({
        field: 'visitDateTime',
        header: 'تاريخ الزيارة',
        isDate: true,
      }),
    ];
    this.getVisitRequestType();
    this.getAllVisitRequestStatus();
  }
}
