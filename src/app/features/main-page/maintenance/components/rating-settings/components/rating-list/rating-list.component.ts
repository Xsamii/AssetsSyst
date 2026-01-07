import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceContractsService } from '../../../maintenance-contracts/services/maintenance-contracts.service';
import { Router } from '@angular/router';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { forkJoin } from 'rxjs';
import { RatingSettingsService } from '../../services/rating-settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.scss']
})
export class RatingListComponent {
  userRole = +localStorage.getItem('maintainanceRole');
  showBreadcrumb: boolean = true;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertFailureMessage: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertConfirmHardDelete: boolean = false;
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
    private _sharedService: SharedService,
    private surveyService: RatingSettingsService
  ) {
    this.initializeEvaluationForm();
  }

  ngOnInit(): void {
    this.getData();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'name', header: 'اسم مؤشر التقييم' }),
    ];
  }

  // =============================
  // NAVIGATION METHODS
  // =============================

  openEdit(id) {
    this._router.navigate(['maintenance/rating-settings/edit', id]);
  }

  // =============================
  // SEARCH AND FILTER METHODS
  // =============================
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getData();
  }

  routeToAddPage() {
    this._router.navigate(['maintenance/rating-settings/add']);
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
    this.surveyService
      .getAllSurvey(paganations, this.filterDataParams)
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

  deleteSurvey(event) {
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


  copyLink(id: any) {
  const fullUrl = `${environment.suveyUrl}survey/${id}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullUrl).then(() => {
      console.log('Copied!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  } else {
    // fallback للبيئات اللي مش داعمة clipboard API
    const textarea = document.createElement('textarea');
    textarea.value = fullUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    console.log('Copied with fallback!');
  }
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
      this.surveyService
        .deleteSurvey(this.projectId, false)
        .subscribe(
          (res) => {
            if (res.isSuccess) {
              this.alertConfirm = false;
              this.alertSuccess = true;
              this.alertSuccessMsg =
                'تم حذف مؤشر التقييم بنجاح من قائمة مؤشرات التقييم، يمكنك المتابعة';
              this.getData();
            } else {
              // Check if error code is 7068 (survey has answers)
              if (res.errors && res.errors[0]?.code === '7068') {
                this.alertConfirm = false;
                this.alertConfirmHardDelete = true;
              } else {
                this.alertConfirm = false;
                this.alertError = true;
                this.alertFailureMessage = res.errors[0].message;
              }
            }
          },
          (err) => {
            this.alertConfirm = false;
            this.alertError = true;
            this.alertFailureMessage = 'حدث خطأ أثناء الحذف، يرجى المحاولة مرة أخرى';
          }
        );
    } else {
      this.alertConfirm = false;
    }
  }

  // CONFIRM HARD DELETE (when survey has answers)
  alertConfirmHardDeleteFun(value) {
    if (value) {
      // User confirmed hard delete
      this.surveyService
        .deleteSurvey(this.projectId, true)
        .subscribe(
          (res) => {
            if (res.isSuccess) {
              this.alertConfirmHardDelete = false;
              this.alertSuccess = true;
              this.alertSuccessMsg =
                'تم حذف مؤشر التقييم بنجاح من قائمة مؤشرات التقييم، يمكنك المتابعة';
              this.getData();
            } else {
              this.alertConfirmHardDelete = false;
              this.alertError = true;
              this.alertFailureMessage = res.errors[0].message;
            }
          },
          (err) => {
            this.alertConfirmHardDelete = false;
            this.alertError = true;
            this.alertFailureMessage = 'حدث خطأ أثناء الحذف، يرجى المحاولة مرة أخرى';
          }
        );
    } else {
      // User cancelled hard delete
      this.alertConfirmHardDelete = false;
    }
  }

  // ERROR
  alertErrorFun(value) {
    if (value) {
      this.alertError = false;
    }
  }
}
