import { Component } from '@angular/core';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { SitesService } from './services/sites.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { CommonModule } from '@angular/common';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [
    CommonModule,
    BreadCrumbComponent,
    ListComponent,
    NoDataYetComponent,
    ReactiveFormsModule,
    SweetAlertMessageComponent,
    DropdownModule
  ],
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent {
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  builldingLookup: any = [];
  buildingSubUnitLookup: any = [];
  alertSuccess: boolean = false;
  displayDialog: boolean = false;
  searchForm: FormGroup;
  filterDataParams = new FilterDataParams();
  alertSuccessMsg: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  alertErrorMsg: string = 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
  constructor(
    private _sitesService: SitesService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) { }

  // -----------------------------------
  // FORM
  // -----------------------------------
  siteForm = this._fb.group({
    siteName: ['', Validators.required],
    uniqueNumber: ['', Validators.required],
    notes: [''],
  });
  get formControls() {
    return this.siteForm.controls;
  }


  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
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
  // ------------------------------------
  // GET ALL SITES
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  buildingIds: number[] = [];
  buildingSubUnitIds: number[] = [];
  showBreadcrumb: boolean = true;
  getAllSites(paganations?: any) {
    this._sitesService
      .getAllSites(paganations, this.searchValue, this.buildingSubUnitIds, this.buildingIds)
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
          this.showBreadcrumb = false;
        }
      );
  }
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getAllSites();
  }
  popupFilter() {
    this.isSearchingReasult = true;
    this.buildingIds = [];
    this.buildingSubUnitIds = [];
    if (this.searchForm.value.buildingId)
      this.buildingIds.push(this.searchForm.value.buildingId);

    if (this.searchForm.value.buildingSubUnitId)
      this.buildingSubUnitIds.push(this.searchForm.value.buildingSubUnitId);

    this.getAllSites();
    this.displayDialog = false;
  }
  showDialog() {
    this.displayDialog = true;
    this.initializeSearchForm();
  }
  initializeSearchForm() {
    this.searchForm = this._fb.group({
      buildingId: [],
      buildingSubUnitId: [],
    });
  }
  search() {
    this.popupFilter();
  }
  hideDialog() {
    this.searchForm.reset();
    this.displayDialog = false;
    this.popupFilter();
  }
  // ------------------------------------
  // UPDATE  SITE
  // ------------------------------------

  siteId: number = null;
  openAdd() {
    this.isEditMode = false;
    this.siteForm.reset();
    this.showAddEditPopup = true;
    this.siteId = null;
    this.buildingSubUnitLookup = [];
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.siteId = id;
    this._sitesService.getSiteById(id).subscribe((res) => {
      this.siteForm.patchValue({
        siteName: res.data.siteName,
        uniqueNumber: res.data.uniqueNumber,
        notes: res.data.notes,
      });
    });
  }
  OnSubmitData() {
    const obj = {
      id: this.siteId,
      siteName: this.siteForm.value.siteName,
      uniqueNumber: this.siteForm.value.uniqueNumber,
      notes: this.siteForm.value.notes,
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._sitesService.createSite(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.siteForm.reset();
          this.getAllSites();
          this.showAddEditPopup = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تمت إضافة الموقع بنجاح إلى قائمة المواقع، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    } else {
      // ---------FOR EDIT--------------
      this._sitesService.updateSite(obj).subscribe((res) => {
        this.siteForm.reset();
        this.getAllSites();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل الموقع بنجاح، يمكنك المتابعة';
      });
    }
  }
  // ------------------------------------
  // DELETE SITE
  // ------------------------------------
  confirmDelete(id) {
    this.siteId = id;
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
      this.showAddEditPopup = true;
      this.alertWarning = false;
    }
  }
  // CONFIRM
  alertConfirmFun(value) {
    if (value) {
      this._sitesService.deleteSite(this.siteId).subscribe((res) => {
        if (res.isSuccess) {
          this.getAllSites();
          this.alertError = false;
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تم حذف الموقع بنجاح من قائمة المواقع، يمكنك المتابعة';
          this.alertConfirm = false;

        } else {
          this.alertConfirm = false;
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
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

  onCloseAddEditePopup() {
    this.showAddEditPopup = false;
    this.alertWarning = true;
  }
  // ------------------------------------
  // ONINIT
  // ------------------------------------
  ngOnInit(): void {
    this.getAllSites();
    this.getAllBuildingLookup();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'name', header: 'اسم الموقع' }),
      new listColumns({ field: 'code', header: 'الرقم المميز' }),
      new listColumns({ field: 'notes', header: 'الملاحظات' }),
    ];
  }
}
