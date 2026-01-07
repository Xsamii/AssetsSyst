import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { MaintenanceContractsService } from './services/maintenance-contracts.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-maintenance-contracts',
  templateUrl: './maintenance-contracts.component.html',
  styleUrls: ['./maintenance-contracts.component.scss'],
})
export class MaintenanceContractsComponent {
  userRole = +localStorage.getItem('maintainanceRole');
  showBreadcrumb: boolean = true;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertFailureMessage: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  values: any[] = [];
  totalPageCount!: number;
  filterDataParams = new FilterDataParams();
  searchValue!: string;
  projectId;
  displayDialog: boolean = false;
  searchForm: FormGroup;

  // Evaluation Dialog Properties
  showEvaluationDialog: boolean = false;
  selectedContract: any = null;
  selectedContractId: number = null;
  evaluationTerms: any[] = [];
  evaluationForm: FormGroup = new FormGroup({});
  ratings: number[] = [];
  hoverRating: number[] = [];
  isLoadingEvaluation: boolean = false;
  saveTimeout: any; // For auto-save delay

  // Dropdown data
  projectTypeList: any[] = [];
  projectOrginList: any[] = [];
  projectClassificationList: any[] = [];
  projectStatusList: any[] = [];
  officeList: any[] = [];
  projectManagerList: any[] = [];

  constructor(
    private _maintenanceContractsService: MaintenanceContractsService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService
  ) {
    this.initializeEvaluationForm();
  }

  ngOnInit(): void {
    this.getData();
    this.cols = [
      new listColumns({ field: 'orderNumber', header: '#' }),
      new listColumns({ field: 'contractName', header: 'الاسم ' }),
      new listColumns({ field: 'projectTypeName', header: 'النوع' }),
      new listColumns({ field: 'contractValue', header: 'القيمة ' }),
      new listColumns({
        field: 'batchesCount',
        header: 'المستخلصات ',
        isCurrency: true,
      }),
    ];
  }

  // =============================
  // NAVIGATION METHODS
  // =============================
  openAdd() {
    this._router.navigate(['maintenance/maintenance-contracts/add']);
  }

  openEdit(id) {
    this._router.navigate(['maintenance/maintenance-contracts/edit', id]);
  }

