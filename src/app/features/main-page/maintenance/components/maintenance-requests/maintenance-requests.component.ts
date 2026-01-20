import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { MaintenanceRequestsService } from './services/maintenance-requests.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { CalendarModule } from 'primeng/calendar';
import { UploadFileComponent } from 'src/app/Shared/components/uploadFile/uploadFile.component';

import * as moment from 'moment';
import { UserTypesEnum } from 'src/app/core/enums/UserTypesEnum';
import { officeTypeEnum } from 'src/app/core/enums/officeTypeEnum';

@Component({
  selector: 'app-maintenance-requests',
  standalone: true,
  imports: [
    CommonModule,
    BreadCrumbComponent,
    ListComponent,
    ReactiveFormsModule,
    SweetAlertMessageComponent,
    DropdownModule,
    NoDataYetComponent,
    CalendarModule,
    UploadFileComponent,
  ],
  templateUrl: './maintenance-requests.component.html',
  styleUrls: ['./maintenance-requests.component.scss'],
})
export class MaintenanceRequestsComponent implements OnInit {
  // -----------------------------------
  // VALUES
  // -----------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  showBreadcrumb: boolean = true;
  showFilterPopup: boolean = false;
  filterDataParams = new FilterDataParams();
  showReciveRequest: boolean = false;
  showAddRequestNotes: boolean = false;
  showCustomizePreview: boolean = false;
  //new feature
  showCustomizeProcessing: boolean = false;
  customizeProcessingId: any;

  showPreviewRequest: boolean = false;
  showStatusPreview: boolean = false;
  showConfirmAcceptPreview: boolean = false;
  showConfirmRefusePreview: boolean = false;
  currentRequestId: any;
  uploadedFiles: File[] = [];
  userRole = +localStorage.getItem('maintainanceRole');
  userOfficeType = +localStorage.getItem('userOfficeType');
  userTypes = UserTypesEnum;
  officeTypes = officeTypeEnum;

  filesArr: {
    filePath: string;
    fullPath: string;
    originalName: string;
    attachTypeId: number | null;
  }[] = [];
  editMode: boolean = false;
  editeId!: number;

  // =============================
  // EVALUATION PROPERTIES
  // =============================
  showEvaluationDialog: boolean = false;
  selectedRequest: any = null;
  selectedRequestId: number = null;
  evaluationTerms: any[] = [];
  evaluationForm: FormGroup = new FormGroup({});
  ratings: number[] = [];
  hoverRating: number[] = [];
  isLoadingEvaluation: boolean = false;
  saveTimeout: any; // For auto-save delay

