import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { MaintenancePlanService } from './services/maintenance-plan.service';
@Component({
  selector: 'app-maintenance-plan',
  templateUrl: './maintenance-plan.component.html',
  styleUrls: ['./maintenance-plan.component.scss'],
})
export class MaintenancePlanComponent implements OnInit {
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

  // -----------------------------------
  // CONSTRUCTOR
  // -----------------------------------
  constructor(
    private _maintenancePlanService: MaintenancePlanService,
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getAllMaintenancePlan();
    // COLUMN LIST
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'maintenanceTypeName', header: 'نوع الصيانة' }),
      new listColumns({ field: 'planMalfunctionTypeName', header: 'كود نوع العطل' }),
      new listColumns({ field: 'buildingName', header: 'المبني' }),
      new listColumns({ field: 'dateFrom', header: ' الفترة من', isDate:true }),
      new listColumns({ field: 'dateTo', header: 'الفترة الي', isDate:true }),
      new listColumns({ field: 'officeName', header: 'المقاول'}),
    ];
  }

  // --------------------------------------------
  // GET ALL Maintenance Request
  // --------------------------------------------
  getAllMaintenancePlan(paganations?: any) {
    this._maintenancePlanService
      .getAllList(paganations, this.filterDataParams)
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

  // ==========================================
  // DELETE Maintenance plan
  // ==========================================
  deleteId!: number;
  deleteMaintenancePlan(id: number) {
    this.deleteId = id;
    this.alertConfirm = true;
  }
  alertConfirm: boolean = false;
  alertConfirmFun(value: boolean) {
    if (value) {
      this._maintenancePlanService
        .deleteMaintenancePlan(this.deleteId)
        .subscribe((res) => {
          if (res.isSuccess) {
            this.alertConfirm = false;
            this.alertSuccessMsg =
              'تم حذف خطة الصيانة بنجاح من قائمة خطط الصيانة، يمكنك المتابعة';
            this.alertSuccess = true;
            this.getAllMaintenancePlan();
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

  //=================================================
  // FILTERS BY TEXT
  //=================================================
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    // this.getAllMaintenanceRequest();
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
}
