import { GetAllSubUnits } from './../sub-units/model/model';
import { Component } from '@angular/core';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { FloorsService } from './services/floors.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { CommonModule } from '@angular/common';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-floors',
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
  templateUrl: './floors.component.html',
  styleUrls: ['./floors.component.scss']
})
export class FloorsComponent {
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  sitesLookup: any = [];
  builldingLookup: any = [];
  addEditBuildingLookup: any = [];
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
    private _floorsService: FloorsService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) { }

  // -----------------------------------
  // FORM
  // -----------------------------------
  floorForm = this._fb.group({
    floorNumber: ['', Validators.required],
    siteId: [null, Validators.required],
    buildingId: [null, Validators.required],
  });
  get formControls() {
    return this.floorForm.controls;
  }


  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  getSitesLookup() {
    this._sharedService.GetSites().subscribe((res) => {
      this.sitesLookup = res.data;
    });
  }
  getAllBuildingLookup() {
    this._sharedService.getAllBuilding().subscribe((res) => {
      this.builldingLookup = res.data;
      this.addEditBuildingLookup = res.data;
    });
  }
  // For filter dialog - load buildings by site
  onFilterSiteChange(siteId: number) {
    if (siteId) {
      this._sharedService.GetBuildingsBySiteId(siteId).subscribe((res: any) => {
        this.builldingLookup = res.data || [];
      });
    } else {
      this._sharedService.getAllBuilding().subscribe((res) => {
        this.builldingLookup = res.data;
      });
    }
    this.searchForm.patchValue({ buildingId: null });
  }
  // For add-edit dialog - load buildings by site
  onAddEditSiteChange(siteId: number) {
    if (siteId) {
      this._sharedService.GetBuildingsBySiteId(siteId).subscribe((res: any) => {
        this.addEditBuildingLookup = res.data || [];
      });
    } else {
      this._sharedService.getAllBuilding().subscribe((res) => {
        this.addEditBuildingLookup = res.data;
      });
    }
    this.floorForm.patchValue({ buildingId: null });
  }
  getAllBuildingSubUnit(id: number) {
    this._sharedService.getAllBuildingSubUnit(id).subscribe((res) => {
      this.buildingSubUnitLookup = res.data;
    });
  }
  // ------------------------------------
  // GET ALL FLOOORS
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  buildingIds: number[] = [];
  SiteIds: number[] = [];
  showBreadcrumb: boolean = true;
  getAllFloors(paganations?: any) {
    this._floorsService
      .getAllFloors(paganations, this.searchValue, this.SiteIds, this.buildingIds)
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
  filterBySearchText(value: string) {
    this.searchValue = value;
    this.isSearchingReasult = true;
    this.filterDataParams!.searchTerm = value;
    this.getAllFloors();
  }
  popupFilter() {
    this.isSearchingReasult = true;
    this.buildingIds = [];
    this.SiteIds = [];
    if (this.searchForm.value.buildingId)
      this.buildingIds.push(this.searchForm.value.buildingId);

    if (this.searchForm.value.siteId)
      this.SiteIds.push(this.searchForm.value.siteId);

    this.getAllFloors();
    this.displayDialog = false;
  }
  showDialog() {
    this.displayDialog = true;
    // If a site is already selected, load buildings for that site
    if (this.searchForm.value.siteId) {
      this._sharedService.GetBuildingsBySiteId(this.searchForm.value.siteId).subscribe((res: any) => {
        this.builldingLookup = res.data || [];
      });
    }
  }
  initializeSearchForm() {
    this.searchForm = this._fb.group({
      siteId: [],
      buildingId: [],
      buildingSubUnitId: [],
    });
  }
  search() {
    this.popupFilter();
  }
  hideDialog() {
    this.displayDialog = false;
  }
  resetFilter() {
    this.searchForm.reset();
    // Reset buildings list to show all buildings
    this._sharedService.getAllBuilding().subscribe((res) => {
      this.builldingLookup = res.data;
    });
    this.buildingIds = [];
    this.SiteIds = [];
    this.isSearchingReasult = false;
    this.getAllFloors();
    this.displayDialog = false;
  }
  // ------------------------------------
  // UPDATE  FLOOR
  // ------------------------------------

  floorId: number = null;
  openAdd() {
    this.isEditMode = false;
    this.floorForm.reset();
    this.showAddEditPopup = true;
    this.floorId = null;
    // Reset to all buildings for add mode
    // this._sharedService.getAllBuilding().subscribe((res) => {
    //   this.addEditBuildingLookup = res.data;
    // });
    this.addEditBuildingLookup = [];
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.floorId = id;
    this._floorsService.getFloorById(id).subscribe((res) => {
      this.getAllBuildingSubUnit(res.data.buildingId);
      // If the floor has a siteId, load buildings for that site
      if (res.data.siteId) {
        this._sharedService.GetBuildingsBySiteId(res.data.siteId).subscribe((siteRes: any) => {
          this.addEditBuildingLookup = siteRes.data || [];
          this.floorForm.patchValue({
            floorNumber: res.data.floorNumber,
            siteId: res.data.siteId,
            buildingId: res.data.buildingId,
          });
        });
      } else {
        // No site, load all buildings
        this._sharedService.getAllBuilding().subscribe((buildRes) => {
          this.addEditBuildingLookup = buildRes.data;
          this.floorForm.patchValue({
            floorNumber: res.data.floorNumber,
            siteId: null,
            buildingId: res.data.buildingId,
          });
        });
      }
    });
  }
  OnSubmitData() {
    const obj = {
      id: this.floorId,
      floorNumber: this.floorForm.value.floorNumber,
      // buildingSubUnitId: Number(this.floorForm.value.buildingSubUnitId),
      BuildingId: Number(this.floorForm.value.buildingId),
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._floorsService.createFloor(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.floorForm.reset();
          this.getAllFloors();
          this.showAddEditPopup = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تمت إضافة الطابق بنجاح إلى قائمة الطوابق، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    } else {
      // ---------FOR EDIT--------------
      this._floorsService.updateFloor(obj).subscribe((res) => {
        this.floorForm.reset();
        this.getAllFloors();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل الطابق بنجاح، يمكنك المتابعة';
      });
    }
  }
  // ------------------------------------
  // DELETE SUB UNIT
  // ------------------------------------
  confirmDelete(id) {
    this.floorId = id;
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
      this._floorsService.deleteFloor(this.floorId).subscribe((res) => {
        if (res.isSuccess) {
          this.getAllFloors();
          this.alertError = false;
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تم حذف الطابق بنجاح من قائمة الطوابق، يمكنك المتابعة';
          this.alertConfirm = false;

        } else {
          this.alertConfirm = false;
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
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
    this.initializeSearchForm();
    this.getAllFloors();
    this.getSitesLookup();
    this.getAllBuildingLookup();
    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'floorNumber', header: 'رقم الطابق' }),
      new listColumns({ field: 'siteName', header: 'اسم الموقع ' }),
      new listColumns({ field: 'buildingName', header: 'اسم المبنى الرئيسي' }),

    ];
  }
}
