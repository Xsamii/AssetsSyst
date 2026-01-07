import { Component } from '@angular/core';
import { EvaluationSettingsService } from './services/evaluation-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-evaluation-settings',
  templateUrl: './evaluation-settings.component.html',
  styleUrls: ['./evaluation-settings.component.scss'],
})
export class EvaluationSettingsComponent {
  // --------------------------------
  // VALUES
  // --------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  showBreadcrumb: boolean = true;
  alertConfirm: boolean = false;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  alertSuccessMsg: string = '';
  alertErrorMsg: string = '';
  filterDataParams = new FilterDataParams();
  totalCount: number;

  // Dropdown Lists
  durationsList: any[] = [];
  planTypesList: any[] = [];

  // --------------------------------
  // SWEET ALERTS FUNCTIONS
  // --------------------------------

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
  alertConfirmFun(value) {
    if (value) {
      this._evaluationSettingsService.deleteEvaluationSetting(this.currentId).subscribe((res) => {
        if (res.isSuccess) {
          this.alertConfirm = false;
          this.alertSuccessMsg =
            'تم حذف بند التقييم بنجاح من قائمة بنود التقييم، يمكنك المتابعة';
          this.alertSuccess = true;
          this.getAllEvaluationSettings();
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
  // --------------------------------
  // CONSTRUCTOR
  // --------------------------------
  constructor(
    private _evaluationSettingsService: EvaluationSettingsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _sharedService: SharedService
  ) {}
  // ------------------------------------
  // GET ALL Evaluation Settings
  // ------------------------------------
  getAllEvaluationSettings(paganations?: any) {
    this._evaluationSettingsService
      .getAllEvaluationSettings(paganations, this.filterDataParams)
      .subscribe(
        (data) => {
          // Map the response to display format
          this.values = data.data.items

          // this.totalCount = data.data.totalCount;

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
          this.alertErrorMsg =
            'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
          this.alertError = true;
          this.showBreadcrumb = false;

        }
      );
  }
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams.searchTerm = value;
    this.getAllEvaluationSettings();
  }

  // --------------------------------
  // FILTER BY DROPDOWNS
  // --------------------------------
  getDropDowns() {
    forkJoin({
      durationsReq: this._sharedService.Getperiodss(),
      planTypesReq: this._sharedService.GetmaintPlanTypeForEves()
    }).subscribe(({ durationsReq, planTypesReq }: any) => {
      this.durationsList = durationsReq.data;
      this.planTypesList = planTypesReq.data;

      // Fetch evaluation settings after dropdowns are loaded
      this.getAllEvaluationSettings();
    });
  }

  filterByDurationId(durationId: any) {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];
    if (durationId) {
      console.log(durationId);

      this.filterDataParams.filterItems.push({
        key: 'periodId',
        operator: 'equals',
        value: durationId,
      });
    }
    this.getAllEvaluationSettings();
  }

  filterByPlanTypeId(planTypeId: any) {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = []
    if (planTypeId) {
      console.log(planTypeId);

      this.filterDataParams.filterItems.push({
        key: 'maintTypeId',
        operator: 'equals',
        value: planTypeId,
      });
    }
    this.getAllEvaluationSettings();
  }

  // --------------------------------
  // ON ADD Evaluation Setting
  // --------------------------------
  openAdd() {
    this._router.navigate(['add'], { relativeTo: this._activatedRoute });
  }
  // --------------------------------
  // ON EDIT Evaluation Setting
  // --------------------------------
  openEdit(id: number) {
    this._router.navigate(['edit', id], { relativeTo: this._activatedRoute });
  }
  // --------------------------------
  // DELETE Evaluation Setting
  // --------------------------------
  currentId!: number;
  confirmDelete(id: number) {
    this.currentId = id;
    this.alertConfirm = true;
  }
  // --------------------------------
  // ONINIT
  // --------------------------------
  ngOnInit(): void {
    this.getDropDowns();
    this.cols = [
      new listColumns({ field: 'orderNumber', header: '#' }),
      new listColumns({ field: 'maintTypeName', header: 'نوع خطة الصيانة' }),
      new listColumns({ field: 'periodName', header: 'المدة' }),
      // new listColumns({ field: 'termsString', header: 'البنود' }),

    ];
  }
}
