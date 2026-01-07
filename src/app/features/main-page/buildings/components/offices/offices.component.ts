import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { FilterDataParams, SharedService } from 'src/app/Shared/services/shared.service';
import { BuildingOfficesService } from './services/building-offices.service';

@Component({
  selector: 'app-offices',
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
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss']
})
export class OfficesComponent implements OnInit {
  // UI State
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  displayDialog: boolean = false;
  showBreadcrumb: boolean = true;
  isSearchingResult: boolean = false;

  // Loading states
  isLoading: boolean = false;
  isLoadingFloors: boolean = false;

  // Lookup data
  buildingLookup: any[] = [];
  floorLookup: any[] = [];
  buildingOfficeLookup: any[] = [];

  // Alert states
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  alertErrorMsg: string = 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';

  // Form and data
  searchForm!: FormGroup;
  buildingOfficeForm!: FormGroup;
  filterDataParams = new FilterDataParams();

  // Table data
  values: any[] = [];
  cols: any[] = [];
  totalPageCount: number = 0;

  // Search and filter parameters
  searchValue: string = '';
  buildingIds: number[] = [];
  officeIds: number[] = [];
  floorIds: number[] = [];
  buildingOfficeId: number | null = null;

  constructor(
    private _buildingOffices: BuildingOfficesService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) {
    this.initializeForms();
  }

  // -----------------------------------
  // FORM INITIALIZATION
  // -----------------------------------
  private initializeForms(): void {
    this.buildingOfficeForm = this._fb.group({
      officeNumber: ['', Validators.required],
      name: ['', Validators.required],
      floorId: [null],
      buildingId: [null, Validators.required],
    });

    this.initializeSearchForm();
  }

  initializeSearchForm(): void {
    this.searchForm = this._fb.group({
      buildingId: [null],
      officeId: [null],
      floorId: [null],
    });
  }

  get formControls() {
    return this.buildingOfficeForm.controls;
  }

  // ------------------------------------
  // UTILITY METHODS
  // ------------------------------------
  private resetDependentDropdowns(): void {
    this.floorLookup = [];
    this.buildingOfficeLookup = [];
  }

  private resetFilterArrays(): void {
    this.buildingIds = [];
    this.officeIds = [];
    this.floorIds = [];
  }

  private handleError(error: any): void {
    console.error('Error occurred:', error);
    this.alertError = true;
    this.alertErrorMsg = error?.error?.message || error?.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى';
    this.isLoading = false;
    this.isLoadingFloors = false;
  }

  // ------------------------------------
  // LOOKUP METHODS
  // ------------------------------------
  getAllBuildingLookup(): void {
    this._sharedService.getAllBuilding().subscribe({
      next: (res) => {
        this.buildingLookup = res.data || [];
      },
      error: (err) => this.handleError(err)
    });
  }

  getFloorsByBuildingId(buildingId: number): void {
    if (!buildingId) return;

    this.isLoadingFloors = true;
    this._sharedService.GetBuildingFloors(buildingId).subscribe({
      next: (res) => {
        this.floorLookup = res.data || [];
        this.isLoadingFloors = false;
      },
      error: (err) => {
        this.handleError(err);
        this.floorLookup = [];
      }
    });
  }

  getOfficesByFloorId(floorId: number): void {
    if (!floorId) return;

    this._sharedService.getOfficesInFloor(floorId).subscribe({
      next: (res) => {
        this.buildingOfficeLookup = res.data || [];
      },
      error: (err) => {
        this.handleError(err);
        this.buildingOfficeLookup = [];
      }
    });
  }

  // ------------------------------------
  // DATA FETCHING
  // ------------------------------------
  getAllBuildingOffices(pagination?: any): void {
    this.isLoading = true;

    this._buildingOffices
      .getAllBuildingOffice(
        pagination,
        this.searchValue,
        this.officeIds,
        this.floorIds,
        [],
        this.buildingIds
      )
      .subscribe({
        next: (data) => {
          this.values = data.data?.items || [];
          this.totalPageCount = data.data?.totalCount || 0;

          this.showBreadcrumb = this.isSearchingResult || this.values.length > 0;
          this.isLoading = false;
        },
        error: (err) => this.handleError(err)
      });
  }

  // ------------------------------------
  // SEARCH AND FILTER
  // ------------------------------------
  filterBySearchText(value: string): void {
    this.searchValue = value;
    this.isSearchingResult = true;
    this.filterDataParams.searchTerm = value;
    this.getAllBuildingOffices();
  }

  popupFilter(): void {
    this.isSearchingResult = true;
    this.resetFilterArrays();

    const formValue = this.searchForm.value;

    if (formValue.buildingId) {
      this.buildingIds.push(formValue.buildingId);
    }
    if (formValue.officeId) {
      this.officeIds.push(formValue.officeId);
    }
    if (formValue.floorId) {
      this.floorIds.push(formValue.floorId);
    }

    this.getAllBuildingOffices();
    this.displayDialog = false;
  }

  showDialog(): void {
    this.displayDialog = true;
    this.resetFilterArrays();
    this.initializeSearchForm();
  }

  search(): void {
    this.popupFilter();
  }

  hideDialog(): void {
    this.searchForm.reset();
    this.displayDialog = false;
    this.popupFilter();
  }

