import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { AssetsService } from './assets.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
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
    ReactiveFormsModule,
  ],
})
export class AssetsComponent {
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  mainBuildingsList;
  subUnitsList;
  floorsList;
  officesList;
  typeAssetList;
  assetStatusList;
  sitesLookup: any[] = [];

  displayDialog: boolean = false;
  showBreadcrumb: boolean = true;
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertFailureMessage: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  searchForm: FormGroup;
  filterDataParams = new FilterDataParams();
  assetId: number;
  searchValue!: string;

  constructor(
    private router: Router,
    private _assetService: AssetsService,
    private _sharedService: SharedService,
    private _formBuilder: FormBuilder
  ) { }
  ngOnInit() {
    this.initializeSearchForm();

    this.assetStatusList = [
      {
        status: true,
        name: 'يعمل',
      },
      {
        status: false,
        name: ' لا يعمل',
      },
    ];

    this.getData();
    this.getSitesLookup();

    this.getAssetTypeLookUp();
    this.getBulldingLookUp();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'name', header: 'رقم الأصل' }),
      new listColumns({ field: 'notes', header: 'اسم الأصل' }),
      new listColumns({
        field: 'siteName',
        header: 'اسم الموقع ',
      }),
      new listColumns({
        field: 'buildingName',
        header: 'المبني الرئيسي',
      }),
      // new listColumns({ field: 'unitName', header: 'المبنى الفرعي' }),
      new listColumns({ field: 'floorName', header: 'الطابق ' }),
      new listColumns({
        field: 'officeName',
        header: ' الغرفة ',
      }),
      new listColumns({
        field: 'typeName',
        header: ' النظام ',
      }),
      new listColumns({
        field: 'categoryName',
        header: ' التصنيف الرئيسي ',
      }),
      new listColumns({
        field: 'subCategoryName',
        header: ' التصنيف الفرعي ',
      }),
    ];
  }
  openAdd() {
    this.router.navigate(['buildings/assets/add']);
  }

  openEdit(event) {
    this.router.navigate(['/buildings/assets/edit', event]);
  }
  openmaintenancelog(event) {
    let assetName = this.values.find((item) => item.id === Number(event));


    this.router.navigate([
      '/buildings/assets/maintenance-log-for-asset',
      event,
      assetName.name,
    ]);
  }
  openmaintenanceinspectionlog(event) {
    let assetName = this.values.find((item) => item.id === Number(event));
    this.router.navigate([
      '/buildings/assets/maintenance-inspection-log',
      event,
      assetName.name,
    ]);
  }

  viewMap(event) {
    console.log(event);

    const selectedAsset = this.values.find((item) => item.id === event);
    const assetIdentificationNumber = selectedAsset?.name || event;

    this.router.navigate(['/map'], {
      queryParams: { assetId: assetIdentificationNumber },
    });
  }
  getData(paganations?: any) {
    this._assetService.getAllList(paganations, this.filterDataParams).subscribe(
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
  // initialize form
  // ----------------------------------------
  initializeSearchForm() {
    this.searchForm = this._formBuilder.group({
      unitId: [],
      siteId: [],
      buildingId: [],
      floorId: [],
      officeId: [],
      typeAssetId: [],
      isWorking: [],
    });
  }

  //=================================================
  // FILTERING
  //=================================================

  showDialog() {
    this.displayDialog = true;
    // If a site is already selected, load buildings for that site
    if (this.searchForm.value.siteId) {
      this._sharedService.GetBuildingsBySiteId(this.searchForm.value.siteId).subscribe({
        next: (res: any) => {
          this.mainBuildingsList = res.data || [];
        }
      });
    }
    // If a building is already selected, load floors for that building
    if (this.searchForm.value.buildingId) {
      this.getFloorLookUp(this.searchForm.value.buildingId);
    }
    // If a floor is already selected, load offices for that floor
    if (this.searchForm.value.floorId) {
      this._sharedService.getOfficesInFloor(this.searchForm.value.floorId).subscribe((res) => {
        this.officesList = res.data;
      });
    }
  }

  filterBySearchTesxt(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getData();
  }
  popupFilter() {
    this.isSearchingReasult = true;
    this.filterDataParams.filterItems = [];
    if (this.searchForm.value.siteId)
      this.filterDataParams.SiteIds = this.searchForm.value.siteId;

    if (this.searchForm.value.buildingId)
      this.filterDataParams.BuildingIds = this.searchForm.value.buildingId;

    if (this.searchForm.value.floorId)
      this.filterDataParams.FloorIds = this.searchForm.value.floorId;

    if (this.searchForm.value.officeId)
      this.filterDataParams.OfficeIds = this.searchForm.value.officeId;
    if (this.searchForm.value.typeAssetId)
      this.filterDataParams.AssetTypeIds = this.searchForm.value.typeAssetId;
    // Fix: Check for undefined/null instead of truthy value since false is a valid filter value
    if (this.searchForm.value.isWorking !== undefined && this.searchForm.value.isWorking !== null)
      this.filterDataParams.IsWorking = this.searchForm.value.isWorking;

    this.getData();
    this.displayDialog = false;
  }
  hideDialog() {
    this.displayDialog = false;
  }

  resetFilter() {
    this.searchForm.reset();
    // Reset buildings list to show all buildings
    this._sharedService.getAllBuilding().subscribe((res) => {
      this.mainBuildingsList = res.data;
    });
    this.floorsList = [];
    this.officesList = [];
    // Reset filter params
    this.filterDataParams.SiteIds = undefined;
    this.filterDataParams.BuildingIds = undefined;
    this.filterDataParams.FloorIds = undefined;
    this.filterDataParams.OfficeIds = undefined;
    this.filterDataParams.AssetTypeIds = undefined;
    this.filterDataParams.IsWorking = undefined;
    this.filterDataParams.filterItems = [];
    this.isSearchingReasult = false;
    this.getData();
    this.displayDialog = false;
  }

  OnSubmitData() {
    this.popupFilter();
  }

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
      this._assetService.deleteAsset(this.assetId).subscribe((res) => {
        if (res.isSuccess) {
          this.alertConfirm = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تم حذف  الأصل بنجاح من قائمة  الأصول، يمكنك المتابعة';
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

  // ------------------------------------
  // LookUps
  // ------------------------------------
  getAssetTypeLookUp() {
    this._sharedService.getAllAssetTypes().subscribe((res) => {
      this.typeAssetList = res.data;
    });
  }

  getBulldingLookUp() {
    this._sharedService.getAllBuilding().subscribe((res) => {
      this.mainBuildingsList = res.data;
    });
  }
  changeBulding(id) {
    this.getFloorLookUp(id.value);
  }
  changeFloor(id) {
    console.log(id);

    this._sharedService.getOfficesInFloor(id.value).subscribe((res) => {
      this.officesList = res.data;
    });
  }

  // getSubunitLookUp(id) {
  //   this._sharedService.getAllBuildingSubUnit(id).subscribe((res) => {
  //     this.subUnitsList = res.data;
  //   });
  // }
  // changeSubUnit(id) {
  //   this.getFloorLookUp(id.value);
  // }

  getFloorLookUp(id) {
    this._sharedService.GetBuildingFloors(id).subscribe((res) => {
      this.floorsList = res.data;
    });
  }
  onFilterSiteChange(siteId: number): void {
    this.floorsList = [];
    this.mainBuildingsList = [];
    this.searchForm.patchValue({ buildingId: null, floorId: null, officeId: null });

    if (siteId) {
      this._sharedService.GetBuildingsBySiteId(siteId).subscribe({
        next: (res: any) => {
          this.mainBuildingsList = res.data || [];
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this._sharedService.getAllBuilding().subscribe({
        next: (res) => {
          this.mainBuildingsList = res.data || [];
        },
        error: (err) => this.handleError(err)
      });
    }
  }
  getSitesLookup(): void {
    this._sharedService.GetSites().subscribe({
      next: (res) => {
        this.sitesLookup = res.data || [];
      },
      error: (err) => this.handleError(err)
    });
  }
  private handleError(error: any): void {
    console.error('Error occurred:', error);
    this.alertError = true;
    // this.alertErrorMsg = error?.error?.message || error?.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى';
    // this.isLoading = false;
    // this.isLoadingFloors = false;
  }

}