  // -----------------------------------
  // CONSTRUCTOR
  // -----------------------------------
  constructor(
    private _maintenanceRequestsService: MaintenanceRequestsService,
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { }

  // =============================
  // EVALUATION METHODS
  // =============================

  // Initialize Evaluation Form
  initializeEvaluationForm() {
    this.evaluationForm = this._fb.group({});
  }

  // Open Evaluation Dialog
  evaluateEvent(requestData: any) {
    this.selectedRequest = requestData;
    this.selectedRequestId = requestData.id || requestData;
    this.showEvaluationDialog = true;
    this.isLoadingEvaluation = true;

    // Load evaluation terms for this request
    this.loadEvaluationTerms();
  }

  // Load Evaluation Terms from API
  loadEvaluationTerms() {
    this._maintenanceRequestsService
      .getEvaluationTermForMaintenance(this.selectedRequestId)
      .subscribe(
        (response) => {
          this.isLoadingEvaluation = false;
          if (response.isSuccess) {
            this.evaluationTerms = response.data || [];
            this.initializeRatings();
            this.buildEvaluationForm();
          } else {
            this.alertError = true;
            this.alertErrorMsg = 'فشل في تحميل معايير التقييم';
            this.evaluationTerms = [];
          }
        },
        (error) => {
          this.isLoadingEvaluation = false;
          this.alertError = true;
          this.alertErrorMsg = 'خطأ في الاتصال بالخادم';
          this.evaluationTerms = [];
        }
      );
  }

  // Initialize ratings arrays
  initializeRatings() {
    this.ratings = new Array(this.evaluationTerms.length).fill(0);
    this.hoverRating = new Array(this.evaluationTerms.length).fill(0);

    // Set existing ratings if available - using 'rate' field from API response
    this.evaluationTerms.forEach((term, index) => {
      this.ratings[index] = term.rate || 0;
    });
  }

  // Build dynamic form based on evaluation terms
  buildEvaluationForm() {
    const formControls = {};
    this.evaluationTerms.forEach((term, index) => {
      formControls[`rating_${index}`] = [
        term.rate || 0,
        [Validators.min(0), Validators.max(5)] // Removed required validator
      ];
    });

    this.evaluationForm = this._fb.group(formControls);
  }

  // Set Rating for specific term
  setRating(termIndex: number, rating: number) {
    this.ratings[termIndex] = rating;
    this.evaluationForm.patchValue({
      [`rating_${termIndex}`]: rating
    });
  }

  // Get Rating for specific term
  getRating(termIndex: number): number {
    return this.ratings[termIndex] || 0;
  }

  // Set hover rating for visual feedback
  setHoverRating(termIndex: number, rating: number) {
    this.hoverRating[termIndex] = rating;
  }

  // Clear hover rating
  clearHoverRating(termIndex: number) {
    this.hoverRating[termIndex] = 0;
  }

  // Set Rating and Auto-Save
  setRatingAndSave(termIndex: number, rating: number) {
    // Update the rating
    this.setRating(termIndex, rating);

    // Auto-save after a short delay to avoid too many API calls
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      this.autoSaveEvaluation();
    }, 500); // 500ms delay
  }

  // Auto-save evaluation without form validation
  autoSaveEvaluation() {
    if (this.evaluationTerms.length > 0) {
      const evaluationData = {
        id: this.selectedRequestId,
        termRates: this.evaluationTerms.map((term, index) => ({
          rate: this.ratings[index] || 0,
          termsId: term.id
        }))
      };

      // Check if this is a new evaluation or edit - using 'rate' field
      const hasExistingRating = this.evaluationTerms.some(term => term.rate && term.rate > 0);

      const apiCall = hasExistingRating
        ? this._maintenanceRequestsService.editMaintenanceEvaluation(evaluationData)
        : this._maintenanceRequestsService.addMaintenanceEvaluation(evaluationData);

      apiCall.subscribe(
        (response) => {
          if (response.isSuccess) {
            // Update the terms with the new ratings to mark them as existing
            this.evaluationTerms.forEach((term, index) => {
              term.rate = this.ratings[index];
            });
          } else {
          }
        },
        (error) => {
        }
      );
    }
  }

  // Close Evaluation Dialog
  closeEvaluationDialog() {
    // Clear the auto-save timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }

    this.showEvaluationDialog = false;
    this.selectedRequest = null;
    this.selectedRequestId = null;
    this.evaluationTerms = [];
    this.ratings = [];
    this.hoverRating = [];
    this.isLoadingEvaluation = false;
    this.evaluationForm = this._fb.group({});
  }

  // Get Rating Text
  getRatingText(rating: number): string {
    const ratingTexts = {
      0: 'غير مقيم',
      1: 'ضعيف جداً',
      2: 'ضعيف',
      3: 'متوسط',
      4: 'جيد',
      5: 'ممتاز'
    };
    return ratingTexts[rating] || 'غير مقيم';
  }

  // ============================================
  // EXISTING METHODS (keeping all your original code)
  // ============================================

  // --------------------------------------------
  // GET ALL Maintenance Request
  // --------------------------------------------
  getAllMaintenanceRequest(paganations?: any) {
    this._maintenanceRequestsService
      .getAllMaintenanceRequest(paganations, this.filterDataParams)
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
      });
  }

  //=================================================
  // FILTERS BY TEXT
  //=================================================
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getAllMaintenanceRequest();
  }
  //=================================================
  // FILTERS POPUP
  //=================================================
  onShowFilterPopup() {
    this.showFilterPopup = true;
    // If a site is already selected, load buildings for that site
    if (this.filterForm.value.siteId) {
      this._sharedService.GetBuildingsBySiteId(this.filterForm.value.siteId).subscribe((res: any) => {
        this.builldingLookup = res.data || [];
      });
    }
  }

  hideFilterPopup() {
    this.showFilterPopup = false;
  }
  filterForm = this._fb.group({
    siteId: [],
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
    if (this.filterForm.value.siteId)
      this.filterDataParams.filterItems.push({
        key: 'SiteId',
        operator: 'equals',
        value: this.filterForm.value.siteId,
      });
    if (this.filterForm.value.buildingId)
      this.filterDataParams.filterItems.push({
        key: 'buildingId',
        operator: 'equals',
        value: this.filterForm.value.buildingId,
      });
    // if (this.filterForm.value.subUnitId)
    //   this.filterDataParams.filterItems.push({
    //     key: 'subUnitId',
    //     operator: 'equals',
    //     value: this.filterForm.value.subUnitId,
    //   });
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

    this.getAllMaintenanceRequest();
    this.showFilterPopup = false;
  }
  closePopupFilter() {
    this.filterForm.reset();
    // Reset buildings list to show all buildings
    this._sharedService.getAllBuilding().subscribe((res) => {
      this.builldingLookup = res.data;
    });
    this.filterDataParams.filterItems = [];
    this.isSearchingReasult = false;
    this.getAllMaintenanceRequest();
    this.showFilterPopup = false;
  }
  // ==========================================
  // DELETE Maintenance Request
  // ==========================================
  deleteId!: number;
  deleteMaintenanceRequest(id: number) {
    this.deleteId = id;
    this.alertConfirm = true;
  }
  alertConfirm: boolean = false;
  alertConfirmFun(value: boolean) {
    if (value) {
      this._maintenanceRequestsService
        .deleteMaintenanceRequest(this.deleteId)
        .subscribe((res) => {
          if (res.isSuccess) {
            this.alertConfirm = false;
            this.alertSuccessMsg =
              'تم حذف الطلب بنجاح من قائمة طلبات الصيانة، يمكنك المتابعة';
            this.alertSuccess = true;
            this.getAllMaintenanceRequest();
          } else {
            this.alertConfirm = false;
            this.alertErrorMsg = res.errors[0].message;
            this.alertError = true;
          }
        });
    } else {
      this.alertConfirm = false;
    }
  }

  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  sitesLookup: any[] = [];
  builldingLookup: any[] = [];
  buildingSubUnitLookup: any = [];
  visitRequestsStatusLookup: any = [];
  requestPrioretyLookup: any = [];
  primaryMaintenanceTypeLookup: any = [];
  secondaryMaintenanceTypeLookup: any = [];

  getSites() {
    this._sharedService.GetSites().subscribe((res: any) => {
      this.sitesLookup = res.data || [];
    });
  }

  onSiteChange(siteId: number) {
    // Reset building selection when site changes
    this.filterForm.patchValue({ buildingId: null });

    if (siteId) {
      // Filter buildings by selected site
      this._sharedService.GetBuildingsBySiteId(siteId).subscribe((res: any) => {
        this.builldingLookup = res.data || [];
      });
    } else {
      // If no site selected, show all buildings
      this._sharedService.getAllBuilding().subscribe((res) => {
        this.builldingLookup = res.data;
      });
    }
  }

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
    this._sharedService.getVisitRequestsStatus().subscribe((res) => {
      this.visitRequestsStatusLookup = res['data'];
    });
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

  // ===========================================
  // Route To ADD PAGE
  // ===========================================
  routeToAddPage() {
    this._router.navigate(['add'], { relativeTo: this._activatedRoute });
  }
  openEdit(id) {
    this._router.navigate(['edit', id], { relativeTo: this._activatedRoute });
  }
  showRequest(id) {
    this._router.navigate(['details', id], {
      relativeTo: this._activatedRoute,
    });
  }
  // -----------------------------------
  // ONINIT
  // -----------------------------------
  ngOnInit(): void {
    // GET ALL
    this.getAllMaintenanceRequest();
    // LOOKUPS
    this.getSites();
    this.getAllBuildingLookup();
    this.getVisitRequestsStatus();
    this.getRequestPriorety();
    this.getAllPrimaryMaintenanceType();
    // Initialize evaluation form
    this.initializeEvaluationForm();
    // COLUMN LIST
    this.cols = [
      new listColumns({ field: 'orderNumber', header: '#' }),
      new listColumns({ field: 'siteName', header: 'الموقع' }),

      new listColumns({ field: 'buildingName', header: 'المبنى الرئيسي' }),
      // new listColumns({ field: 'buildingSubUnitName', header: 'المبنى الفرعي'  }),
      // new listColumns({ field: 'assetName', header: 'رقم الأصل' }),
      new listColumns({ field: 'floorNumber', header: 'الطابق' }),
      new listColumns({ field: 'buildingOfficeName', header: 'الغرفة' }),
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

  // ====================================
  // SWEET ALERTS
  // ====================================
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertSuccessFun(value: boolean) {
    this.alertSuccess = false;
  }
  alertError: boolean = false;
  alertErrorMsg: string = '';
  alertErrorFun(value: boolean) {
    this.alertError = false;
  }

  // ====================================
  // NEW EVENTS
  // ====================================
  // ------------------
  // Recieve Request
  // ------------------
  recieveRequest(id: any) {
    this.currentRequestId = id;
    this.showReciveRequest = true;
  }
  onRecieveRequest() {
    this._maintenanceRequestsService
      .receiveRequest(this.currentRequestId)
      .subscribe((res) => {
        if (res.isSuccess) {
          this.showReciveRequest = false;
          this.alertSuccessMsg = 'تم تأكيد استلام الطلب بنجاح، يمكنك المتابعة';
          this.alertSuccess = true;
          this.getAllMaintenanceRequest();
        } else {
          this.showReciveRequest = false;
          this.alertErrorMsg = res.errors[0].message;
          this.alertError = true;
        }
      });
  }
  // ------------------------------
  // Add Review Request
  // ------------------------------
  reviewRequestForm = this._fb.group({
    note: [],
    reviewDate: [, Validators.required],
    reviewTime: [, Validators.required],
    fileUploads: this._fb.array([]),
  });
  get reviewRequestFormControll() {
    return this.reviewRequestForm.controls;
  }
  reviewRequest(id: any) {
    this.currentRequestId = id;
    this.uploadedFiles = [];
    this.reviewRequestForm.reset();
    this.showPreviewRequest = true;
  }
  onReviewRequest() {
    const obj = {
      maintenanceRequestId: this.currentRequestId,
      note: this.reviewRequestForm.value.note,
      previewDateTime:
        moment(new Date(this.reviewRequestForm.value.reviewDate)).format(
          'YYYY-MM-DD'
        ) +
        'T' +
        String(this.reviewRequestForm.value.reviewTime).slice(16, 21),
      fileUploads: this.uploadedFiles,
    };

    this._maintenanceRequestsService.requestPreview(obj).subscribe((res) => {
      if (res.isSuccess) {
        this.showPreviewRequest = false;
        this.alertSuccessMsg =
          'تمت إضافة طلب المعاينة بنجاح إلى طلب الصيانة، يمكنك المتابعة';
        this.alertSuccess = true;
        this.getAllMaintenanceRequest();
      } else {
        this.showPreviewRequest = false;
        this.alertErrorMsg = res.errors[0].message;
        this.alertError = true;
      }
    });
  }
  // ----------------------
  // Add Request Notes
  // ----------------------
  notesForm = this._fb.group({
    consultantNotes: ['', Validators.required],
  });
  get notesFormControll() {
    return this.notesForm.controls;
  }
  onAddRequestNotes() {
    const obj = { ...this.notesForm.value, id: this.currentRequestId };
    this._maintenanceRequestsService.addNotes(obj).subscribe((res) => {
      if (res.isSuccess) {
        this.showAddRequestNotes = false;
        this.alertSuccessMsg =
          'تمت إضافة الملاحظة بنجاح إلى طلب الصيانة، يمكنك المتابعة ';
        this.alertSuccess = true;
        this.getAllMaintenanceRequest();
      } else {
        this.showAddRequestNotes = false;
        this.alertErrorMsg = res.errors[0].message;
        this.alertError = true;
      }
    });
  }
  addRequestNotes(id: any) {
    this.currentRequestId = id;
    this.showAddRequestNotes = true;
    this.notesForm.reset();
  }

  // ------------------------------
  // Customize Preview
  // ------------------------------
  assignedEmployeeList: any[] = [];
  customizeForm = this._fb.group({
    note: [],
    assignedEmployeeId: ['', Validators.required],
  });
  get customizeFormControl() {
    return this.customizeForm.controls;
  }
  customizePreview(id: any) {
    this.currentRequestId = id;
    this.showCustomizePreview = true;
    this.customizeForm.reset();
    this._maintenanceRequestsService
      .getOfficeEmployeeByMaintenanceRequest(id)
      .subscribe((res) => {
        this.assignedEmployeeList = res.data;
      });
  }
  onCustomizePreview() {
    const obj = {
      maintenanceRequestId: this.currentRequestId,
      note: this.customizeForm.value.note,
      assignedEmployeeId: this.customizeForm.value.assignedEmployeeId,
    };
    this._maintenanceRequestsService.assignPreview(obj).subscribe((res) => {
      if (res.isSuccess) {
        this.showCustomizePreview = false;
        this.alertSuccessMsg = 'تم تخصيص معاينة الطلب بنجاح، يمكنك المتابعة';
        this.alertSuccess = true;
        this.getAllMaintenanceRequest();
      } else {
        this.showCustomizePreview = false;
        this.alertErrorMsg = res.errors[0].message;
        this.alertError = true;
      }
    });
  }
  // ------------------------------
  // Status Preview
  // ------------------------------

  statusPreviewForm = this._fb.group({
    isAccept: [true],
    note: [''],
    fileUploads: this._fb.array([]),
  });

  get statusPreviewFormControll() {
    return this.statusPreviewForm.controls;
  }
  statusPreview(id: any) {
    this.currentRequestId = id;
    this.statusPreviewForm.reset();
    this.uploadedFiles = [];
    this.showStatusPreview = true;
  }
  onStatusPreview() {
    const obj = {
      maintenanceRequestId: this.currentRequestId,
      isAccept: this.statusPreviewForm.value.isAccept,
      note: this.statusPreviewForm.value.note,
      fileUploads: this.uploadedFiles,
    };
    this._maintenanceRequestsService.statusPreview(obj).subscribe((res) => {
      if (res.isSuccess) {
        this.showStatusPreview = false;
        this.alertSuccessMsg = 'تم تعين حالة المعاينة بنجاح، يمكنك المتابعة';
        this.alertSuccess = true;
        this.getAllMaintenanceRequest();
      } else {
        this.showStatusPreview = false;
        this.alertErrorMsg = res.errors[0].message;
        this.alertError = true;
      }
    });
  }
  // ------------------------------
  // ------------------------------
  confirmStatusPreview(value: any) {
    this.currentRequestId = value.id;
    if (value.maintenanceRequestStatusId == 6) {
      this.showConfirmRefusePreview = true;
    } else if (value.maintenanceRequestStatusId == 8) {
      this.showConfirmAcceptPreview = true;
    }
  }

  onConfirmStatusPreview(value: boolean) {
    const obj = {
      id: this.currentRequestId,
      isConfirmed: value,
    };
    this._maintenanceRequestsService.confirmPreview(obj).subscribe((res) => {
      if (res.isSuccess) {
        this.showConfirmRefusePreview = false;
        this.showConfirmAcceptPreview = false;
        this.alertSuccessMsg = 'تم تأكيد حالة المعاينة بنجاح، يمكنك المتابعة';
        this.alertSuccess = true;
        this.getAllMaintenanceRequest();
      } else {
        this.showConfirmRefusePreview = false;
        this.showConfirmAcceptPreview = false;
        this.alertErrorMsg = res.errors[0].message;
        this.alertError = true;
      }
    });
  }

  CustomizeProcessing(id: any) {
    this.showCustomizeProcessing = true;
    this.customizeProcessingId = id;
    this._maintenanceRequestsService
      .getOfficeEmployeeByMaintenanceRequest(id)
      .subscribe((res) => {
        this.assignedEmployeeList = res.data;
      });
  }
  onCustomizeProcessing() {
    const obj = {
      maintenanceRequestId: this.customizeProcessingId,
      note: this.customizeForm.value.note,
      assignedEmployeeId: this.customizeForm.value.assignedEmployeeId,
    };
    this._maintenanceRequestsService.receiveRequest(obj).subscribe((res) => {
      if (res.isSuccess) {
        this.showCustomizeProcessing = false;
        this.alertSuccessMsg = 'تم تخصيص معالجة الطلب بنجاح، يمكنك المتابعة';
        this.alertSuccess = true;
        this.getAllMaintenanceRequest();
      } else {
        this.showCustomizeProcessing = false;
        this.alertErrorMsg = res.errors[0].message;
        this.alertError = true;
      }
    });
  }
  maintenanceToPart(event: any) {
    this._router.navigate(['buildings/parts-requests/create', event]);
  }
}
