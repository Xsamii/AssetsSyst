import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { MaintenanceInspectionLogService } from './maintenance-inspection-log.service';

@Component({
  selector: 'app-maintenance-inspection-log',
  templateUrl: './maintenance-inspection-log.component.html',
  styleUrls: ['./maintenance-inspection-log.component.scss'],
  standalone: true,
  imports: [
    NoDataYetComponent,
    ListComponent,
    DropdownModule,
    DialogModule,
    CommonModule,
    BreadcrumbModule,
    BreadCrumbComponent,
    SweetAlertMessageComponent,
  ],
})
export class MaintenanceInspectionLogComponent {
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  showBreadcrumb: boolean = true;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertFailureMessage: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  filterDataParams = new FilterDataParams();
  id: number;
  constructor(
    private router: Router,
    private _sharedService: SharedService,
    private _MaintenanceInspectionLog: MaintenanceInspectionLogService,
    private _route: ActivatedRoute
  ) {}

  // ----------------------------------------
  // GET ALL
  // ----------------------------------------
  searchValue!: string;
  getData(paganations?: any) {
    this.filterDataParams.filterItems = [];
    if (this.id)
      this.filterDataParams.filterItems.push({
        key: 'AssetId',
        operator: 'equals',
        value: String(this.id),
      });
    this._MaintenanceInspectionLog
      .getAllList(paganations, this.filterDataParams)
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

  //=================================================
  // FILTERING
  //=================================================

  filterBySearchTesxt(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getData();
  }

  viewassetLog(event) {
    this.router.navigate(
      ['/buildings/assets/maintenance-inspection-log-view', event],
      { queryParams: { returnUrl: this.router.url } }
    );
  }
  assetId: number;
  deleteAsset(event) {
    this.assetId = event;
    this.alertConfirm = true;
  }

  // ------------------------------------
  // SWEET ALERTS
  // ------------------------------------
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
      // this.showAddEditPopup = true;
      this.alertWarning = false;
    }
  }
  // CONFIRM
  alertConfirmFun(value) {
    if (value) {
      this._MaintenanceInspectionLog
        .deleteMaintenanceInspectionLog(this.assetId)
        .subscribe((res) => {
          if (res.isSuccess) {
            this.alertConfirm = false;
            this.alertSuccess = true;
            this.alertSuccessMsg =
              'تم حذف   سجل الكشف الدوري للصيانة بنجاح  ,       يمكنك المتابعة';
            this.getData();
          } else {
            this.alertConfirm = false;
            this.alertError = true;
            this.alertFailureMessage = res.errors[0].message;
          }
        });
      this.getData();
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

  ngOnInit() {
    this.id = Number(this._route.snapshot.paramMap.get('id'));
    this.assetName = this._route.snapshot.paramMap.get('assetName');

    this.getData();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'assetName', header: '  رقم الأصل' }),
      new listColumns({
        field: 'isChecked',
        header: ' حالة الكشف',
        isChecked: true,
      }),
      new listColumns({
        field: 'checkDate',
        header: 'تاريخ الكشف ',
        isDate: true,
      }),
      new listColumns({
        field: 'contractorName',
        header: 'المقاول ',
      }),
      new listColumns({
        field: 'maintenanceItems',
        header: ' عناصر الصيانة  ',
      }),
    ];
  }
  assetName: string;
  openAdd() {
    this.router.navigate(['buildings/assets/add-maintenance-inspection-log'], {
      queryParams: {
        returnUrl: this.router.url,
        assetName: this.assetName,
        assetId: this.id,
      },
    });
  }
  openEdit(event) {
    this.router.navigate(
      ['buildings/assets/edit-maintenance-inspection-log', event],
      { queryParams: { returnUrl: this.router.url } }
    );
  }
}
