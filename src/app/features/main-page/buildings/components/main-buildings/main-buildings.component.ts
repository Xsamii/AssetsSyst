import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { MainBuildingsService } from './services/main-buildings.service';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import {
  FilterDataParams,
  SharedService,
} from 'src/app/Shared/services/shared.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GeoLoctionComponent } from 'src/app/Shared/components/geo-loction/geo-loction.component';

@Component({
  selector: 'app-main-buildings',
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
    ReactiveFormsModule, GeoLoctionComponent
  ],
  templateUrl: './main-buildings.component.html',
  styleUrls: ['./main-buildings.component.scss'],
})
export class MainBuildingsComponent {
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  executiveList;
  sitesList: any[] = [];
  mainBuildingsList: any[] = [];
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
  showAddEditPopup: boolean = false
  // items = [
  //   { label: 'الرئيسية', routerLink: '/' },
  //   { label: 'إدارة الأصول', routerLink: '/buildings' },
  //   { label: 'المباني', routerLink: '/buildings/main-buildings' },
  // ];
  constructor(
    private router: Router,
    private _mainBuildingsService: MainBuildingsService,
    private _sharedService: SharedService,
    private _formBuilder: FormBuilder
  ) { }

  openAdd() {
    this.router.navigate(['buildings/main-buildings/add']);
  }

  // ----------------------------------------
  // GET ALL
  // ----------------------------------------
  searchValue!: string;
  getData(paganations?: any) {
    this._mainBuildingsService
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

  showDialog() {
    this.displayDialog = true;
    // this.searchForm.reset()
    this.initializeSearchForm();
    this.getDropDowns();
  }
  OnSubmitData() {
    this.popupFilter();
  }
  initializeSearchForm() {
    this.searchForm = this._formBuilder.group({
      siteId: [],
      buildingId: [],
      executiveProjectId: [],
    });
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
      this.filterDataParams.filterItems.push({
        key: 'SiteId',
        operator: 'equals',
        value: String(this.searchForm.value.siteId),
      });
    if (this.searchForm.value.buildingId)
      this.filterDataParams.filterItems.push({
        key: 'Id',
        operator: 'equals',
        value: String(this.searchForm.value.buildingId),
      });
    if (this.searchForm.value.executiveProjectId)
      this.filterDataParams.filterItems.push({
        key: 'ExecutableProjectId',
        operator: 'equals',
        value: String(this.searchForm.value.executiveProjectId),
      });

    this.getData();
    this.displayDialog = false;
  }

  onSiteChange(siteId: number) {
    // Reset building selection when site changes
    this.searchForm.patchValue({ buildingId: null });

    if (siteId) {
      // Filter buildings by selected site
      this._sharedService.GetBuildingsBySiteId(siteId).subscribe((res: any) => {
        this.mainBuildingsList = res.data || [];
      });
    } else {
      // If no site selected, show all buildings
      this._sharedService.getAllBuilding().subscribe((res) => {
        this.mainBuildingsList = res['data'];
      });
    }
  }
  hideDialog() {
    this.searchForm.reset();
    this.displayDialog = false;
    this.popupFilter();
  }

  openEdit(event) {
    this.router.navigate(['/buildings/main-buildings/edit', event]);
  }
  mainBuildingId: number;
  deleteBuilding(event) {
    this.mainBuildingId = event;
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
      this._mainBuildingsService
        .deleteBuilding(this.mainBuildingId)
        .subscribe((res) => {
          if (res.isSuccess) {
            this.alertConfirm = false;
            this.alertSuccess = true;
            this.alertSuccessMsg =
              'تم حذف المبنى بنجاح من قائمة المباني، يمكنك المتابعة';
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
  getDropDowns() {
    this._sharedService.GetSites().subscribe((res: any) => {
      this.sitesList = res.data || [];
    });
    this._sharedService.getAllBuilding().subscribe((res) => {
      this.mainBuildingsList = res['data'];
    });
    this._sharedService.getMaintenanceExecutiveProjects().subscribe((res) => {
      this.executiveList = res['data'];
    });
  }
  openLink(event) {
    window.open(event.urlBuilding3D, '_blank');
  }

  ngOnInit() {
    this.getData();
    this.cols = [
      new listColumns({ field: 'orderNumber', header: '#' }),
      new listColumns({ field: 'name', header: 'اسم المبني' }),
      new listColumns({ field: 'buildingCode', header: 'كود المبني' }),
      new listColumns({ field: 'siteName', header: 'الموقع' }),
      new listColumns({ field: 'floorsNumber', header: 'عدد الطوابق' }),
      new listColumns({
        field: 'executableProjectName',
        header: 'عقد الصيانة',
      }),
    ];
  }
  showDailog() {
    this.showAddEditPopup = true
  }
}
