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
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { MainBuildingsService } from '../../main-buildings/services/main-buildings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceLogService } from './services/maintenance-log.service';
import { MaintenanceRequestsService } from 'src/app/features/main-page/maintenance/components/maintenance-requests/services/maintenance-requests.service';

@Component({
  selector: 'app-maintenance-log-for-asset',
  templateUrl: './maintenance-log-for-asset.component.html',
  styleUrls: ['./maintenance-log-for-asset.component.scss'],
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
export class MaintenanceLogForAssetComponent {
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  officesList;
  AssetTypeList;

  showBreadcrumb: boolean = true;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertFailureMessage: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  filterDataParams = new FilterDataParams();
  officeID: any;
  assetTypeId: any;
  assetId: number;
  assetName: string;
  searchValue!: string;
  maintenanceId: number;
  constructor(
    private router: Router,
    private _mainBuildingsService: MaintenanceLogService,
    private _sharedService: SharedService,
    private activcatedRoute: ActivatedRoute,
    private _maintenanceRequestsService: MaintenanceRequestsService
  ) { }

  ngOnInit() {
    this.filterDataParams.filterItems = [];
    this.assetName = this.activcatedRoute.snapshot.paramMap.get('assetName');
    this.activcatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.assetId = params['id'];
      }
    });
    this.getDropDowns();
    this.getData();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'requestId', header: ' رقم الطلب' }),
      new listColumns({
        field: 'createdAt',
        header: 'تاريخ المعالجة',
        isDate: true,
      }),
      new listColumns({ field: 'supervisorName', header: 'الإستشاري ' }),
      new listColumns({
        field: 'executableUserName',
        header: 'المقاول ',
      }),
      new listColumns({
        field: 'assetName',
        header: ' رقم الأصل ',
      }),
      new listColumns({
        field: 'assetTypeName',
        header: '  النظام ',
      }),
    ];
  }
  // ----------------------------------------
  // GET ALL
  // ----------------------------------------
  getData(paganations?: any) {
    if (this.assetId)
      this.filterDataParams.filterItems.push({
        key: 'AssetId',
        operator: 'equals',
        value: String(this.assetId),
      });
    this._mainBuildingsService
      .getAllMaintenanceLogs(paganations, this.filterDataParams)
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

  fillterByofficeid(event: any) {
    this.officeID = event;
    this.isSearchingReasult = true;
    if (this.officeID)
      this.filterDataParams.filterItems.push({
        key: 'officeID',
        operator: 'equals',
        value: String(this.officeID),
      });
    this.getData();
  }
  fillterByassetTypeid(event: any) {
    this.assetTypeId = event;
    this.isSearchingReasult = true;
    if (this.assetTypeId)
      this.filterDataParams.filterItems.push({
        key: 'assetTypeId',
        operator: 'equals',
        value: String(this.assetTypeId),
      });
    this.getData();
  }
  //=================================================
  // lockup
  //=================================================
  getDropDowns() {
    this.getoffices();
    this.getAssetsType();
  }

  getoffices() {
    this._sharedService.getOfficeList().subscribe((office) => {
      this.officesList = office.data;
    });
  }
  getAssetsType() {
    this._sharedService.getAllAssetTypes().subscribe((office) => {
      this.AssetTypeList = office.data;
    });
  }
  viewassetLog(event) {
    this.router.navigate(['/buildings/assets/maintenance-log-view', event]);
  }
  assetLogId: number;
  deleteAsset(event) {
    this.assetLogId = event;
    this.alertConfirm = true;
  }

  openAdd() {
    this.router.navigate(['/maintenance/maintenace-requests/addFromAssets', this.assetId]);
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
    //   if (value) {
    //     this._mainBuildingsService
    //       .deleteBuilding(this.assetId)
    //       .subscribe((res) => {
    //         if (res.isSuccess) {
    //           this.alertConfirm = false;
    //           this.alertSuccess = true;
    //           this.alertSuccessMsg =
    //             'تم حذف  الأصل بنجاح من قائمة  الأصول، يمكنك المتابعة';
    //           this.getData();
    //         } else {
    //           this.alertConfirm = false;
    //           this.alertError = true;
    //           this.alertFailureMessage = res.errors[0].message;
    //         }
    //       });
    //     this.getData();
    //   } else {
    //     this.alertConfirm = false;
    //   }
    // }
    // // ERROR
    // alertErrorFun(value) {
    //   if (value) {
    //     this.alertError = false;
    //   }
  }
}