  // ------------------------------------
  // DROPDOWN CHANGE HANDLERS
  // ------------------------------------
  onBuildingChangeForSearch(event: any): void {
    this.floorLookup = [];
    this.buildingOfficeLookup = [];

    this.searchForm.patchValue({
      floorId: null,
      officeId: null
    });

    if (event.value) {
      this.getFloorsByBuildingId(event.value);
    }
  }

  onFloorChangeForSearch(event: any): void {
    this.buildingOfficeLookup = [];

    this.searchForm.patchValue({
      officeId: null
    });

    if (event.value) {
      this.getOfficesByFloorId(event.value);
    }
  }

  onBuildingChange(event: any): void {
    this.floorLookup = [];

    this.buildingOfficeForm.patchValue({
      floorId: null
    });

    if (event.value) {
      this.getFloorsByBuildingId(event.value);
    }
  }

  // ------------------------------------
  // CRUD OPERATIONS
  // ------------------------------------
  openAdd(): void {
    this.isEditMode = false;
    this.buildingOfficeForm.reset();
    this.showAddEditPopup = true;
    this.buildingOfficeId = null;
    this.resetDependentDropdowns();
  }

  openEdit(id: number): void {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.buildingOfficeId = id;
    this.isLoading = true;

    this._buildingOffices.getBuildingOfficeById(id).pipe(
      tap(res => {
        const officeData = res.data;
        this.buildingOfficeForm.patchValue({
          officeNumber: officeData.officeNumber,
          name: officeData.name,
          buildingId: officeData.buildingId,
        });
        this.isLoading = false;
      }),
      switchMap(res => {
        const officeData = res.data;
        if (officeData.buildingId) {
          return this._sharedService.GetBuildingFloors(officeData.buildingId).pipe(
            tap(floors => {
              this.floorLookup = floors.data || [];
              this.buildingOfficeForm.patchValue({
                floorId: officeData.floorId,
              });
            })
          );
        }
        return of(null);
      }),
      catchError(err => {
        this.handleError(err);
        return EMPTY;
      })
    ).subscribe();
  }

  OnSubmitData(): void {
    if (this.buildingOfficeForm.invalid) return;

    this.isLoading = true;
    const formValue = this.buildingOfficeForm.value;

    const officeData = {
      id: this.buildingOfficeId,
      officeNumber: formValue.officeNumber,
      name: formValue.name,
      floorId: formValue.floorId,
      buildingId: formValue.buildingId,
    };

    const operation = this.isEditMode
      ? this._buildingOffices.updateBuildingOffice(officeData)
      : this._buildingOffices.createBuildingOffice(officeData);

    operation.subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.buildingOfficeForm.reset();
          this.getAllBuildingOffices();
          this.showAddEditPopup = false;
          this.alertSuccess = true;
          this.alertSuccessMsg = this.isEditMode
            ? 'تم تعديل تفاصيل الغرفة بنجاح، يمكنك المتابعة'
            : 'تمت إضافة الغرفة بنجاح إلى قائمة الغرف، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors?.[0]?.message || 'حدث خطأ أثناء العملية';
        }
        this.isLoading = false;
      },
      error: (err) => this.handleError(err)
    });
  }

  confirmDelete(id: number): void {
    this.buildingOfficeId = id;
    this.alertConfirm = true;
  }

  // ------------------------------------
  // ALERT HANDLERS
  // ------------------------------------
  alertSuccessFun(value: boolean): void {
    if (value) {
      this.alertSuccess = false;
    }
  }

  alertWarningFun(value: boolean): void {
    if (value) {
      this.alertWarning = false;
    } else {
      this.showAddEditPopup = true;
      this.alertWarning = false;
    }
  }

  alertConfirmFun(value: boolean): void {
    if (value && this.buildingOfficeId) {
      this.isLoading = true;
      this._buildingOffices.deleteBuildingOffice(this.buildingOfficeId).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getAllBuildingOffices();
            this.alertError = false;
            this.alertSuccess = true;
            this.alertSuccessMsg = 'تم حذف الغرفة بنجاح من قائمة الغرف، يمكنك المتابعة';
          } else {
            this.alertError = true;
            this.alertErrorMsg = res.errors?.[0]?.message || 'حدث خطأ أثناء الحذف';
          }
          this.alertConfirm = false;
          this.isLoading = false;
        },
        error: (err) => {
          this.handleError(err);
          this.alertConfirm = false;
        }
      });
    } else {
      this.alertConfirm = false;
    }
  }

  alertErrorFun(value: boolean): void {
    if (value) {
      this.alertError = false;
    }
  }

  onCloseAddEditePopup(): void {
    this.showAddEditPopup = false;
    this.alertWarning = true;
  }

  // ------------------------------------
  // LIFECYCLE HOOKS
  // ------------------------------------
  ngOnInit(): void {
    this.getAllBuildingOffices();
    this.getAllBuildingLookup();

    this.cols = [
      new listColumns({ field: 'id', header: '#' }),
      new listColumns({ field: 'officeNumber', header: 'رقم الغرفة' }),
      new listColumns({ field: 'name', header: 'اسم الغرفة' }),
      new listColumns({ field: 'floorNumber', header: 'رقم الطابق' }),
      new listColumns({ field: 'buildingName', header: 'المبنى الرئيسي' }),
    ];
  }
}