  // =============================
  // SEARCH AND FILTER METHODS
  // =============================
  filterBySearchTesxt(value) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getData();
  }

  showDialog() {
    this.displayDialog = true;
    this.initializeSearchForm();
    this.getDropDowns();
  }

  hideDialog() {
    this.displayDialog = false;
    this.filterDataParams.filterItems = [];
    this.getData();
  }

  initializeSearchForm() {
    this.searchForm = this._formBuilder.group({
      ProjectTypeId: [],
      ProjectClassificationId: [],
      ProjectStatueId: [],
      OfficeId: [],
      ProjectManagerId: [],
    });
  }

  OnSubmitData() {
    this.popupFilter();
  }

  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];

    if (this.searchForm.value.ProjectTypeId)
      this.filterDataParams.filterItems.push({
        key: 'ProjectTypeId',
        operator: 'equals',
        value: String(this.searchForm.value.ProjectTypeId),
      });

    if (this.searchForm.value.ProjectClassificationId)
      this.filterDataParams.filterItems.push({
        key: 'ProjectClassificationId',
        operator: 'equals',
        value: String(this.searchForm.value.ProjectClassificationId),
      });

    if (this.searchForm.value.ProjectStatueId)
      this.filterDataParams.filterItems.push({
        key: 'ProjectStatueId',
        operator: 'equals',
        value: String(this.searchForm.value.ProjectStatueId),
      });

    if (this.searchForm.value.OfficeId)
      this.filterDataParams.filterItems.push({
        key: 'OfficeId',
        operator: 'equals',
        value: String(this.searchForm.value.OfficeId),
      });

    if (this.searchForm.value.ProjectManagerId)
      this.filterDataParams.filterItems.push({
        key: 'ProjectManagerId',
        operator: 'equals',
        value: String(this.searchForm.value.ProjectManagerId),
      });

    this.getData();
    this.displayDialog = false;
  }

  // =============================
  // DATA METHODS
  // =============================
  getData(paganations?: any) {
    this._maintenanceContractsService
      .getAllProjectsList(paganations, this.filterDataParams)
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

  deleteProject(event) {
    this.projectId = event;
    this.alertConfirm = true;
  }

  // =============================
  // DROPDOWN METHODS
  // =============================
  getDropDowns() {
    forkJoin({
      projectTypeReq: this._sharedService.getProjectType(),
      projectClassificationReq: this._sharedService.getProjectClassifications(),
      projectStatusReq: this._sharedService.getProjectStatus(),
    }).subscribe(
      ({
        projectTypeReq,
        projectClassificationReq,
        projectStatusReq,
      }) => {
        this.projectTypeList = projectTypeReq.data;
        this.projectClassificationList = projectClassificationReq.data;
        this.projectStatusList = projectStatusReq.data;
      }
    );
  }

  getOfficesByProjectType(event) {
    this._sharedService.getOfficesByType(event).subscribe(res => {
      this.officeList = res.data;
    });
  }

  getAllProjectManagersByOfficeId(event) {
    this._sharedService
      .getProjectManagersByOfficeId(event)
      .subscribe((data) => {
        this.projectManagerList = data.data;
      });
  }

  // =============================
  // EVALUATION METHODS
  // =============================

  // Initialize Evaluation Form
  initializeEvaluationForm() {
    this.evaluationForm = this._formBuilder.group({});
  }

  // Open Evaluation Dialog
  openEvaluation(id: any) {
    this.selectedContractId =  id;
    this.showEvaluationDialog = true;
    this.isLoadingEvaluation = true;

    // Load evaluation terms for this contract
    this.loadEvaluationTerms();
  }

  // Load Evaluation Terms from API
  loadEvaluationTerms() {
    this._maintenanceContractsService
      .getEvaluationTermForCOntract(this.selectedContractId)
      .subscribe(
        (response) => {
          this.isLoadingEvaluation = false;
          if (response.isSuccess) {
            this.evaluationTerms = response.data || [];
            this.initializeRatings();
            this.buildEvaluationForm();
          } else {
            this.alertError = true;
            this.alertFailureMessage = 'فشل في تحميل معايير التقييم';
            this.evaluationTerms = [];
          }
        },
        (error) => {
          this.isLoadingEvaluation = false;
          this.alertError = true;
          this.alertFailureMessage = 'خطأ في الاتصال بالخادم';
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

    this.evaluationForm = this._formBuilder.group(formControls);
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
        id: this.selectedContractId,
        termRates: this.evaluationTerms.map((term, index) => ({
          rate: this.ratings[index] || 0,
          termsId: term.id
        }))
      };

      // Check if this is a new evaluation or edit - using 'rate' field
      const hasExistingRating = this.evaluationTerms.some(term => term.rate && term.rate > 0);

      const apiCall = hasExistingRating
        ? this._maintenanceContractsService.editContrateEvaluation(evaluationData)
        : this._maintenanceContractsService.addContrateEvaluation(evaluationData);

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

  // Submit Evaluation
  submitEvaluation() {
    if (this.evaluationForm.valid && this.evaluationTerms.length > 0) {
      // Use the correct API body format
      const evaluationData = {
        id: this.selectedContractId,
        termRates: this.evaluationTerms.map((term, index) => ({
          rate: this.ratings[index] || 0,
          termsId: term.id
        }))
      };

      // Check if this is a new evaluation or edit - using 'rate' field
      const hasExistingRating = this.evaluationTerms.some(term => term.rate && term.rate > 0);

      const apiCall = hasExistingRating
        ? this._maintenanceContractsService.editContrateEvaluation(evaluationData)
        : this._maintenanceContractsService.addContrateEvaluation(evaluationData);

      apiCall.subscribe(
        (response) => {
          if (response.isSuccess) {
            this.closeEvaluationDialog();
            this.alertSuccess = true;
            this.alertSuccessMsg = 'تم حفظ التقييم بنجاح';
            this.getData(); // Refresh the list
          } else {
            this.alertError = true;
            this.alertFailureMessage = response.errors?.[0]?.message || 'فشل في حفظ التقييم';
          }
        },
        (error) => {
          this.alertError = true;
          this.alertFailureMessage = 'خطأ في الاتصال بالخادم';
        }
      );
    } else {
      // Mark all fields as touched to show validation errors (if any)
      Object.keys(this.evaluationForm.controls).forEach(key => {
        this.evaluationForm.get(key)?.markAsTouched();
      });
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
    this.selectedContract = null;
    this.selectedContractId = null;
    this.evaluationTerms = [];
    this.ratings = [];
    this.hoverRating = [];
    this.isLoadingEvaluation = false;
    this.evaluationForm = this._formBuilder.group({});
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

  // =============================
  // SWEET ALERTS METHODS
  // =============================

  // SUCCESS
  alertSuccessFun(value) {
    if (value) {
      this.alertSuccess = false;
    }
  }

  // WARNING
  alertWarningFun(value) {
    if (value) {
      this.alertWarning = false;
    } else {
      this.alertWarning = false;
    }
  }

  // CONFIRM
  alertConfirmFun(value) {
    if (value) {
      this._maintenanceContractsService
        .deleteProject(this.projectId)
        .subscribe((res) => {
          if (res.isSuccess) {
            this.alertConfirm = false;
            this.alertSuccess = true;
            this.alertSuccessMsg =
              'تم حذف عقد الصيانة بنجاح من قائمة عقود الصيانة، يمكنك المتابعة';
            this.getData();
          } else {
            this.alertConfirm = false;
            this.alertError = true;
            this.alertFailureMessage = res.errors[0].message;
          }
        });
    } else {
      this.alertConfirm = false;
    }
  }

  // ERROR
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
}
