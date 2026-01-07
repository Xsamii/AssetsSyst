import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { ProjectsMaintenanceRequestsService } from './services/projects-maintenance-requests.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-projects-maintenance-requests',
  standalone: true,
  imports: [
    CommonModule,
    ListComponent,
    NoDataYetComponent,
    BreadCrumbComponent,
    SweetAlertMessageComponent,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './projects-maintenance-requests.component.html',
  styleUrls: ['./projects-maintenance-requests.component.scss'],
})
export class ProjectsMaintenanceRequestsComponent {
  // --------------------------------------
  // VALUES
  // --------------------------------------
  showBreadcrumb: boolean = true;
  recieveAlertSubSuccess: boolean = false;
  closeAlertSubSuccess: boolean = false;
  subSuccessBtnText: string = '';
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  values: any[] = [];
  totalPageCount!: number;
  filterDataParams = new FilterDataParams();
  searchValue!: string;
  currentRowId: number = 0;
  errorMsg: any;
  showNotesPopup: boolean = false;
  showFilterPopup: boolean = false;
  type;
  userRole = +localStorage.getItem('maintainanceRole');

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------
  constructor(
    private _projectsMaintenanceService: ProjectsMaintenanceRequestsService,
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }
  // --------------------------------------
  // form
  // --------------------------------------
  maintainenceForm = this._fb.group({
    consultantNotes: ['', Validators.required],
  });
  get formControls() {
    return this.maintainenceForm.controls;
  }
  // ----------------------------------------
  // GET ALL MANTANINCE REQUEST
  // ----------------------------------------
  getData(paganations?: any) {
    this.type == 1
      ? (this.filterDataParams.ProjectType = 1)
      : (this.filterDataParams.ProjectType = 2);
    this._projectsMaintenanceService
      .getAllMaintenanceRequest(paganations, this.filterDataParams)
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
          this.alertError = true;
        }
      );
  }
  // ----------------------------------------
  // FILTERS BY TEXT
  // ----------------------------------------
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getData();
  }
  // ----------------------------------------
  // FILTERS POPUP
  // ----------------------------------------
  filterForm = this._fb.group({
    buildingId: [],
    subUnitId: [],
    mainCategoryType: [],
    subCategoryType: [],
    maintenanceRequestStatusId: [],
    requestPriorety: [],
  });
  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];
    if (this.filterForm.value.buildingId)
      this.filterDataParams.filterItems.push({
        key: 'buildingId',
        operator: 'equals',
        value: this.filterForm.value.buildingId,
      });
    if (this.filterForm.value.subUnitId)
      this.filterDataParams.filterItems.push({
        key: 'subUnitId',
        operator: 'equals',
        value: this.filterForm.value.subUnitId,
      });
    if (this.filterForm.value.subCategoryType)
      this.filterDataParams.filterItems.push({
        key: 'SubCategoryType',
        operator: 'equals',
        value: this.filterForm.value.subCategoryType,
      });
    if (this.filterForm.value.maintenanceRequestStatusId)
      this.filterDataParams.filterItems.push({
        key: 'MaintenanceRequestStatusId',
        operator: 'equals',
        value: this.filterForm.value.maintenanceRequestStatusId,
      });
    if (this.filterForm.value.requestPriorety)
      this.filterDataParams.filterItems.push({
        key: 'RequestPriorety',
        operator: 'equals',
        value: this.filterForm.value.requestPriorety,
      });

    this.getData();
    this.showFilterPopup = false;
  }
  onShowFilterPopup() {
    this.showFilterPopup = true;
  }
  closePopupFilter() {
    this.filterForm.reset();
    this.showFilterPopup = false;
    this.popupFilter();
  }
  // --------------------------------------
  // RECIEVE REQUEST
  // --------------------------------------
  recieve(value) {
    this.currentRowId = value;
    this.alertSuccessMsg = 'هل أنت متأكد أنك تُريد تأكيد استلام الطلب؟';
    this.subSuccessBtnText = 'استلام';
    this.recieveAlertSubSuccess = true;
  }
  recieveAlertSubSuccessFun(value) {
    if (value) {
      this._projectsMaintenanceService
        .recieveRequest(this.currentRowId)
        .subscribe((res) => {
          if (res.isSuccess) {
            this.recieveAlertSubSuccess = false;
            this.alertSuccessMsg =
              'تم تأكيد استلام الطلب بنجاح، يمكنك المتابعة';
            this.alertSuccess = true;
            this.getData();
          } else {
            this.recieveAlertSubSuccess = false;
            this.errorMsg = res.errors[0].message;
            this.alertError = true;
          }
        });
    } else {
      this.recieveAlertSubSuccess = false;
    }
  }
  // --------------------------------------
  // ADD REQUEST NOTES
  // --------------------------------------
  addRequestNotes(value) {
    this.currentRowId = value;
    this.showNotesPopup = true;
  }
  sendNotes() {
    const obj = {
      id: this.currentRowId,
      consultantNotes: this.maintainenceForm.value.consultantNotes,
    };
    this._projectsMaintenanceService.addNotes(obj).subscribe((res) => {
      if (res.isSuccess) {
        this.alertSuccessMsg =
          'تمت إضافة الملاحظة بنجاح إلى طلب الصيانة، يمكنك المتابعة';
        this.showNotesPopup = false;
        this.maintainenceForm.reset();
        this.alertSuccess = true;
      } else {
        this.showNotesPopup = false;
        this.errorMsg = res.errors[0].message;
        this.alertError = true;
        this.maintainenceForm.reset();
      }
    });
  }
  // --------------------------------------
  // CLOSE REQUEST
  // --------------------------------------
  onCloseRequest(value) {
    this.currentRowId = value;
    this.alertSuccessMsg = 'هل أنت متأكد أنك تُريد تأكيد إغلاق الطلب؟';
    this.subSuccessBtnText = 'إغلاق';
    this.closeAlertSubSuccess = true;
  }
  CloseAlertSubSuccessFun(value) {
    if (value) {
      this._projectsMaintenanceService
        .close(this.currentRowId)
        .subscribe((res) => {
          if (res.isSuccess) {
            this.closeAlertSubSuccess = false;
            this.alertSuccessMsg = 'تم تأكيد إغلاق الطلب بنجاح، يمكنك المتابعة';

            this.alertSuccess = true;
            this.getData();
          } else {
            this.closeAlertSubSuccess = false;
            this.errorMsg = res.errors[0].message;
            this.alertError = true;
          }
        });
    } else {
      this.closeAlertSubSuccess = false;
    }
  }
  // ------------------------------------
  // SWEET ALERTS
  // ------------------------------------
  alertSuccessFun(value) {
    if (value) {
      this.alertSuccess = false;
    }
  }
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }

  alertWarningFun(value) {
    if (value) {
      this.alertWarning = false;
      this.maintainenceForm.reset();
    } else {
      this.alertWarning = false;
      this.showNotesPopup = true;
    }
  }
  onCloseNotesPopup() {
    this.alertWarning = true;
    this.showNotesPopup = false;
  }
  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  builldingLookup: any = [];
  buildingSubUnitLookup: any = [];
  visitRequestsStatusLookup: any = [];
  requestPrioretyLookup: any = [];
  primaryMaintenanceTypeLookup: any = [];
  secondaryMaintenanceTypeLookup: any = [];
  getAllBuildingLookup() {
    this._sharedService.getAllBuilding().subscribe((res) => {
      this.builldingLookup = res.data;
    });
  }
  getAllBuildingSubUnit(id: number) {
    this._sharedService.getAllBuildingSubUnit(id).subscribe((res) => {
      this.buildingSubUnitLookup = res.data;
    });
  }
  getVisitRequestsStatus() {
    this.visitRequestsStatusLookup =
      this._sharedService.getVisitRequestsStatus();
  }
  getRequestPriorety() {
    this.requestPrioretyLookup = this._sharedService.getRequestPriorety();
  }
  getAllPrimaryMaintenanceType() {
    this._sharedService.getAllPrimaryMaintenanceType().subscribe((res) => {
      this.primaryMaintenanceTypeLookup = res.data;
    });
  }
  getMaintTypesByParent(id: number) {
    this._sharedService.getMaintTypesByParent(id).subscribe((res) => {
      this.secondaryMaintenanceTypeLookup = res.data;
    });
  }
  // --------------------------------------
  // ONINIT
  // --------------------------------------

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((res) => {
      this.type = res['role'];

      // GET ALL
      this.getData();
      // LOOKUPS
      this.getAllBuildingLookup();
      this.getVisitRequestsStatus();
      this.getRequestPriorety();
      this.getAllPrimaryMaintenanceType();
    });

    // COLUMN LIST
    this.cols = [
      new listColumns({ field: 'buildingName', header: 'المبنى' }),
      new listColumns({ field: 'buildingSubUnitName', header: 'المبنى' }),
      new listColumns({
        field: 'mainCategoryTypeName',
        header: 'العطل الرئيسي',
      }),
      new listColumns({ field: 'subCategoryTypeName', header: 'العطل الفرعي' }),
      new listColumns({
        field: 'requestPriorety',
        header: 'أولوية الطلب',
        priority: 'priorityTypeId',
      }),
      new listColumns({
        field: 'maintenanceRequestStatusName',
        header: 'حالة الطلب',
        maintenanceRequestStatusId: 'maintenanceRequestStatusId',
      }),
    ];
  }

  showMaintenanceRequest(id) {
    this._router.navigate([`details/${id}`], {
      relativeTo: this._activatedRoute,
    });
  }
}
