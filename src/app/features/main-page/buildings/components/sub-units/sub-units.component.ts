import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BreadCrumbComponent } from 'src/app/Shared/components/bread-crumb/bread-crumb.component';
import { SubUnitService } from './services/sub-unit.service';
import { listColumns } from 'src/app/Shared/components/list/listColumns';
import { ListComponent } from 'src/app/Shared/components/list/list.component';
import { NoDataYetComponent } from 'src/app/Shared/components/no-data-yet/no-data-yet.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from 'src/app/Shared/services/shared.service';
import { SweetAlertMessageComponent } from 'src/app/Shared/components/sweet-alert-message/sweet-alert-message.component';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-sub-units',
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
  templateUrl: './sub-units.component.html',
  styleUrls: ['./sub-units.component.scss'],
})
export class SubUnitsComponent implements OnInit {
  showAddEditPopup: boolean = false;
  isEditMode: boolean = false;
  builldingLookup: any = [];
  alertSuccess: boolean = false;
  alertSuccessMsg: string = '';
  alertWarning: boolean = false;
  alertConfirm: boolean = false;
  alertError: boolean = false;
  alertErrorMsg: string = 'يبدو أنه قد حدث خطأ ما، من فضلك أعد المحاولة مجددًا';
  constructor(
    private _subUnitService: SubUnitService,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) { }

  // -----------------------------------
  // FORM
  // -----------------------------------
  subUnitForm = this._fb.group({
    name: ['', Validators.required],
    code: [''],
    mainBuildingId: [null, Validators.required],
  });
  get formControls() {
    return this.subUnitForm.controls;
  }

  // ------------------------------------
  // LOOKUPS
  // ------------------------------------
  getAllBuildingLookup() {
    this._sharedService.getAllBuilding().subscribe((res) => {
      this.builldingLookup = res.data;
    });
  }
  // ------------------------------------
  // GET ALL SUB UNITS
  // ------------------------------------
  values: any[] = [];
  cols: any[] = [];
  isSearchingReasult: boolean = false;
  totalPageCount!: number;
  searchValue!: string;
  showBreadcrumb: boolean = true;
  getAllSubUnits(paganations?: any) {
    this._subUnitService
      .getAllSubUnits(paganations, this.searchValue)
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
    this.getAllSubUnits();
  }
  // ------------------------------------
  // UPDATE SUB UNIT
  // ------------------------------------

  subUnitId: number = null;
  openAdd() {
    this.isEditMode = false;
    this.subUnitForm.reset();
    this.showAddEditPopup = true;
    this.subUnitId = null;
  }
  openEdit(id) {
    this.isEditMode = true;
    this.showAddEditPopup = true;
    this.subUnitId = id;
    this._subUnitService.getSubUnitById(id).subscribe((res) => {
      this.subUnitForm.patchValue({
        name: res.data.name,
        code: res.data.code,
        mainBuildingId: res.data.mainBuildingId,
      });
    });
  }
  OnSubmitData() {
    const obj = {
      id: this.subUnitId,
      name: this.subUnitForm.value.name,
      code: this.subUnitForm.value.code,
      mainBuildingId: Number(this.subUnitForm.value.mainBuildingId),
    };
    if (!this.isEditMode) {
      // ---------FOR ADD--------------
      this._subUnitService.createSubUnit(obj).subscribe((res) => {
        if (res.isSuccess) {
          this.subUnitForm.reset();
          this.getAllSubUnits();
          this.showAddEditPopup = false;
          this.alertSuccess = true;
          this.alertSuccessMsg =
            'تمت إضافة المبنى بنجاح إلى قائمة المباني الفرعية، يمكنك المتابعة';
        } else {
          this.alertError = true;
          this.alertErrorMsg = res.errors[0].message;
        }
      });
    } else {
      // ---------FOR EDIT--------------
      this._subUnitService.updateSubUnit(obj).subscribe((res) => {
        this.subUnitForm.reset();
        this.getAllSubUnits();
        this.showAddEditPopup = false;
        this.alertSuccess = true;
        this.alertSuccessMsg = 'تم تعديل تفاصيل المبنى بنجاح، يمكنك المتابعة';
      });
    }
  }
  // ------------------------------------
  // DELETE SUB UNIT
  // ------------------------------------
  confirmDelete(id) {
    this.subUnitId = id;
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
      this._subUnitService.deleteSubUnit(this.subUnitId).subscribe((res) => {
        if (res.isSuccess) {
          this.getAllSubUnits();
          this.alertError = false;
          this.alertSuccess = true;
          this.alertSuccessMsg = 'تم حذف المبنى بنجاح من قائمة المباني الفرعية، يمكنك المتابعة';
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
    this.getAllSubUnits();
    this.getAllBuildingLookup();
    this.cols = [
      new listColumns({ field: 'orderNumber', header: '#' }),
      new listColumns({ field: 'name', header: 'اسم المبنى الفرعي' }),
      new listColumns({ field: 'code', header: 'كود المبنى الفرعي' }),
      new listColumns({ field: 'mainBuidingName', header: 'المبنى الرئيسي' }),
    ];
  }
}
